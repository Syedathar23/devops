import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, Camera, Check, Calendar, Lock, Info } from 'lucide-react';
import useToastStore from '../store/toastStore';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function ProfilePage() {
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.addToast);
  const { user, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Prefer not to say !',
    birthday: '',
    email: '',
    phone: '',
    fitnessGoal: 'General Fitness'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstname || '',
        lastName: user.lastname || '',
        gender: user.gender || 'Prefer not to say',
        birthday: user.birthday || '',
        email: user.email || '',
        phone: user.phone || '',
        fitnessGoal: user.fitnessgoal || 'General Fitness'
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Send the fields to the backend. The backend's updateUserField will handle the update.
      const updateData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        gender: formData.gender,
        birthday: formData.birthday,
        phone: formData.phone,
        fitnessgoal: formData.fitnessGoal
      };

      const res = await axios.put('http://localhost:5000/api/users/updateuserfield', updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.data.success) {
        addToast('Profile updated successfully', 'success');
        // Optionally re-fetch user or update context
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      if (user) {
        setFormData({
          firstName: user.firstname || '',
          lastName: user.lastname || '',
          gender: user.gender || 'Prefer not to say',
          birthday: user.birthday || '',
          email: user.email || '',
          phone: user.phone || '',
          fitnessGoal: user.fitnessgoal || 'General Fitness'
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-manrope py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR (20%) */}
          <aside className="lg:w-1/5 shrink-0 h-fit">
            <div className="flex items-center gap-4 mb-8 px-4">
              <div className="w-12 h-12 rounded-full bg-[#c7c4d8]/40 flex items-center justify-center text-[#464555]">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-body-lg font-bold text-[#191c1d]">{formData.firstName} {formData.lastName}</h3>
                <p className="text-[12px] text-[#777587]">Premium Member</p>
              </div>
            </div>

            <nav className="flex flex-col space-y-2">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-medium bg-[#4f46e5] text-white shadow-sm transition-colors">
                <User size={20} />
                Profile
              </Link>
              
              <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-medium text-[#191c1d] hover:bg-white transition-colors">
                <Package size={20} />
                Orders
              </Link>
              
              <Link to="/addresses" className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-medium text-[#191c1d] hover:bg-white transition-colors">
                <MapPin size={20} />
                Addresses
              </Link>
            </nav>

            <div className="mt-8 pt-6 border-t border-[#c7c4d8]/40 px-4">
              <button onClick={handleLogout} className="flex items-center gap-3 py-3 w-full text-body-md font-bold text-[#ef4444] hover:text-red-700 transition-colors">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT (80%) */}
          <main className="lg:w-4/5 bg-[#ffffff] rounded-lg p-8 shadow-sm border border-[#c7c4d8]/20">
            {/* Verification Banner */}
            {user && !user.isverified && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="text-amber-500" size={20} />
                  <div>
                    <p className="text-body-sm font-bold text-amber-900">Email Verification Required</p>
                    <p className="text-[12px] text-amber-700">Please verify your email to access all features.</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      const res = await axios.post('http://localhost:5000/api/users/verifyaccount', {}, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      });
                      if (res.data.success) addToast("Verification email sent!", "success");
                    } catch (err) {
                      addToast("Failed to send verification email", "error");
                    }
                  }}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold rounded transition-colors"
                >
                  Resend Email
                </button>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-[#c7c4d8]/30">
              <div className="flex items-center gap-4">
                <h1 className="text-[32px] font-bold text-[#191c1d]">Profile</h1>
                {user?.isverified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                    <Check size={10} /> VERIFIED
                  </span>
                )}
              </div>
              
              <div className="relative group cursor-pointer mt-4 sm:mt-0">
                <div className="w-20 h-20 rounded-full bg-[#f3f4f5] flex items-center justify-center border border-[#c7c4d8]/40 overflow-hidden">
                  <User size={40} className="text-[#c7c4d8]" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-[24px]">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 transition-shadow" required />
                </div>
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 transition-shadow" required />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">Gender</label>
                  <div className="relative">
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 appearance-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777587] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">Birthday</label>
                  <div className="relative">
                    <input type="text" name="birthday" value={formData.birthday} onChange={handleChange} placeholder="mm/dd/yyyy" className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 pr-10 text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50" />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777587] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">Email Address</label>
                  <input type="email" name="email" value={formData.email} disabled className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 text-[#777587] cursor-not-allowed opacity-80" />
                </div>
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50" />
                </div>
              </div>

              {/* Row 4 (Gym Theme) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[12px] uppercase text-[#777587] font-bold mb-1.5 block">Fitness Goal</label>
                  <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 appearance-none">
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="General Fitness">General Fitness</option>
                    <option value="Athletic Performance">Athletic Performance</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-[#c7c4d8]/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] uppercase text-[#777587] font-bold tracking-wider">Security</span>
                  <button type="button" className="text-[14px] font-bold text-[#4f46e5] hover:underline">Change Password</button>
                </div>
                <div className="relative">
                  <input type="password" value="********" disabled className="w-full bg-[#f3f4f5] border border-[#c7c4d8]/30 rounded-[0.5rem] px-4 py-3 pl-10 text-[#777587]" />
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777587]" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="submit" disabled={isLoading} className="w-full sm:w-[60%] bg-[#4f46e5] hover:bg-[#3525cd] text-white font-bold py-3.5 rounded-[0.5rem] transition-colors flex items-center justify-center">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleDiscard} className="w-full sm:w-[40%] bg-[#f3f4f5] hover:bg-[#e2e4e6] text-[#191c1d] font-bold py-3.5 rounded-[0.5rem] transition-colors border border-[#c7c4d8]/40">
                  Discard
                </button>
              </div>

              <div className="mt-8 bg-[#e0e7ff] rounded-lg p-5 flex items-start gap-4">
                <Info size={24} className="text-[#4f46e5] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-bold text-[#191c1d] mb-1">Account Security</h4>
                  <p className="text-[14px] text-[#464555] leading-relaxed">
                    To update your password or email address, please visit our secure security settings portal. Changes here only reflect your display profile.
                  </p>
                </div>
              </div>
            </form>
          </main>

        </div>
      </div>
    </div>
  );
}
