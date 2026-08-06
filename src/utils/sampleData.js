/**
 * Sample Data for Room Name List & Hostel Automation System
 * Based on Don Bosco Skill Mission Bengaluru Refectory Arrangement (AUG 2026)
 */

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

// 9 Refectory Tables / Rooms
export const sampleRooms = [
  { id: 'room-tbl-1', roomNumber: 'Table 1', roomName: 'Refectory Block - Table 1', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-2', roomNumber: 'Table 2', roomName: 'Refectory Block - Table 2', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-3', roomNumber: 'Table 3', roomName: 'Refectory Block - Table 3', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-4', roomNumber: 'Table 4', roomName: 'Refectory Block - Table 4', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-0', roomNumber: 'Table 0 (Extra)', roomName: 'Refectory Block - Table 0 Extra', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-5', roomNumber: 'Table 5', roomName: 'Refectory Block - Table 5', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-6', roomNumber: 'Table 6', roomName: 'Refectory Block - Table 6', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-7', roomNumber: 'Table 7', roomName: 'Refectory Block - Table 7', capacity: 12, createdDate: todayStr, isActive: true },
  { id: 'room-tbl-8', roomNumber: 'Table 8', roomName: 'Refectory Block - Table 8', capacity: 12, createdDate: todayStr, isActive: true }
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

export const samplePeople = rawAllocations.map((item, idx) => {
  const numStr = String(idx + 1).padStart(4, '0');
  const regNum = `DBSM2026${numStr}`;
  return {
    id: `person-${numStr}`,
    name: item.name,
    registrationNumber: regNum,
    roomId: item.roomId,
    roomNumber: item.roomNum,
    course: 'Skill Development Course',
    dob: '2003-08-15',
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  };
});

export const sampleFees = samplePeople.slice(0, 15).map((person, i) => {
  const isPaid = i % 3 === 0;
  const isOverdue = i % 3 === 2;
  const dueDateStr = isOverdue ? '2026-08-01' : '2026-08-25';
  const finePerDay = 50;
  const overdueDays = isOverdue ? 4 : 0;
  const lateFee = overdueDays * finePerDay;
  const amount = 5000;
  const totalPayable = isPaid ? amount : (amount + lateFee);

  return {
    id: `fee-${i + 1}`,
    personId: person.id,
    personName: person.name,
    registrationNumber: person.registrationNumber,
    roomNumber: person.roomNumber,
    feeType: 'Hostel Fee',
    month: 'August 2026',
    amount: amount,
    paidAmount: isPaid ? amount : 0,
    finePerDay: finePerDay,
    lateFee: isPaid ? 0 : lateFee,
    totalPayable: totalPayable,
    dueDate: dueDateStr,
    description: 'Monthly Hostel & Refectory Maintenance Charges',
    status: isPaid ? 'Paid' : (isOverdue ? 'Overdue' : 'Pending'),
    paymentMode: isPaid ? 'UPI' : null,
    transactionRef: isPaid ? `TXN2026080${i}` : null,
    createdAt: todayStr
  };
});

export const sampleLeaves = [
  {
    id: 'leave-1',
    personId: samplePeople[0].id,
    personName: samplePeople[0].name,
    registrationNumber: samplePeople[0].registrationNumber,
    roomNumber: samplePeople[0].roomNumber,
    leaveDate: '2026-08-10',
    returnDate: '2026-08-14',
    reason: 'Family event and home visit',
    contactNumber: '9876543210',
    parentContact: '9876543211',
    status: 'Pending',
    appliedDate: todayStr,
    remarks: ''
  },
  {
    id: 'leave-2',
    personId: samplePeople[24].id, // Surendhiran
    personName: samplePeople[24].name,
    registrationNumber: samplePeople[24].registrationNumber,
    roomNumber: samplePeople[24].roomNumber,
    leaveDate: '2026-08-15',
    returnDate: '2026-08-18',
    reason: 'Medical checkup',
    contactNumber: '9876543212',
    parentContact: '9876543213',
    status: 'Approved',
    appliedDate: todayStr,
    remarks: 'Approved by Warden'
  }
];

export const sampleComplaints = [
  {
    id: 'comp-1',
    personId: samplePeople[0].id,
    personName: samplePeople[0].name,
    registrationNumber: samplePeople[0].registrationNumber,
    roomNumber: samplePeople[0].roomNumber,
    category: 'Furniture',
    priority: 'Medium',
    description: 'Table chair cushion needs replacement.',
    status: 'Pending',
    createdAt: todayStr
  }
];

export const initializeSampleData = () => {
  localStorage.setItem('rnl_rooms', JSON.stringify(sampleRooms));
  localStorage.setItem('rnl_people', JSON.stringify(samplePeople));
  localStorage.setItem('rnl_fees', JSON.stringify(sampleFees));
  localStorage.setItem('rnl_leaves', JSON.stringify(sampleLeaves));
  localStorage.setItem('rnl_complaints', JSON.stringify(sampleComplaints));
  localStorage.setItem('rnl_demo_loaded', 'true');
  return true;
};

