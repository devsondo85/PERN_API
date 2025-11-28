import React, { useState, useEffect } from 'react';
import { updateProduct, getCategories, getProductById } from '../services/api';

const EditProductModal = ({ product, isOpen, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    low_stock_threshold: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load product data and categories when modal opens
  useEffect(() => {
    if (isOpen && product) {
      loadProductData();
      fetchCategories();
    }
  }, [isOpen, product]);

  const loadProductData = async () => {
    try {
      // Fetch fresh product data
      const productData = await getProductById(product.id);
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        quantity: productData.quantity || '',
        low_stock_threshold: productData.low_stock_threshold || '',
        category_id: productData.category_id || '',
      });
    } catch (err) {
      console.error('Error loading product data:', err);
      setError('Failed to load product data');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (formData.quantity === '' || parseInt(formData.quantity) < 0) {
      setError('Quantity must be 0 or greater');
      return false;
    }
    if (parseInt(formData.low_stock_threshold) < 0) {
      setError('Low stock threshold must be 0 or greater');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        category_id: formData.category_id || null,
      };

      await updateProduct(product.id, productData);
      
      setSuccess(true);
      
      // Notify parent component to refresh product list
      if (onProductUpdated) {
        onProductUpdated();
      }

      // Close modal after 1 second
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err) {
      // Better error messages
      if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else if (err.message.includes('400') || err.message.includes('validation')) {
        setError(err.message || 'Please check your input and try again.');
      } else if (err.message.includes('404')) {
        setError('Product not found. It may have been deleted.');
      } else {
        setError(err.message || 'Failed to update product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      low_stock_threshold: '',
      category_id: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              Product updated successfully!
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-name">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-price">
                Price <span className="required">*</span>
              </label>
              <input
                type="number"
                id="edit-price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-quantity">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="edit-quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-low-stock-threshold">Low Stock Threshold</label>
              <input
                type="number"
                id="edit-low-stock-threshold"
                name="low_stock_threshold"
                value={formData.low_stock_threshold}
                onChange={handleChange}
                min="0"
                placeholder="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-category-id">Category</label>
              <select
                id="edit-category-id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;

