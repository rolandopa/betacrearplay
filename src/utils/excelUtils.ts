import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { Product, Client, Personnel } from '../types';

export const importProductsFromExcel = (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to Product objects
        const products = jsonData.map((row: any) => ({
          id: uuidv4(),
          name: row['NOMBRE DEL PRODUCTO'] || '',
          price: parseFloat(row['PRECIO']) || 0,
          stock: parseInt(row['STOCK'] || row['UNIDADES DISPONIBLES'] || 0),
          imageUrl: row['URL DE LA IMAGEN'] || '',
        }));
        
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const importClientsFromExcel = (file: File): Promise<Client[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to Client objects
        const clients = jsonData.map((row: any) => ({
          id: uuidv4(),
          name: row['NOMBRE DEL CLIENTE'] || '',
          balance: parseFloat(row['SALDO DISPONIBLE']) || 0,
          history: [],
        }));
        
        resolve(clients);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const importPersonnelFromExcel = (file: File): Promise<Personnel[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to Personnel objects
        const personnel = jsonData.map((row: any) => ({
          id: uuidv4(),
          name: row['NOMBRE DEL CLIENTE'] || row['NOMBRE DEL PERSONAL'] || '',
          owedBalance: parseFloat(row['SALDO ADEUDADO']) || 0,
          history: [],
        }));
        
        resolve(personnel);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (data: any[], filename: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const prepareProductsForExport = (products: Product[]): any[] => {
  return products.map(product => ({
    'NOMBRE DEL PRODUCTO': product.name,
    'PRECIO': product.price,
    'UNIDADES DISPONIBLES': product.stock,
    'URL DE LA IMAGEN': product.imageUrl,
  }));
};

export const prepareClientsForExport = (clients: Client[]): any[] => {
  return clients.map(client => ({
    'NOMBRE DEL CLIENTE': client.name,
    'SALDO DISPONIBLE': client.balance,
  }));
};

export const preparePersonnelForExport = (personnel: Personnel[]): any[] => {
  return personnel.map(person => ({
    'NOMBRE DEL PERSONAL': person.name,
    'SALDO ADEUDADO': person.owedBalance,
  }));
};

export const prepareTransactionsForExport = (transactions: any[]): any[] => {
  return transactions.map(transaction => ({
    'FECHA': new Date(transaction.date).toLocaleString(),
    'CLIENTE': transaction.clientName,
    'TIPO': transaction.clientType === 'client' ? 'Cliente' : 'Personal',
    'PRODUCTOS': transaction.products.map((p: any) => `${p.name} (${p.quantity})`).join(', '),
    'TOTAL': transaction.total,
  }));
};