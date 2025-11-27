import { prisma } from '@/lib/prisma';

export type NotificationType = 'ORDER_STATUS' | 'TICKET_RESPONSE' | 'SYSTEM' | 'PROMOTION';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Crear una notificación para un usuario
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
}

/**
 * Notificar cambio de estado de pedido
 */
export async function notifyOrderStatusChange(
  userId: string,
  orderId: string,
  numeroOrden: string,
  newStatus: string
) {
  const statusMessages: Record<string, { title: string; message: string }> = {
    PREPARANDO: {
      title: '👨‍🍳 Tu pedido está en preparación',
      message: `Tu pedido #${numeroOrden} está siendo preparado por nuestro equipo.`,
    },
    LISTO: {
      title: '✅ ¡Tu pedido está listo!',
      message: `Tu pedido #${numeroOrden} está listo para ser entregado.`,
    },
    ENTREGADO: {
      title: '🎉 Pedido entregado',
      message: `Tu pedido #${numeroOrden} ha sido entregado. ¡Disfruta tu comida!`,
    },
    CANCELADO: {
      title: '❌ Pedido cancelado',
      message: `Tu pedido #${numeroOrden} ha sido cancelado. Si tienes dudas, contáctanos.`,
    },
  };

  const statusInfo = statusMessages[newStatus];
  if (!statusInfo) return;

  return createNotification({
    userId,
    type: 'ORDER_STATUS',
    title: statusInfo.title,
    message: statusInfo.message,
    link: `/pedidos/${orderId}`,
  });
}

/**
 * Notificar nueva respuesta en ticket
 */
export async function notifyTicketResponse(
  userId: string,
  ticketId: string,
  numeroTicket: string,
  isAdminResponse: boolean
) {
  if (isAdminResponse) {
    // Notificar al cliente
    return createNotification({
      userId,
      type: 'TICKET_RESPONSE',
      title: '💬 Nueva respuesta a tu ticket',
      message: `Nuestro equipo de soporte ha respondido a tu ticket #${numeroTicket}.`,
      link: `/cliente/tickets/${ticketId}`,
    });
  } else {
    // Notificar a admins (puedes extender para notificar a todos los admins)
    // Por ahora, solo retornamos null ya que los admins verán el chat en tiempo real
    return null;
  }
}

/**
 * Notificar promoción o mensaje del sistema
 */
export async function notifyPromotion(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    userId,
    type: 'PROMOTION',
    title,
    message,
    link,
  });
}

/**
 * Notificar mensaje del sistema
 */
export async function notifySystem(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    userId,
    type: 'SYSTEM',
    title,
    message,
    link,
  });
}

/**
 * Enviar notificación a múltiples usuarios
 */
export async function createBulkNotifications(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) {
  try {
    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type,
        title,
        message,
        link,
      })),
    });

    return notifications;
  } catch (error) {
    console.error('Error al crear notificaciones masivas:', error);
    throw error;
  }
}
