import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../types';
import { Plus, Edit, Trash2, Save, X, DownloadCloud, UploadCloud, Database } from 'lucide-react';
import { 
  importProductsFromExcel, 
  exportToExcel, 
  prepareProductsForExport 
} from '../../utils/excelUtils';

const ProductsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  });
  const [confirmReset, setConfirmReset] = useState(false);

  const handleAddProduct = () => {
    const product = {
      id: uuidv4(),
      ...newProduct
    };
    
    dispatch({ type: 'ADD_PRODUCT', payload: product });
    
    // Add to statistics
    dispatch({
      type: 'ADD_STATISTIC',
      payload: {
        id: uuidv4(),
        date: new Date().toISOString(),
        type: 'product_update',
        details: `Producto agregado: ${product.name}`
      }
    });
    
    // Reset form
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      imageUrl: ''
    });
    setShowForm(false);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: editingProduct });
      
      // Add to statistics
      dispatch({
        type: 'ADD_STATISTIC',
        payload: {
          id: uuidv4(),
          date: new Date().toISOString(),
          type: 'product_update',
          details: `Producto actualizado: ${editingProduct.name}`
        }
      });
      
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    const product = state.products.find(p => p.id === id);
    if (!product) return;
    
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
    
    // Add to statistics
    dispatch({
      type: 'ADD_STATISTIC',
      payload: {
        id: uuidv4(),
        date: new Date().toISOString(),
        type: 'product_update',
        details: `Producto eliminado: ${product.name}`
      }
    });
  };

  const handleResetProducts = () => {
    dispatch({ type: 'RESET_PRODUCTS' });
    
    // Add to statistics
    dispatch({
      type: 'ADD_STATISTIC',
      payload: {
        id: uuidv4(),
        date: new Date().toISOString(),
        type: 'product_update',
        details: 'Base de datos de productos reiniciada'
      }
    });
    
    setConfirmReset(false);
  };

  const handleExportProducts = () => {
    const data = prepareProductsForExport(state.products);
    exportToExcel(data, 'productos');
  };

  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    importProductsFromExcel(file)
      .then(products => {
        products.forEach(product => {
          dispatch({ type: 'ADD_PRODUCT', payload: product });
        });
        
        // Add to statistics
        dispatch({
          type: 'ADD_STATISTIC',
          payload: {
            id: uuidv4(),
            date: new Date().toISOString(),
            type: 'product_update',
            details: `Importación de productos: ${products.length} productos`
          }
        });
        
        // Reset file input
        e.target.value = '';
      })
      .catch(error => {
        console.error('Error importing products:', error);
        // Reset file input
        e.target.value = '';
      });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administración de Productos</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-1" />
            Agregar Producto
          </button>
          
          <button
            onClick={handleExportProducts}
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
              onChange={handleImportProducts} 
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

      {/* Add/Edit Product Form */}
      {(showForm || editingProduct) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) => 
                  editingProduct 
                    ? setEditingProduct({ ...editingProduct, name: e.target.value }) 
                    : setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => 
                  editingProduct 
                    ? setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 }) 
                    : setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidades Disponibles
              </label>
              <input
                type="number"
                min="0"
                value={editingProduct ? editingProduct.stock : newProduct.stock}
                onChange={(e) => 
                  editingProduct 
                    ? setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 }) 
                    : setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de la Imagen
              </label>
              <input
                type="text"
                value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                onChange={(e) => 
                  editingProduct 
                    ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value }) 
                    : setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="h-5 w-5 inline-block mr-1" />
              {editingProduct ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {confirmReset && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">¿Está seguro?</h3>
          <p className="text-red-700 mb-4">
            Esta acción eliminará todos los productos y no se puede deshacer.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleResetProducts}
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

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.products.length > 0 ? (
              state.products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.imageUrl || 'https://via.placeholder.com/40'} 
                          alt="" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/40?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${product.stock > 10 ? 'text-green-600' : (product.stock > 0 ? 'text-amber-600' : 'text-red-600')}`}>
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;