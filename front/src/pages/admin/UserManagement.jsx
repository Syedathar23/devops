import React, { useState, useEffect } from 'react';
import { Search, Mail, Calendar, User, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-body-md text-on-surface-variant font-medium">Loading Users...</p>
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
        <h1 className="text-h2 font-bold text-on-surface">User Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-outline-variant/40 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-dim text-label-caps text-on-surface-variant">
                <th className="px-6 py-4 font-semibold uppercase">User</th>
                <th className="px-6 py-4 font-semibold uppercase">Email</th>
                <th className="px-6 py-4 font-semibold uppercase">Joined Date</th>
                <th className="px-6 py-4 font-semibold uppercase">Role</th>
                <th className="px-6 py-4 font-semibold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-dim/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User size={16} />
                    </div>
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant flex items-center gap-2">
                    <Mail size={14} className="text-outline" />
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant flex items-center gap-2">
                    <Calendar size={14} className="text-outline" />
                    {new Date(user.createdat).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-dim text-on-surface-variant'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">View Details</button>
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
