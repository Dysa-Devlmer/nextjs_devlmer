import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { passwordResetEmail } from '@/lib/emailTemplates';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Por seguridad, siempre devolvemos éxito aunque el usuario no exista
    // Esto previene que se pueda verificar si un email está registrado
    if (!user) {
      return NextResponse.json(
        { message: 'Si el email existe, recibirás un enlace de recuperación' },
        { status: 200 }
      );
    }

    // Verificar que el usuario tenga contraseña (no sea OAuth)
    if (!user.password) {
      return NextResponse.json(
        { message: 'Si el email existe, recibirás un enlace de recuperación' },
        { status: 200 }
      );
    }

    // Invalidar tokens anteriores del usuario
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Generar token único y seguro
    const token = crypto.randomBytes(32).toString('hex');

    // Crear token en la base de datos (válido por 1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires: expiresAt,
      },
    });

    // Construir URL de reseteo
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    // Enviar email con el enlace de reseteo
    try {
      await sendEmail(
        user.email,
        'Recuperación de Contraseña - FastFood',
        passwordResetEmail({
          userName: user.name || 'Usuario',
          resetUrl,
        })
      );
    } catch (emailError) {
      console.error('Error al enviar email de recuperación:', emailError);
      return NextResponse.json(
        { error: 'Error al enviar el email de recuperación' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Si el email existe, recibirás un enlace de recuperación' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en forgot-password:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
