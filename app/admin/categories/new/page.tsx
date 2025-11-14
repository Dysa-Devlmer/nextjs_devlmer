'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export default function NewCategoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear categoría');
      }

      router.push('/admin/categories');
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
            <Link href="/admin/categories" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Categorías</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Categoría</CardTitle>
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
                      Crear Categoría
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
