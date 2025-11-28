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
  FileText,
  FileSpreadsheet,
  Download,
  User,
  Sliders,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/ui/NotificationBell';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  exportOrdersToPDF,
  exportOrdersToExcel,
  exportProductsToPDF,
  exportProductsToExcel,
  exportDashboardReportToPDF,
} from '@/lib/exportUtils';

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
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

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

      // Store full data for export
      setAllOrders(orders);
      setAllProducts(products);

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCategories: categories.length,
        revenue,
        pendingOrders,
        activeProducts,
      });

      // Datos para gráfico de pedidos por estado
      const statusCounts = {
        PENDIENTE: 0,
        PREPARANDO: 0,
        LISTO: 0,
        ENTREGADO: 0,
        CANCELADO: 0,
      };
      orders.forEach((order: any) => {
        if (statusCounts.hasOwnProperty(order.estado)) {
          statusCounts[order.estado as keyof typeof statusCounts]++;
        }
      });
      setOrdersByStatus([
        { name: 'Pendiente', value: statusCounts.PENDIENTE, color: '#F59E0B' },
        { name: 'Preparando', value: statusCounts.PREPARANDO, color: '#3B82F6' },
        { name: 'Listo', value: statusCounts.LISTO, color: '#A855F7' },
        { name: 'Entregado', value: statusCounts.ENTREGADO, color: '#10B981' },
        { name: 'Cancelado', value: statusCounts.CANCELADO, color: '#EF4444' },
      ]);

      // Datos para gráfico de productos por categoría
      const categoryCounts: any = {};
      products.forEach((product: any) => {
        const catName = product.category?.nombre || 'Sin categoría';
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
      });
      const colors = ['#F97316', '#3B82F6', '#10B981', '#A855F7', '#F59E0B', '#EF4444'];
      setCategoryData(
        Object.entries(categoryCounts).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length],
        }))
      );

      // Datos para gráfico de ingresos (últimos 7 días)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDay: any = {};
      last7Days.forEach(day => {
        revenueByDay[day] = 0;
      });

      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        if (revenueByDay.hasOwnProperty(orderDate) && order.estado !== 'CANCELADO') {
          revenueByDay[orderDate] += order.total;
        }
      });

      setRevenueData(
        last7Days.map(day => ({
          date: new Date(day).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
          ingresos: parseFloat(revenueByDay[day].toFixed(2)),
        }))
      );
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
            <div className="flex gap-2 items-center">
              <NotificationBell />
              <Link href="/perfil">
                <Button variant="secondary" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportDashboardReportToPDF(stats, allOrders, allProducts)}
                disabled={allOrders.length === 0}
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportOrdersToExcel(allOrders)}
                disabled={allOrders.length === 0}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
            </div>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Link href="/admin/users">
                <Button variant="secondary" fullWidth>
                  <Users className="w-5 h-5 mr-2" />
                  Gestionar Usuarios
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
              <Link href="/admin/config">
                <Button variant="secondary" fullWidth>
                  <Sliders className="w-5 h-5 mr-2" />
                  Configuración
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Ingresos */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => `$${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ fill: '#F97316', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pedidos por Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos por Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Productos por Categoría */}
          <Card>
            <CardHeader>
              <CardTitle>Productos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                  <Legend />
                  <Bar dataKey="value" name="Productos" fill="#F97316">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Estadísticas Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Promedio por pedido</span>
                  <span className="text-lg font-bold text-orange-600">
                    ${stats.totalOrders > 0 ? (stats.revenue / stats.totalOrders).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Tasa de actividad</span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.totalProducts > 0 ? ((stats.activeProducts / stats.totalProducts) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Productos por categoría</span>
                  <span className="text-lg font-bold text-green-600">
                    {stats.totalCategories > 0 ? (stats.totalProducts / stats.totalCategories).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Pedidos pendientes</span>
                  <span className="text-lg font-bold text-purple-600">
                    {stats.pendingOrders}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
