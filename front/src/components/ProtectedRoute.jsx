import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

const ProtectedRoute = () => {
  const { admin } = useAuth();
  
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default ProtectedRoute;
