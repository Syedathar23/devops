import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [searchParams, setSearchParams] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setSearchParams(id);
    }
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${BASE_URL}/admin/orders/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-body-md text-on-surface-variant font-medium">Loading Orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-error p-6 rounded-xl border border-error/20 flex items-center gap-4">
        <AlertCircle size={24} />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-h2 font-bold text-on-surface">Order Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchParams}
              onChange={(e) => setSearchParams(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant/40 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-surface-dim border border-outline-variant/40 hover:bg-outline-variant/20 text-on-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-body-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-dim text-label-caps text-on-surface-variant">
                <th className="px-6 py-4 font-semibold uppercase">Order ID</th>
                <th className="px-6 py-4 font-semibold uppercase">Customer</th>
                <th className="px-6 py-4 font-semibold uppercase">Date</th>
                <th className="px-6 py-4 font-semibold uppercase">Products</th>
                <th className="px-6 py-4 font-semibold uppercase">Total</th>
                <th className="px-6 py-4 font-semibold uppercase">Status</th>
                <th className="px-6 py-4 font-semibold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {orders.filter(order => order.id.toString().includes(searchParams) || (order.firstname + ' ' + order.lastname).toLowerCase().includes(searchParams.toLowerCase())).map((order) => (
                <tr key={order.id} className="hover:bg-surface-dim/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">#{order.id}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{order.firstname} {order.lastname}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{new Date(order.createdat).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-on-surface-variant">Order</td>
                  <td className="px-6 py-4 font-medium text-on-surface">₹{parseFloat(order.totalamount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border-none focus:ring-1 focus:ring-primary ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Processing' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark p-1.5 rounded bg-primary/10 transition-colors" title="View Order">
                      <Eye size={16} />
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
