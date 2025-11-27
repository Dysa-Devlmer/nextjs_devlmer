import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!resend) {
    console.log('⚠️ Resend no configurado. Email simulado:');
    console.log(`📧 To: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Content: ${html.substring(0, 100)}...`);
    return { success: false, message: 'Resend no configurado' };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'FastFood <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });

    console.log('✅ Email enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error };
  }
};
