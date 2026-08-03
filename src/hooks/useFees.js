import { useState, useEffect, useCallback } from 'react';
import { getFees, saveFees, generateUUID } from '../utils/storage';

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

  const addFee = (feeData) => {
    const newFee = {
      id: generateUUID(),
      status: feeData.status || 'Pending',
      paidAmount: feeData.status === 'Paid' ? (Number(feeData.amount) || 0) : (Number(feeData.paidAmount) || 0),
      createdAt: new Date().toISOString().split('T')[0],
      ...feeData
    };
    const updated = [newFee, ...fees];
    saveFees(updated);
    setFees(updated);
    return { success: true, fee: newFee };
  };

  const updateFee = (id, updatedData) => {
    const updated = fees.map(f => {
      if (f.id === id) {
        return {
          ...f,
          ...updatedData,
          paidAmount: updatedData.status === 'Paid' ? (Number(updatedData.amount || f.amount) || 0) : (Number(updatedData.paidAmount) || 0)
        };
      }
      return f;
    });
    saveFees(updated);
    setFees(updated);
    return { success: true };
  };

  const deleteFee = (id) => {
    const updated = fees.filter(f => f.id !== id);
    saveFees(updated);
    setFees(updated);
    return { success: true };
  };

  const getFeeStats = useCallback(() => {
    const totalCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
    const pendingFees = fees
      .filter(f => f.status === 'Pending')
      .reduce((acc, f) => acc + ((Number(f.amount) || 0) - (Number(f.paidAmount) || 0)), 0);
    const overdueFees = fees
      .filter(f => f.status === 'Overdue')
      .reduce((acc, f) => acc + ((Number(f.amount) || 0) - (Number(f.paidAmount) || 0)), 0);
    
    return {
      totalCollected,
      pendingFees,
      overdueFees,
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
    deleteFee,
    getFeeStats,
    reloadFees: loadFees
  };
};
