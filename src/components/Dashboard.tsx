import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      logout();
      navigate('/login');
    }
  };

  const testUserResource = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await api.post('/api/v1/user/resource');
      setMessage(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Access Denied (User Resource)');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const testAdminResource = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await api.get('/api/v1/admin/resource');
      setMessage(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Access Denied (Admin Resource)');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-3xl p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user?.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-sm transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Authorities</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {user?.roles.map((role) => (
              <span key={role} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">API Resource Testing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={testUserResource}
              className="p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition duration-200 text-center"
            >
              Test User Resource
              <span className="block text-xs font-normal text-gray-500 mt-1">Requires USER_WRITE (POST)</span>
            </button>
            <button
              onClick={testAdminResource}
              className="p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition duration-200 text-center"
            >
              Test Admin Resource
              <span className="block text-xs font-normal text-gray-500 mt-1">Requires ADMIN role (GET)</span>
            </button>
          </div>
        </div>

        <div className="min-h-[100px] p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Response from Server</h4>
          {message && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-300 font-medium">
                <span className="mr-2">✅</span> {message}
              </p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 font-medium">
                <span className="mr-2">❌</span> {error}
              </p>
            </div>
          )}
          {!message && !error && (
            <p className="text-gray-400 text-sm italic">Click a resource button above to see authorization in action.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
