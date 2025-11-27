import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener ticket por ID
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

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario tenga acceso al ticket
    if (
      session.user.role === 'CLIENTE' &&
      ticket.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    return NextResponse.json(
      { error: 'Error al obtener ticket' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar ticket (solo ADMIN y STAFF)
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
    const { estado, prioridad, categoria } = body;

    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: {
        ...(estado && { estado }),
        ...(prioridad && { prioridad }),
        ...(categoria && { categoria }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error al actualizar ticket:', error);
    return NextResponse.json(
      { error: 'Error al actualizar ticket' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar ticket (solo ADMIN)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    await prisma.ticket.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Ticket eliminado' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    return NextResponse.json(
      { error: 'Error al eliminar ticket' },
      { status: 500 }
    );
  }
}
