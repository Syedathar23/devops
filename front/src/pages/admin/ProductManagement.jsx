import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    costprice: '',
    sellprice: '',
    category: 'Supplements',
    image1: '',
    stock: 0,
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to delete product';
        alert(errorMsg);
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/admin/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setProducts(products.map(p => p.id === editingId ? response.data.product : p));
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/admin/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setProducts([response.data.product, ...products]);
        }
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', description: '', costprice: '', sellprice: '', category: 'Supplements', image1: '', stock: 0 });
    } catch (err) {
      alert('Failed to save product');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      costprice: product.costprice || 0,
      sellprice: product.sellprice,
      category: product.category,
      image1: product.image1,
      stock: product.stock || 0,
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const cost = parseFloat(formData.costprice) || 0;
  const sell = parseFloat(formData.sellprice) || 0;
  const profitAmount = sell - cost;
  const profitMargin = sell > 0 ? ((profitAmount / sell) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-body-md text-on-surface-variant font-medium">Loading Products...</p>
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
        <h1 className="text-h2 font-bold text-on-surface">Product Management</h1>
        <button 
          onClick={() => {
            setFormData({ title: '', description: '', costprice: '', sellprice: '', category: 'Supplements', image1: '', stock: 0 });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-h3 font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Description</label>
                <textarea 
                  required rows="3"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Cost Price (₹)</label>
                <input 
                  type="number" required min="0" step="0.01"
                  value={formData.costprice} onChange={(e) => setFormData({...formData, costprice: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Selling Price (₹)</label>
                <input 
                  type="number" required min="0" step="0.01"
                  value={formData.sellprice} onChange={(e) => setFormData({...formData, sellprice: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Stock Level</label>
                <input 
                  type="number" required min="0"
                  value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                />
              </div>
              <div className="md:col-span-2 bg-surface-dim p-4 rounded-lg flex items-center justify-between border border-outline-variant/30">
                <div>
                  <p className="text-body-sm font-medium text-on-surface-variant">Estimated Profit</p>
                  <p className={`text-h3 font-bold ${profitAmount > 0 ? 'text-success' : profitAmount < 0 ? 'text-error' : 'text-on-surface'}`}>
                    ₹{profitAmount.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-body-sm font-medium text-on-surface-variant">Profit Margin</p>
                  <p className={`text-h3 font-bold ${profitMargin > 0 ? 'text-success' : profitMargin < 0 ? 'text-error' : 'text-on-surface'}`}>
                    {profitMargin}%
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Category</label>
                <select 
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                >
                  <option>Supplements</option>
                  <option>Equipment</option>
                  <option>Accessories</option>
                  <option>Apparel</option>
                </select>
              </div>
              <div>
                <label className="block text-label-caps text-on-surface-variant mb-1.5 uppercase">Image URL</label>
                <input 
                  type="text" required
                  value={formData.image1} onChange={(e) => setFormData({...formData, image1: e.target.value})}
                  className="w-full border border-outline-variant/40 rounded-lg px-4 py-2"
                />
              </div>
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-surface-dim text-on-surface font-semibold py-3 rounded-lg hover:bg-outline-variant/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border border-outline-variant/40 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-outline-variant/40 rounded-lg px-4 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Categories</option>
              <option>Supplements</option>
              <option>Equipment</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-dim text-label-caps text-on-surface-variant">
                <th className="px-6 py-4 font-semibold uppercase">Product</th>
                <th className="px-6 py-4 font-semibold uppercase">Category</th>
                <th className="px-6 py-4 font-semibold uppercase">Stock</th>
                <th className="px-6 py-4 font-semibold uppercase">Price</th>
                <th className="px-6 py-4 font-semibold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-dim/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-dim overflow-hidden flex-shrink-0">
                        <img src={product.image1} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-on-surface">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${product.stock <= 5 ? 'text-error' : 'text-on-surface'}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-on-surface">₹{parseFloat(product.sellprice).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-primary hover:text-primary-dark p-1.5 rounded bg-primary/10 transition-colors" title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-error hover:text-error p-1.5 rounded bg-error-container transition-colors" title="Delete"
                    >
                      <Trash2 size={16} />
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
