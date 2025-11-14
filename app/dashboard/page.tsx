import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Redirigir según el rol
  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin');
    case 'STAFF':
      redirect('/staff');
    case 'CLIENTE':
      redirect('/menu');
    default:
      redirect('/');
  }
}
