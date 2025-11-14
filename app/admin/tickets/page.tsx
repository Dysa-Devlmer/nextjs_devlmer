'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Ticket, TicketStatus, TicketPriority } from '@/types';

export default function AdminTicketsPage() {
  const { tickets, updateTicket } = useTickets();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<TicketStatus | 'todos'>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<TicketPriority | 'todos'>('todos');
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);
  const [respuesta, setRespuesta] = useState('');

  const ticketsFiltrados = tickets.filter((ticket) => {
    const matchBusqueda =
      ticket.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.numeroPedido.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.clienteNombre.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    const matchPrioridad = filtroPrioridad === 'todos' || ticket.prioridad === filtroPrioridad;

    return matchBusqueda && matchEstado && matchPrioridad;
  });

  const handleEstadoChange = (ticketId: string, nuevoEstado: TicketStatus) => {
    updateTicket(ticketId, { estado: nuevoEstado });
  };

  const handleResponder = () => {
    if (ticketSeleccionado && respuesta.trim()) {
      updateTicket(ticketSeleccionado.id, {
        respuesta,
        estado: 'en_proceso',
      });
      setRespuesta('');
      setTicketSeleccionado(null);
    }
  };

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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tickets</h1>
            <div className="w-40"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por asunto, pedido o cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as TicketStatus | 'todos')}
                options={[
                  { value: 'todos', label: 'Todos los estados' },
                  { value: 'abierto', label: 'Abiertos' },
                  { value: 'en_proceso', label: 'En Proceso' },
                  { value: 'resuelto', label: 'Resueltos' },
                  { value: 'cerrado', label: 'Cerrados' },
                ]}
              />

              <Select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value as TicketPriority | 'todos')}
                options={[
                  { value: 'todos', label: 'Todas las prioridades' },
                  { value: 'baja', label: 'Baja' },
                  { value: 'media', label: 'Media' },
                  { value: 'alta', label: 'Alta' },
                  { value: 'urgente', label: 'Urgente' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4 text-sm text-gray-600">
          Mostrando {ticketsFiltrados.length} de {tickets.length} tickets
        </div>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {ticketsFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron tickets con los filtros aplicados</p>
              </CardContent>
            </Card>
          ) : (
            ticketsFiltrados.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Encabezado */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.asunto}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <StatusBadge status={ticket.estado} />
                          <PriorityBadge priority={ticket.prioridad} />
                          <CategoryBadge category={ticket.categoria} />
                        </div>
                      </div>
                    </div>

                    {/* Información del Cliente */}
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Cliente</p>
                        <p className="text-sm font-medium text-gray-900">{ticket.clienteNombre}</p>
                        <p className="text-xs text-gray-600">{ticket.clienteEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Teléfono</p>
                        <p className="text-sm font-medium text-gray-900">{ticket.clienteTelefono}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Número de Pedido</p>
                        <p className="text-sm font-medium text-gray-900">{ticket.numeroPedido}</p>
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <p className="text-sm text-gray-600">{ticket.descripcion}</p>
                    </div>

                    {/* Respuesta existente */}
                    {ticket.respuesta && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Respuesta:</p>
                        <p className="text-sm text-blue-800">{ticket.respuesta}</p>
                      </div>
                    )}

                    {/* Calificación */}
                    {ticket.calificacion && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Calificación:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= ticket.calificacion! ? 'text-yellow-500' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {ticket.comentarioCalificacion && (
                          <span className="text-sm text-gray-600 ml-2">- {ticket.comentarioCalificacion}</span>
                        )}
                      </div>
                    )}

                    {/* Fechas */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>Creado: {formatFecha(ticket.fechaCreacion)}</span>
                      <span>•</span>
                      <span>Actualizado: {formatFecha(ticket.fechaActualizacion)}</span>
                      {ticket.fechaResolucion && (
                        <>
                          <span>•</span>
                          <span>Resuelto: {formatFecha(ticket.fechaResolucion)}</span>
                        </>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Select
                        value={ticket.estado}
                        onChange={(e) => handleEstadoChange(ticket.id, e.target.value as TicketStatus)}
                        options={[
                          { value: 'abierto', label: 'Abierto' },
                          { value: 'en_proceso', label: 'En Proceso' },
                          { value: 'resuelto', label: 'Resuelto' },
                          { value: 'cerrado', label: 'Cerrado' },
                        ]}
                        className="flex-1"
                      />
                      <Button
                        variant="primary"
                        onClick={() => {
                          setTicketSeleccionado(ticket);
                          setRespuesta(ticket.respuesta || '');
                        }}
                      >
                        {ticket.respuesta ? 'Editar Respuesta' : 'Responder'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Modal de Respuesta */}
      {ticketSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Responder a: {ticketSeleccionado.asunto}
              </h3>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{ticketSeleccionado.descripcion}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tu respuesta:</label>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={6}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setTicketSeleccionado(null);
                    setRespuesta('');
                  }}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleResponder} fullWidth disabled={!respuesta.trim()}>
                  Enviar Respuesta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
