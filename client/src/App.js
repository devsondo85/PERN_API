import React, { useState } from 'react';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import DashboardStats from './components/DashboardStats';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [products, setProducts] = useState([]);

  const handleProductAdded = () => {
    // Trigger refresh of product list
    setRefreshKey(prev => prev + 1);
  };

  const handleProductsLoaded = (loadedProducts) => {
    setProducts(loadedProducts);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventory Management System</h1>
      </header>
      <main className="App-main">
        <DashboardStats products={products} />
        <AddProductForm onProductAdded={handleProductAdded} />
        <ProductList 
          key={refreshKey} 
          onProductAdded={handleProductAdded}
          onProductsLoaded={handleProductsLoaded}
        />
      </main>
    </div>
  );
}

export default App;
