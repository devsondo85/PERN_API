const express = require('express')
const cors = require('cors')
const app = express()
const port = 9001
const db = require('./queries')
const path = require('path')

// Middleware 
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request bodies

//CRUD - API Routes (must come BEFORE static files)

// ========== CATEGORIES ==========
//READ - get all categories
app.get('/categories', db.getCategories)
//READ - get category by ID
app.get('/categories/:id', db.getCategoryById)
//CREATE - add new category
app.post('/categories', db.createCategory)
//UPDATE - update category
app.put('/categories/:id', db.updateCategory)
//DELETE - delete category
app.delete('/categories/:id', db.deleteCategory)

// ========== PRODUCTS ==========
//READ - get all products
app.get('/products', db.getProducts)
//READ - get product by ID
app.get('/products/:id', db.getProductById)
//READ - get low stock products
app.get('/products/low-stock', db.getLowStockProducts)
//CREATE - add new product
app.post('/products', db.createProduct)
//UPDATE - update product
app.put('/products/:id', db.updateProduct)
//DELETE - delete product
app.delete('/products/:id', db.deleteProduct)

// ========== INVENTORY LOGS ==========
//READ - get all inventory logs
app.get('/inventory-logs', db.getInventoryLogs)
//READ - get inventory logs by product ID
app.get('/inventory-logs/product/:productId', db.getInventoryLogsByProduct)
//CREATE - create inventory log (also updates product quantity)
app.post('/inventory-logs', db.createInventoryLog)

//host react app as static files (must come AFTER API routes)
app.use(express.static(path.resolve(__dirname, '../client/build')))

//Routes
app.get('/', (req, res) => {
    // we'll do some stuff here
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})
    
//starting express on our PORT
app.listen(port, () => {
    console.log(`the app is running on port ${port}.`)
})

