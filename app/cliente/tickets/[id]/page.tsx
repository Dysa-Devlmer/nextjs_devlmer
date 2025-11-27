'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Chat } from '@/components/ui/Chat';

interface Ticket {
  id: string;
  numeroTicket: string;
  asunto: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  categoria: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  if (!session) {
    redirect('/auth/login');
  }

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else {
        alert('Ticket no encontrado');
        router.push('/cliente');
      }
    } catch (error) {
      console.error('Error al cargar ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-4">Cargando ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Ticket no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cliente" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Mis Tickets</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.numeroTicket}</h1>
              <p className="text-sm text-gray-600">{ticket.asunto}</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información del Ticket */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Estado</p>
                  <div className="mt-1">
                    <StatusBadge status={ticket.estado} />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Prioridad</p>
                  <div className="mt-1">
                    <PriorityBadge priority={ticket.prioridad} />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Categoría</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{ticket.categoria}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(ticket.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Última actualización</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(ticket.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.descripcion}</p>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <CardTitle>Conversación</CardTitle>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Comunícate con nuestro equipo de soporte
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <Chat ticketId={ticket.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
