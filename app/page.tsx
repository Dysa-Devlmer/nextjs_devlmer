import Link from 'next/link';
import { Users, ShieldCheck, Headset, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headset className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">FastFood Posventa</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Atención Posventa
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona reclamos, seguimiento de pedidos y mejora la satisfacción de tus clientes
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10 text-blue-600" />
                <CardTitle>Portal del Cliente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Accede a tu portal para crear tickets, ver el estado de tus reclamos y calificar
                nuestro servicio.
              </p>
              <Link href="/cliente">
                <Button variant="primary" fullWidth>
                  Acceder como Cliente
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-green-600" />
                <CardTitle>Panel Administrativo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Gestiona todos los tickets, responde a clientes y visualiza estadísticas en tiempo
                real.
              </p>
              <Link href="/admin">
                <Button variant="success" fullWidth>
                  Acceder como Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <CardTitle>Características Principales</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Para Clientes</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Crear tickets de reclamo fácilmente</li>
                  <li>✓ Seguimiento en tiempo real</li>
                  <li>✓ Historial completo de tickets</li>
                  <li>✓ Sistema de calificación</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Para Administradores</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Dashboard con métricas clave</li>
                  <li>✓ Gestión completa de tickets</li>
                  <li>✓ Estadísticas por categoría</li>
                  <li>✓ Búsqueda y filtros avanzados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías de Atención</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">Pedido Incorrecto</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">Pedido Frío</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-900">Falta Producto</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-900">Calidad</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 FastFood Posventa. Sistema de gestión de atención al cliente.</p>
        </div>
      </footer>
    </div>
  );
}
