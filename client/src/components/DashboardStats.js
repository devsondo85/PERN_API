import React, { useMemo } from 'react';

const DashboardStats = ({ products }) => {
  const stats = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        lowStockCount: 0,
        totalValue: 0,
        totalQuantity: 0,
        lowStockProducts: []
      };
    }

    const lowStockProducts = products.filter(
      product => product.quantity <= product.low_stock_threshold
    );

    const totalValue = products.reduce((sum, product) => {
      return sum + (parseFloat(product.price) * parseInt(product.quantity));
    }, 0);

    const totalQuantity = products.reduce((sum, product) => {
      return sum + parseInt(product.quantity);
    }, 0);

    return {
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      totalValue,
      totalQuantity,
      lowStockProducts
    };
  }, [products]);

  return (
    <div className="dashboard-stats">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
        </div>

        <div className={`stat-card ${stats.lowStockCount > 0 ? 'stat-card-warning' : 'stat-card-success'}`}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-label">Low Stock Items</div>
            <div className="stat-value">{stats.lowStockCount}</div>
            {stats.lowStockCount > 0 && (
              <div className="stat-subtext">Needs attention</div>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Quantity</div>
            <div className="stat-value">{stats.totalQuantity.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Inventory Value</div>
            <div className="stat-value">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {stats.lowStockCount > 0 && (
        <div className="low-stock-alert">
          <div className="alert-header">
            <span className="alert-icon">⚠️</span>
            <h3>Low Stock Alert</h3>
            <span className="alert-badge">{stats.lowStockCount}</span>
          </div>
          <div className="alert-products">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="alert-product-item">
                <span className="product-name">{product.name}</span>
                <span className="product-stock">
                  <span className="stock-quantity">{product.quantity}</span>
                  <span className="stock-threshold">/ {product.low_stock_threshold}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;

