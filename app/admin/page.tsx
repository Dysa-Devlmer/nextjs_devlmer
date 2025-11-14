'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    revenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      const [orders, products, categories] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        categoriesRes.json(),
      ]);

      const revenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      const pendingOrders = orders.filter((o: any) => o.estado === 'PENDIENTE' || o.estado === 'PREPARANDO').length;
      const activeProducts = products.filter((p: any) => p.activo).length;

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCategories: categories.length,
        revenue,
        pendingOrders,
        activeProducts,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setRecentOrders(data.slice(0, 5));
    } catch (error) {
      console.error('Error al cargar pedidos recientes:', error);
    }
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
              <p className="text-sm text-gray-600">Dashboard de Gestión</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas Principales */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    {stats.pendingOrders} pendientes
                  </p>
                </div>
                <ShoppingBag className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${stats.revenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Productos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.activeProducts} activos
                  </p>
                </div>
                <Package className="w-12 h-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorías</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gestión Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/products">
                <Button variant="primary" fullWidth>
                  <Package className="w-5 h-5 mr-2" />
                  Gestionar Productos
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="secondary" fullWidth>
                  <Settings className="w-5 h-5 mr-2" />
                  Gestionar Categorías
                </Button>
              </Link>
              <Link href="/staff">
                <Button variant="secondary" fullWidth>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ver Pedidos
                </Button>
              </Link>
              <Link href="/admin/tickets">
                <Button variant="secondary" fullWidth>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Ver Tickets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos Recientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pedidos Recientes</CardTitle>
              <Link href="/staff">
                <Button variant="secondary" size="sm">Ver Todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay pedidos recientes</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Pedido #{order.numeroOrden}</p>
                      <p className="text-sm text-gray-600">{order.user?.name || 'Cliente'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">${order.total.toFixed(2)}</p>
                      <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                        order.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                        order.estado === 'PREPARANDO' ? 'bg-blue-100 text-blue-800' :
                        order.estado === 'LISTO' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.estado}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
