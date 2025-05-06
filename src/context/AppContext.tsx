import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Product, Client, Personnel, CartItem, TransactionRecord, StatisticsRecord } from '../types';

type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'RESET_PRODUCTS' }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'RESET_CLIENTS' }
  | { type: 'SET_PERSONNEL'; payload: Personnel[] }
  | { type: 'ADD_PERSONNEL'; payload: Personnel }
  | { type: 'UPDATE_PERSONNEL'; payload: Personnel }
  | { type: 'DELETE_PERSONNEL'; payload: string }
  | { type: 'RESET_PERSONNEL' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SELECT_CLIENT'; payload: { id: string; type: 'client' | 'personnel' } }
  | { type: 'RESET_CLIENT_SELECTION' }
  | { type: 'ADD_TRANSACTION'; payload: TransactionRecord }
  | { type: 'ADD_STATISTIC'; payload: StatisticsRecord }
  | { type: 'RESET_STATISTICS' }
  | { type: 'SET_ADMIN_PASSWORD'; payload: string };

const initialState: AppState = {
  products: [],
  clients: [],
  personnel: [],
  statistics: [],
  transactions: [],
  cart: [],
  selectedClientId: null,
  selectedClientType: null,
  adminPassword: 'sobriedad25'
};

const loadState = (): AppState => {
  try {
    const savedState = localStorage.getItem('storeAppState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (e) {
    console.error('Error loading state from localStorage', e);
  }
  return initialState;
};

const saveState = (state: AppState) => {
  try {
    localStorage.setItem('storeAppState', JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state to localStorage', e);
  }
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'RESET_PRODUCTS':
      return { ...state, products: [] };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload)
      };
    case 'RESET_CLIENTS':
      return { ...state, clients: [] };
    case 'SET_PERSONNEL':
      return { ...state, personnel: action.payload };
    case 'ADD_PERSONNEL':
      return { ...state, personnel: [...state.personnel, action.payload] };
    case 'UPDATE_PERSONNEL':
      return {
        ...state,
        personnel: state.personnel.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
    case 'DELETE_PERSONNEL':
      return {
        ...state,
        personnel: state.personnel.filter(p => p.id !== action.payload)
      };
    case 'RESET_PERSONNEL':
      return { ...state, personnel: [] };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SELECT_CLIENT':
      return {
        ...state,
        selectedClientId: action.payload.id,
        selectedClientType: action.payload.type
      };
    case 'RESET_CLIENT_SELECTION':
      return { ...state, selectedClientId: null, selectedClientType: null };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case 'ADD_STATISTIC':
      return {
        ...state,
        statistics: [...state.statistics, action.payload]
      };
    case 'RESET_STATISTICS':
      return { ...state, statistics: [] };
    case 'SET_ADMIN_PASSWORD':
      return { ...state, adminPassword: action.payload };
    default:
      return state;
  }
};

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};