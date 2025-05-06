import React from 'react';
import AdminPassword from '../../components/AdminPassword';
import Navigation from '../../components/Navigation';

const AdminLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <AdminPassword />
      </div>
    </div>
  );
};

export default AdminLogin;