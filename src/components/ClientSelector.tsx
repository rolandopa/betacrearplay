import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Client, Personnel } from '../types';
import { Search, Users } from 'lucide-react';

const ClientSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allItems = useMemo(() => {
    const clients = state.clients.map(client => ({
      ...client,
      type: 'client' as const,
      amount: client.balance,
      label: 'Saldo'
    }));
    
    const personnel = state.personnel.map(person => ({
      ...person,
      type: 'personnel' as const,
      amount: person.owedBalance,
      label: 'Adeuda'
    }));
    
    return [...clients, ...personnel];
  }, [state.clients, state.personnel]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return [...allItems].sort((a, b) => a.name.localeCompare(b.name));
    }
    return allItems
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allItems, searchTerm]);

  const selectedItem = useMemo(() => {
    if (!state.selectedClientId || !state.selectedClientType) return null;
    return allItems.find(item => 
      item.id === state.selectedClientId && 
      item.type === state.selectedClientType
    );
  }, [state.selectedClientId, state.selectedClientType, allItems]);

  const handleSelect = (id: string, type: 'client' | 'personnel') => {
    dispatch({
      type: 'SELECT_CLIENT',
      payload: { id, type }
    });
    setIsOpen(false);
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Seleccionar Cliente o Personal
      </label>
      <div className="relative">
        <div 
          className="w-full flex items-center justify-between p-3 border rounded-md bg-white cursor-pointer hover:border-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedItem ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-400" />
                <span>{selectedItem.name}</span>
              </div>
              <span className={`font-medium ${selectedItem.type === 'client' ? 'text-green-600' : 'text-red-600'}`}>
                {selectedItem.label}: ${selectedItem.amount.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Users className="h-5 w-5 mr-2" />
              <span>Seleccionar cliente o personal</span>
            </div>
          )}
        </div>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-auto">
            <div className="sticky top-0 bg-white p-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div 
                    key={`${item.type}-${item.id}`}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelect(item.id, item.type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className={`h-4 w-4 mr-2 ${item.type === 'client' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${item.type === 'client' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.label}: ${item.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'client' ? 'Cliente' : 'Personal'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSelector;