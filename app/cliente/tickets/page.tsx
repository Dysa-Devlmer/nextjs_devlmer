'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface Ticket {
  id: string;
  numeroTicket: string;
  asunto: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  categoria: string;
  createdAt: string;
}

export default function ClienteTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  if (!session) {
    redirect('/auth/login');
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const ticketsFiltrados = tickets.filter((ticket) =>
    ticket.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
    ticket.numeroTicket.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abiertos = tickets.filter((t) => t.estado === 'ABIERTO' || t.estado === 'EN_PROCESO').length;
  const resueltos = tickets.filter((t) => t.estado === 'RESUELTO' || t.estado === 'CERRADO').length;

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Mis Tickets de Soporte</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Proceso</p>
                  <p className="text-3xl font-bold text-yellow-600">{abiertos}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resueltos</p>
                  <p className="text-3xl font-bold text-green-600">{resueltos}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center mb-6">
          <Input
            type="text"
            placeholder="Buscar por asunto o número..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="max-w-md"
          />
          <Link href="/cliente/nuevo">
            <Button variant="primary">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Ticket
            </Button>
          </Link>
        </div>

        {/* Lista de Tickets */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-4">Cargando tickets...</p>
            </CardContent>
          </Card>
        ) : ticketsFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay tickets que mostrar</p>
              <Link href="/cliente/nuevo">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear tu primer ticket
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ticketsFiltrados.map((ticket) => (
              <Link key={ticket.id} href={`/cliente/tickets/${ticket.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.asunto}</h3>
                          <span className="text-sm text-gray-500">#{ticket.numeroTicket}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.descripcion}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatFecha(ticket.createdAt)}</span>
                          <span>•</span>
                          <span className="capitalize">{ticket.categoria}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end ml-4">
                        <StatusBadge status={ticket.estado} />
                        <PriorityBadge priority={ticket.prioridad} />
                        <div className="flex items-center gap-1 text-xs text-orange-600 mt-2">
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat disponible</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
