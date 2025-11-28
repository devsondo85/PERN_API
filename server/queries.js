/**
 * Database Queries Module
 * 
 * This module handles all database operations for the inventory management system.
 * Uses PostgreSQL with the node-postgres (pg) package for database connectivity.
 * 
 * @module queries
 */

// Connect to PostgreSQL using the node-postgres package
const POOL = require('pg').Pool 

// Database configuration with environment variable support for deployment
const pool = new POOL({
    user: process.env.DB_USER || 'me',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'inventory_app',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
})

/**
 * Create all the functions that will be our request handlers in our Express server.
 * Each function handles a specific API endpoint and performs the corresponding database operation.
 */

// ========== CATEGORIES ==========
/**
 * Get all categories from the database
 * @route GET /categories
 * @returns {Array} Array of category objects
 */
const getCategories = (req, res) => {
    pool.query('SELECT * FROM categories ORDER BY name ASC', (error, results) => {
        if (error) {
            console.error('Error fetching categories:', error)
            return res.status(500).json({ message: 'Error fetching categories', error: error.message })
        }
        res.status(200).json(results.rows)
    })
}

const getCategoryById = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('SELECT * FROM categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.error('Error fetching category:', error)
            return res.status(500).json({ message: 'Error fetching category', error: error.message })
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' })
        }
        res.status(200).json(results.rows[0])
    })
}

const createCategory = (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' })
    }
    pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name], (error, results) => {
        if (error) {
            console.error('Error creating category:', error)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'Category name already exists' })
            }
            return res.status(500).json({ message: 'Error creating category', error: error.message })
        }
        res.status(201).json(results.rows[0])
    })
}

const updateCategory = (req, res) => {
    const id = parseInt(req.params.id)
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' })
    }
    pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id], (error, results) => {
        if (error) {
            console.error('Error updating category:', error)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'Category name already exists' })
            }
            return res.status(500).json({ message: 'Error updating category', error: error.message })
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' })
        }
        res.status(200).json(results.rows[0])
    })
}

const deleteCategory = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id], (error, results) => {
        if (error) {
            console.error('Error deleting category:', error)
            return res.status(500).json({ message: 'Error deleting category', error: error.message })
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' })
        }
        res.status(200).json({ message: 'Category deleted successfully', category: results.rows[0] })
    })
}

// ========== PRODUCTS ==========
/**
 * Get all products with their category names
 * @route GET /products
 * @returns {Array} Array of product objects with category_name
 */
const getProducts = (req, res) => {
    pool.query(
        `SELECT p.*, c.name as category_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         ORDER BY p.created_at DESC`,
        (error, results) => {
            if (error) {
                console.error('Error fetching products:', error)
                return res.status(500).json({ message: 'Error fetching products', error: error.message })
            }
            res.status(200).json(results.rows)
        }
    )
}

const getProductById = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query(
        `SELECT p.*, c.name as category_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.id = $1`,
        [id],
        (error, results) => {
            if (error) {
                console.error('Error fetching product:', error)
                return res.status(500).json({ message: 'Error fetching product', error: error.message })
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Product not found' })
            }
            res.status(200).json(results.rows[0])
        }
    )
}

const getLowStockProducts = (req, res) => {
    pool.query(
        `SELECT p.*, c.name as category_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.quantity <= p.low_stock_threshold 
         ORDER BY p.quantity ASC`,
        (error, results) => {
            if (error) {
                console.error('Error fetching low stock products:', error)
                return res.status(500).json({ message: 'Error fetching low stock products', error: error.message })
            }
            res.status(200).json(results.rows)
        }
    )
}

const createProduct = (req, res) => {
    const { name, description, price, quantity, low_stock_threshold, category_id } = req.body
    if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ message: 'Name, price, and quantity are required' })
    }
    const lowStock = low_stock_threshold !== undefined ? low_stock_threshold : 5
    pool.query(
        'INSERT INTO products (name, description, price, quantity, low_stock_threshold, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, description || null, price, quantity, lowStock, category_id || null],
        (error, results) => {
            if (error) {
                console.error('Error creating product:', error)
                return res.status(500).json({ message: 'Error creating product', error: error.message })
            }
            res.status(201).json(results.rows[0])
        }
    )
}

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id)
    const { name, description, price, quantity, low_stock_threshold, category_id } = req.body
    pool.query(
        'UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), quantity = COALESCE($4, quantity), low_stock_threshold = COALESCE($5, low_stock_threshold), category_id = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [name, description, price, quantity, low_stock_threshold, category_id, id],
        (error, results) => {
            if (error) {
                console.error('Error updating product:', error)
                return res.status(500).json({ message: 'Error updating product', error: error.message })
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Product not found' })
            }
            res.status(200).json(results.rows[0])
        }
    )
}

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id], (error, results) => {
        if (error) {
            console.error('Error deleting product:', error)
            return res.status(500).json({ message: 'Error deleting product', error: error.message })
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json({ message: 'Product deleted successfully', product: results.rows[0] })
    })
}

// ========== INVENTORY LOGS ==========
/**
 * Get all inventory logs with product names
 * @route GET /inventory-logs
 * @returns {Array} Array of inventory log objects
 */
const getInventoryLogs = (req, res) => {
    pool.query(
        `SELECT il.*, p.name as product_name 
         FROM inventory_logs il 
         LEFT JOIN products p ON il.product_id = p.id 
         ORDER BY il.created_at DESC`,
        (error, results) => {
            if (error) {
                console.error('Error fetching inventory logs:', error)
                return res.status(500).json({ message: 'Error fetching inventory logs', error: error.message })
            }
            res.status(200).json(results.rows)
        }
    )
}

const getInventoryLogsByProduct = (req, res) => {
    const productId = parseInt(req.params.productId)
    pool.query(
        `SELECT il.*, p.name as product_name 
         FROM inventory_logs il 
         LEFT JOIN products p ON il.product_id = p.id 
         WHERE il.product_id = $1 
         ORDER BY il.created_at DESC`,
        [productId],
        (error, results) => {
            if (error) {
                console.error('Error fetching inventory logs:', error)
                return res.status(500).json({ message: 'Error fetching inventory logs', error: error.message })
            }
            res.status(200).json(results.rows)
        }
    )
}

const createInventoryLog = (req, res) => {
    const { product_id, change_type, quantity_change, notes } = req.body
    if (!product_id || !change_type || quantity_change === undefined) {
        return res.status(400).json({ message: 'product_id, change_type, and quantity_change are required' })
    }
    if (!['restock', 'sale', 'adjustment'].includes(change_type)) {
        return res.status(400).json({ message: 'change_type must be one of: restock, sale, adjustment' })
    }
    
    // First get current quantity
    pool.query('SELECT quantity FROM products WHERE id = $1', [product_id], (error, productResults) => {
        if (error) {
            console.error('Error fetching product:', error)
            return res.status(500).json({ message: 'Error fetching product', error: error.message })
        }
        if (productResults.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' })
        }
        
        const previousQuantity = productResults.rows[0].quantity
        const newQuantity = previousQuantity + quantity_change
        
        if (newQuantity < 0) {
            return res.status(400).json({ message: 'Insufficient quantity. Cannot reduce below 0.' })
        }
        
        // Update product quantity
        pool.query('UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', 
            [newQuantity, product_id], (error) => {
                if (error) {
                    console.error('Error updating product quantity:', error)
                    return res.status(500).json({ message: 'Error updating product quantity', error: error.message })
                }
                
                // Create inventory log
                pool.query(
                    'INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_quantity, new_quantity, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [product_id, change_type, quantity_change, previousQuantity, newQuantity, notes || null],
                    (error, results) => {
                        if (error) {
                            console.error('Error creating inventory log:', error)
                            return res.status(500).json({ message: 'Error creating inventory log', error: error.message })
                        }
                        res.status(201).json(results.rows[0])
                    }
                )
            }
        )
    })
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getProducts,
    getProductById,
    getLowStockProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getInventoryLogs,
    getInventoryLogsByProduct,
    createInventoryLog,
}