import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { orderConfirmationEmail } from '@/lib/emailTemplates';

// GET - Listar pedidos
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

    // Solo clientes ven sus propios pedidos
    if (session.user.role === 'CLIENTE') {
      where.userId = session.user.id;
    }

    // Filtrar por estado si se proporciona
    if (estado) {
      where.estado = estado;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            telefono: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo pedido
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
    const { items, metodoPago, notas, direccionEntrega } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un producto' },
        { status: 400 }
      );
    }

    // Calcular totales
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 404 }
        );
      }

      const itemSubtotal = product.precio * item.cantidad;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        cantidad: item.cantidad,
        precioUnitario: product.precio,
        subtotal: itemSubtotal,
        notas: item.notas,
      });
    }

    const impuestos = subtotal * 0.10; // 10% de impuestos
    const total = subtotal + impuestos;

    // Generar número de orden único
    const orderCount = await prisma.order.count();
    const numeroOrden = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    // Crear orden con items
    const order = await prisma.order.create({
      data: {
        numeroOrden,
        userId: session.user.id,
        subtotal,
        impuestos,
        total,
        metodoPago,
        notas,
        direccionEntrega: direccionEntrega || session.user.direccion,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            telefono: true,
          },
        },
      },
    });

    // Enviar email de confirmación
    try {
      const emailItems = order.items.map(item => ({
        nombre: item.product.nombre,
        cantidad: item.cantidad,
        precio: item.precioUnitario,
      }));

      await sendEmail(
        order.user.email,
        `Confirmación de Pedido #${order.numeroOrden}`,
        orderConfirmationEmail({
          numeroOrden: order.numeroOrden,
          userName: order.user.name || 'Cliente',
          items: emailItems,
          total: order.total,
          direccionEntrega: order.direccionEntrega,
          metodoPago: order.metodoPago,
        })
      );
    } catch (emailError) {
      console.error('Error al enviar email de confirmación:', emailError);
      // No fallar la creación del pedido si el email falla
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}
