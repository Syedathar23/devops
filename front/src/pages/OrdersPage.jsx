import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import useToastStore from '../store/toastStore';
import { orderApi } from '../services/api';

export default function OrdersPage() {
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.addToast);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');
    const orderId = params.get('order_id');

    if (payment === 'success' && sessionId && orderId) {
      confirmPayment(sessionId, orderId);
    } else {
      fetchOrders();
    }
  }, []);

  const confirmPayment = async (sessionId, orderId) => {
    try {
      const res = await orderApi.confirmStripePayment({ sessionId, orderId });
      if (res.data.success) {
        addToast("Payment successful! Your order has been placed.", "success");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to confirm payment.", "error");
    } finally {
      fetchOrders();
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getUserOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      addToast("Failed to fetch orders", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    addToast('Logged out successfully', 'success');
    navigate('/auth');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-amber-600 bg-amber-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdat) - new Date(a.createdat));

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-manrope">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR (20%) */}
          <aside className="lg:w-1/5 bg-[#f8f9fa] h-fit shrink-0">
            <h2 className="text-h3 font-bold text-[#191c1d] mb-6 px-4">Account</h2>
            
            <nav className="flex flex-col space-y-2">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-medium text-[#191c1d] hover:bg-white transition-colors">
                <User size={20} />
                Profile
              </Link>
              
              <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-medium bg-[#4f46e5] text-white transition-colors shadow-sm">
                <Package size={20} />
                Orders
              </Link>
              
              <Link to="/addresses" className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-medium text-[#191c1d] hover:bg-white transition-colors">
                <MapPin size={20} />
                Addresses
              </Link>
            </nav>

            <div className="mt-8 pt-6 border-t border-[#c7c4d8]/40 px-4">
              <button onClick={handleLogout} className="flex items-center gap-3 py-3 w-full text-body-md font-bold text-red-600 hover:text-red-700 transition-colors">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT (80%) */}
          <main className="lg:w-4/5 bg-[#ffffff] rounded-lg p-8 shadow-sm border border-[#c7c4d8]/20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#c7c4d8]/30 pb-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-[#191c1d] leading-tight">Recent Orders</h1>
                <p className="text-body-md text-[#777587] mt-1">View and manage your purchase history from the last 12 months</p>
              </div>
              <div className="text-label-caps text-[#464555] uppercase tracking-wider font-bold bg-[#f3f4f5] px-4 py-2 rounded-lg self-start">
                {sortedOrders.length} TOTAL ORDERS
              </div>
            </div>

            {/* Orders List */}
            {sortedOrders.length > 0 ? (
              <div className="space-y-[24px]">
                {sortedOrders.map((order) => {
                  const orderDate = new Date(order.createdat).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const firstItem = order.items?.[0] || {};
                  const productImage = firstItem.product?.image || '/images/product-placeholder.webp';
                  
                  return (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/order-details/${order.id}`)}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-lg border border-[#c7c4d8]/40 hover:border-[#4f46e5]/40 hover:shadow-sm transition-all cursor-pointer group gap-6"
                    >
                      {/* Left (Image) & Middle (Info) */}
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                        <div className="w-[80px] h-[80px] bg-[#f8f9fa] rounded-lg overflow-hidden shrink-0 border border-[#c7c4d8]/20">
                          <img src={productImage} alt={`Order ${order.id}`} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-[12px] text-[#4f46e5] uppercase font-bold tracking-wider">
                            ORDER #LX-{order.id.toString().padStart(4, '0')}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[12px] font-bold ${getStatusColor(order.status)}`}>
                              {order.status?.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex flex-col mt-0.5">
                            <span className="text-[14px] text-[#777587]">
                              Placed on {orderDate}
                            </span>
                            {order.estimated_delivery && (
                              <span className="text-[14px] text-[#191c1d] font-semibold mt-0.5">
                                Estimated Delivery: {order.estimated_delivery}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right (Price & Link) */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2">
                        <span className="text-[24px] font-extrabold text-[#191c1d]">
                          ₹{order.totalamount?.toFixed(2)}
                        </span>
                        <span className="text-[14px] font-bold text-[#4f46e5] flex items-center gap-1 group-hover:underline">
                          View Details <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center text-[#777587] mb-6">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-[24px] font-bold text-[#191c1d] mb-2">Looking for something else?</h3>
                <p className="text-[16px] text-[#777587] mb-8 max-w-md">
                  You haven't placed any orders yet. Start shopping to add fitness gear to your history.
                </p>
                <Link to="/shop" className="bg-[#4f46e5] hover:bg-[#3525cd] text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block w-full sm:w-auto">
                  Continue Shopping
                </Link>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
