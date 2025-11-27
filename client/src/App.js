import React, { useState } from 'react';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    // Trigger refresh of product list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventory Management System</h1>
      </header>
      <main className="App-main">
        <AddProductForm onProductAdded={handleProductAdded} />
        <ProductList key={refreshKey} onProductAdded={handleProductAdded} />
      </main>
    </div>
  );
}

export default App;
