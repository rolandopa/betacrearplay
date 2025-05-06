import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Client, TransactionRecord } from '../../types';
import { 
  Plus, Edit, Trash2, Save, X, DownloadCloud, UploadCloud, 
  Database, History, Calendar, DollarSign, User 
} from 'lucide-react';
import { 
  importClientsFromExcel, 
  exportToExcel, 
  prepareClientsForExport 
} from '../../utils/excelUtils';

const ClientsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'history'>>({
    name: '',
    balance: 0
  });
  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleAddClient = () => {
    const client = {
      id: uuidv4(),
      ...newClient,
      history: []
    };
    
    dispatch({ type: 'ADD_CLIENT', payload: client });
    
    // Add to statistics
    dispatch({
      type: 'ADD_STATISTIC',
      payload: {
        id: uuidv4(),
        date: new Date().toISOString(),
        type: 'client_update',
        details: `Cliente agregado: ${client.name}`
      }
    });
    
    // Reset form
    setNewClient({
      name: '',
      balance: 0
    });
    setShowForm(false);
  };

  const handleUpdateClient = () => {
    if (editingClient) {
      dispatch({ type: 'UPDATE_CLIENT', payload: editingClient });
      
      // Add to statistics
      dispatch({
        type: 'ADD_STATISTIC',
        payload: {
          id: uuidv4(),
          date: new Date().toISOString(),
          type: 'client_update',
          details: `Cliente actualizado: ${editingClient.name}`
        }
      });
      
      setEditingClient(null);
    }
  };

  const handleDeleteClient = (id: string) => {
    const client = state.clients.find(c => c.id === id);
    if (!client) return;
    
    dispatch({ type: 'DELETE_CLIENT', payload: id });
    
    // Add to statistics
    dispatch({
      type: 'ADD_STATISTIC',
      payload: {
        id: uuidv4(),
        date: new Date().toISOString(),
        type: 'client_update',
        details: `Cliente eliminado: ${client.name}`
      }
    });
    
    // If viewing this client's history, clear it
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient(null);
    }
  };

  const handleResetClients = () => {
    dispatch({ type: 'RESET_CLIENTS' });
    
    // Add to statistics
    dispatch({
      type: 'ADD_STATISTIC',
      payload: {
        id: uuidv4(),
        date: new Date().toISOString(),
        type: 'client_update',
        details: 'Base de datos de clientes reiniciada'
      }
    });
    
    setConfirmReset(false);
    setSelectedClient(null);
  };

  const handleExportClients = () => {
    const data = prepareClientsForExport(state.clients);
    exportToExcel(data, 'clientes');
  };

  const handleImportClients = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    importClientsFromExcel(file)
      .then(clients => {
        clients.forEach(client => {
          dispatch({ type: 'ADD_CLIENT', payload: client });
        });
        
        // Add to statistics
        dispatch({
          type: 'ADD_STATISTIC',
          payload: {
            id: uuidv4(),
            date: new Date().toISOString(),
            type: 'client_update',
            details: `Importación de clientes: ${clients.length} clientes`
          }
        });
        
        // Reset file input
        e.target.value = '';
      })
      .catch(error => {
        console.error('Error importing clients:', error);
        // Reset file input
        e.target.value = '';
      });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administración de Clientes</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-1" />
            Agregar Cliente
          </button>
          
          <button
            onClick={handleExportClients}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <DownloadCloud className="h-5 w-5 mr-1" />
            Exportar
          </button>
          
          <label className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 cursor-pointer">
            <UploadCloud className="h-5 w-5 mr-1" />
            Importar
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              onChange={handleImportClients} 
            />
          </label>
          
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Database className="h-5 w-5 mr-1" />
            Reiniciar DB
          </button>
        </div>
      </div>

      {/* Add/Edit Client Form */}
      {(showForm || editingClient) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente
              </label>
              <input
                type="text"
                value={editingClient ? editingClient.name : newClient.name}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, name: e.target.value }) 
                    : setNewClient({ ...newClient, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo Disponible
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editingClient ? editingClient.balance : newClient.balance}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, balance: parseFloat(e.target.value) || 0 }) 
                    : setNewClient({ ...newClient, balance: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={editingClient ? handleUpdateClient : handleAddClient}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="h-5 w-5 inline-block mr-1" />
              {editingClient ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {confirmReset && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">¿Está seguro?</h3>
          <p className="text-red-700 mb-4">
            Esta acción eliminará todos los clientes y no se puede deshacer.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleResetClients}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sí, reiniciar
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-medium">Clientes</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {state.clients.length > 0 ? (
                state.clients.map((client) => (
                  <li 
                    key={client.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      selectedClient?.id === client.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-green-600">Saldo: ${client.balance.toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClient(client);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  No hay clientes registrados
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-medium">
              {selectedClient 
                ? `Historial de ${selectedClient.name}` 
                : 'Seleccione un cliente para ver su historial'}
            </h2>
          </div>
          
          {selectedClient ? (
            <div className="p-4">
              <div className="flex items-center mb-4 text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">Cliente: {selectedClient.name}</span>
                <DollarSign className="h-4 w-4 mr-1" />
                <span>Saldo actual: ${selectedClient.balance.toFixed(2)}</span>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalle
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedClient.history.length > 0 ? (
                      [...selectedClient.history]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((transaction: TransactionRecord) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>
                                <p className="font-medium">Compra</p>
                                <p className="text-xs text-gray-500">
                                  {transaction.products.map(p => `${p.name} (${p.quantity})`).join(', ')}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                              -${transaction.total.toFixed(2)}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                          No hay transacciones registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <History className="h-12 w-12 text-gray-300 mb-2" />
              <p>Seleccione un cliente para ver su historial de transacciones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;