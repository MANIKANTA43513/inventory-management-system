import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST - Import products from CSV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 400 }
      );
    }

    const results = {
      imported: 0,
      duplicates: [] as string[],
      errors: [] as string[],
    };

    for (const product of products) {
      try {
        const { sku, name, category, price, stock, supplier } = product;

        // Check if SKU already exists
        const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku);

        if (existing) {
          results.duplicates.push(sku);
          continue;
        }

        // Insert new product
        db.prepare(`
          INSERT INTO products (sku, name, category, price, stock, supplier)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(sku, name, category, parseFloat(price), parseInt(stock), supplier || null);

        results.imported++;
      } catch (error: any) {
        results.errors.push(`SKU ${product.sku}: ${error.message}`);
      }
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
