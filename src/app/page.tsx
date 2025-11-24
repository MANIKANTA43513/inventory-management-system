"use client"

import { useState } from 'react';
import ProductTable from '@/components/ProductTable';
import InventoryHistory from '@/components/InventoryHistory';
import { Toaster } from '@/components/ui/sonner';
import { Package } from 'lucide-react';

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Product Inventory Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage your products, track inventory, and view history
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Table - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ProductTable
              onProductSelect={setSelectedProductId}
              selectedProductId={selectedProductId}
            />
          </div>

          {/* Inventory History Sidebar - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <InventoryHistory
                productId={selectedProductId}
                onClose={() => setSelectedProductId(null)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}