import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useToastStore from '../../store/toastStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('admin');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    const result = await adminLogin(email, password);
    if (result.success) {
      addToast("Admin signed in successfully!", "success");
      navigate('/admin/dashboard');
    } else {
      addToast(result.message || "Invalid admin credentials", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-manrope bg-white">
      {/* LEFT SIDE (40%) */}
      <div className="lg:w-[40%] relative hidden lg:flex flex-col justify-center px-12 xl:px-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/gym-bag.webp")' }}
        />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-block">
              <h1 className="text-[48px] xl:text-[56px] font-extrabold text-white tracking-tight leading-none mb-6">
                FITZONE
              </h1>
            </Link>
            <p className="text-body-lg xl:text-h3 text-white/90 max-w-md leading-relaxed font-medium">
              Administrative Control Panel. Manage your store, inventory, and users with premium precision.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE (60%) */}
      <div className="flex-1 lg:w-[60%] bg-[#f8f9fa] flex items-center justify-center px-6 py-12 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="text-[40px] font-extrabold text-gray-900 tracking-tight">
              FITZONE
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-gray-800 leading-tight">
              Admin Access
            </h2>
            <p className="text-body-md text-gray-500 mt-2">
              Secure login for FITZONE store administrators
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex p-1 bg-gray-200/50 rounded-lg">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${userType === 'user' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${userType === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Admin
              </button>
            </div>

            <div>
              <label className="text-body-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-body-md text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                placeholder="admin@fitzone.com"
                required
              />
            </div>

            <div>
              <label className="text-body-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-12 text-body-md text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-200 pt-8">
            <p className="text-body-sm text-gray-600">
              Not an administrator?{" "}
              <Link to="/auth" className="text-indigo-600 font-semibold hover:underline">
                Back to User Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
