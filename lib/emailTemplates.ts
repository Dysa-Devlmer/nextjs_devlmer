// Templates de email con HTML responsivo

export const orderConfirmationEmail = (order: {
  numeroOrden: string;
  userName: string;
  items: Array<{ nombre: string; cantidad: number; precio: number }>;
  total: number;
  direccionEntrega: string;
  metodoPago: string;
}) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.nombre}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.cantidad}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.precio.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.cantidad * item.precio).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🍔 FastFood</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Confirmación de Pedido</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">¡Gracias por tu pedido, ${order.userName}!</h2>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Hemos recibido tu pedido <strong style="color: #f97316;">#${order.numeroOrden}</strong> y ya estamos trabajando en él.
              </p>

              <!-- Order Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Detalles del Pedido</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f3f4f6;">
                      <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 14px; font-weight: 600;">Producto</th>
                      <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 14px; font-weight: 600;">Cant.</th>
                      <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">Precio</th>
                      <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 16px;">Subtotal:</span>
                    <span style="color: #111827; font-size: 16px; font-weight: 600;">$${(order.total / 1.1).toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 16px;">Impuestos (10%):</span>
                    <span style="color: #111827; font-size: 16px; font-weight: 600;">$${(order.total * 0.1 / 1.1).toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #f97316;">
                    <span style="color: #111827; font-size: 18px; font-weight: 700;">TOTAL:</span>
                    <span style="color: #f97316; font-size: 20px; font-weight: 700;">$${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <!-- Delivery Info -->
              <div style="margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">📍 Información de Entrega</h3>
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 16px;">
                  <strong>Dirección:</strong> ${order.direccionEntrega}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 16px;">
                  <strong>Método de Pago:</strong> ${order.metodoPago}
                </p>
              </div>

              <!-- Status Timeline -->
              <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  ⏱️ <strong>Estado actual:</strong> Pendiente de preparación
                </p>
                <p style="margin: 10px 0 0 0; color: #92400e; font-size: 13px;">
                  Te notificaremos cuando tu pedido esté en preparación y cuando esté listo para entrega.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                ¿Necesitas ayuda? Contáctanos a soporte@fastfood.com
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2024 FastFood. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const orderStatusUpdateEmail = (order: {
  numeroOrden: string;
  userName: string;
  estado: string;
  total: number;
}) => {
  const statusInfo: Record<string, { emoji: string; title: string; message: string; color: string }> = {
    PREPARANDO: {
      emoji: '👨‍🍳',
      title: 'Tu pedido está en preparación',
      message: 'Nuestro equipo está preparando tu pedido con mucho cuidado.',
      color: '#3b82f6',
    },
    LISTO: {
      emoji: '✅',
      title: 'Tu pedido está listo',
      message: 'Tu pedido está listo para ser entregado. ¡Llegará pronto!',
      color: '#a855f7',
    },
    ENTREGADO: {
      emoji: '🎉',
      title: 'Pedido entregado',
      message: '¡Disfruta tu comida! Esperamos que te guste.',
      color: '#10b981',
    },
    CANCELADO: {
      emoji: '❌',
      title: 'Pedido cancelado',
      message: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
      color: '#ef4444',
    },
  };

  const info = statusInfo[order.estado] || statusInfo.PREPARANDO;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualización de Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: ${info.color}; padding: 40px 20px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">${info.emoji}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${info.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 18px;">
                Hola <strong>${order.userName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                ${info.message}
              </p>
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                  <strong>Número de Pedido:</strong> #${order.numeroOrden}
                </p>
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                  <strong>Estado:</strong> <span style="color: ${info.color}; font-weight: 600;">${order.estado}</span>
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Total:</strong> $${order.total.toFixed(2)}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Gracias por elegir FastFood 🍔
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2024 FastFood. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const ticketCreatedEmail = (ticket: {
  numeroTicket: string;
  userName: string;
  asunto: string;
  descripcion: string;
  prioridad: string;
}) => {
  const priorityColors: Record<string, string> = {
    ALTA: '#ef4444',
    MEDIA: '#f59e0b',
    BAJA: '#10b981',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Creado</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 20px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎫</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Ticket Creado</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 18px;">
                Hola <strong>${ticket.userName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Hemos recibido tu solicitud de soporte. Nuestro equipo la revisará pronto y te responderá a la brevedad.
              </p>
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                  <strong>Ticket:</strong> #${ticket.numeroTicket}
                </p>
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                  <strong>Asunto:</strong> ${ticket.asunto}
                </p>
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                  <strong>Prioridad:</strong>
                  <span style="background-color: ${priorityColors[ticket.prioridad] || '#6b7280'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                    ${ticket.prioridad}
                  </span>
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Descripción:</strong><br>
                  ${ticket.descripcion}
                </p>
              </div>
              <div style="background-color: #dbeafe; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  💡 <strong>Nota:</strong> Te notificaremos por email cuando haya una respuesta a tu ticket.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                ¿Necesitas ayuda urgente? Llámanos al (123) 456-7890
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2024 FastFood. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const welcomeEmail = (user: { name: string; email: string }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a FastFood</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🍔 ¡Bienvenido a FastFood!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 18px;">
                Hola <strong>${user.name}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                ¡Gracias por registrarte en FastFood! Estamos emocionados de tenerte con nosotros.
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Ahora puedes disfrutar de nuestro delicioso menú, hacer pedidos en línea y mucho más.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/menu" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  Ver Menú
                </a>
              </div>
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  🎁 ¡Oferta especial de bienvenida!
                </p>
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  Usa el código <strong>BIENVENIDO10</strong> en tu primer pedido para obtener 10% de descuento.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Síguenos en nuestras redes sociales
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2024 FastFood. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const passwordResetEmail = (data: {
  userName: string;
  resetUrl: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Recuperación de Contraseña</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 18px;">
                Hola <strong>${data.userName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en FastFood.
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  Restablecer Contraseña
                </a>
              </div>

              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  ⚠️ Información Importante
                </p>
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  Este enlace es válido por <strong>1 hora</strong>. Si expira, deberás solicitar un nuevo restablecimiento de contraseña.
                </p>
              </div>

              <div style="background-color: #fee2e2; border-radius: 8px; padding: 20px; margin-top: 20px;">
                <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                  🛡️ Seguridad
                </p>
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                  Nunca compartas este enlace con nadie. Si no solicitaste este cambio, te recomendamos cambiar tu contraseña inmediatamente o contactar a nuestro equipo de soporte.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                ¿Necesitas ayuda? Contáctanos a soporte@fastfood.com
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2024 FastFood. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
