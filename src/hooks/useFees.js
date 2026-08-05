import { useState, useEffect, useCallback } from 'react';
import { getFees, saveFees, generateUUID, addNotification, getPeople } from '../utils/storage';

export const useFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFees = useCallback(() => {
    const data = getFees();
    setFees(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFees();
  }, [loadFees]);

  const addFee = (feeData, targetScope = 'single', targetId = null) => {
    const currentFees = getFees();
    const newFeeRecords = [];
    const peopleList = getPeople();

    if (targetScope === 'all') {
      // Post fee request to all active students
      peopleList.forEach(p => {
        newFeeRecords.push({
          id: generateUUID(),
          personId: p.id,
          personName: p.name,
          registrationNumber: p.registrationNumber,
          roomNumber: p.roomNumber || 'N/A',
          feeType: feeData.feeType,
          amount: Number(feeData.amount) || 0,
          paidAmount: 0,
          finePerDay: Number(feeData.finePerDay) || 0,
          lateFee: 0,
          totalPayable: Number(feeData.amount) || 0,
          dueDate: feeData.dueDate,
          description: feeData.description || '',
          month: feeData.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          status: 'Pending',
          createdAt: new Date().toISOString().split('T')[0]
        });

        addNotification({
          userId: p.id,
          registrationNumber: p.registrationNumber,
          title: '💳 New Hostel Fee Request',
          message: `A new ${feeData.feeType} of ₹${feeData.amount} has been issued. Due date: ${feeData.dueDate}.`,
          type: 'info'
        });
      });
    } else if (targetScope === 'room' && targetId) {
      // Post fee request to all residents in selected room
      const roomResidents = peopleList.filter(p => p.roomId === targetId);
      roomResidents.forEach(p => {
        newFeeRecords.push({
          id: generateUUID(),
          personId: p.id,
          personName: p.name,
          registrationNumber: p.registrationNumber,
          roomNumber: p.roomNumber || 'N/A',
          feeType: feeData.feeType,
          amount: Number(feeData.amount) || 0,
          paidAmount: 0,
          finePerDay: Number(feeData.finePerDay) || 0,
          lateFee: 0,
          totalPayable: Number(feeData.amount) || 0,
          dueDate: feeData.dueDate,
          description: feeData.description || '',
          month: feeData.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          status: 'Pending',
          createdAt: new Date().toISOString().split('T')[0]
        });

        addNotification({
          userId: p.id,
          registrationNumber: p.registrationNumber,
          title: '💳 New Room Fee Request',
          message: `A new ${feeData.feeType} of ₹${feeData.amount} has been issued for your room. Due date: ${feeData.dueDate}.`,
          type: 'info'
        });
      });
    } else {
      // Single student fee request
      const amountVal = Number(feeData.amount) || 0;
      const isPaid = feeData.status === 'Paid';
      const singleFee = {
        id: generateUUID(),
        status: feeData.status || 'Pending',
        paidAmount: isPaid ? amountVal : (Number(feeData.paidAmount) || 0),
        finePerDay: Number(feeData.finePerDay) || 0,
        lateFee: 0,
        totalPayable: amountVal,
        createdAt: new Date().toISOString().split('T')[0],
        month: feeData.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        ...feeData
      };
      newFeeRecords.push(singleFee);

      if (feeData.personId) {
        addNotification({
          userId: feeData.personId,
          registrationNumber: feeData.registrationNumber,
          title: '💳 New Hostel Fee Request',
          message: `A new ${feeData.feeType || 'Fee'} request of ₹${amountVal} has been issued. Due date: ${feeData.dueDate}.`,
          type: 'info'
        });
      }
    }

    const updated = [...newFeeRecords, ...currentFees];
    saveFees(updated);
    setFees(updated);

    return { success: true, count: newFeeRecords.length };
  };

  const updateFee = (id, updatedData) => {
    const currentFees = getFees();
    const updated = currentFees.map(f => {
      if (f.id === id) {
        const isPaid = updatedData.status === 'Paid';
        const amountVal = Number(updatedData.amount || f.amount) || 0;
        const paidVal = isPaid ? amountVal : (Number(updatedData.paidAmount) || 0);
        return {
          ...f,
          ...updatedData,
          amount: amountVal,
          paidAmount: paidVal,
          totalPayable: isPaid ? paidVal : (amountVal + (Number(f.lateFee) || 0))
        };
      }
      return f;
    });
    saveFees(updated);
    setFees(updated);
    return { success: true };
  };

  const payFee = (id, paymentDetails) => {
    const currentFees = getFees();
    let paidFeeRecord = null;

    const updated = currentFees.map(f => {
      if (f.id === id) {
        const totalPaid = Number(f.totalPayable || f.amount) || Number(f.amount) || 0;
        const receiptNo = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const txnId = paymentDetails.transactionId || `TXN${Date.now()}`;
        
        paidFeeRecord = {
          ...f,
          status: 'Paid',
          paidAmount: totalPaid,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMode: paymentDetails.paymentMode || 'UPI',
          transactionRef: txnId,
          receiptNumber: receiptNo
        };
        return paidFeeRecord;
      }
      return f;
    });

    saveFees(updated);
    setFees(updated);

    if (paidFeeRecord) {
      // Notify student
      addNotification({
        userId: paidFeeRecord.personId || 'student',
        registrationNumber: paidFeeRecord.registrationNumber,
        title: '✅ Fee Payment Successful',
        message: `Your payment of ₹${paidFeeRecord.paidAmount} for ${paidFeeRecord.feeType} was successfully processed. Receipt #${paidFeeRecord.receiptNumber}.`,
        type: 'success'
      });

      // Notify admin
      addNotification({
        userId: 'admin',
        title: '💰 Student Payment Received',
        message: `${paidFeeRecord.personName} (${paidFeeRecord.registrationNumber}) paid ₹${paidFeeRecord.paidAmount} for ${paidFeeRecord.feeType}. Txn ID: ${paidFeeRecord.transactionRef}.`,
        type: 'success'
      });
    }

    return { success: true, fee: paidFeeRecord };
  };

  const deleteFee = (id) => {
    const currentFees = getFees();
    const updated = currentFees.filter(f => f.id !== id);
    saveFees(updated);
    setFees(updated);
    return { success: true };
  };

  const getFeeStats = useCallback(() => {
    const totalCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
    const pendingFees = fees
      .filter(f => f.status === 'Pending')
      .reduce((acc, f) => acc + ((Number(f.totalPayable || f.amount) || 0) - (Number(f.paidAmount) || 0)), 0);
    const overdueFees = fees
      .filter(f => f.status === 'Overdue')
      .reduce((acc, f) => acc + ((Number(f.totalPayable || f.amount) || 0) - (Number(f.paidAmount) || 0)), 0);
    
    return {
      totalCollected,
      pendingFees,
      overdueFees,
      totalRevenue: totalCollected + pendingFees + overdueFees,
      totalEntries: fees.length,
      paidCount: fees.filter(f => f.status === 'Paid').length,
      pendingCount: fees.filter(f => f.status === 'Pending').length,
      overdueCount: fees.filter(f => f.status === 'Overdue').length
    };
  }, [fees]);

  return {
    fees,
    loading,
    addFee,
    updateFee,
    payFee,
    deleteFee,
    getFeeStats,
    reloadFees: loadFees
  };
};
