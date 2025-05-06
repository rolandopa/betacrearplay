import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import { Check, Search } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    return state.products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        product.stock > 0
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [state.products, searchTerm]);

  const handleProductClick = (product: Product) => {
    if (selectedProducts.includes(product.id)) {
      setSelectedProducts(selectedProducts.filter(id => id !== product.id));
      dispatch({ 
        type: 'REMOVE_FROM_CART', 
        payload: product.id 
      });
    } else {
      setSelectedProducts([...selectedProducts, product.id]);
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: { product, quantity: 1 } 
      });
    }
  };

  // Group products into rows of 3 for the grid
  const productRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 3) {
      rows.push(filteredProducts.slice(i, i + 3));
    }
    return rows;
  }, [filteredProducts]);

  return (
    <div className="mt-6">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {productRows.length > 0 ? (
        <div className="space-y-4">
          {productRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {row.map(product => (
                <div 
                  key={product.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedProducts.includes(product.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded-md">
                      <img 
                        src={product.imageUrl || 'https://via.placeholder.com/100'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/100?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-md font-medium">{product.name}</h3>
                      <p className="text-lg font-semibold text-blue-600">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Disponible: {product.stock}</p>
                    </div>
                    {selectedProducts.includes(product.id) && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'No se encontraron productos que coincidan con la búsqueda' 
            : 'No hay productos disponibles'}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;