'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';

export default function NuevoTicketPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    asunto: '',
    descripcion: '',
    prioridad: 'MEDIA',
    categoria: 'general',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!session) {
    redirect('/auth/login');
  }

  const categorias = [
    { value: 'pedido', label: 'Problema con Pedido' },
    { value: 'producto', label: 'Problema con Producto' },
    { value: 'entrega', label: 'Problema de Entrega' },
    { value: 'pago', label: 'Problema de Pago' },
    { value: 'general', label: 'Consulta General' },
  ];

  const prioridades = [
    { value: 'BAJA', label: 'Baja' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'URGENTE', label: 'Urgente' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.asunto.trim()) newErrors.asunto = 'El asunto es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const ticket = await response.json();
        router.push(`/cliente/tickets/${ticket.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear ticket');
      }
    } catch (error) {
      console.error('Error al crear ticket:', error);
      alert('Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cliente/tickets" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Ticket</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información del Ticket</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Cuéntanos sobre tu problema o consulta y te responderemos lo antes posible
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Asunto *"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                placeholder="Ej: Producto equivocado en mi pedido"
                error={errors.asunto}
              />

              <Textarea
                label="Descripción *"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente tu problema o consulta..."
                rows={6}
                error={errors.descripcion}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Categoría"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  options={categorias}
                />

                <Select
                  label="Prioridad"
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  options={prioridades}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> Después de crear el ticket, podrás chatear en tiempo real con nuestro equipo de soporte.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/cliente/tickets" className="flex-1">
                  <Button type="button" variant="secondary" fullWidth>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Crear Ticket
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
