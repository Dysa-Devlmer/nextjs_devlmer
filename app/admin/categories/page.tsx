'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, FolderOpen, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar categoría');
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar categoría');
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: category.nombre,
          descripcion: category.descripcion,
          activo: !category.activo
        }),
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
              <p className="text-sm text-gray-600">{categories.length} categorías totales</p>
            </div>
            <Link href="/admin/categories/new">
              <Button variant="primary">
                <Plus className="w-5 h-5 mr-2" />
                Nueva Categoría
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
                placeholder="Buscar categorías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Categorías */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-4">Cargando categorías...</p>
            </CardContent>
          </Card>
        ) : filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías</h3>
              <p className="text-gray-600 mb-6">Comienza creando tu primera categoría</p>
              <Link href="/admin/categories/new">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Categoría
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-xl text-gray-900">{category.nombre}</h3>
                        <Badge variant={category.activo ? 'success' : 'error'}>
                          {category.activo ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      {category.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {category.descripcion}
                        </p>
                      )}
                      {category._count && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FolderOpen className="w-4 h-4" />
                          <span>{category._count.products} productos</span>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Button variant="secondary" size="sm" fullWidth>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant={category.activo ? 'secondary' : 'success'}
                        size="sm"
                        onClick={() => handleToggleActive(category)}
                      >
                        {category.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
