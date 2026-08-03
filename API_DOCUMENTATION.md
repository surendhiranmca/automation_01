# Room Name List Automation System - API Documentation

## 🌐 Overview

The Room Name List Automation System features a RESTful backend API powered by **Node.js** and **Express.js**. It supports dual-layer storage: a primary **MySQL** database for persistence and a smart **in-memory fallback database** for instant cloud deployment (e.g. Render) or offline local operation when MySQL is unavailable.

- **Default Server Port**: `5000` (or `process.env.PORT`)
- **Default Base URL**: `http://localhost:5000/api`
- **Data Format**: JSON (`Content-Type: application/json`)
- **CORS**: Enabled for cross-origin requests

---

## 🗄️ Database Schema

### `users` Table
Stores administrative user accounts.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique user identifier |
| `username` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Unique login username |
| `password` | `VARCHAR(255)` | `NOT NULL` | User password |
| `role` | `VARCHAR(50)` | `NOT NULL` | Access role (e.g., `'admin'`) |

### `rooms` Table
Stores room records and capacity limits.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique room UUID |
| `roomNumber` | `VARCHAR(50)` | `NOT NULL` | Room number (e.g., `'101'`) |
| `roomName` | `VARCHAR(255)` | `NOT NULL` | Room name/building description |
| `capacity` | `INT` | `NOT NULL` | Maximum capacity of the room |
| `createdDate` | `VARCHAR(50)` | `NOT NULL` | Creation date (`YYYY-MM-DD`) |
| `isActive` | `BOOLEAN` | `DEFAULT TRUE` | Active room status flag |

### `people` Table
Stores student/person assignments and details.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | `PRIMARY KEY` | Unique person UUID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full name of person |
| `registrationNumber` | `VARCHAR(100)` | `NOT NULL` | Unique registration number |
| `roomId` | `VARCHAR(255)` | `NOT NULL, FOREIGN KEY` | Assigned room ID |
| `dob` | `VARCHAR(50)` | `NULL` | Date of birth (`YYYY-MM-DD`) |
| `course` | `VARCHAR(100)` | `NOT NULL` | Course or department name |
| `assignedDate` | `VARCHAR(50)` | `NOT NULL` | Date assigned to current room |
| `listPeriod` | `VARCHAR(50)` | `NOT NULL` | Start date of active list period |
| `status` | `VARCHAR(50)` | `DEFAULT 'active'` | Status (`'active'`, `'transferred'`, `'inactive'`) |

---

## 🔐 Authentication API

### 1. Admin Login
Authenticates admin users against database or fallback storage.

- **Endpoint**: `POST /api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "admin-001",
      "username": "admin",
      "role": "admin"
    }
  }
  ```
- **Response (Failure - 200 OK)**:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

### 2. Student Login
Authenticates students using registration number and formatted Date of Birth (`DD/MM/YYYY`).

- **Endpoint**: `POST /api/auth/student-login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "registrationNumber": "REG2026001",
    "dob": "15/08/2002"
  }
  ```
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "p-101",
      "username": "REG2026001",
      "role": "student",
      "roomId": "room-001",
      "name": "John Doe"
    }
  }
  ```
- **Response (Failure - 200 OK)**:
  ```json
  {
    "success": false,
    "message": "Invalid Date of Birth"
  }
  ```

---

## 🏠 Room Management API

### 1. Get All Rooms
Fetches all configured rooms.

- **Endpoint**: `GET /api/rooms`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "room-001",
      "roomNumber": "101",
      "roomName": "Main Block - Floor 1",
      "capacity": 4,
      "createdDate": "2026-08-01",
      "isActive": true
    }
  ]
  ```

### 2. Create Room
Adds a new room record.

- **Endpoint**: `POST /api/rooms`
- **Request Body**:
  ```json
  {
    "id": "room-002",
    "roomNumber": "102",
    "roomName": "Main Block - Floor 1",
    "capacity": 4,
    "createdDate": "2026-08-03",
    "isActive": true
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

### 3. Update Room
Modifies existing room details.

- **Endpoint**: `PUT /api/rooms/:id`
- **Request Body**:
  ```json
  {
    "roomNumber": "102-A",
    "roomName": "Deluxe Wing - Floor 1",
    "capacity": 2,
    "isActive": true
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

### 4. Delete Room
Removes a room by ID.

- **Endpoint**: `DELETE /api/rooms/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

---

## 👥 People Management API

### 1. Get All People
Retrieves all registered students / residents.

- **Endpoint**: `GET /api/people`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "person-001",
      "name": "Alex Johnson",
      "registrationNumber": "REG2026001",
      "roomId": "room-001",
      "dob": "2002-08-15",
      "course": "Computer Science",
      "assignedDate": "2026-08-01",
      "listPeriod": "2026-08-01",
      "status": "active"
    }
  ]
  ```

### 2. Create Person
Registers a new person to a room.

- **Endpoint**: `POST /api/people`
- **Request Body**:
  ```json
  {
    "id": "person-002",
    "name": "Sarah Connor",
    "registrationNumber": "REG2026002",
    "roomId": "room-001",
    "dob": "2003-05-12",
    "course": "Cybernetics",
    "assignedDate": "2026-08-03",
    "listPeriod": "2026-08-01",
    "status": "active"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

### 3. Update Person
Updates person details (name, course, DOB, status).

- **Endpoint**: `PUT /api/people/:id`
- **Request Body**:
  ```json
  {
    "name": "Sarah Connor",
    "registrationNumber": "REG2026002",
    "roomId": "room-001",
    "dob": "2003-05-12",
    "course": "Advanced Robotics",
    "status": "active"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

### 4. Transfer Person
Transfers a person to a new room and updates assignment metadata.

- **Endpoint**: `POST /api/people/transfer`
- **Request Body**:
  ```json
  {
    "id": "person-001",
    "newRoomId": "room-002",
    "assignedDate": "2026-08-03"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

### 5. Delete Person
Removes a person record.

- **Endpoint**: `DELETE /api/people/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

---

## ⚡ Error Handling & Fallback Behavior

- **HTTP 500 Internal Server Error**: Returned if MySQL queries fail without active fallback handler.
- **Smart Fallback Activation**: If MySQL database connection times out or fails (e.g. cloud deployment without database instance), the backend automatically degrades gracefully to in-memory fallback storage without crashing.
