import { ReactNode } from 'react';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const statusConfig: Record<TicketStatus, { variant: BadgeProps['variant']; label: string }> = {
    abierto: { variant: 'error', label: 'Abierto' },
    en_proceso: { variant: 'warning', label: 'En Proceso' },
    resuelto: { variant: 'success', label: 'Resuelto' },
    cerrado: { variant: 'default', label: 'Cerrado' },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const priorityConfig: Record<TicketPriority, { variant: BadgeProps['variant']; label: string }> = {
    baja: { variant: 'info', label: 'Baja' },
    media: { variant: 'warning', label: 'Media' },
    alta: { variant: 'error', label: 'Alta' },
    urgente: { variant: 'error', label: 'Urgente' },
  };

  const config = priorityConfig[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  const categoryLabels: Record<TicketCategory, string> = {
    pedido_incorrecto: 'Pedido Incorrecto',
    pedido_frio: 'Pedido Frío',
    falta_producto: 'Falta Producto',
    calidad_producto: 'Calidad Producto',
    tiempo_entrega: 'Tiempo Entrega',
    servicio_cliente: 'Servicio Cliente',
    otro: 'Otro',
  };

  return <Badge variant="default">{categoryLabels[category]}</Badge>;
}
