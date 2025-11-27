import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

// POST - Enviar mensaje de chat
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ticketId, mensaje } = body;

    if (!mensaje || !ticketId) {
      return NextResponse.json(
        { error: 'Mensaje y ticketId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario tiene acceso al ticket
    if (
      session.user.role === 'CLIENTE' &&
      ticket.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Crear mensaje
    const chatMessage = await prisma.chatMessage.create({
      data: {
        ticketId,
        userId: session.user.id,
        mensaje,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Enviar mensaje via Pusher (si está configurado)
    if (pusherServer) {
      try {
        await pusherServer.trigger(
          `ticket-${ticketId}`,
          'new-message',
          {
            id: chatMessage.id,
            mensaje: chatMessage.mensaje,
            createdAt: chatMessage.createdAt,
            user: chatMessage.user,
          }
        );
      } catch (pusherError) {
        console.error('Error al enviar mensaje via Pusher:', pusherError);
        // No fallar la creación del mensaje si Pusher falla
      }
    } else {
      console.log('⚠️ Pusher no configurado - mensaje guardado sin notificación en tiempo real');
    }

    return NextResponse.json(chatMessage, { status: 201 });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}

// GET - Obtener mensajes de un ticket
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { error: 'ticketId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario tiene acceso al ticket
    if (
      session.user.role === 'CLIENTE' &&
      ticket.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Obtener mensajes
    const messages = await prisma.chatMessage.findMany({
      where: { ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}
