# Hostel Management System - API & Schema Specification

## 🌐 Overview

The Hostel Management System features a RESTful backend API powered by **Node.js** and **Express.js**. It supports dual-layer storage: a primary **MySQL 8.0** database for persistence and a smart **in-memory fallback database** for instant cloud deployment (e.g. Render) or offline local operation when MySQL is unavailable.

- **Default Server Port**: `5000` (or `process.env.PORT`)
- **Default Base URL**: `http://localhost:5000/api`
- **Data Format**: JSON (`Content-Type: application/json`)
- **CORS**: Enabled for cross-origin requests

---

## 🗄️ Master Database Schemas

### `users` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique user identifier |
| `username` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Login username / User ID |
| `password` | `VARCHAR(255)` | `NOT NULL` | Account password |
| `role` | `VARCHAR(50)` | `NOT NULL` | Access role (`superadmin`, `admin`, `warden`, `accountant`, `student`, `security`) |

### `rooms` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique room UUID |
| `roomNumber` | `VARCHAR(50)` | `NOT NULL` | Room/Table number (e.g. `'Table 1'`) |
| `roomName` | `VARCHAR(255)` | `NOT NULL` | Room name/building description |
| `capacity` | `INT` | `NOT NULL` | Maximum capacity limit |
| `createdDate` | `VARCHAR(50)` | `NOT NULL` | Creation date (`YYYY-MM-DD`) |
| `isActive` | `BOOLEAN` | `DEFAULT TRUE` | Active room status flag |

### `people` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique person UUID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full name of resident student |
| `registrationNumber` | `VARCHAR(100)` | `NOT NULL` | Unique registration number (`DBSM2026xxxx`) |
| `roomId` | `VARCHAR(255)` | `NOT NULL, FOREIGN KEY` | Assigned room ID |
| `dob` | `VARCHAR(50)` | `NULL` | Date of birth (`YYYY-MM-DD`) |
| `course` | `VARCHAR(100)` | `NOT NULL` | Course or department name |
| `assignedDate` | `VARCHAR(50)` | `NOT NULL` | Assignment date |
| `listPeriod` | `VARCHAR(50)` | `NOT NULL` | Active list period start date |
| `status` | `VARCHAR(50)` | `DEFAULT 'active'` | Resident status |

### `leaves` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique leave request UUID |
| `personId` | `VARCHAR(255)` | `NOT NULL` | Student UUID |
| `personName` | `VARCHAR(255)` | `NOT NULL` | Student name |
| `registrationNumber` | `VARCHAR(100)` | `NOT NULL` | Student registration number |
| `roomNumber` | `VARCHAR(50)` | `NOT NULL` | Room/Table number |
| `leaveDate` | `VARCHAR(50)` | `NOT NULL` | Leave start date |
| `returnDate` | `VARCHAR(50)` | `NOT NULL` | Expected return date |
| `reason` | `TEXT` | `NOT NULL` | Reason for leave |
| `contactNumber` | `VARCHAR(50)` | `NOT NULL` | Emergency phone number |
| `status` | `VARCHAR(50)` | `DEFAULT 'Pending'` | Approval status (`Pending`, `Approved`, `Rejected`) |
| `remarks` | `TEXT` | `NULL` | Warden decision remarks |

### `fees` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique fee billing UUID |
| `personId` | `VARCHAR(255)` | `NOT NULL` | Student UUID |
| `personName` | `VARCHAR(255)` | `NOT NULL` | Student name |
| `registrationNumber` | `VARCHAR(100)` | `NOT NULL` | Student registration number |
| `roomNumber` | `VARCHAR(50)` | `NOT NULL` | Room number |
| `feeType` | `VARCHAR(100)` | `NOT NULL` | Fee description (e.g. `'Hostel Fee'`) |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` | Base fee amount |
| `finePerDay` | `DECIMAL(10,2)` | `DEFAULT 0` | Optional late fine per day |
| `totalPayable` | `DECIMAL(10,2)` | `NOT NULL` | Total payable including late fine |
| `dueDate` | `VARCHAR(50)` | `NOT NULL` | Payment due date |
| `status` | `VARCHAR(50)` | `DEFAULT 'Pending'` | Payment status (`Pending`, `Paid`, `Overdue`) |

### `visitors` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique visitor entry UUID |
| `visitorName` | `VARCHAR(255)` | `NOT NULL` | Visitor full name |
| `contactNumber` | `VARCHAR(50)` | `NOT NULL` | Visitor phone number |
| `personId` | `VARCHAR(255)` | `NOT NULL` | Host student UUID |
| `personName` | `VARCHAR(255)` | `NOT NULL` | Host student name |
| `registrationNumber` | `VARCHAR(100)` | `NOT NULL` | Host student registration number |
| `roomNumber` | `VARCHAR(50)` | `NOT NULL` | Host room number |
| `purpose` | `TEXT` | `NOT NULL` | Detailed purpose of visit |
| `checkInTime` | `VARCHAR(50)` | `NOT NULL` | Entry timestamp |
| `checkOutTime` | `VARCHAR(50)` | `NULL` | Exit timestamp |
| `status` | `VARCHAR(50)` | `DEFAULT 'In Hostel'` | Visitor status (`In Hostel`, `Checked Out`) |

### `attendance` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique attendance record UUID |
| `date` | `VARCHAR(50)` | `NOT NULL` | Attendance date (`YYYY-MM-DD`) |
| `personId` | `VARCHAR(255)` | `NOT NULL` | Student UUID |
| `personName` | `VARCHAR(255)` | `NOT NULL` | Student name |
| `registrationNumber` | `VARCHAR(100)` | `NOT NULL` | Student registration number |
| `roomNumber` | `VARCHAR(50)` | `NOT NULL` | Room number |
| `status` | `VARCHAR(50)` | `DEFAULT 'Present'` | Roll call status (`Present`, `Absent`, `On Leave`) |

### `audit_logs` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique audit event UUID |
| `timestamp` | `VARCHAR(50)` | `NOT NULL` | Event timestamp |
| `userRole` | `VARCHAR(50)` | `NOT NULL` | User role who performed action |
| `username` | `VARCHAR(100)` | `NOT NULL` | User account name |
| `action` | `VARCHAR(255)` | `NOT NULL` | Action title |
| `details` | `TEXT` | `NOT NULL` | Detailed event log message |

---

## 🌐 REST API Endpoints Summary

- `POST /api/auth/login` — Admin Login
- `POST /api/auth/student-login` — Student Login
- `GET /api/rooms` — Fetch all rooms
- `POST /api/rooms` — Create room
- `GET /api/people` — Fetch all resident students
- `POST /api/people` — Add resident student
- `GET /api/leaves` — Fetch leave applications
- `POST /api/leaves` — Submit leave application
- `GET /api/fees` — Fetch fee billings
- `POST /api/fees` — Broadcast fee request
- `GET /api/visitors` — Fetch visitor gate passes
- `POST /api/visitors` — Issue visitor check-in pass
- `GET /api/attendance` — Fetch daily attendance
- `POST /api/attendance` — Save daily roll call attendance
- `GET /api/audit-logs` — Fetch system security audit logs
