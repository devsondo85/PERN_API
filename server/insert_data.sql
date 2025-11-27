-- Insert data into inventory_app database
-- Make sure you're connected to the database: \c inventory_app;

-- ========== CATEGORIES ==========
-- Insert categories
INSERT INTO categories (name) VALUES 
('Electronics'),
('Clothing'),
('Books'),
('Home & Garden');

-- ========== PRODUCTS ==========
-- Insert sample products
-- Note: low_stock_threshold will default to 5 if not specified
INSERT INTO products (name, description, price, quantity, category_id) VALUES
('Laptop', 'High-performance laptop', 999.99, 10, 1),
('T-Shirt', 'Cotton t-shirt', 19.99, 25, 2),
('React Guide', 'Learn React programming', 29.99, 5, 3),
('Desk Lamp', 'LED desk lamp', 39.99, 3, 4);


-- ========== INVENTORY LOGS ==========
-- Insert inventory logs (usually created automatically when inventory changes)
-- Format: INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_quantity, new_quantity, notes)
--         VALUES (product_id, 'restock'|'sale'|'adjustment', change_amount, old_qty, new_qty, 'notes');

-- Example inventory logs (replace with your own):
-- Note: Make sure product_id exists in products table
-- INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_quantity, new_quantity, notes)
-- VALUES (1, 'restock', 10, 0, 10, 'Initial stock');

-- INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_quantity, new_quantity, notes)
-- VALUES (1, 'sale', -2, 10, 8, 'Sold 2 units');

-- Add your inventory logs here:
-- INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_quantity, new_quantity, notes)
-- VALUES (1, 'restock', 0, 0, 0, 'Your notes');

