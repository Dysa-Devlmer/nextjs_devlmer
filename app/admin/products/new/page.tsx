'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface Category {
  id: string;
  nombre: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoryId: '',
    imagen: '',
    destacado: false,
  });

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
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear producto');
      }

      router.push('/admin/products');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/products" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Productos</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Nombre del Producto *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Hamburguesa Clásica"
                required
              />

              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el producto..."
                rows={4}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Precio *"
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />

                <Select
                  label="Categoría *"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.nombre,
                  }))}
                  required
                />
              </div>

              <ImageUpload
                value={formData.imagen}
                onChange={(url) => setFormData((prev) => ({ ...prev, imagen: url }))}
                endpoint="productImage"
                label="Imagen del Producto"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="destacado"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
                  Marcar como producto destacado
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/admin/products" className="flex-1">
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
                      Crear Producto
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
