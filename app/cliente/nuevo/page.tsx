'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { TicketCategory, TicketPriority } from '@/types';

function NuevoTicketForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addTicket } = useTickets();

  const clienteId = searchParams.get('clienteId') || 'cliente1';

  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteEmail: '',
    clienteTelefono: '',
    numeroPedido: '',
    categoria: 'pedido_incorrecto' as TicketCategory,
    prioridad: 'media' as TicketPriority,
    asunto: '',
    descripcion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categorias = [
    { value: 'pedido_incorrecto', label: 'Pedido Incorrecto' },
    { value: 'pedido_frio', label: 'Pedido Frío' },
    { value: 'falta_producto', label: 'Falta Producto' },
    { value: 'calidad_producto', label: 'Calidad del Producto' },
    { value: 'tiempo_entrega', label: 'Tiempo de Entrega' },
    { value: 'servicio_cliente', label: 'Servicio al Cliente' },
    { value: 'otro', label: 'Otro' },
  ];

  const prioridades = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' },
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

    if (!formData.clienteNombre.trim()) newErrors.clienteNombre = 'El nombre es requerido';
    if (!formData.clienteEmail.trim()) newErrors.clienteEmail = 'El email es requerido';
    if (!formData.clienteTelefono.trim()) newErrors.clienteTelefono = 'El teléfono es requerido';
    if (!formData.numeroPedido.trim()) newErrors.numeroPedido = 'El número de pedido es requerido';
    if (!formData.asunto.trim()) newErrors.asunto = 'El asunto es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    addTicket({
      ...formData,
      clienteId,
    });

    router.push('/cliente');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cliente" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Ticket</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Reclamo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos del Cliente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Completo"
                    name="clienteNombre"
                    value={formData.clienteNombre}
                    onChange={handleChange}
                    error={errors.clienteNombre}
                    placeholder="Juan Pérez"
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="clienteEmail"
                    value={formData.clienteEmail}
                    onChange={handleChange}
                    error={errors.clienteEmail}
                    placeholder="juan@email.com"
                  />
                  <Input
                    label="Teléfono"
                    type="tel"
                    name="clienteTelefono"
                    value={formData.clienteTelefono}
                    onChange={handleChange}
                    error={errors.clienteTelefono}
                    placeholder="555-0000"
                  />
                  <Input
                    label="Número de Pedido"
                    name="numeroPedido"
                    value={formData.numeroPedido}
                    onChange={handleChange}
                    error={errors.numeroPedido}
                    placeholder="PED-1234"
                  />
                </div>
              </div>

              {/* Detalles del Reclamo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Reclamo</h3>
                <div className="space-y-4">
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

                  <Input
                    label="Asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    error={errors.asunto}
                    placeholder="Breve descripción del problema"
                  />

                  <Textarea
                    label="Descripción Detallada"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    error={errors.descripcion}
                    placeholder="Describe con detalle el problema que experimentaste..."
                    rows={6}
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Link href="/cliente" className="flex-1">
                  <Button type="button" variant="secondary" fullWidth>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" variant="primary" className="flex-1">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Ticket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function NuevoTicketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>}>
      <NuevoTicketForm />
    </Suspense>
  );
}
