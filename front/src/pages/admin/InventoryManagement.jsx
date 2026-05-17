import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Download } from 'lucide-react';

export default function InventoryManagement() {
  const [inventory] = useState([
    { id: 1, product: 'Whey Protein Isolate 2kg', sku: 'WP01', stock: 150, reorderLevel: 50, status: 'OK' },
    { id: 2, product: 'Premium Yoga Mat', sku: 'YM05', stock: 20, reorderLevel: 30, status: 'Low' },
    { id: 3, product: 'Resistance Band Set', sku: 'RB02', stock: 85, reorderLevel: 40, status: 'OK' },
    { id: 4, product: 'Massage Gun Pro', sku: 'MG01', stock: 0, reorderLevel: 15, status: 'Out' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-h2 font-bold text-on-surface">Inventory Management</h1>
        <button className="bg-white border border-outline-variant/40 hover:bg-surface-dim text-on-surface font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex gap-2">
          <button className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg text-body-sm">All Items</button>
          <button className="px-4 py-2 text-on-surface-variant hover:bg-surface-dim font-medium rounded-lg text-body-sm">Low Stock</button>
          <button className="px-4 py-2 text-on-surface-variant hover:bg-surface-dim font-medium rounded-lg text-body-sm">Out of Stock</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-dim text-label-caps text-on-surface-variant">
                <th className="px-6 py-4 font-semibold uppercase">Product</th>
                <th className="px-6 py-4 font-semibold uppercase">SKU</th>
                <th className="px-6 py-4 font-semibold uppercase">Current Stock</th>
                <th className="px-6 py-4 font-semibold uppercase">Reorder Level</th>
                <th className="px-6 py-4 font-semibold uppercase">Status</th>
                <th className="px-6 py-4 font-semibold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-surface-dim/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">{item.product}</td>
                  <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{item.sku}</td>
                  <td className="px-6 py-4 font-medium text-on-surface">{item.stock}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{item.reorderLevel}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                      item.status === 'OK' ? 'bg-green-100 text-green-700' :
                      item.status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'OK' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark font-medium flex items-center justify-end gap-1.5 ml-auto">
                      <RefreshCw size={14} /> Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
