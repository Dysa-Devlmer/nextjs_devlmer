import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.chatMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Principal',
      email: 'admin@fastfood.com',
      password: hashedPassword,
      role: 'ADMIN',
      telefono: '555-0001',
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Personal Cocina',
      email: 'staff@fastfood.com',
      password: hashedPassword,
      role: 'STAFF',
      telefono: '555-0002',
    },
  });

  const cliente1 = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@email.com',
      password: hashedPassword,
      role: 'CLIENTE',
      telefono: '555-1001',
      direccion: 'Calle Principal 123',
    },
  });

  const cliente2 = await prisma.user.create({
    data: {
      name: 'María García',
      email: 'maria@email.com',
      password: hashedPassword,
      role: 'CLIENTE',
      telefono: '555-1002',
      direccion: 'Avenida Central 456',
    },
  });

  console.log('✅ Usuarios creados');

  // Crear categorías
  const catHamburguesas = await prisma.category.create({
    data: {
      nombre: 'Hamburguesas',
      descripcion: 'Hamburguesas jugosas con ingredientes frescos',
      activo: true,
      orden: 1,
    },
  });

  const catPapas = await prisma.category.create({
    data: {
      nombre: 'Papas Fritas',
      descripcion: 'Papas crujientes en diferentes tamaños',
      activo: true,
      orden: 2,
    },
  });

  const catBebidas = await prisma.category.create({
    data: {
      nombre: 'Bebidas',
      descripcion: 'Refrescos y bebidas frías',
      activo: true,
      orden: 3,
    },
  });

  const catPostres = await prisma.category.create({
    data: {
      nombre: 'Postres',
      descripcion: 'Deliciosos postres para completar tu comida',
      activo: true,
      orden: 4,
    },
  });

  console.log('✅ Categorías creadas');

  // Crear productos
  await prisma.product.createMany({
    data: [
      // Hamburguesas
      {
        nombre: 'Hamburguesa Clásica',
        descripcion: 'Carne 100% res, lechuga, tomate, cebolla, pepinillos',
        precio: 8.99,
        categoryId: catHamburguesas.id,
        activo: true,
        destacado: true,
      },
      {
        nombre: 'Hamburguesa Doble',
        descripcion: 'Doble carne, queso cheddar, tocino, salsa especial',
        precio: 12.99,
        categoryId: catHamburguesas.id,
        activo: true,
        destacado: true,
      },
      {
        nombre: 'Hamburguesa Pollo',
        descripcion: 'Pechuga de pollo empanizada, lechuga, mayonesa',
        precio: 9.99,
        categoryId: catHamburguesas.id,
        activo: true,
      },
      {
        nombre: 'Hamburguesa Vegetariana',
        descripcion: 'Hamburguesa de lentejas y vegetales, aguacate',
        precio: 10.99,
        categoryId: catHamburguesas.id,
        activo: true,
      },
      // Papas Fritas
      {
        nombre: 'Papas Pequeñas',
        descripcion: 'Porción individual de papas fritas crujientes',
        precio: 2.99,
        categoryId: catPapas.id,
        activo: true,
      },
      {
        nombre: 'Papas Medianas',
        descripcion: 'Porción mediana perfecta para acompañar',
        precio: 3.99,
        categoryId: catPapas.id,
        activo: true,
      },
      {
        nombre: 'Papas Grandes',
        descripcion: 'Porción familiar de papas fritas',
        precio: 5.99,
        categoryId: catPapas.id,
        activo: true,
      },
      // Bebidas
      {
        nombre: 'Coca-Cola',
        descripcion: 'Refresco 500ml',
        precio: 2.49,
        categoryId: catBebidas.id,
        activo: true,
      },
      {
        nombre: 'Sprite',
        descripcion: 'Refresco de lima-limón 500ml',
        precio: 2.49,
        categoryId: catBebidas.id,
        activo: true,
      },
      {
        nombre: 'Agua Mineral',
        descripcion: 'Agua natural 600ml',
        precio: 1.99,
        categoryId: catBebidas.id,
        activo: true,
      },
      // Postres
      {
        nombre: 'Helado de Vainilla',
        descripcion: 'Helado cremoso con salsa de chocolate',
        precio: 3.99,
        categoryId: catPostres.id,
        activo: true,
      },
      {
        nombre: 'Apple Pie',
        descripcion: 'Tarta de manzana caliente',
        precio: 4.49,
        categoryId: catPostres.id,
        activo: true,
      },
    ],
  });

  console.log('✅ Productos creados');

  // Obtener productos para crear órdenes
  const products = await prisma.product.findMany();

  // Crear órdenes de ejemplo
  const order1 = await prisma.order.create({
    data: {
      numeroOrden: 'ORD-001',
      userId: cliente1.id,
      subtotal: 15.98,
      impuestos: 1.60,
      total: 17.58,
      estado: 'ENTREGADO',
      metodoPago: 'Tarjeta de Crédito',
      direccionEntrega: cliente1.direccion,
      items: {
        create: [
          {
            productId: products[0].id,
            cantidad: 1,
            precioUnitario: 8.99,
            subtotal: 8.99,
          },
          {
            productId: products[4].id,
            cantidad: 1,
            precioUnitario: 2.99,
            subtotal: 2.99,
          },
          {
            productId: products[7].id,
            cantidad: 2,
            precioUnitario: 2.49,
            subtotal: 4.98,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      numeroOrden: 'ORD-002',
      userId: cliente2.id,
      subtotal: 22.98,
      impuestos: 2.30,
      total: 25.28,
      estado: 'PREPARANDO',
      metodoPago: 'Efectivo',
      direccionEntrega: cliente2.direccion,
      items: {
        create: [
          {
            productId: products[1].id,
            cantidad: 1,
            precioUnitario: 12.99,
            subtotal: 12.99,
          },
          {
            productId: products[5].id,
            cantidad: 1,
            precioUnitario: 3.99,
            subtotal: 3.99,
          },
          {
            productId: products[10].id,
            cantidad: 2,
            precioUnitario: 3.99,
            subtotal: 7.98,
          },
        ],
      },
    },
  });

  console.log('✅ Órdenes creadas');

  // Crear tickets de ejemplo
  await prisma.ticket.create({
    data: {
      numeroTicket: 'TKT-001',
      userId: cliente1.id,
      orderId: order1.id,
      categoria: 'PEDIDO_FRIO',
      prioridad: 'MEDIA',
      estado: 'RESUELTO',
      asunto: 'Hamburguesa llegó fría',
      descripcion: 'Mi pedido llegó después de 45 minutos y la hamburguesa estaba fría.',
      respuesta: 'Lamentamos mucho el inconveniente. Le hemos enviado un cupón de descuento del 20% para su próxima orden.',
      calificacion: 4,
      fechaResolucion: new Date(),
    },
  });

  await prisma.ticket.create({
    data: {
      numeroTicket: 'TKT-002',
      userId: cliente2.id,
      orderId: order2.id,
      categoria: 'FALTA_PRODUCTO',
      prioridad: 'ALTA',
      estado: 'EN_PROCESO',
      asunto: 'Faltaron las papas fritas',
      descripcion: 'En mi pedido no venían las papas fritas que ordené.',
      respuesta: 'Estamos procesando un reembolso parcial. Disculpe las molestias.',
    },
  });

  console.log('✅ Tickets creados');
  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('📧 Usuarios de prueba:');
  console.log('   Admin: admin@fastfood.com / password123');
  console.log('   Staff: staff@fastfood.com / password123');
  console.log('   Cliente 1: juan@email.com / password123');
  console.log('   Cliente 2: maria@email.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
