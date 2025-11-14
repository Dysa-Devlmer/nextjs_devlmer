'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Clock, Package, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  id: string;
  cantidad: number;
  notas?: string;
  product: {
    nombre: string;
    categoria: string;
  };
}

interface Order {
  id: string;
  numeroOrden: string;
  total: number;
  estado: string;
  createdAt: string;
  user: {
    name: string;
    telefono: string;
  };
  items: OrderItem[];
  direccionEntrega: string;
  metodoPago: string;
  notas?: string;
}

export default function StaffPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('PENDIENTE');

  if (!session || (session.user.role !== 'STAFF' && session.user.role !== 'ADMIN')) {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchOrders();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const url = filter ? `/api/orders?estado=${filter}` : '/api/orders';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARANDO':
        return 'bg-blue-100 text-blue-800';
      case 'LISTO':
        return 'bg-purple-100 text-purple-800';
      case 'ENTREGADO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDIENTE':
        return { status: 'PREPARANDO', label: 'Iniciar Preparación', icon: Package };
      case 'PREPARANDO':
        return { status: 'LISTO', label: 'Marcar como Listo', icon: Check };
      case 'LISTO':
        return { status: 'ENTREGADO', label: 'Marcar como Entregado', icon: Check };
      default:
        return null;
    }
  };

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours}h ${minutes % 60}min`;
  };

  const pendingCount = orders.filter(o => o.estado === 'PENDIENTE').length;
  const preparingCount = orders.filter(o => o.estado === 'PREPARANDO').length;
  const readyCount = orders.filter(o => o.estado === 'LISTO').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Cocina</h1>
                <p className="text-sm text-gray-600">Gestión de Pedidos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={fetchOrders} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Link href="/dashboard">
                <Button variant="primary">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={filter === 'PENDIENTE' ? 'ring-2 ring-yellow-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-yellow-600" />
              </div>
              <Button
                variant={filter === 'PENDIENTE' ? 'primary' : 'secondary'}
                fullWidth
                className="mt-4"
                onClick={() => setFilter('PENDIENTE')}
              >
                Ver Pendientes
              </Button>
            </CardContent>
          </Card>

          <Card className={filter === 'PREPARANDO' ? 'ring-2 ring-blue-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Preparación</p>
                  <p className="text-3xl font-bold text-blue-600">{preparingCount}</p>
                </div>
                <Package className="w-12 h-12 text-blue-600" />
              </div>
              <Button
                variant={filter === 'PREPARANDO' ? 'primary' : 'secondary'}
                fullWidth
                className="mt-4"
                onClick={() => setFilter('PREPARANDO')}
              >
                Ver en Cocina
              </Button>
            </CardContent>
          </Card>

          <Card className={filter === 'LISTO' ? 'ring-2 ring-purple-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Listos</p>
                  <p className="text-3xl font-bold text-purple-600">{readyCount}</p>
                </div>
                <Check className="w-12 h-12 text-purple-600" />
              </div>
              <Button
                variant={filter === 'LISTO' ? 'primary' : 'secondary'}
                fullWidth
                className="mt-4"
                onClick={() => setFilter('LISTO')}
              >
                Ver Listos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">Cargando pedidos...</p>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">No hay pedidos con estado: {filter}</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const nextStatus = getNextStatus(order.estado);
              const NextIcon = nextStatus?.icon;

              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Pedido #{order.numeroOrden}</CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(order.estado)}`}>
                            {order.estado}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      {nextStatus && NextIcon && (
                        <Button
                          variant="primary"
                          onClick={() => updateOrderStatus(order.id, nextStatus.status)}
                        >
                          <NextIcon className="w-5 h-5 mr-2" />
                          {nextStatus.label}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Cliente */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Cliente:</p>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-gray-600">{order.user.telefono}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dirección:</p>
                          <p className="font-medium">{order.direccionEntrega}</p>
                          <p className="text-sm text-gray-600">{order.metodoPago}</p>
                        </div>
                      </div>
                      {order.notas && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">Notas:</p>
                          <p className="text-sm font-medium text-orange-700">{order.notas}</p>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-white border rounded-lg">
                          <div>
                            <p className="font-semibold text-lg">
                              {item.cantidad}x {item.product.nombre}
                            </p>
                            {item.notas && (
                              <p className="text-sm text-orange-700 mt-1">
                                ⚠️ {item.notas}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
