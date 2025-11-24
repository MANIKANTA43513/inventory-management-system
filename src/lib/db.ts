import Database from 'better-sqlite3';
import path from 'path';

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'inventory.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    supplier TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create inventory_history table
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    change_amount INTEGER NOT NULL,
    change_type TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )
`);

// Seed initial data if products table is empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (sku, name, category, price, stock, supplier)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seedData = [
    ['LAP-001', 'MacBook Pro 16"', 'Electronics', 2499.99, 15, 'Apple Inc.'],
    ['LAP-002', 'Dell XPS 15', 'Electronics', 1899.99, 8, 'Dell Technologies'],
    ['PHN-001', 'iPhone 15 Pro', 'Electronics', 999.99, 25, 'Apple Inc.'],
    ['PHN-002', 'Samsung Galaxy S24', 'Electronics', 899.99, 20, 'Samsung'],
    ['TAB-001', 'iPad Air', 'Electronics', 599.99, 12, 'Apple Inc.'],
    ['ACC-001', 'USB-C Cable', 'Accessories', 19.99, 150, 'Generic'],
    ['ACC-002', 'Wireless Mouse', 'Accessories', 49.99, 45, 'Logitech'],
    ['ACC-003', 'Mechanical Keyboard', 'Accessories', 129.99, 30, 'Corsair'],
    ['MON-001', 'LG UltraWide 34"', 'Electronics', 799.99, 10, 'LG Electronics'],
    ['MON-002', 'Dell 27" 4K Monitor', 'Electronics', 549.99, 18, 'Dell Technologies'],
    ['HDP-001', 'Sony WH-1000XM5', 'Accessories', 349.99, 22, 'Sony'],
    ['SPK-001', 'HomePod Mini', 'Electronics', 99.99, 35, 'Apple Inc.'],
    ['CAM-001', 'Logitech Webcam', 'Accessories', 79.99, 40, 'Logitech'],
    ['DES-001', 'Standing Desk', 'Furniture', 599.99, 5, 'IKEA'],
    ['CHR-001', 'Ergonomic Chair', 'Furniture', 399.99, 7, 'Herman Miller'],
  ];

  const insertMany = db.transaction((data: string[][]) => {
    for (const item of data) {
      insertProduct.run(...item);
    }
  });

  insertMany(seedData);
}

export default db;
