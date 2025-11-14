'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Package, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  activo: boolean;
  destacado: boolean;
  category: {
    id: string;
    nombre: string;
  };
}

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, activo: !product.activo }),
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
              <p className="text-sm text-gray-600">{products.length} productos totales</p>
            </div>
            <Link href="/admin/products/new">
              <Button variant="primary">
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Búsqueda */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Productos */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-4">Cargando productos...</p>
            </CardContent>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos</h3>
              <p className="text-gray-600 mb-6">Comienza creando tu primer producto</p>
              <Link href="/admin/products/new">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Producto
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  {/* Imagen */}
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {product.imagen ? (
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{product.nombre}</h3>
                        <div className="flex gap-2">
                          {product.destacado && (
                            <span className="text-yellow-500" title="Destacado">⭐</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {product.descripcion || 'Sin descripción'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{product.category.nombre}</Badge>
                        <Badge variant={product.activo ? 'success' : 'error'}>
                          {product.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-2xl font-bold text-orange-600">
                        ${product.precio.toFixed(2)}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-3 gap-2 pt-3">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="secondary" size="sm" fullWidth>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant={product.activo ? 'secondary' : 'success'}
                        size="sm"
                        onClick={() => handleToggleActive(product)}
                      >
                        {product.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
