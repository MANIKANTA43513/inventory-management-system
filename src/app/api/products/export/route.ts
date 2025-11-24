import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { stringify } from 'csv-stringify/sync';

export const dynamic = 'force-dynamic';

// GET - Export products to CSV
export async function GET() {
  try {
    const products = db.prepare('SELECT sku, name, category, price, stock, supplier FROM products ORDER BY id').all();

    const csv = stringify(products, {
      header: true,
      columns: ['sku', 'name', 'category', 'price', 'stock', 'supplier']
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="products-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}
