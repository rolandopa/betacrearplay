import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Plus, Minus } from 'lucide-react';

const ShoppingCart: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  const totalAmount = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [state.cart]);

  const selectedClient = useMemo(() => {
    if (!state.selectedClientId || !state.selectedClientType) return null;
    
    if (state.selectedClientType === 'client') {
      return state.clients.find(client => client.id === state.selectedClientId);
    } else {
      return state.personnel.find(personnel => personnel.id === state.selectedClientId);
    }
  }, [state.selectedClientId, state.selectedClientType, state.clients, state.personnel]);

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    if (newQuantity > product.stock) {
      return; // Don't allow quantity to exceed available stock
    }

    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { productId, quantity: newQuantity }
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-lg font-medium mb-4">Carrito de Compras</h2>
      
      {state.cart.length > 0 ? (
        <>
          <div className="divide-y">
            {state.cart.map((item) => (
              <div key={item.product.id} className="py-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">
                      ${item.product.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                      className="w-16 text-center border rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-medium text-blue-600">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                {item.quantity >= item.product.stock && (
                  <p className="text-xs text-amber-600 mt-1">
                    Stock máximo alcanzado
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center font-medium text-lg">
              <span>Total</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
            
            {selectedClient && (
              <div className="mt-2 text-sm text-gray-600">
                {state.selectedClientType === 'client' ? (
                  <span>Saldo disponible: <span className="font-medium text-green-600">${selectedClient.balance.toFixed(2)}</span></span>
                ) : (
                  <span>Saldo adeudado: <span className="font-medium text-red-600">${selectedClient.owedBalance.toFixed(2)}</span></span>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500 py-4 text-center">No hay productos en el carrito</p>
      )}
    </div>
  );
};

export default ShoppingCart;