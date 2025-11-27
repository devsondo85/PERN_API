import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import EditProductModal from './EditProductModal';

const ProductList = ({ onProductAdded, onProductUpdated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch products on component mount and when products are added/updated
  useEffect(() => {
    fetchProducts();
  }, [onProductAdded, onProductUpdated, refreshKey]);

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
    const productName = products.find(p => p.id === id)?.name || 'this product';
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        // Refresh the product list
        setRefreshKey(prev => prev + 1);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product. Please try again.');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductUpdated = () => {
    // Trigger refresh
    setRefreshKey(prev => prev + 1);
    fetchProducts();
    if (onProductUpdated) {
      onProductUpdated();
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
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <EditProductModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default ProductList;

