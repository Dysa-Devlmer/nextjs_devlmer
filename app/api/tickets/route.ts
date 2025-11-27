import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { ticketCreatedEmail } from '@/lib/emailTemplates';

// GET - Listar tickets
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
    const estado = searchParams.get('estado');

    let where: any = {};

    // Solo clientes ven sus propios tickets
    if (session.user.role === 'CLIENTE') {
      where.userId = session.user.id;
    }

    // Filtrar por estado si se proporciona
    if (estado) {
      where.estado = estado;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    return NextResponse.json(
      { error: 'Error al obtener tickets' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo ticket
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
    const { asunto, descripcion, prioridad, categoria } = body;

    if (!asunto || !descripcion) {
      return NextResponse.json(
        { error: 'Asunto y descripción son requeridos' },
        { status: 400 }
      );
    }

    // Generar número de ticket único
    const ticketCount = await prisma.ticket.count();
    const numeroTicket = `TKT-${String(ticketCount + 1).padStart(6, '0')}`;

    // Crear ticket
    const ticket = await prisma.ticket.create({
      data: {
        numeroTicket,
        userId: session.user.id,
        asunto,
        descripcion,
        prioridad: prioridad || 'MEDIA',
        categoria: categoria || 'general',
        estado: 'ABIERTO',
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

    // Enviar email de confirmación
    try {
      await sendEmail(
        ticket.user.email,
        `Ticket Creado: #${ticket.numeroTicket}`,
        ticketCreatedEmail({
          numeroTicket: ticket.numeroTicket,
          userName: ticket.user.name || 'Usuario',
          asunto: ticket.asunto,
          descripcion: ticket.descripcion,
          prioridad: ticket.prioridad,
        })
      );
    } catch (emailError) {
      console.error('Error al enviar email de ticket:', emailError);
      // No fallar la creación del ticket si el email falla
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error al crear ticket:', error);
    return NextResponse.json(
      { error: 'Error al crear ticket' },
      { status: 500 }
    );
  }
}
