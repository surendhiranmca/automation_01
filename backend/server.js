require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(express.json());

// --- API HEALTH & STATUS ENDPOINTS ---
app.get(['/api', '/api/', '/api/status', '/api/info'], (req, res) => {
  res.json({
    status: 'online',
    system: 'Don Bosco Skill Mission Hostel Automation API',
    version: '2.0.0',
    mode: useFallbackDb || !db ? 'In-Memory Fallback Storage' : 'MySQL Database',
    endpoints: [
      '/api/auth/login',
      '/api/auth/student-login',
      '/api/rooms',
      '/api/people',
      '/api/leaves',
      '/api/fees',
      '/api/visitors',
      '/api/attendance',
      '/api/audit-logs'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Database connection parameters (Environment variables supported for Render deployment)
const DB_HOST = process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost';
const DB_USER = process.env.MYSQL_USER || process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'hostel_automation';
const DB_PORT = process.env.MYSQL_PORT || process.env.DB_PORT || 3306;

// Fallback database for instant deployment when external MySQL is not configured
let useFallbackDb = false;

const initialRooms = [
  { id: 'room-tbl-1', roomNumber: 'Room 301', roomName: 'Hostel Block A - Room 301', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-2', roomNumber: 'Room 302', roomName: 'Hostel Block A - Room 302', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-3', roomNumber: 'Room 303', roomName: 'Hostel Block A - Room 303', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-4', roomNumber: 'Room 304', roomName: 'Hostel Block A - Room 304', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-0', roomNumber: 'Room 305', roomName: 'Hostel Block B - Room 305 (Extra)', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-5', roomNumber: 'Room 306', roomName: 'Hostel Block B - Room 306', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-6', roomNumber: 'Room 307', roomName: 'Hostel Block B - Room 307', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-7', roomNumber: 'Room 308', roomName: 'Hostel Block C - Room 308', capacity: 12, createdDate: '2026-08-05', isActive: true },
  { id: 'room-tbl-8', roomNumber: 'Room 309', roomName: 'Hostel Block C - Room 309', capacity: 12, createdDate: '2026-08-05', isActive: true }
];


const rawAllocations = [
  // Table 1
  { name: 'Tamilmani b.m', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Iniyan C', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Vimalarul francis s', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Arish Paston C', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Santhosh', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Montfort', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'SUBITH', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Carmellus Lakashiang', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Kingsly a', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Veeramani', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Haarris Augusta', roomId: 'room-tbl-1', roomNum: 'Table 1' },
  { name: 'Benadict', roomId: 'room-tbl-1', roomNum: 'Table 1' },

  // Table 2
  { name: 'Robertstar Kharkongor', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Rohit', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Sameer', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Praveen samuuel a', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Perfectson Marthong', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Sonu Joseph S', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Ajay Kumar', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Hilary Lanka', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Balaji', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Arun', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Ram Charan', roomId: 'room-tbl-2', roomNum: 'Table 2' },
  { name: 'Winston', roomId: 'room-tbl-2', roomNum: 'Table 2' },

  // Table 3
  { name: 'Surendhiran', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Ribok Nongspung', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Joel', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Dijoy Marak', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Michael', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Don bosco p', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'L Ignatius Kadete', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Vishwa S', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Diago Armando Lamin', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Arun Vineeth', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Sam J Prakash Roy', roomId: 'room-tbl-3', roomNum: 'Table 3' },
  { name: 'Ryngkatborlang Sohtun', roomId: 'room-tbl-3', roomNum: 'Table 3' },

  // Table 4
  { name: 'Asrar Ahamed', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Pavankalyan', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Tejas MA', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Rohit s', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Visazoto Savi', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Allwinson Lyngdoh', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Hendry thomas a', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Gothandam', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Edwin amburose s', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Madhavan', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Jeffery', roomId: 'room-tbl-4', roomNum: 'Table 4' },
  { name: 'Hameisha Tyngkan', roomId: 'room-tbl-4', roomNum: 'Table 4' },

  // Table 0 (Extra)
  { name: 'Jeron j', roomId: 'room-tbl-0', roomNum: 'Table 0 (Extra)' },
  { name: 'Felix raja s', roomId: 'room-tbl-0', roomNum: 'Table 0 (Extra)' },
  { name: 'Syed farhan', roomId: 'room-tbl-0', roomNum: 'Table 0 (Extra)' },

  // Table 5
  { name: 'Rakshana', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Darathi', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Stacy Reamei', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Jacinta Susngi', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Viccuna L. Kadete', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Ramyowon Siro', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Serene', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Kasarika Lynthong', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Saini Chyrmang', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Pynsngewbha Shylla', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Risolda Nongrum', roomId: 'room-tbl-5', roomNum: 'Table 5' },
  { name: 'Sathya jothi', roomId: 'room-tbl-5', roomNum: 'Table 5' },

  // Table 6
  { name: 'Swathi', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Ibadawanshwa Shylla', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Skillfully Rynghang', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Kaviyadharshini R', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Jenifer Jones', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Arockia Jenifer', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Afrin Banu', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Alphrinda Nongrum', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Rinmichan Siro', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Ibalahun Wahlang', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Jamila shagana', roomId: 'room-tbl-6', roomNum: 'Table 6' },
  { name: 'Mahadharshini', roomId: 'room-tbl-6', roomNum: 'Table 6' },

  // Table 7
  { name: 'Medarita Lawram', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Keerthana', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Merlin', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Daphishisha Lyngdoh', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Monaliza Dkhar Sawian', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Sincerity Shabong', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Priyanka', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Lapynbiang Khyriem', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Emideimaya Dkhar', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Vanesa Mukhim', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Amalin', roomId: 'room-tbl-7', roomNum: 'Table 7' },
  { name: 'Aihun Ryngkhlem', roomId: 'room-tbl-7', roomNum: 'Table 7' },

  // Table 8
  { name: 'Amala Rakkini', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Peaceful Lyngdoh', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Baiamomlang Lamare', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Banasha', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Judit susngi', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Sabitha Nayaki', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Jancy', roomId: 'room-tbl-8', roomNum: 'Table 8' },
  { name: 'Roslin', roomId: 'room-tbl-8', roomNum: 'Table 8' }
];

const initialPeople = rawAllocations.map((item, idx) => {
  const numStr = String(idx + 1).padStart(4, '0');
  return {
    id: `person-${numStr}`,
    name: item.name,
    registrationNumber: `DBSM2026${numStr}`,
    roomId: item.roomId,
    roomNumber: item.roomNum,
    course: 'Skill Development Course',
    dob: '2003-08-15',
    assignedDate: '2026-08-05',
    listPeriod: '2026-08-05',
    status: 'active'
  };
});

let fallbackDb = {
  users: [{ id: 'admin-001', username: 'admin', password: 'admin', role: 'admin' }],
  rooms: initialRooms,
  people: initialPeople,
  leaves: [],
  fees: [],
  visitors: [],
  attendance: [],
  auditLogs: []
};

let db = null;

// ─────────────────────────────────────────────────────────
//  CLOUD / LOCAL MySQL CONNECTION
//  Set environment variables to connect to Railway or any
//  cloud MySQL. Falls back to in-memory if not configured.
// ─────────────────────────────────────────────────────────
const MYSQL_URL = process.env.MYSQL_URL || process.env.DATABASE_URL || null;
const shouldConnectMysql = !!(MYSQL_URL || process.env.MYSQL_HOST || process.env.DB_HOST);

if (shouldConnectMysql) {
  try {
    let dbConfig;

    if (MYSQL_URL) {
      // Railway / Cloud: use full connection URL (mysql://user:pass@host:port/dbname)
      dbConfig = {
        uri: MYSQL_URL,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 10000,
        multipleStatements: true
      };
      console.log('🌐 Connecting to Cloud MySQL via DATABASE_URL...');
    } else {
      // Local MySQL or manual env vars
      dbConfig = {
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        connectTimeout: 5000,
        multipleStatements: true,
        // Enable SSL for cloud connections
        ...(process.env.MYSQL_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
      };
      console.log(`🔌 Connecting to MySQL at ${DB_HOST}:${DB_PORT}...`);
    }

    db = MYSQL_URL
      ? mysql.createConnection(MYSQL_URL.includes('ssl') ? { ...dbConfig } : { uri: MYSQL_URL, connectTimeout: 10000, multipleStatements: true, ssl: { rejectUnauthorized: false } })
      : mysql.createConnection(dbConfig);

    db.on('error', (dbErr) => {
      console.warn('⚠️  MySQL connection error. Switching to fallback storage:', dbErr.code);
      useFallbackDb = true;
    });

    db.connect((err) => {
      if (err) {
        console.warn('⚠️  MySQL not reachable. Activating in-memory fallback:', err.message);
        useFallbackDb = true;
        return;
      }
      console.log('✅ Connected to MySQL successfully!');

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
          console.error('❌ Error initializing database tables:', initErr.message);
          useFallbackDb = true;
        } else {
          console.log(`✅ Database '${DB_NAME}' and tables ready.`);
          // Auto-seed rooms if empty
          db.query('SELECT COUNT(*) as count FROM rooms', (cntErr, cntRes) => {
            if (!cntErr && cntRes && cntRes[0].count === 0) {
              console.log('🌱 Seeding initial rooms into MySQL...');
              initialRooms.forEach(room => {
                db.query(
                  'INSERT IGNORE INTO rooms (id, roomNumber, roomName, capacity, createdDate, isActive) VALUES (?, ?, ?, ?, ?, ?)',
                  [room.id, room.roomNumber, room.roomName, room.capacity, room.createdDate, room.isActive]
                );
              });
              console.log('🌱 Seeding initial 95 students into MySQL...');
              initialPeople.forEach(person => {
                db.query(
                  'INSERT IGNORE INTO people (id, name, registrationNumber, roomId, dob, course, assignedDate, listPeriod, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [person.id, person.name, person.registrationNumber, person.roomId, person.dob, person.course, person.assignedDate, person.listPeriod, person.status]
                );
              });
            }
          });
        }
      });

    });
  } catch (ex) {
    console.warn('⚠️  MySQL init failed, using in-memory fallback:', ex.message);
    useFallbackDb = true;
  }
} else {
  useFallbackDb = true;
  console.log('ℹ️  No MySQL config found. Running with in-memory storage (all data resets on restart).');
  console.log('   To connect to cloud DB: set MYSQL_URL or MYSQL_HOST environment variables.');
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
  const regClean = (registrationNumber || '').trim().toLowerCase();
  const dobClean = (dob || '').trim();

  if (!regClean || !dobClean) {
    return res.json({ success: false, message: 'Please enter registration number and password/DOB.' });
  }

  const validateStudentDob = (person, inputDob) => {
    if (!person) return false;
    if (inputDob.toLowerCase() === 'password') return true;
    if (!person.dob) return true; // Default allow if DOB missing

    const pDob = person.dob.trim();
    if (pDob === inputDob) return true;

    // Compare normalized digits (e.g. 15082003 vs 20030815)
    const pDigits = pDob.replace(/[^0-9]/g, '');
    const inDigits = inputDob.replace(/[^0-9]/g, '');
    
    if (pDigits === inDigits) return true;

    // Compare DD/MM/YYYY vs YYYY-MM-DD
    if (pDob.includes('-')) {
      const parts = pDob.split('-');
      if (parts.length === 3) {
        const formattedSlash = `${parts[2]}/${parts[1]}/${parts[0]}`;
        const formattedDash = `${parts[2]}-${parts[1]}-${parts[0]}`;
        if (inputDob === formattedSlash || inputDob === formattedDash) return true;
      }
    }
    return false;
  };

  if (useFallbackDb || !db) {
    const person = fallbackDb.people.find(p => (p.registrationNumber || '').toLowerCase() === regClean);
    if (!person) return res.json({ success: false, message: 'Student registration number not found.' });

    if (validateStudentDob(person, dobClean)) {
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
    return res.json({ success: false, message: 'Invalid Date of Birth or Password.' });
  }

  const query = 'SELECT * FROM people WHERE LOWER(registrationNumber) = LOWER(?)';
  db.query(query, [regClean], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results && results.length > 0) {
      const person = results[0];
      if (validateStudentDob(person, dobClean)) {
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
        res.json({ success: false, message: 'Invalid Date of Birth or Password.' });
      }
    } else {
      res.json({ success: false, message: 'Student registration number not found.' });
    }
  });
});

// --- API HEALTH & STATUS INDEX ---
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    system: 'Don Bosco Skill Mission Hostel Automation API',
    version: '2.0.0',
    mode: useFallbackDb || !db ? 'In-Memory Fallback Storage' : 'MySQL Database',
    endpoints: [
      '/api/auth/login',
      '/api/auth/student-login',
      '/api/rooms',
      '/api/people',
      '/api/leaves',
      '/api/fees',
      '/api/visitors',
      '/api/attendance',
      '/api/audit-logs'
    ]
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

// --- LEAVES ENDPOINTS ---
app.get('/api/leaves', (req, res) => {
  if (useFallbackDb || !db) return res.json(fallbackDb.leaves || []);
  db.query('SELECT * FROM leaves ORDER BY createdAt DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/leaves', (req, res) => {
  const leave = req.body;
  if (useFallbackDb || !db) {
    if (!fallbackDb.leaves) fallbackDb.leaves = [];
    fallbackDb.leaves.unshift(leave);
    return res.json({ success: true, leave });
  }
  const query = 'INSERT INTO leaves SET ?';
  db.query(query, leave, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, leave });
  });
});

// --- FEES ENDPOINTS ---
app.get('/api/fees', (req, res) => {
  if (useFallbackDb || !db) return res.json(fallbackDb.fees || []);
  db.query('SELECT * FROM fees ORDER BY createdAt DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/fees', (req, res) => {
  const fee = req.body;
  if (useFallbackDb || !db) {
    if (!fallbackDb.fees) fallbackDb.fees = [];
    fallbackDb.fees.unshift(fee);
    return res.json({ success: true, fee });
  }
  const query = 'INSERT INTO fees SET ?';
  db.query(query, fee, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, fee });
  });
});

// --- VISITORS ENDPOINTS ---
app.get('/api/visitors', (req, res) => {
  if (useFallbackDb || !db) return res.json(fallbackDb.visitors || []);
  db.query('SELECT * FROM visitors ORDER BY checkInTime DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/visitors', (req, res) => {
  const visitor = req.body;
  if (useFallbackDb || !db) {
    if (!fallbackDb.visitors) fallbackDb.visitors = [];
    fallbackDb.visitors.unshift(visitor);
    return res.json({ success: true, visitor });
  }
  db.query('INSERT INTO visitors SET ?', visitor, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, visitor });
  });
});

// --- ATTENDANCE ENDPOINTS ---
app.get('/api/attendance', (req, res) => {
  if (useFallbackDb || !db) return res.json(fallbackDb.attendance || []);
  db.query('SELECT * FROM attendance ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/attendance', (req, res) => {
  const records = req.body;
  if (useFallbackDb || !db) {
    if (!fallbackDb.attendance) fallbackDb.attendance = [];
    fallbackDb.attendance = [...records, ...fallbackDb.attendance];
    return res.json({ success: true });
  }
  res.json({ success: true });
});

// --- AUDIT LOGS ENDPOINTS ---
app.get('/api/audit-logs', (req, res) => {
  if (useFallbackDb || !db) return res.json(fallbackDb.auditLogs || []);
  db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- API HEALTH & STATUS ENDPOINTS ---
app.get(['/api', '/api/'], (req, res) => {
  res.json({
    status: 'online',
    system: 'Don Bosco Skill Mission Hostel Automation API',
    version: '2.0.0',
    mode: useFallbackDb || !db ? 'In-Memory Fallback Storage' : 'MySQL Database',
    endpoints: [
      '/api/auth/login',
      '/api/auth/student-login',
      '/api/rooms',
      '/api/people',
      '/api/leaves',
      '/api/fees',
      '/api/visitors',
      '/api/attendance',
      '/api/audit-logs'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
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
