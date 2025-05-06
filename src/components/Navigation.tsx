import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, Users, Package, BarChart2, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin/dashboard');

  return (
    <nav className="bg-white shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img src="https://i.postimg.cc/7PMVcjwk/logo-tienda1.png" alt="Tienda Logo" className="h-10 mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Tienda
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-1">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Store className="mr-2 h-5 w-5" />
              <span>Tienda</span>
            </Link>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard/products" className={`nav-link ${location.pathname.includes('/products') ? 'active' : ''}`}>
                  <Package className="mr-2 h-5 w-5" />
                  <span>Productos</span>
                </Link>
                <Link to="/admin/dashboard/clients" className={`nav-link ${location.pathname.includes('/clients') ? 'active' : ''}`}>
                  <Users className="mr-2 h-5 w-5" />
                  <span>Clientes</span>
                </Link>
                <Link to="/admin/dashboard/personnel" className={`nav-link ${location.pathname.includes('/personnel') ? 'active' : ''}`}>
                  <Users className="mr-2 h-5 w-5" />
                  <span>Personal</span>
                </Link>
                <Link to="/admin/dashboard/statistics" className={`nav-link ${location.pathname.includes('/statistics') ? 'active' : ''}`}>
                  <BarChart2 className="mr-2 h-5 w-5" />
                  <span>Estadísticas</span>
                </Link>
              </>
            ) : (
              <Link to="/admin" className="nav-link">
                <Settings className="mr-2 h-5 w-5" />
                <span>Administración</span>
              </Link>
            )}
          </div>
          
          <div className="md:hidden">
            <Link to={isAdmin ? '/' : '/admin'} className="nav-link">
              {isAdmin ? <Store className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2">
          <Link to="/" className={`nav-link flex-col items-center text-xs ${location.pathname === '/' ? 'active' : ''}`}>
            <Store className="h-5 w-5 mb-1" />
            <span>Tienda</span>
          </Link>
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard/products" className={`nav-link flex-col items-center text-xs ${location.pathname.includes('/products') ? 'active' : ''}`}>
                <Package className="h-5 w-5 mb-1" />
                <span>Productos</span>
              </Link>
              <Link to="/admin/dashboard/clients" className={`nav-link flex-col items-center text-xs ${location.pathname.includes('/clients') ? 'active' : ''}`}>
                <Users className="h-5 w-5 mb-1" />
                <span>Clientes</span>
              </Link>
              <Link to="/admin/dashboard/personnel" className={`nav-link flex-col items-center text-xs ${location.pathname.includes('/personnel') ? 'active' : ''}`}>
                <Users className="h-5 w-5 mb-1" />
                <span>Personal</span>
              </Link>
              <Link to="/admin/dashboard/statistics" className={`nav-link flex-col items-center text-xs ${location.pathname.includes('/statistics') ? 'active' : ''}`}>
                <BarChart2 className="h-5 w-5 mb-1" />
                <span>Estadísticas</span>
              </Link>
            </>
          ) : (
            <Link to="/admin" className="nav-link flex-col items-center text-xs">
              <Settings className="h-5 w-5 mb-1" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;