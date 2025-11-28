'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Building2,
  Mail,
  Clock,
  CreditCard,
  Bell,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RestaurantConfig {
  id: string;
  restaurantName: string;
  logo?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  mondayOpen?: string;
  mondayClose?: string;
  tuesdayOpen?: string;
  tuesdayClose?: string;
  wednesdayOpen?: string;
  wednesdayClose?: string;
  thursdayOpen?: string;
  thursdayClose?: string;
  fridayOpen?: string;
  fridayClose?: string;
  saturdayOpen?: string;
  saturdayClose?: string;
  sundayOpen?: string;
  sundayClose?: string;
  enableOrders: boolean;
  minOrderAmount: number;
  deliveryFee: number;
  freeDeliveryMinimum?: number;
  estimatedDeliveryTime: number;
  taxRate: number;
  acceptCash: boolean;
  acceptCard: boolean;
  acceptTransfer: boolean;
  notifyNewOrders: boolean;
  notifyNewTickets: boolean;
  adminEmailForNotif?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

type TabType = 'general' | 'contacto' | 'horarios' | 'pedidos' | 'notificaciones' | 'seo';

export default function ConfigPage() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      setError('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar configuración');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: keyof RestaurantConfig, value: any) => {
    setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'contacto', label: 'Contacto', icon: Mail },
    { id: 'horarios', label: 'Horarios', icon: Clock },
    { id: 'pedidos', label: 'Pedidos', icon: CreditCard },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración del Restaurante</h1>
              <p className="text-sm text-gray-600">Gestiona la información de tu negocio</p>
            </div>
            <div className="w-40" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">Configuración guardada exitosamente</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab: General */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Restaurante *
                  </label>
                  <Input
                    type="text"
                    value={config.restaurantName}
                    onChange={(e) => updateConfig('restaurantName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eslogan / Tagline
                  </label>
                  <Input
                    type="text"
                    value={config.tagline || ''}
                    onChange={(e) => updateConfig('tagline', e.target.value)}
                    placeholder="La mejor comida rápida de la ciudad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={config.description || ''}
                    onChange={(e) => updateConfig('description', e.target.value)}
                    rows={4}
                    placeholder="Describe tu restaurante..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <Input
                    type="url"
                    value={config.logo || ''}
                    onChange={(e) => updateConfig('logo', e.target.value)}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL de la imagen del logo (recomendado: 200x200px)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: Contacto */}
          {activeTab === 'contacto' && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={config.email || ''}
                      onChange={(e) => updateConfig('email', e.target.value)}
                      placeholder="contacto@restaurante.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      value={config.phone || ''}
                      onChange={(e) => updateConfig('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <Input
                    type="text"
                    value={config.address || ''}
                    onChange={(e) => updateConfig('address', e.target.value)}
                    placeholder="Calle Principal #123"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <Input
                      type="text"
                      value={config.city || ''}
                      onChange={(e) => updateConfig('city', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <Input
                      type="text"
                      value={config.state || ''}
                      onChange={(e) => updateConfig('state', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <Input
                      type="text"
                      value={config.zipCode || ''}
                      onChange={(e) => updateConfig('zipCode', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <Input
                    type="text"
                    value={config.country}
                    onChange={(e) => updateConfig('country', e.target.value)}
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Redes Sociales</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <Input
                        type="url"
                        value={config.facebook || ''}
                        onChange={(e) => updateConfig('facebook', e.target.value)}
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <Input
                        type="url"
                        value={config.instagram || ''}
                        onChange={(e) => updateConfig('instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter / X
                      </label>
                      <Input
                        type="url"
                        value={config.twitter || ''}
                        onChange={(e) => updateConfig('twitter', e.target.value)}
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <Input
                        type="tel"
                        value={config.whatsapp || ''}
                        onChange={(e) => updateConfig('whatsapp', e.target.value)}
                        placeholder="5551234567"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: Horarios - Continúa en el siguiente mensaje por límite de caracteres */}
          {activeTab === 'horarios' && (
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { day: 'Lunes', open: 'mondayOpen', close: 'mondayClose' },
                  { day: 'Martes', open: 'tuesdayOpen', close: 'tuesdayClose' },
                  { day: 'Miércoles', open: 'wednesdayOpen', close: 'wednesdayClose' },
                  { day: 'Jueves', open: 'thursdayOpen', close: 'thursdayClose' },
                  { day: 'Viernes', open: 'fridayOpen', close: 'fridayClose' },
                  { day: 'Sábado', open: 'saturdayOpen', close: 'saturdayClose' },
                  { day: 'Domingo', open: 'sundayOpen', close: 'sundayClose' },
                ].map((schedule) => (
                  <div key={schedule.day} className="flex items-center gap-4">
                    <div className="w-28 text-sm font-medium text-gray-700">
                      {schedule.day}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={config[schedule.open as keyof RestaurantConfig] as string || ''}
                        onChange={(e) => updateConfig(schedule.open as keyof RestaurantConfig, e.target.value)}
                        placeholder="09:00"
                      />
                      <span className="text-gray-500">-</span>
                      <Input
                        type="time"
                        value={config[schedule.close as keyof RestaurantConfig] as string || ''}
                        onChange={(e) => updateConfig(schedule.close as keyof RestaurantConfig, e.target.value)}
                        placeholder="22:00"
                      />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-4">
                  Deja en blanco los días que el restaurante permanece cerrado
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tab: Pedidos */}
          {activeTab === 'pedidos' && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pedidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableOrders"
                    checked={config.enableOrders}
                    onChange={(e) => updateConfig('enableOrders', e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <label htmlFor="enableOrders" className="text-sm font-medium text-gray-700">
                    Habilitar sistema de pedidos en línea
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Mínimo de Pedido ($)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.minOrderAmount}
                      onChange={(e) => updateConfig('minOrderAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de Envío ($)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.deliveryFee}
                      onChange={(e) => updateConfig('deliveryFee', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envío Gratis desde ($)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.freeDeliveryMinimum || ''}
                      onChange={(e) => updateConfig('freeDeliveryMinimum', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="Opcional"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Dejar vacío para no ofrecer envío gratis
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo Estimado de Entrega (minutos)
                    </label>
                    <Input
                      type="number"
                      min="5"
                      step="5"
                      value={config.estimatedDeliveryTime}
                      onChange={(e) => updateConfig('estimatedDeliveryTime', parseInt(e.target.value) || 30)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tasa de Impuesto (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={config.taxRate}
                      onChange={(e) => updateConfig('taxRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Métodos de Pago</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="acceptCash"
                        checked={config.acceptCash}
                        onChange={(e) => updateConfig('acceptCash', e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                      />
                      <label htmlFor="acceptCash" className="text-sm text-gray-700">
                        Aceptar Efectivo
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="acceptCard"
                        checked={config.acceptCard}
                        onChange={(e) => updateConfig('acceptCard', e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                      />
                      <label htmlFor="acceptCard" className="text-sm text-gray-700">
                        Aceptar Tarjeta
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="acceptTransfer"
                        checked={config.acceptTransfer}
                        onChange={(e) => updateConfig('acceptTransfer', e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                      />
                      <label htmlFor="acceptTransfer" className="text-sm text-gray-700">
                        Aceptar Transferencia
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: Notificaciones */}
          {activeTab === 'notificaciones' && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifyNewOrders"
                      checked={config.notifyNewOrders}
                      onChange={(e) => updateConfig('notifyNewOrders', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <label htmlFor="notifyNewOrders" className="text-sm text-gray-700">
                      Notificar nuevos pedidos por email
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifyNewTickets"
                      checked={config.notifyNewTickets}
                      onChange={(e) => updateConfig('notifyNewTickets', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <label htmlFor="notifyNewTickets" className="text-sm text-gray-700">
                      Notificar nuevos tickets de soporte por email
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del Administrador para Notificaciones
                  </label>
                  <Input
                    type="email"
                    value={config.adminEmailForNotif || ''}
                    onChange={(e) => updateConfig('adminEmailForNotif', e.target.value)}
                    placeholder="admin@restaurante.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email donde llegarán las notificaciones importantes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: SEO */}
          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle>Optimización SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Meta (SEO)
                  </label>
                  <Input
                    type="text"
                    value={config.metaTitle || ''}
                    onChange={(e) => updateConfig('metaTitle', e.target.value)}
                    placeholder="FastFood - La mejor comida rápida"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 50-60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Meta (SEO)
                  </label>
                  <textarea
                    value={config.metaDescription || ''}
                    onChange={(e) => updateConfig('metaDescription', e.target.value)}
                    rows={3}
                    placeholder="Describe tu restaurante para motores de búsqueda..."
                    maxLength={160}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 150-160 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palabras Clave (SEO)
                  </label>
                  <Input
                    type="text"
                    value={config.metaKeywords || ''}
                    onChange={(e) => updateConfig('metaKeywords', e.target.value)}
                    placeholder="comida rápida, hamburguesas, pizza, entrega a domicilio"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separar con comas
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botón Guardar */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
