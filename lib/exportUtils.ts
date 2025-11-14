import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Order {
  numeroOrden: string;
  user: { name: string; email: string };
  total: number;
  estado: string;
  createdAt: string;
  direccionEntrega: string;
  metodoPago: string;
}

interface Product {
  nombre: string;
  category: { nombre: string };
  precio: number;
  activo: boolean;
  destacado: boolean;
}

interface Category {
  nombre: string;
  descripcion?: string;
  activo: boolean;
  _count?: { products: number };
}

export const exportOrdersToPDF = (orders: Order[]) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text('Reporte de Pedidos', 14, 22);

  // Fecha
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  // Tabla de pedidos
  const tableData = orders.map((order) => [
    order.numeroOrden,
    order.user.name,
    order.user.email,
    `$${order.total.toFixed(2)}`,
    order.estado,
    new Date(order.createdAt).toLocaleDateString('es-ES'),
    order.metodoPago,
  ]);

  autoTable(doc, {
    head: [['Pedido', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha', 'Pago']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [249, 115, 22] }, // orange-600
  });

  // Estadísticas
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = totalRevenue / orders.length || 0;

  const finalY = (doc as any).lastAutoTable.finalY || 35;
  doc.setFontSize(10);
  doc.text(`Total de Pedidos: ${orders.length}`, 14, finalY + 10);
  doc.text(`Ingresos Totales: $${totalRevenue.toFixed(2)}`, 14, finalY + 17);
  doc.text(`Promedio por Pedido: $${avgOrder.toFixed(2)}`, 14, finalY + 24);

  doc.save(`pedidos_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportOrdersToExcel = (orders: Order[]) => {
  const worksheetData = [
    ['Pedido', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha', 'Dirección', 'Método de Pago'],
    ...orders.map((order) => [
      order.numeroOrden,
      order.user.name,
      order.user.email,
      order.total,
      order.estado,
      new Date(order.createdAt).toLocaleDateString('es-ES'),
      order.direccionEntrega,
      order.metodoPago,
    ]),
    [],
    ['Estadísticas'],
    ['Total de Pedidos:', orders.length],
    ['Ingresos Totales:', orders.reduce((sum, order) => sum + order.total, 0)],
    ['Promedio por Pedido:', orders.reduce((sum, order) => sum + order.total, 0) / orders.length || 0],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

  XLSX.writeFile(workbook, `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportProductsToPDF = (products: Product[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Reporte de Productos', 14, 22);

  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  const tableData = products.map((product) => [
    product.nombre,
    product.category.nombre,
    `$${product.precio.toFixed(2)}`,
    product.activo ? 'Sí' : 'No',
    product.destacado ? 'Sí' : 'No',
  ]);

  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Precio', 'Activo', 'Destacado']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [249, 115, 22] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 35;
  const activeCount = products.filter((p) => p.activo).length;
  const featuredCount = products.filter((p) => p.destacado).length;

  doc.setFontSize(10);
  doc.text(`Total de Productos: ${products.length}`, 14, finalY + 10);
  doc.text(`Productos Activos: ${activeCount}`, 14, finalY + 17);
  doc.text(`Productos Destacados: ${featuredCount}`, 14, finalY + 24);

  doc.save(`productos_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportProductsToExcel = (products: Product[]) => {
  const worksheetData = [
    ['Producto', 'Categoría', 'Precio', 'Activo', 'Destacado'],
    ...products.map((product) => [
      product.nombre,
      product.category.nombre,
      product.precio,
      product.activo ? 'Sí' : 'No',
      product.destacado ? 'Sí' : 'No',
    ]),
    [],
    ['Estadísticas'],
    ['Total de Productos:', products.length],
    ['Productos Activos:', products.filter((p) => p.activo).length],
    ['Productos Destacados:', products.filter((p) => p.destacado).length],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

  XLSX.writeFile(workbook, `productos_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportCategoriesToExcel = (categories: Category[]) => {
  const worksheetData = [
    ['Categoría', 'Descripción', 'Activo', 'Productos'],
    ...categories.map((category) => [
      category.nombre,
      category.descripcion || '',
      category.activo ? 'Sí' : 'No',
      category._count?.products || 0,
    ]),
    [],
    ['Estadísticas'],
    ['Total de Categorías:', categories.length],
    ['Categorías Activas:', categories.filter((c) => c.activo).length],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Categorías');

  XLSX.writeFile(workbook, `categorias_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportDashboardReportToPDF = (stats: any, orders: Order[], products: Product[]) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text('Reporte General del Sistema', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);

  // Estadísticas Principales
  doc.setFontSize(14);
  doc.text('Resumen Ejecutivo', 14, 40);

  doc.setFontSize(10);
  let yPos = 50;

  doc.text(`Total de Pedidos: ${stats.totalOrders}`, 14, yPos);
  doc.text(`Ingresos Totales: $${stats.revenue.toFixed(2)}`, 14, yPos + 7);
  doc.text(`Promedio por Pedido: $${(stats.revenue / stats.totalOrders || 0).toFixed(2)}`, 14, yPos + 14);
  doc.text(`Pedidos Pendientes: ${stats.pendingOrders}`, 14, yPos + 21);

  doc.text(`Total de Productos: ${stats.totalProducts}`, 110, yPos);
  doc.text(`Productos Activos: ${stats.activeProducts}`, 110, yPos + 7);
  doc.text(`Total de Categorías: ${stats.totalCategories}`, 110, yPos + 14);
  doc.text(`Tasa de Actividad: ${((stats.activeProducts / stats.totalProducts) * 100 || 0).toFixed(1)}%`, 110, yPos + 21);

  // Pedidos Recientes
  yPos = 85;
  doc.setFontSize(14);
  doc.text('Últimos Pedidos', 14, yPos);

  const recentOrders = orders.slice(0, 10);
  const ordersTableData = recentOrders.map((order) => [
    order.numeroOrden,
    order.user.name,
    `$${order.total.toFixed(2)}`,
    order.estado,
    new Date(order.createdAt).toLocaleDateString('es-ES'),
  ]);

  autoTable(doc, {
    head: [['Pedido', 'Cliente', 'Total', 'Estado', 'Fecha']],
    body: ordersTableData,
    startY: yPos + 5,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [249, 115, 22] },
  });

  // Nueva página para productos destacados
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Productos Destacados', 14, 20);

  const featuredProducts = products.filter(p => p.destacado).slice(0, 15);
  const productsTableData = featuredProducts.map((product) => [
    product.nombre,
    product.category.nombre,
    `$${product.precio.toFixed(2)}`,
    product.activo ? 'Activo' : 'Inactivo',
  ]);

  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Precio', 'Estado']],
    body: productsTableData,
    startY: 25,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [249, 115, 22] },
  });

  doc.save(`reporte_general_${new Date().toISOString().split('T')[0]}.pdf`);
};
