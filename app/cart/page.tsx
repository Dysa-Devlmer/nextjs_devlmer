'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    removeItem,
    updateQuantity,
    updateNotas,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
  } = useCart();

  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/login?redirect=/cart');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/menu" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Menú</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Carrito</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-6">Agrega productos del menú para continuar</p>
              <Link href="/menu">
                <Button variant="primary">
                  Ver Menú
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/menu" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Continuar Comprando</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
            <Button variant="danger" size="sm" onClick={clearCart}>
              Vaciar Carrito
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Imagen */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.imagen ? (
                        <img
                          src={item.product.imagen}
                          alt={item.product.nombre}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-4xl">🍔</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.product.nombre}
                          </h3>
                          {item.product.descripcion && (
                            <p className="text-sm text-gray-600">{item.product.descripcion}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Notas */}
                      <div className="mb-3">
                        <Input
                          type="text"
                          placeholder="Notas especiales (ej: sin cebolla)"
                          value={item.notas || ''}
                          onChange={(e) => updateNotas(item.product.id, e.target.value)}
                          className="text-sm"
                        />
                      </div>

                      {/* Cantidad y Precio */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.cantidad - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-8 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.cantidad + 1)}
                            className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            ${item.product.precio.toFixed(2)} c/u
                          </p>
                          <p className="font-bold text-lg text-orange-600">
                            ${(item.product.precio * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos (10%):</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {!session && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                    Inicia sesión para continuar con tu pedido
                  </div>
                )}

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleCheckout}
                  className="mb-3"
                >
                  {session ? 'Proceder al Pago' : 'Iniciar Sesión'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Link href="/menu">
                  <Button variant="secondary" fullWidth>
                    Agregar Más Productos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
