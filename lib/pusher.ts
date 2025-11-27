import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Configuración del servidor (backend)
export const pusherServer = process.env.PUSHER_APP_ID
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
      useTLS: true,
    })
  : null;

// Configuración del cliente (frontend)
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
    console.warn('⚠️ Pusher no configurado. Chat en tiempo real deshabilitado.');
    return null;
  }

  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
      }
    );
  }

  return pusherClientInstance;
};
