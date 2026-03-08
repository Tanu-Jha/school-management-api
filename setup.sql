-- ============================================================
-- Run this ONCE in your MySQL client to create the database.
-- The table itself is auto-created when the server starts,
-- but you can also run the CREATE TABLE below manually.
-- ============================================================

CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)  NOT NULL,
    address     VARCHAR(500)  NOT NULL,
    latitude    FLOAT         NOT NULL,
    longitude   FLOAT         NOT NULL,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Optional: seed with sample data for quick testing
INSERT INTO schools (name, address, latitude, longitude) VALUES
('Delhi Public School',        'Sector 19, Patna, Bihar',        25.6120, 85.1580),
('St. Michael''s High School', 'Digha, Patna, Bihar',            25.6220, 85.0920),
('Notre Dame Academy',         'Patna City, Bihar',              25.5940, 85.1870),
('DAV Public School',          'Khagaul, Patna, Bihar',          25.5830, 85.0470),
('Loyola High School',         'Kurji, Patna, Bihar',            25.6350, 85.1350);
