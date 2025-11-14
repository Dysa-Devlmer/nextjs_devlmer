'use client';

import Link from 'next/link';
import { ArrowLeft, BarChart3, Clock, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { calculateStats, calculateCategoryStats } from '@/utils/stats';

export default function AdminPage() {
  const { tickets } = useTickets();
  const stats = calculateStats(tickets);
  const categoryStats = calculateCategoryStats(tickets);

  const categoryLabels: Record<string, string> = {
    pedido_incorrecto: 'Pedido Incorrecto',
    pedido_frio: 'Pedido Frío',
    falta_producto: 'Falta Producto',
    calidad_producto: 'Calidad',
    tiempo_entrega: 'Tiempo Entrega',
    servicio_cliente: 'Servicio',
    otro: 'Otro',
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
            <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
            <Link href="/admin/tickets">
              <Button variant="primary">Gestionar Tickets</Button>
            </Link>
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
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Abiertos</p>
                  <p className="text-3xl font-bold text-red-600">{stats.abiertos}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Proceso</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.enProceso}</p>
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
                  <p className="text-3xl font-bold text-green-600">{stats.resueltos}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Rendimiento */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <CardTitle>Calificación Promedio</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-6xl font-bold text-gray-900">
                    {stats.promedioCalificacion.toFixed(1)}
                  </p>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-3xl ${
                          star <= Math.round(stats.promedioCalificacion)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <CardTitle>Tiempo Promedio de Resolución</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-6xl font-bold text-gray-900">
                    {stats.tiempoPromedioResolucion.toFixed(1)}
                  </p>
                  <p className="text-xl text-gray-600 mt-2">horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats
                .sort((a, b) => b.cantidad - a.cantidad)
                .map((stat) => (
                  <div key={stat.categoria}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {categoryLabels[stat.categoria]}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stat.cantidad} ({stat.porcentaje.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${stat.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Estado */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Distribución de Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{stats.abiertos}</p>
                <p className="text-sm text-gray-600 mt-1">Abiertos</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{stats.enProceso}</p>
                <p className="text-sm text-gray-600 mt-1">En Proceso</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{stats.resueltos}</p>
                <p className="text-sm text-gray-600 mt-1">Resueltos</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">{stats.cerrados}</p>
                <p className="text-sm text-gray-600 mt-1">Cerrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
