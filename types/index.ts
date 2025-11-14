export type TicketStatus = 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
export type TicketPriority = 'baja' | 'media' | 'alta' | 'urgente';
export type TicketCategory =
  | 'pedido_incorrecto'
  | 'pedido_frio'
  | 'falta_producto'
  | 'calidad_producto'
  | 'tiempo_entrega'
  | 'servicio_cliente'
  | 'otro';

export interface Ticket {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  numeroPedido: string;
  categoria: TicketCategory;
  prioridad: TicketPriority;
  estado: TicketStatus;
  asunto: string;
  descripcion: string;
  respuesta?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaResolucion?: string;
  calificacion?: number;
  comentarioCalificacion?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

export interface TicketStats {
  total: number;
  abiertos: number;
  enProceso: number;
  resueltos: number;
  cerrados: number;
  promedioCalificacion: number;
  tiempoPromedioResolucion: number;
}

export interface CategoryStats {
  categoria: TicketCategory;
  cantidad: number;
  porcentaje: number;
}
