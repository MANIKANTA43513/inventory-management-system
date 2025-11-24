import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sku, name, category, price, stock, supplier } = body;

    // Get current product for history tracking
    const currentProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const stmt = db.prepare(`
      UPDATE products 
      SET sku = ?, name = ?, category = ?, price = ?, stock = ?, supplier = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(sku, name, category, price, stock, supplier || null, id);

    // Track inventory changes
    if (currentProduct.stock !== stock) {
      const changeAmount = stock - currentProduct.stock;
      const changeType = changeAmount > 0 ? 'increase' : 'decrease';

      db.prepare(`
        INSERT INTO inventory_history (product_id, previous_stock, new_stock, change_amount, change_type, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        id,
        currentProduct.stock,
        stock,
        Math.abs(changeAmount),
        changeType,
        `Stock updated from ${currentProduct.stock} to ${stock}`
      );
    }

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
