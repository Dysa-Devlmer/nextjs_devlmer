import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { orderStatusUpdateEmail } from '@/lib/emailTemplates';
import { notifyOrderStatusChange } from '@/lib/notifications';

// GET - Obtener pedido por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            telefono: true,
            direccion: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario solo pueda ver sus propios pedidos
    if (session.user.role === 'CLIENTE' && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado del pedido (ADMIN y STAFF)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { estado } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        estado,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Enviar email de actualización de estado
    try {
      await sendEmail(
        order.user.email,
        `Actualización de Pedido #${order.numeroOrden}`,
        orderStatusUpdateEmail({
          numeroOrden: order.numeroOrden,
          userName: order.user.name || 'Cliente',
          estado: order.estado,
          total: order.total,
        })
      );
    } catch (emailError) {
      console.error('Error al enviar email de actualización:', emailError);
      // No fallar la actualización si el email falla
    }

    // Crear notificación in-app
    try {
      await notifyOrderStatusChange(
        order.userId,
        order.id,
        order.numeroOrden,
        order.estado
      );
    } catch (notifError) {
      console.error('Error al crear notificación:', notifError);
      // No fallar la actualización si la notificación falla
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return NextResponse.json(
      { error: 'Error al actualizar pedido' },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar pedido
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Solo el dueño o admin pueden cancelar
    if (session.user.role === 'CLIENTE' && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Solo se puede cancelar si está pendiente
    if (order.estado !== 'PENDIENTE') {
      return NextResponse.json(
        { error: 'Solo se pueden cancelar pedidos pendientes' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        estado: 'CANCELADO',
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    return NextResponse.json(
      { error: 'Error al cancelar pedido' },
      { status: 500 }
    );
  }
}
