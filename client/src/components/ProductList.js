import React, { useState, useEffect, useMemo } from 'react';
import { getProducts, deleteProduct, getCategories } from '../services/api';
import EditProductModal from './EditProductModal';

const ProductList = ({ onProductAdded, onProductUpdated }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'quantity', 'id'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Fetch products and categories on component mount and when products are added/updated
  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
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

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category_id === parseInt(selectedCategory)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'quantity':
          aValue = parseInt(a.quantity);
          bValue = parseInt(b.quantity);
          break;
        case 'id':
        default:
          aValue = parseInt(a.id);
          bValue = parseInt(b.id);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    setSortOrder('asc');
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
      <div className="product-list-header">
        <h2>Product Inventory</h2>
        <div className="search-filter-bar">
          <div className="search-group">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <select
              className="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-group">
            <label>Sort by:</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
              <option value="id">ID</option>
            </select>
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {(searchTerm || selectedCategory) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <p>No products found. Add your first product below!</p>
      ) : filteredAndSortedProducts.length === 0 ? (
        <p className="no-results">No products match your search criteria.</p>
      ) : (
        <>
          <p className="results-count">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </p>
          <table className="products-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('id')}>
                  ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Description</th>
                <th className="sortable" onClick={() => handleSort('price')}>
                  Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('quantity')}>
                  Quantity {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Low Stock Threshold</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.map((product) => (
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
        </>
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

