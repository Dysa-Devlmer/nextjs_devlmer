import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { securityLogger } from './securityLogger';
import { validateEmail } from './validation';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          securityLogger.logLoginFailed(
            credentials?.email || 'unknown',
            'unknown',
            'Email o contraseña no proporcionados'
          );
          throw new Error('Email y contraseña requeridos');
        }

        // Validar formato de email
        const emailValidation = validateEmail(credentials.email);
        if (!emailValidation.valid) {
          securityLogger.logLoginFailed(
            credentials.email,
            'unknown',
            'Formato de email inválido'
          );
          throw new Error('Credenciales inválidas');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() }
        });

        if (!user || !user.password) {
          securityLogger.logLoginFailed(
            credentials.email,
            'unknown',
            'Usuario no encontrado o sin contraseña'
          );
          throw new Error('Credenciales inválidas');
        }

        // Verificar si el usuario está activo
        if (!user.activo) {
          securityLogger.logLoginFailed(
            credentials.email,
            'unknown',
            'Usuario desactivado'
          );
          throw new Error('Cuenta desactivada. Contacta al administrador.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          securityLogger.logLoginFailed(
            credentials.email,
            'unknown',
            'Contraseña incorrecta'
          );
          throw new Error('Credenciales inválidas');
        }

        // Log exitoso
        securityLogger.logLoginSuccess(user.id, user.email, 'unknown');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
