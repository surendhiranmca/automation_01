/**
 * Sample Data for Room Name List Automation System
 * This file contains demo data for testing and demonstration
 */

import { generateUUID } from './storage';
import { getTodayDate } from './dateUtils';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

// Sample Rooms
export const sampleRooms = [
  {
    id: generateUUID(),
    roomNumber: '101',
    roomName: 'Building A - Floor 1',
    capacity: 25,
    createdDate: todayStr,
    isActive: true
  },
  {
    id: generateUUID(),
    roomNumber: '102',
    roomName: 'Building A - Floor 2',
    capacity: 30,
    createdDate: todayStr,
    isActive: true
  },
  {
    id: generateUUID(),
    roomNumber: '201',
    roomName: 'Building B - Floor 1',
    capacity: 20,
    createdDate: todayStr,
    isActive: true
  },
  {
    id: generateUUID(),
    roomNumber: '202',
    roomName: 'Building B - Floor 2',
    capacity: 28,
    createdDate: todayStr,
    isActive: true
  }
];

// Sample People (will be assigned to rooms)
export const samplePeople = [
  {
    id: generateUUID(),
    name: 'John Doe',
    registrationNumber: 'REG001',
    roomId: sampleRooms[0].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Jane Smith',
    registrationNumber: 'REG002',
    roomId: sampleRooms[0].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Michael Johnson',
    registrationNumber: 'REG003',
    roomId: sampleRooms[0].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Emily Brown',
    registrationNumber: 'REG004',
    roomId: sampleRooms[1].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'David Wilson',
    registrationNumber: 'REG005',
    roomId: sampleRooms[1].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Sarah Davis',
    registrationNumber: 'REG006',
    roomId: sampleRooms[1].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Robert Miller',
    registrationNumber: 'REG007',
    roomId: sampleRooms[1].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Lisa Anderson',
    registrationNumber: 'REG008',
    roomId: sampleRooms[2].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'James Taylor',
    registrationNumber: 'REG009',
    roomId: sampleRooms[2].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Jennifer Martinez',
    registrationNumber: 'REG010',
    roomId: sampleRooms[2].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Christopher Garcia',
    registrationNumber: 'REG011',
    roomId: sampleRooms[3].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Amanda Rodriguez',
    registrationNumber: 'REG012',
    roomId: sampleRooms[3].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Daniel Lee',
    registrationNumber: 'REG013',
    roomId: sampleRooms[3].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Jessica White',
    registrationNumber: 'REG014',
    roomId: sampleRooms[3].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Matthew Harris',
    registrationNumber: 'REG015',
    roomId: sampleRooms[0].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Ashley Clark',
    registrationNumber: 'REG016',
    roomId: sampleRooms[1].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'transferred'
  },
  {
    id: generateUUID(),
    name: 'Ryan Thomas',
    registrationNumber: 'REG017',
    roomId: sampleRooms[2].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  },
  {
    id: generateUUID(),
    name: 'Nicole Jackson',
    registrationNumber: 'REG018',
    roomId: sampleRooms[0].id,
    assignedDate: todayStr,
    listPeriod: todayStr,
    status: 'active'
  }
];

// Sample Fees
export const sampleFees = [
  {
    id: generateUUID(),
    personId: samplePeople[0].id,
    personName: samplePeople[0].name,
    registrationNumber: samplePeople[0].registrationNumber,
    roomNumber: sampleRooms[0].roomNumber,
    month: 'August 2026',
    amount: 4500,
    paidAmount: 4500,
    dueDate: '2026-08-10',
    paidDate: '2026-08-02',
    status: 'Paid',
    paymentMode: 'Online Transfer',
    transactionRef: 'TXN9928120'
  },
  {
    id: generateUUID(),
    personId: samplePeople[1].id,
    personName: samplePeople[1].name,
    registrationNumber: samplePeople[1].registrationNumber,
    roomNumber: sampleRooms[0].roomNumber,
    month: 'August 2026',
    amount: 4500,
    paidAmount: 0,
    dueDate: '2026-08-10',
    paidDate: null,
    status: 'Pending',
    paymentMode: null,
    transactionRef: null
  },
  {
    id: generateUUID(),
    personId: samplePeople[2].id,
    personName: samplePeople[2].name,
    registrationNumber: samplePeople[2].registrationNumber,
    roomNumber: sampleRooms[1].roomNumber,
    month: 'July 2026',
    amount: 4500,
    paidAmount: 0,
    dueDate: '2026-07-25',
    paidDate: null,
    status: 'Overdue',
    paymentMode: null,
    transactionRef: null
  }
];

// Sample Complaints
export const sampleComplaints = [
  {
    id: generateUUID(),
    personId: samplePeople[0].id,
    personName: samplePeople[0].name,
    registrationNumber: samplePeople[0].registrationNumber,
    roomNumber: sampleRooms[0].roomNumber,
    category: 'Wi-Fi',
    priority: 'High',
    description: 'Wi-Fi connectivity is very weak on the 1st floor.',
    status: 'Pending',
    createdDate: todayStr,
    resolvedDate: null,
    adminRemarks: null
  },
  {
    id: generateUUID(),
    personId: samplePeople[1].id,
    personName: samplePeople[1].name,
    registrationNumber: samplePeople[1].registrationNumber,
    roomNumber: sampleRooms[0].roomNumber,
    category: 'Maintenance',
    priority: 'Medium',
    description: 'Bathroom door lock is loose.',
    status: 'In Progress',
    createdDate: todayStr,
    resolvedDate: null,
    adminRemarks: 'Carpenter assigned'
  },
  {
    id: generateUUID(),
    personId: samplePeople[2].id,
    personName: samplePeople[2].name,
    registrationNumber: samplePeople[2].registrationNumber,
    roomNumber: sampleRooms[1].roomNumber,
    category: 'Electricity',
    priority: 'Low',
    description: 'Study table bulb needs replacement.',
    status: 'Resolved',
    createdDate: todayStr,
    resolvedDate: todayStr,
    adminRemarks: 'Replaced with new 12W LED bulb.'
  }
];

// Sample Leaves
export const sampleLeaves = [
  {
    id: generateUUID(),
    personId: samplePeople[0].id,
    personName: samplePeople[0].name,
    registrationNumber: samplePeople[0].registrationNumber,
    roomNumber: sampleRooms[0].roomNumber,
    leaveDate: '2026-08-10',
    returnDate: '2026-08-14',
    reason: 'Family Function in hometown',
    contactNumber: '9876543210',
    parentContact: '9876543211',
    status: 'Approved',
    appliedDate: todayStr,
    adminRemarks: 'Approved by Warden'
  },
  {
    id: generateUUID(),
    personId: samplePeople[1].id,
    personName: samplePeople[1].name,
    registrationNumber: samplePeople[1].registrationNumber,
    roomNumber: sampleRooms[0].roomNumber,
    leaveDate: '2026-08-12',
    returnDate: '2026-08-15',
    reason: 'Medical checkup',
    contactNumber: '9876543212',
    parentContact: '9876543213',
    status: 'Pending',
    appliedDate: todayStr,
    adminRemarks: null
  }
];

/**
 * Initialize sample data into storage
 */
export const initializeSampleData = () => {
  // Check if data already exists
  const existingRooms = localStorage.getItem('rnl_rooms');

  if (existingRooms && JSON.parse(existingRooms).length > 0) {
    console.log('Sample data already exists, skipping initialization');
    return false;
  }

  try {
    localStorage.setItem('rnl_rooms', JSON.stringify(sampleRooms));
    localStorage.setItem('rnl_people', JSON.stringify(samplePeople));
    localStorage.setItem('rnl_fees', JSON.stringify(sampleFees));
    localStorage.setItem('rnl_complaints', JSON.stringify(sampleComplaints));
    localStorage.setItem('rnl_leaves', JSON.stringify(sampleLeaves));
    
    // Update metadata
    const metadata = {
      lastUpdateDate: todayStr,
      nextUpdateDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalRooms: sampleRooms.length,
      totalPeople: samplePeople.length,
      updateIntervalDays: 15,
      lastCheckDate: todayStr,
      appCreatedDate: todayStr
    };
    
    localStorage.setItem('rnl_metadata', JSON.stringify(metadata));
    
    console.log('Sample data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return false;
  }
};

/**
 * Get summary of sample data
 */
export const getSampleDataSummary = () => {
  return {
    totalRooms: sampleRooms.length,
    totalPeople: samplePeople.length,
    totalFees: sampleFees.length,
    totalComplaints: sampleComplaints.length,
    totalLeaves: sampleLeaves.length,
    roomDetails: sampleRooms.map(room => ({
      roomNumber: room.roomNumber,
      roomName: room.roomName,
      capacity: room.capacity,
      assignedPeople: samplePeople.filter(p => p.roomId === room.id).length
    }))
  };
};
