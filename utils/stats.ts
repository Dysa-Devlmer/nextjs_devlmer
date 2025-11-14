import { Ticket, TicketStats, CategoryStats, TicketCategory } from '@/types';

export function calculateStats(tickets: Ticket[]): TicketStats {
  const total = tickets.length;
  const abiertos = tickets.filter((t) => t.estado === 'abierto').length;
  const enProceso = tickets.filter((t) => t.estado === 'en_proceso').length;
  const resueltos = tickets.filter((t) => t.estado === 'resuelto').length;
  const cerrados = tickets.filter((t) => t.estado === 'cerrado').length;

  const ticketsConCalificacion = tickets.filter((t) => t.calificacion);
  const promedioCalificacion = ticketsConCalificacion.length > 0
    ? ticketsConCalificacion.reduce((acc, t) => acc + (t.calificacion || 0), 0) / ticketsConCalificacion.length
    : 0;

  const ticketsResueltos = tickets.filter((t) => t.fechaResolucion);
  const tiempoPromedioResolucion = ticketsResueltos.length > 0
    ? ticketsResueltos.reduce((acc, t) => {
        const inicio = new Date(t.fechaCreacion).getTime();
        const fin = new Date(t.fechaResolucion!).getTime();
        return acc + (fin - inicio);
      }, 0) / ticketsResueltos.length / (1000 * 60 * 60) // convertir a horas
    : 0;

  return {
    total,
    abiertos,
    enProceso,
    resueltos,
    cerrados,
    promedioCalificacion,
    tiempoPromedioResolucion,
  };
}

export function calculateCategoryStats(tickets: Ticket[]): CategoryStats[] {
  const categoryCounts: Record<TicketCategory, number> = {
    pedido_incorrecto: 0,
    pedido_frio: 0,
    falta_producto: 0,
    calidad_producto: 0,
    tiempo_entrega: 0,
    servicio_cliente: 0,
    otro: 0,
  };

  tickets.forEach((ticket) => {
    categoryCounts[ticket.categoria]++;
  });

  const total = tickets.length;

  return Object.entries(categoryCounts).map(([categoria, cantidad]) => ({
    categoria: categoria as TicketCategory,
    cantidad,
    porcentaje: total > 0 ? (cantidad / total) * 100 : 0,
  }));
}
