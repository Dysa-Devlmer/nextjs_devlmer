'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Order {
  id: string;
  numeroOrden: string;
  total: number;
  subtotal: number;
  impuestos: number;
  estado: string;
  metodoPago: string;
  direccionEntrega: string;
  notas?: string;
  createdAt: string;
  items: {
    id: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    notas?: string;
    product: {
      nombre: string;
      descripcion?: string;
    };
  }[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error al cargar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'PREPARANDO':
        return <Package className="w-6 h-6 text-blue-600" />;
      case 'LISTO':
        return <Truck className="w-6 h-6 text-purple-600" />;
      case 'ENTREGADO':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getEstadoText = (estado: string) => {
    const estados: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      PREPARANDO: 'Preparando',
      LISTO: 'Listo para Entrega',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado',
    };
    return estados[estado] || estado;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Pedido no encontrado</p>
            <Link href="/menu">
              <Button variant="primary">Volver al Menú</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Confirmación de éxito */}
        {isSuccess && (
          <Card className="mb-8 border-2 border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-green-700">
                <CheckCircle className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-1">¡Pedido Confirmado!</h2>
                  <p className="text-green-600">
                    Tu pedido ha sido recibido y está siendo preparado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detalles del Pedido */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pedido #{order.numeroOrden}</CardTitle>
              <div className="flex items-center gap-2">
                {getEstadoIcon(order.estado)}
                <span className="font-semibold">{getEstadoText(order.estado)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Realizado el {new Date(order.createdAt).toLocaleString('es-ES')}
            </p>
          </CardHeader>
          <CardContent>
            {/* Productos */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900">Productos:</h3>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">
                      {item.cantidad}x {item.product.nombre}
                    </p>
                    {item.notas && (
                      <p className="text-sm text-gray-600">Nota: {item.notas}</p>
                    )}
                  </div>
                  <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Impuestos:</span>
                <span>${order.impuestos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-orange-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex items-start gap-2">
                <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Dirección de entrega:</p>
                  <p className="text-gray-900">{order.direccionEntrega}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Método de pago:</p>
                  <p className="text-gray-900 capitalize">{order.metodoPago}</p>
                </div>
              </div>
              {order.notas && (
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Notas:</p>
                    <p className="text-gray-900">{order.notas}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-4">
          <Link href="/menu" className="flex-1">
            <Button variant="primary" fullWidth>
              Hacer Otro Pedido
            </Button>
          </Link>
          <Link href="/cliente" className="flex-1">
            <Button variant="secondary" fullWidth>
              Crear Ticket de Soporte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
