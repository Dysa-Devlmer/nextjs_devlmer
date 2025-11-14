'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  _count?: {
    products: number;
  };
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [error, setError] = useState('');
  const [productCount, setProductCount] = useState(0);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${params.id}`);
      if (response.ok) {
        const category: Category = await response.json();
        setFormData({
          nombre: category.nombre,
          descripcion: category.descripcion || '',
          activo: category.activo,
        });
        if (category._count) {
          setProductCount(category._count.products);
        }
      } else {
        setError('Categoría no encontrada');
      }
    } catch (error) {
      console.error('Error al cargar categoría:', error);
      setError('Error al cargar categoría');
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar categoría');
      }

      router.push('/admin/categories');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-4">Cargando categoría...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/categories" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Categorías</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Editar Categoría</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Categoría</CardTitle>
            {productCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <FolderOpen className="w-4 h-4" />
                <span>Esta categoría tiene {productCount} producto{productCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Nombre de la Categoría *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Hamburguesas"
                required
              />

              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe la categoría..."
                rows={4}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Categoría activa (visible en el menú)
                </label>
              </div>

              {!formData.activo && productCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                  <strong>Nota:</strong> Desactivar esta categoría ocultará {productCount} producto{productCount !== 1 ? 's' : ''} del menú público.
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link href="/admin/categories" className="flex-1">
                  <Button type="button" variant="secondary" fullWidth>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
