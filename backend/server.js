const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection parameters (Environment variables supported for Render deployment)
const DB_HOST = process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost';
const DB_USER = process.env.MYSQL_USER || process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'hostel_automation';
const DB_PORT = process.env.MYSQL_PORT || process.env.DB_PORT || 3306;

// Fallback database for instant deployment when external MySQL is not configured
let useFallbackDb = false;
let fallbackDb = {
  users: [{ id: 'admin-001', username: 'admin', password: 'admin', role: 'admin' }],
  rooms: [],
  people: []
};

let db = null;

// On cloud hosting (e.g. Render) without explicit MYSQL_HOST, activate fallback storage immediately
// to prevent 30-second TCP connection timeouts during server startup
const shouldConnectMysql = (process.env.MYSQL_HOST || process.env.DB_HOST || process.env.NODE_ENV !== 'production');

if (shouldConnectMysql) {
  try {
    db = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      connectTimeout: 3000, // 3s timeout
      multipleStatements: true
    });

    db.on('error', (dbErr) => {
      console.warn('MySQL socket error caught safely. Switching to fallback storage:', dbErr.message);
      useFallbackDb = true;
    });

    db.connect((err) => {
      if (err) {
        console.warn('MySQL server not reachable. Activating smart storage fallback:', err.message);
        useFallbackDb = true;
        return;
      }
      console.log('Connected to MySQL server');

      const initSql = `
        CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
        USE \`${DB_NAME}\`;

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
          status VARCHAR(50) NOT NULL DEFAULT 'active'
        );

        INSERT IGNORE INTO users (id, username, password, role) VALUES ('admin-001', 'admin', 'admin', 'admin');
      `;

      db.query(initSql, (initErr) => {
        if (initErr) {
          console.error('Error initializing database tables:', initErr.message);
          useFallbackDb = true;
        } else {
          console.log(`Database '${DB_NAME}' and tables ready`);
        }
      });
    });
  } catch (ex) {
    console.warn('MySQL initialization failed, using fallback database:', ex.message);
    useFallbackDb = true;
  }
} else {
  useFallbackDb = true;
  console.log('Render production environment detected: using instant fallback database.');
}

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (useFallbackDb || !db) {
    const user = fallbackDb.users.find(u => u.username === username && u.password === password);
    if (user) {
      return res.json({ success: true, user });
    }
    return res.json({ success: false, message: 'Invalid credentials' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results && results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.post('/api/auth/student-login', (req, res) => {
  const { registrationNumber, dob } = req.body;

  if (useFallbackDb || !db) {
    const person = fallbackDb.people.find(p => p.registrationNumber === registrationNumber);
    if (!person) return res.json({ success: false, message: 'Student not found' });
    if (!person.dob) return res.json({ success: false, message: 'DOB not set for this student' });
    
    const dateParts = person.dob.split('-');
    const formattedDob = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    if (formattedDob === dob) {
      return res.json({
        success: true,
        user: {
          id: person.id,
          username: person.registrationNumber,
          registrationNumber: person.registrationNumber,
          role: 'student',
          roomId: person.roomId,
          name: person.name
        }
      });
    }
    return res.json({ success: false, message: 'Invalid Date of Birth' });
  }

  const query = 'SELECT * FROM people WHERE registrationNumber = ?';
  db.query(query, [registrationNumber], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results && results.length > 0) {
      const person = results[0];
      if (!person.dob) return res.json({ success: false, message: 'DOB not set for this student' });
      
      const dateParts = person.dob.split('-');
      const formattedDob = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      
      if (formattedDob === dob) {
        res.json({ 
          success: true, 
          user: {
            id: person.id,
            username: person.registrationNumber,
            registrationNumber: person.registrationNumber,
            role: 'student',
            roomId: person.roomId,
            name: person.name
          }
        });
      } else {
        res.json({ success: false, message: 'Invalid Date of Birth' });
      }
    } else {
      res.json({ success: false, message: 'Student not found' });
    }
  });
});

// --- ROOMS ---
app.get('/api/rooms', (req, res) => {
  if (useFallbackDb || !db) {
    return res.json(fallbackDb.rooms);
  }
  db.query('SELECT * FROM rooms', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
});

app.post('/api/rooms', (req, res) => {
  const { id, roomNumber, roomName, capacity, createdDate, isActive } = req.body;
  
  if (useFallbackDb || !db) {
    const newRoom = { id, roomNumber, roomName, capacity, createdDate, isActive };
    fallbackDb.rooms.push(newRoom);
    return res.json({ success: true });
  }

  const query = 'INSERT INTO rooms (id, roomNumber, roomName, capacity, createdDate, isActive) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [id, roomNumber, roomName, capacity, createdDate, isActive], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.put('/api/rooms/:id', (req, res) => {
  const { roomNumber, roomName, capacity, isActive } = req.body;
  
  if (useFallbackDb || !db) {
    const index = fallbackDb.rooms.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      fallbackDb.rooms[index] = { ...fallbackDb.rooms[index], roomNumber, roomName, capacity, isActive };
    }
    return res.json({ success: true });
  }

  const query = 'UPDATE rooms SET roomNumber = ?, roomName = ?, capacity = ?, isActive = ? WHERE id = ?';
  db.query(query, [roomNumber, roomName, capacity, isActive, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/rooms/:id', (req, res) => {
  if (useFallbackDb || !db) {
    fallbackDb.rooms = fallbackDb.rooms.filter(r => r.id !== req.params.id);
    return res.json({ success: true });
  }
  db.query('DELETE FROM rooms WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- PEOPLE ---
app.get('/api/people', (req, res) => {
  if (useFallbackDb || !db) {
    return res.json(fallbackDb.people);
  }
  db.query('SELECT * FROM people', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
});

app.post('/api/people', (req, res) => {
  const { id, name, roomId, dob, course, assignedDate, listPeriod, status } = req.body;
  
  if (useFallbackDb || !db) {
    const nextNum = fallbackDb.people.length + 1;
    const newRegNumber = `DBSM2026${String(nextNum).padStart(4, '0')}`;
    const newPerson = { id, name, registrationNumber: newRegNumber, roomId, dob, course, assignedDate, listPeriod, status: status || 'active' };
    fallbackDb.people.push(newPerson);
    return res.json({ success: true, registrationNumber: newRegNumber });
  }

  db.query('SELECT registrationNumber FROM people WHERE registrationNumber LIKE "DBSM2026%" ORDER BY registrationNumber DESC LIMIT 1', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    let newRegNumber = 'DBSM20260001';
    if (rows && rows.length > 0) {
      const lastReg = rows[0].registrationNumber;
      const lastNum = parseInt(lastReg.substring(8), 10);
      if (!isNaN(lastNum)) {
        const nextNum = lastNum + 1;
        newRegNumber = `DBSM2026${String(nextNum).padStart(4, '0')}`;
      }
    }

    const query = 'INSERT INTO people (id, name, registrationNumber, roomId, dob, course, assignedDate, listPeriod, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [id, name, newRegNumber, roomId, dob, course, assignedDate, listPeriod, status], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, registrationNumber: newRegNumber });
    });
  });
});

app.put('/api/people/:id', (req, res) => {
  const { name, roomId, dob, course, status } = req.body;
  if (useFallbackDb || !db) {
    const index = fallbackDb.people.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      fallbackDb.people[index] = { ...fallbackDb.people[index], name, roomId, dob, course, status };
    }
    return res.json({ success: true });
  }

  const query = 'UPDATE people SET name = ?, roomId = ?, dob = ?, course = ?, status = ? WHERE id = ?';
  db.query(query, [name, roomId, dob, course, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/people/:id', (req, res) => {
  if (useFallbackDb || !db) {
    fallbackDb.people = fallbackDb.people.filter(p => p.id !== req.params.id);
    return res.json({ success: true });
  }
  db.query('DELETE FROM people WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.put('/api/people/:id/transfer', (req, res) => {
  const { roomId } = req.body;
  if (useFallbackDb || !db) {
    const index = fallbackDb.people.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      fallbackDb.people[index].roomId = roomId;
      fallbackDb.people[index].status = 'transferred';
    }
    return res.json({ success: true });
  }

  const query = 'UPDATE people SET roomId = ?, status = "transferred" WHERE id = ?';
  db.query(query, [roomId, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- SERVE REACT STATIC BUILD IN PRODUCTION ON RENDER ---
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
  console.log('Serving React production build from:', buildPath);
  app.use(express.static(buildPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} bound to 0.0.0.0`);
});
