import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSelector from '../components/ClientSelector';
import ProductGrid from '../components/ProductGrid';
import ShoppingCart from '../components/ShoppingCart';
import PurchaseConfirmation from '../components/PurchaseConfirmation';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const StorePage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleNewSale = () => {
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'RESET_CLIENT_SELECTION' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Tienda
        </h1>
        <button
          onClick={handleNewSale}
          className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium 
                   transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 
                   focus:ring-4 focus:ring-indigo-200 focus:outline-none transform hover:scale-[1.02]"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nueva Venta
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ClientSelector />
          <ProductGrid />
        </div>
        
        <div>
          <ShoppingCart />
          <PurchaseConfirmation />
        </div>
      </div>
    </div>
  );
};

export default StorePage;