import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import StorePage from './pages/StorePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import ProductsPage from './pages/admin/ProductsPage';
import ClientsPage from './pages/admin/ClientsPage';
import PersonnelPage from './pages/admin/PersonnelPage';
import StatisticsPage from './pages/admin/StatisticsPage';
import Navigation from './components/Navigation';

function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.includes('/admin/dashboard');

  return (
    <>
      {!isAdminDashboard && <Navigation />}
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route path="products" element={<ProductsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="personnel" element={<PersonnelPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;