import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET inventory history for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const history = db.prepare(`
      SELECT * FROM inventory_history 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `).all(id);

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory history' },
      { status: 500 }
    );
  }
}
