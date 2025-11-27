'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { getPusherClient } from '@/lib/pusher';

interface Message {
  id: string;
  mensaje: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    role: string;
  };
}

interface ChatProps {
  ticketId: string;
}

export function Chat({ ticketId }: ChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    subscribeToChannel();

    return () => {
      // Cleanup
      const pusher = getPusherClient();
      if (pusher) {
        pusher.unsubscribe(`ticket-${ticketId}`);
      }
    };
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat?ticketId=${ticketId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChannel = () => {
    const pusher = getPusherClient();

    if (!pusher) {
      console.log('⚠️ Pusher no configurado - sin actualizaciones en tiempo real');
      return;
    }

    const channel = pusher.subscribe(`ticket-${ticketId}`);

    channel.bind('new-message', (data: Message) => {
      setMessages((prev) => {
        // Evitar duplicados
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          mensaje: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Si Pusher no está configurado, agregar mensaje manualmente
        const pusher = getPusherClient();
        if (!pusher) {
          setMessages((prev) => [...prev, data]);
        }
        setNewMessage('');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: string) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return msgDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const dateKey = new Date(message.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-sm">No hay mensajes aún</p>
            <p className="text-xs mt-1">Envía un mensaje para iniciar la conversación</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatDate(msgs[0].createdAt)}
                </div>
              </div>

              {/* Messages */}
              {msgs.map((message) => {
                const isOwn = message.user.id === session?.user?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwn
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } rounded-lg px-4 py-2`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {message.user.name || 'Usuario'}{' '}
                          {message.user.role === 'ADMIN' && '(Admin)'}
                          {message.user.role === 'STAFF' && '(Staff)'}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.mensaje}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-orange-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={sending}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
