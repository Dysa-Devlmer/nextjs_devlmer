'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, Cliente, TicketStatus, TicketPriority } from '@/types';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'estado'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  getTicketsByCliente: (clienteId: string) => Ticket[];
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const ticketsIniciales: Ticket[] = [
  {
    id: '1',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@email.com',
    clienteTelefono: '555-0001',
    numeroPedido: 'PED-1001',
    categoria: 'pedido_frio',
    prioridad: 'media',
    estado: 'abierto',
    asunto: 'Hamburguesa llegó fría',
    descripcion: 'Mi pedido llegó después de 45 minutos y la hamburguesa estaba completamente fría.',
    fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    clienteId: 'cliente2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@email.com',
    clienteTelefono: '555-0002',
    numeroPedido: 'PED-1002',
    categoria: 'falta_producto',
    prioridad: 'alta',
    estado: 'en_proceso',
    asunto: 'Faltaron papas fritas',
    descripcion: 'Pedí un combo completo pero no venían las papas fritas en el pedido.',
    respuesta: 'Lamentamos mucho el inconveniente. Estamos procesando un reembolso parcial por las papas.',
    fechaCreacion: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    clienteId: 'cliente3',
    clienteNombre: 'Carlos López',
    clienteEmail: 'carlos@email.com',
    clienteTelefono: '555-0003',
    numeroPedido: 'PED-1003',
    categoria: 'pedido_incorrecto',
    prioridad: 'media',
    estado: 'resuelto',
    asunto: 'Recibí un pedido equivocado',
    descripcion: 'Pedí pollo pero me enviaron carne. Soy alérgico a la carne roja.',
    respuesta: 'Le hemos enviado su pedido correcto sin costo adicional. Disculpe las molestias.',
    fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    calificacion: 5,
    comentarioCalificacion: 'Excelente atención, resolvieron rápido',
  },
  {
    id: '4',
    clienteId: 'cliente4',
    clienteNombre: 'Ana Martínez',
    clienteEmail: 'ana@email.com',
    clienteTelefono: '555-0004',
    numeroPedido: 'PED-1004',
    categoria: 'servicio_cliente',
    prioridad: 'baja',
    estado: 'cerrado',
    asunto: 'Repartidor fue descortés',
    descripcion: 'El repartidor fue poco amable al entregar el pedido.',
    respuesta: 'Hemos hablado con nuestro equipo de repartidores. Le ofrecemos un descuento en su próximo pedido.',
    fechaCreacion: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
    calificacion: 4,
  },
];

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tickets');
    if (stored) {
      setTickets(JSON.parse(stored));
    } else {
      setTickets(ticketsIniciales);
      localStorage.setItem('tickets', JSON.stringify(ticketsIniciales));
    }
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  const addTicket = (ticket: Omit<Ticket, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'estado'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      estado: 'abierto',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              ...updates,
              fechaActualizacion: new Date().toISOString(),
              ...(updates.estado === 'resuelto' && !ticket.fechaResolucion
                ? { fechaResolucion: new Date().toISOString() }
                : {}),
            }
          : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  const getTicketsByCliente = (clienteId: string) => {
    return tickets.filter((ticket) => ticket.clienteId === clienteId);
  };

  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        getTicketsByCliente,
        getTicketById,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets debe ser usado dentro de un TicketProvider');
  }
  return context;
}
