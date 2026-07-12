-- Seed data for the in-memory H2 database
INSERT INTO items (name, category, quantity, location, purchase_date, status) VALUES
('Dell UltraSharp Monitor 27"', 'Electronics', 12, 'Floor 2 - Room 204', '2024-01-15', 'IN_STOCK'),
('Logitech Wireless Mouse', 'Electronics', 3, 'Floor 2 - Room 204', '2024-02-10', 'LOW_STOCK'),
('Standing Desk', 'Furniture', 8, 'Floor 1 - Open Space', '2023-11-05', 'IN_STOCK'),
('Ergonomic Office Chair', 'Furniture', 0, 'Storage', '2023-09-20', 'OUT_OF_STOCK'),
('HP LaserJet Printer', 'Electronics', 4, 'Floor 3 - Print Room', '2024-03-12', 'LOW_STOCK'),
('A4 Copy Paper (Box)', 'Supplies', 25, 'Supply Closet', '2024-04-01', 'IN_STOCK'),
('Whiteboard Marker Set', 'Supplies', 2, 'Supply Closet', '2024-05-18', 'LOW_STOCK'),
('Lenovo ThinkPad T14', 'Computers', 6, 'IT Storage', '2023-12-01', 'IN_STOCK'),
('Conference Webcam', 'Electronics', 1, 'Meeting Room B', '2024-06-22', 'UNDER_REPAIR'),
('Stapler', 'Supplies', 15, 'Floor 1 - Reception', '2024-07-30', 'IN_STOCK');
