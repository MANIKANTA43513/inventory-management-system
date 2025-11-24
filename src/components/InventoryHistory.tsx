"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryEntry {
  id: number;
  product_id: number;
  previous_stock: number;
  new_stock: number;
  change_amount: number;
  change_type: 'increase' | 'decrease';
  notes: string | null;
  created_at: string;
}

interface InventoryHistoryProps {
  productId: number | null;
  onClose: () => void;
}

export default function InventoryHistory({ productId, onClose }: InventoryHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    if (productId) {
      fetchHistory(productId);
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchHistory = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/history/${id}`);
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProductName(data.product?.name || '');
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!productId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <p>Select a product to view its inventory history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Inventory History</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {productName && (
          <div className="mb-4 pb-4 border-b">
            <h3 className="font-semibold">{productName}</h3>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No history available
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className={`mt-1 ${entry.change_type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.change_type === 'increase' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={entry.change_type === 'increase' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {entry.change_type === 'increase' ? '+' : '-'}{entry.change_amount}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {entry.previous_stock} → {entry.new_stock}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-foreground">{entry.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
