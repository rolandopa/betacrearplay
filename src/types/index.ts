export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface Client {
  id: string;
  name: string;
  balance: number;
  history: TransactionRecord[];
}

export interface Personnel {
  id: string;
  name: string;
  owedBalance: number;
  history: TransactionRecord[];
}

export interface TransactionRecord {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  clientType: 'client' | 'personnel';
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

export interface StatisticsRecord {
  id: string;
  date: string;
  type: 'purchase' | 'product_update' | 'client_update' | 'personnel_update';
  details: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppState {
  products: Product[];
  clients: Client[];
  personnel: Personnel[];
  statistics: StatisticsRecord[];
  transactions: TransactionRecord[];
  cart: CartItem[];
  selectedClientId: string | null;
  selectedClientType: 'client' | 'personnel' | null;
  adminPassword: string;
}