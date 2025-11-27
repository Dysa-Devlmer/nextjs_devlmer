'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, MessageSquare, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
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
    id: string;
    name: string | null;
    email: string;
    telefono: string | null;
  };
}

export default function AdminTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    estado: '',
    prioridad: '',
    categoria: '',
  });

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        estado: ticket.estado,
        prioridad: ticket.prioridad,
        categoria: ticket.categoria,
      });
    }
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else {
        alert('Ticket no encontrado');
        router.push('/admin/tickets');
      }
    } catch (error) {
      console.error('Error al cargar ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setTicket(updated);
        alert('Ticket actualizado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar ticket');
      }
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
      alert('Error al actualizar ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este ticket? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Ticket eliminado exitosamente');
        router.push('/admin/tickets');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar ticket');
      }
    } catch (error) {
      console.error('Error al eliminar ticket:', error);
      alert('Error al eliminar ticket');
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

  const hasChanges =
    formData.estado !== ticket.estado ||
    formData.prioridad !== ticket.prioridad ||
    formData.categoria !== ticket.categoria;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/tickets" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Tickets</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.numeroTicket}</h1>
              <p className="text-sm text-gray-600">{ticket.asunto}</p>
            </div>
            <div className="flex gap-2">
              {session.user.role === 'ADMIN' && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información del Ticket */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nombre</p>
                  <p className="mt-1 text-sm text-gray-900">{ticket.user.name || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{ticket.user.email}</p>
                </div>
                {ticket.user.telefono && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Teléfono</p>
                    <p className="mt-1 text-sm text-gray-900">{ticket.user.telefono}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gestión del Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Gestión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <Select
                    value={formData.estado}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value }))}
                    options={[
                      { value: 'ABIERTO', label: 'Abierto' },
                      { value: 'EN_PROCESO', label: 'En Proceso' },
                      { value: 'RESUELTO', label: 'Resuelto' },
                      { value: 'CERRADO', label: 'Cerrado' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <Select
                    value={formData.prioridad}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prioridad: e.target.value }))}
                    options={[
                      { value: 'BAJA', label: 'Baja' },
                      { value: 'MEDIA', label: 'Media' },
                      { value: 'ALTA', label: 'Alta' },
                      { value: 'URGENTE', label: 'Urgente' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Select
                    value={formData.categoria}
                    onChange={(e) => setFormData((prev) => ({ ...prev, categoria: e.target.value }))}
                    options={[
                      { value: 'pedido', label: 'Pedido' },
                      { value: 'producto', label: 'Producto' },
                      { value: 'entrega', label: 'Entrega' },
                      { value: 'pago', label: 'Pago' },
                      { value: 'general', label: 'General' },
                    ]}
                  />
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Información del Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Estado Actual</p>
                  <div className="mt-1">
                    <StatusBadge status={ticket.estado} />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Prioridad Actual</p>
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

            {/* Descripción Original */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción Original</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.descripcion}</p>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <CardTitle>Conversación con el Cliente</CardTitle>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Responde a las consultas del cliente en tiempo real
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
