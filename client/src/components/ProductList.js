import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api';

const ProductList = ({ onProductAdded, onProductUpdated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on component mount and when products are added/updated
  useEffect(() => {
    fetchProducts();
  }, [onProductAdded, onProductUpdated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        // Refresh the product list
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product. Please try again.');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Product Inventory</h2>
      {products.length === 0 ? (
        <p>No products found. Add your first product below!</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Low Stock Threshold</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description || 'N/A'}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td className={product.quantity <= product.low_stock_threshold ? 'low-stock' : ''}>
                  {product.quantity}
                </td>
                <td>{product.low_stock_threshold}</td>
                <td>{product.category_name || 'Uncategorized'}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;

