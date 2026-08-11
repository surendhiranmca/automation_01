
/**
 * Sample Data for Room Name List & Hostel Automation System
 * Based on Don Bosco Skill Mission Bengaluru Refectory Arrangement (AUG 2026)
 */

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

// 9 Hostel Rooms (301-309)
export const sampleRooms = [
  { id: 'room-tbl-1', roomNumber: 'Room 301', roomName: 'Hostel Block A - Room 301', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-2', roomNumber: 'Room 302', roomName: 'Hostel Block A - Room 302', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-3', roomNumber: 'Room 303', roomName: 'Hostel Block A - Room 303', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-4', roomNumber: 'Room 304', roomName: 'Hostel Block A - Room 304', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-0', roomNumber: 'Room 305', roomName: 'Hostel Block B - Room 305 (Extra)', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-5', roomNumber: 'Room 306', roomName: 'Hostel Block B - Room 306', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-6', roomNumber: 'Room 307', roomName: 'Hostel Block B - Room 307', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-7', roomNumber: 'Room 308', roomName: 'Hostel Block C - Room 308', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-8', roomNumber: 'Room 309', roomName: 'Hostel Block C - Room 309', capacity: 12, createdDate: todayStr, isActive: true }
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

export const samplePeople = [];

export const sampleFees = [];

export const sampleLeaves = [];

export const sampleComplaints = [];

export const initializeSampleData = () => {
  localStorage.setItem('rnl_rooms', JSON.stringify(sampleRooms));
  localStorage.setItem('rnl_people', JSON.stringify([]));
  localStorage.setItem('rnl_fees', JSON.stringify([]));
  localStorage.setItem('rnl_leaves', JSON.stringify([]));
  localStorage.setItem('rnl_complaints', JSON.stringify([]));
  localStorage.setItem('rnl_demo_loaded', 'true');
  return true;
};

