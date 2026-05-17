import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import useToastStore from '../store/toastStore';

export default function VerifyPage() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.addToast);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.put('http://localhost:5000/api/users/verifyaccountafterclick', { token });
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || 'Account verified successfully!');
          addToast('Account verified!', 'success');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be expired.');
      }
    };

    verify();
  }, [location, addToast]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 font-manrope">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-[#c7c4d8]/20">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 size={64} className="text-[#4f46e5] animate-spin mb-6" />
            <h2 className="text-[24px] font-bold text-[#191c1d] mb-2">Verifying Account</h2>
            <p className="text-[#777587]">Please wait while we confirm your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle size={64} className="text-green-500 mb-6" />
            <h2 className="text-[24px] font-bold text-[#191c1d] mb-2">Email Verified!</h2>
            <p className="text-[#777587] mb-8">{message}</p>
            <Link to="/auth" className="w-full bg-[#4f46e5] hover:bg-[#3525cd] text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              Sign In <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle size={64} className="text-red-500 mb-6" />
            <h2 className="text-[24px] font-bold text-[#191c1d] mb-2">Verification Failed</h2>
            <p className="text-[#777587] mb-8">{message}</p>
            <div className="flex flex-col w-full gap-3">
              <Link to="/auth" className="w-full bg-[#4f46e5] hover:bg-[#3525cd] text-white font-bold py-3.5 rounded-lg transition-colors">
                Back to Login
              </Link>
              <Link to="/contact" className="text-body-sm font-bold text-[#4f46e5] hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
