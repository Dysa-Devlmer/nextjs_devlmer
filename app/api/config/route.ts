import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración del restaurante
export async function GET(req: NextRequest) {
  try {
    // Buscar la configuración (solo debería haber una)
    let config = await prisma.restaurantConfig.findFirst();

    // Si no existe, crear una con valores por defecto
    if (!config) {
      config = await prisma.restaurantConfig.create({
        data: {
          restaurantName: 'FastFood',
          country: 'México',
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración (solo ADMIN)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado. Solo administradores pueden modificar la configuración.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Obtener configuración existente o crear una nueva
    let config = await prisma.restaurantConfig.findFirst();

    if (!config) {
      // Crear nueva configuración
      config = await prisma.restaurantConfig.create({
        data: body,
      });
    } else {
      // Actualizar configuración existente
      config = await prisma.restaurantConfig.update({
        where: { id: config.id },
        data: body,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}
