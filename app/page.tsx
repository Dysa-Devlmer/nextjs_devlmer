'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, ShieldCheck, Headset, TrendingUp, UtensilsCrossed, LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">FastFood</h1>
            </div>
            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">
                    Hola, <span className="font-semibold">{session.user.name}</span>
                  </span>
                  <Button variant="primary" onClick={() => router.push('/dashboard')}>
                    Ir al Panel
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="secondary">
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema Completo de Gestión
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pedidos en línea, gestión de productos, atención posventa y más
          </p>
        </div>

        {/* Botón destacado del menú */}
        <div className="mb-12 text-center">
          <Link href="/menu">
            <Button variant="primary" className="px-8 py-4 text-lg">
              <UtensilsCrossed className="w-6 h-6 mr-2" />
              Ver Menú y Hacer Pedido
            </Button>
          </Link>
        </div>

        {/* Feature Cards - Solo si está logueado */}
        {session && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {session.user.role === 'ADMIN' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-10 h-10 text-green-600" />
                    <CardTitle>Panel Administrativo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Gestiona productos, pedidos, tickets y visualiza estadísticas completas.
                  </p>
                  <Link href="/admin">
                    <Button variant="success" fullWidth>
                      Ir al Panel Admin
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {session.user.role === 'STAFF' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="w-10 h-10 text-blue-600" />
                    <CardTitle>Panel de Cocina</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Gestiona pedidos entrantes y actualiza estados en tiempo real.
                  </p>
                  <Link href="/staff">
                    <Button variant="primary" fullWidth>
                      Ir a Cocina
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Headset className="w-10 h-10 text-purple-600" />
                  <CardTitle>Mis Tickets</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Ver el estado de tus reclamos y crear nuevos tickets de soporte.
                </p>
                <Link href="/cliente">
                  <Button variant="primary" fullWidth>
                    Ver Mis Tickets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

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
                  <li>✓ Pedidos en línea con menú completo</li>
                  <li>✓ Seguimiento de pedidos en tiempo real</li>
                  <li>✓ Sistema de tickets y reclamos</li>
                  <li>✓ Historial de pedidos y calificaciones</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Para Administradores</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Gestión completa de productos y categorías</li>
                  <li>✓ Dashboard con métricas y reportes</li>
                  <li>✓ Control de pedidos y tickets</li>
                  <li>✓ Sistema de roles y permisos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías del Menú</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-900">🍔 Hamburguesas</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-900">🍟 Papas Fritas</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">🥤 Bebidas</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="font-medium text-pink-900">🍰 Postres</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 FastFood. Sistema completo de gestión para restaurantes.</p>
        </div>
      </footer>
    </div>
  );
}
