-- Seed data for the in-memory H2 database
INSERT INTO items (name, category, quantity, location, status) VALUES
('Dell UltraSharp Monitor 27"', 'Electronics', 12, 'Floor 2 - Room 204', 'IN_STOCK'),
('Logitech Wireless Mouse', 'Electronics', 3, 'Floor 2 - Room 204', 'LOW_STOCK'),
('Standing Desk', 'Furniture', 8, 'Floor 1 - Open Space', 'IN_STOCK'),
('Ergonomic Office Chair', 'Furniture', 0, 'Storage', 'OUT_OF_STOCK'),
('HP LaserJet Printer', 'Electronics', 4, 'Floor 3 - Print Room', 'LOW_STOCK'),
('A4 Copy Paper (Box)', 'Supplies', 25, 'Supply Closet', 'IN_STOCK'),
('Whiteboard Marker Set', 'Supplies', 2, 'Supply Closet', 'LOW_STOCK'),
('Lenovo ThinkPad T14', 'Computers', 6, 'IT Storage', 'IN_STOCK'),
('Conference Webcam', 'Electronics', 1, 'Meeting Room B', 'UNDER_REPAIR'),
('Stapler', 'Supplies', 15, 'Floor 1 - Reception', 'IN_STOCK');