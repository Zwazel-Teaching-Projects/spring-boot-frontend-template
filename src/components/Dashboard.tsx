import React, { useState } from 'react';
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
      // Even if server call fails, clear local state
      logout();
      navigate('/login');
    }
  };

  const testUserResource = async () => {
    setMessage(null);
    setError(null);
    try {
      // Note: Backend has POST, PUT for user resource
      const response = await api.post('/api/v1/user/resource');
      setMessage(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied (User Resource)');
    }
  };

  const testAdminResource = async () => {
    setMessage(null);
    setError(null);
    try {
      // Note: Backend has GET, DELETE for admin resource
      const response = await api.get('/api/v1/admin/resource');
      setMessage(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied (Admin Resource)');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.email}</strong>!</p>
      <p>Your Authorities: {user?.roles.join(', ')}</p>
      
      <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Logout
      </button>

      <hr style={{ margin: '20px 0' }} />

      <h3>Resource Testing</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={testUserResource} style={{ padding: '10px', cursor: 'pointer' }}>
          Test User Resource (POST)
        </button>
        <button onClick={testAdminResource} style={{ padding: '10px', cursor: 'pointer' }}>
          Test Admin Resource (GET)
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '50px' }}>
        {message && <p style={{ color: 'green', margin: 0 }}><strong>Success:</strong> {message}</p>}
        {error && <p style={{ color: 'red', margin: 0 }}><strong>Error:</strong> {error}</p>}
        {!message && !error && <p style={{ color: '#666', margin: 0 }}>Click a button to test access...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
