'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export default function ClientePage() {
  const { tickets, getTicketsByCliente } = useTickets();
  const [clienteId, setClienteId] = useState('cliente1');
  const [busqueda, setBusqueda] = useState('');

  const misTickets = getTicketsByCliente(clienteId);
  const ticketsFiltrados = misTickets.filter(
    (ticket) =>
      ticket.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.numeroPedido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abiertos = misTickets.filter((t) => t.estado === 'abierto' || t.estado === 'en_proceso').length;
  const resueltos = misTickets.filter((t) => t.estado === 'resuelto' || t.estado === 'cerrado').length;

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
            <h1 className="text-2xl font-bold text-gray-900">Portal del Cliente</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selección de Cliente (simulado) */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificarse como:
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cliente1">Juan Pérez (cliente1)</option>
                  <option value="cliente2">María García (cliente2)</option>
                  <option value="cliente3">Carlos López (cliente3)</option>
                  <option value="cliente4">Ana Martínez (cliente4)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{misTickets.length}</p>
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
            placeholder="Buscar por asunto o número de pedido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="max-w-md"
          />
          <Link href={`/cliente/nuevo?clienteId=${clienteId}`}>
            <Button variant="primary">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Ticket
            </Button>
          </Link>
        </div>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {ticketsFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No hay tickets que mostrar</p>
                <Link href={`/cliente/nuevo?clienteId=${clienteId}`}>
                  <Button variant="primary" className="mt-4">
                    Crear tu primer ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            ticketsFiltrados.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.asunto}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Pedido: {ticket.numeroPedido}</span>
                        <span>•</span>
                        <span>{formatFecha(ticket.fechaCreacion)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <StatusBadge status={ticket.estado} />
                      <PriorityBadge priority={ticket.prioridad} />
                    </div>
                  </div>

                  {ticket.respuesta && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-1">Respuesta:</p>
                      <p className="text-sm text-blue-800">{ticket.respuesta}</p>
                    </div>
                  )}

                  {ticket.calificacion && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Tu calificación:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= ticket.calificacion! ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
