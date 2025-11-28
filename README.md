# Inventory Management System

A full-stack PERN (PostgreSQL, Express, React, Node.js) application for managing product inventory with real-time tracking, low stock alerts, and comprehensive search/filter capabilities.

## 🚀 Features

### Core Functionality
- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products by categories
- **Inventory Tracking**: Real-time quantity monitoring
- **Low Stock Alerts**: Automatic detection and visual indicators for low stock items
- **Search & Filter**: Search by name, filter by category, and sort by multiple fields
- **Dashboard Statistics**: Overview of total products, inventory value, and low stock items

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Automatic refresh after create, update, or delete operations
- **Error Handling**: User-friendly error messages with retry options
- **Loading States**: Visual feedback during data operations
- **Modal Forms**: Clean modal interface for editing products

## 📁 Project Structure

```
PERN-API/
├── server/                 # Backend (Express + PostgreSQL)
│   ├── index.js           # Express server setup and routes
│   ├── queries.js         # Database query functions
│   ├── schema.sql         # Database schema
│   └── insert_data.sql    # Sample data
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ProductList.js
│   │   │   ├── AddProductForm.js
│   │   │   ├── EditProductModal.js
│   │   │   └── DashboardStats.js
│   │   ├── services/      # API service layer
│   │   │   └── api.js
│   │   ├── App.js         # Main App component
│   │   └── App.css        # Styles
│   └── package.json
└── package.json           # Root package.json
```

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **pg (node-postgres)**: PostgreSQL client for Node.js
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **React Hooks**: useState, useEffect, useMemo
- **Fetch API**: HTTP requests
- **CSS3**: Styling with responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devsondo85/PERN_API.git
cd PERN-API
```

### 2. Database Setup

#### Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE inventory_app;

# Exit psql
\q
```

#### Run the Schema

```bash
# Connect to the database and run schema
psql -U me -h localhost -d inventory_app -f server/schema.sql
```

#### Insert Sample Data (Optional)

```bash
psql -U me -h localhost -d inventory_app -f server/insert_data.sql
```

### 3. Backend Setup

```bash
# Install dependencies
npm install

# Update database credentials in server/queries.js
# Edit the pool configuration:
# - user: your PostgreSQL username
# - password: your PostgreSQL password
# - host: your database host
# - database: inventory_app
```

### 4. Frontend Setup

```bash
cd client
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
# From the root directory
cd server
node index.js
```

The server will run on `http://localhost:9001`

### Start the Frontend Development Server

```bash
# From the client directory
cd client
npm start
```

The React app will open at `http://localhost:3000`

## 📡 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/low-stock` - Get low stock products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Inventory Logs
- `GET /inventory-logs` - Get all inventory logs
- `GET /inventory-logs/product/:productId` - Get logs by product
- `POST /inventory-logs` - Create inventory log (updates product quantity)

## 🗄️ Database Schema

### Categories Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) UNIQUE)
- `created_at` (TIMESTAMP)

### Products Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255))
- `description` (TEXT)
- `price` (DECIMAL(10,2))
- `quantity` (INTEGER)
- `low_stock_threshold` (INTEGER)
- `category_id` (INTEGER, FOREIGN KEY)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Inventory Logs Table
- `id` (SERIAL PRIMARY KEY)
- `product_id` (INTEGER, FOREIGN KEY)
- `change_type` (VARCHAR(50)) - 'restock', 'sale', 'adjustment'
- `quantity_change` (INTEGER)
- `previous_quantity` (INTEGER)
- `new_quantity` (INTEGER)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

## 🎨 Features in Detail

### Search & Filter
- **Search by Name**: Real-time search as you type
- **Filter by Category**: Dropdown to filter products by category
- **Sort Options**: Sort by Name, Price, Quantity, or ID
- **Sort Order**: Toggle between ascending and descending
- **Clear Filters**: One-click reset of all filters

### Low Stock Alerts
- **Automatic Detection**: Products with quantity ≤ threshold are flagged
- **Visual Indicators**: Red text, warning badges, and highlighted rows
- **Dashboard Alert**: Dedicated section showing all low stock items
- **Real-time Updates**: Alerts update automatically when quantities change

### Dashboard Statistics
- **Total Products**: Count of all products in inventory
- **Low Stock Items**: Number of products below threshold
- **Total Quantity**: Sum of all product quantities
- **Total Inventory Value**: Calculated value of all inventory

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `server/queries.js`
- Ensure database exists: `psql -l | grep inventory_app`

### CORS Errors
- CORS is enabled in `server/index.js`
- Ensure backend is running on port 9001
- Check browser console for specific error messages

### Products Not Loading
- Check browser console (F12) for errors
- Verify backend server is running
- Test API directly: `curl http://localhost:9001/products`

## 📝 Environment Variables

For production, consider using environment variables:

```javascript
// server/queries.js
const pool = new POOL({
    user: process.env.DB_USER || 'me',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'inventory_app',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
})
```

## 🚢 Deployment

### Quick Start

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Backend Deployment Options
- **Heroku**: Free tier available, easy PostgreSQL setup
- **Railway**: All-in-one solution, automatic deployments
- **Render**: Free tier, simple setup

### Frontend Deployment Options
- **Vercel**: Optimized for React, free tier
- **Netlify**: Easy GitHub integration, free tier
- **Render**: Can deploy alongside backend

### Environment Variables

Before deploying, ensure you have:
- Database connection credentials
- Backend URL for frontend configuration

See `.env.example` for required variables (create `.env` file locally for development).

### Deployment Steps Summary

1. **Prepare Code** ✅ (Already done - environment variables configured)
2. **Deploy Backend** - Choose platform and follow their guide
3. **Set Up Database** - Run `server/schema.sql` on production database
4. **Deploy Frontend** - Update `REACT_APP_API_URL` and deploy
5. **Test** - Verify everything works in production

For step-by-step instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

**Valery Sondo**
- GitHub: [@devsondo85](https://github.com/devsondo85)

## 🙏 Acknowledgments

- Built with PERN stack (PostgreSQL, Express, React, Node.js)
- Uses modern React Hooks and functional components
- Responsive design with CSS3

---

**Note**: Remember to update database credentials and API URLs for production deployment!

