import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import PasswordChange from '../../components/PasswordChange';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <Outlet />
          </div>
          <div className="md:col-span-1">
            <PasswordChange />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;