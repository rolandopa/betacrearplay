import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, AlertCircle, PartyPopper, Sparkles } from 'lucide-react';

const PurchaseConfirmation: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastPurchase, setLastPurchase] = useState<{ name: string; balance: number } | null>(null);
  
  const totalAmount = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  );

  const handleConfirmPurchase = () => {
    if (!state.selectedClientId || !state.selectedClientType) {
      setErrorMessage('Por favor seleccione un cliente');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (state.cart.length === 0) {
      setErrorMessage('El carrito está vacío');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Check if client has sufficient balance
    if (state.selectedClientType === 'client') {
      const client = state.clients.find(c => c.id === state.selectedClientId);
      if (!client) return;
      
      if (client.balance < totalAmount) {
        setErrorMessage('SALDO INSUFICIENTE');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      // Create transaction
      const transaction = {
        id: uuidv4(),
        date: new Date().toISOString(),
        clientId: client.id,
        clientName: client.name,
        clientType: 'client' as const,
        products: state.cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: totalAmount
      };

      // Update client balance
      const updatedClient = {
        ...client,
        balance: client.balance - totalAmount,
        history: [...client.history, transaction]
      };

      // Update product stock
      state.cart.forEach(item => {
        const product = state.products.find(p => p.id === item.product.id);
        if (product) {
          dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
              ...product,
              stock: product.stock - item.quantity
            }
          });
        }
      });

      // Update client
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
      
      // Add transaction to history
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      // Add statistic record
      dispatch({
        type: 'ADD_STATISTIC',
        payload: {
          id: uuidv4(),
          date: new Date().toISOString(),
          type: 'purchase',
          details: `Venta a ${client.name} por $${totalAmount.toFixed(2)}`
        }
      });

      setLastPurchase({ name: client.name, balance: updatedClient.balance });

    } else {
      // Personnel purchase
      const person = state.personnel.find(p => p.id === state.selectedClientId);
      if (!person) return;
      
      // Create transaction
      const transaction = {
        id: uuidv4(),
        date: new Date().toISOString(),
        clientId: person.id,
        clientName: person.name,
        clientType: 'personnel' as const,
        products: state.cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: totalAmount
      };

      // Update personnel owed balance
      const updatedPerson = {
        ...person,
        owedBalance: person.owedBalance + totalAmount,
        history: [...person.history, transaction]
      };

      // Update product stock
      state.cart.forEach(item => {
        const product = state.products.find(p => p.id === item.product.id);
        if (product) {
          dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
              ...product,
              stock: product.stock - item.quantity
            }
          });
        }
      });

      // Update personnel
      dispatch({ type: 'UPDATE_PERSONNEL', payload: updatedPerson });
      
      // Add transaction to history
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      // Add statistic record
      dispatch({
        type: 'ADD_STATISTIC',
        payload: {
          id: uuidv4(),
          date: new Date().toISOString(),
          type: 'purchase',
          details: `Venta a personal ${person.name} por $${totalAmount.toFixed(2)}`
        }
      });

      setLastPurchase({ name: person.name, balance: updatedPerson.owedBalance });
    }

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    
    // Clear cart
    dispatch({ type: 'CLEAR_CART' });
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-2xl mx-4 animate-fadeIn">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl">
            <div className="bg-white p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 gradient-primary"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4">
                    <div className="w-full h-full rotate-180 rounded-full blur-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-50"></div>
                  </div>
                  <PartyPopper className="h-16 w-16 text-indigo-500 relative" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ¡Venta Realizada con Éxito!
              </h3>

              <div className="text-center mb-6">
                <Sparkles className="h-5 w-5 text-yellow-500 inline-block mr-2" />
                <span className="text-gray-600">Gracias por su compra</span>
                <Sparkles className="h-5 w-5 text-yellow-500 inline-block ml-2" />
              </div>

              {lastPurchase && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-pink-50">
                    <p className="text-lg">
                      Cliente: <span className="font-semibold text-indigo-700">{lastPurchase.name}</span>
                    </p>
                    <p className="text-lg">
                      {state.selectedClientType === 'client' ? (
                        <>
                          Saldo disponible: <span className="font-semibold text-green-600">${lastPurchase.balance.toFixed(2)}</span>
                        </>
                      ) : (
                        <>
                          Saldo adeudado: <span className="font-semibold text-red-600">${lastPurchase.balance.toFixed(2)}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowSuccess(false)}
                    className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleConfirmPurchase}
        disabled={state.cart.length === 0 || !state.selectedClientId}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
          state.cart.length === 0 || !state.selectedClientId
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
        }`}
      >
        CONFIRMAR VENTA
      </button>

      {/* Error message */}
      {showError && (
        <div className="mt-6 animate-fadeIn">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-red-800">{errorMessage}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseConfirmation;