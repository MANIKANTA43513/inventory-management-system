import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all unique categories
export async function GET() {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
    
    return NextResponse.json({ 
      categories: categories.map((c: any) => c.category) 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
