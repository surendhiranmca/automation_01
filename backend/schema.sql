CREATE DATABASE IF NOT EXISTS hostel_automation;
USE hostel_automation;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(255) PRIMARY KEY,
  roomNumber VARCHAR(50) NOT NULL,
  roomName VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  createdDate VARCHAR(50) NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS people (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100) NOT NULL,
  roomId VARCHAR(255) NOT NULL,
  dob VARCHAR(50),
  course VARCHAR(100) NOT NULL,
  assignedDate VARCHAR(50) NOT NULL,
  listPeriod VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT IGNORE INTO users (id, username, password, role) VALUES ('admin-001', 'admin', 'admin', 'admin');

CREATE TABLE IF NOT EXISTS leaves (
  id VARCHAR(255) PRIMARY KEY,
  personId VARCHAR(255) NOT NULL,
  personName VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100) NOT NULL,
  roomNumber VARCHAR(50) NOT NULL,
  leaveDate VARCHAR(50) NOT NULL,
  returnDate VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  contactNumber VARCHAR(50) NOT NULL,
  parentContact VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  remarks TEXT,
  createdAt VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS fees (
  id VARCHAR(255) PRIMARY KEY,
  personId VARCHAR(255),
  personName VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100) NOT NULL,
  roomNumber VARCHAR(50) NOT NULL,
  feeType VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paidAmount DECIMAL(10,2) NOT DEFAULT 0,
  finePerDay DECIMAL(10,2) DEFAULT 0,
  lateFee DECIMAL(10,2) DEFAULT 0,
  totalPayable DECIMAL(10,2) NOT NULL,
  dueDate VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  createdAt VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY,
  feeId VARCHAR(255) NOT NULL,
  receiptNumber VARCHAR(100) NOT NULL UNIQUE,
  personName VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100) NOT NULL,
  amountPaid DECIMAL(10,2) NOT NULL,
  paymentDate VARCHAR(50) NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  transactionId VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  isRead BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS visitors (
  id VARCHAR(255) PRIMARY KEY,
  visitorName VARCHAR(255) NOT NULL,
  contactNumber VARCHAR(50) NOT NULL,
  personId VARCHAR(255) NOT NULL,
  personName VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100) NOT NULL,
  roomNumber VARCHAR(50) NOT NULL,
  purpose TEXT NOT NULL,
  checkInTime VARCHAR(50) NOT NULL,
  checkOutTime VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'In Hostel'
);

CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(255) PRIMARY KEY,
  date VARCHAR(50) NOT NULL,
  personId VARCHAR(255) NOT NULL,
  personName VARCHAR(255) NOT NULL,
  registrationNumber VARCHAR(100) NOT NULL,
  roomNumber VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Present'
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  timestamp VARCHAR(50) NOT NULL,
  userRole VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT NOT NULL
);
