import { useState, useEffect, useCallback } from 'react';
import { generateUUID, getRooms as getLocalRooms, saveRooms } from '../utils/storage';
import { validateRoom, isRoomNumberUnique } from '../utils/validators';
import { API_BASE_URL } from '../config/api';

/**
 * Custom hook for room management
 */
export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms from backend API with local storage fallback
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setRooms(data);
        saveRooms(data);
      } else {
        const localRooms = getLocalRooms();
        setRooms(localRooms && localRooms.length > 0 ? localRooms : []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      const localRooms = getLocalRooms();
      setRooms(localRooms || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);


  /**
   * Add new room
   */
  const addRoom = useCallback(async (roomData) => {
    const validation = validateRoom(roomData);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    if (!isRoomNumberUnique(rooms, roomData.roomNumber)) {
      return {
        success: false,
        errors: { roomNumber: 'Room number already exists' }
      };
    }

    const newRoom = {
      id: generateUUID(),
      roomNumber: roomData.roomNumber,
      roomName: roomData.roomName,
      capacity: parseInt(roomData.capacity),
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true
    };

    try {
      await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });
      await fetchRooms();
      return { success: true, room: newRoom };
    } catch (error) {
      console.error('Error adding room:', error);
      return { success: false, errors: { form: 'Failed to save to database' } };
    }
  }, [rooms, fetchRooms]);

  /**
   * Update existing room
   */
  const updateRoom = useCallback(async (roomId, roomData) => {
    const validation = validateRoom(roomData);
    
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    if (!isRoomNumberUnique(rooms, roomData.roomNumber, roomId)) {
      return { success: false, errors: { roomNumber: 'Room number already exists' } };
    }

    try {
      await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: roomData.roomNumber,
          roomName: roomData.roomName,
          capacity: parseInt(roomData.capacity),
          isActive: roomData.isActive !== undefined ? roomData.isActive : true
        })
      });
      await fetchRooms();
      return { success: true };
    } catch (error) {
      console.error('Error updating room:', error);
      return { success: false, errors: { form: 'Failed to update database' } };
    }
  }, [rooms, fetchRooms]);

  /**
   * Delete room
   */
  const deleteRoom = useCallback(async (roomId) => {
    try {
      await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        method: 'DELETE'
      });
      await fetchRooms();
      return { success: true };
    } catch (error) {
      console.error('Error deleting room:', error);
      return { success: false };
    }
  }, [fetchRooms]);

  /**
   * Get room by ID
   */
  const getRoom = useCallback((roomId) => {
    return rooms.find(room => room.id === roomId);
  }, [rooms]);

  /**
   * Search rooms
   */
  const searchRooms = useCallback((query) => {
    if (!query || query.trim() === '') {
      return rooms;
    }

    const lowerQuery = query.toLowerCase();
    return rooms.filter(room =>
      room.roomNumber.toLowerCase().includes(lowerQuery) ||
      room.roomName.toLowerCase().includes(lowerQuery)
    );
  }, [rooms]);

  /**
   * Filter rooms
   */
  const filterRooms = useCallback((filterFn) => {
    return rooms.filter(filterFn);
  }, [rooms]);

  /**
   * Get total rooms
   */
  const getTotalRooms = useCallback(() => {
    return rooms.length;
  }, [rooms]);

  /**
   * Get active rooms
   */
  const getActiveRooms = useCallback(() => {
    return rooms.filter(room => room.isActive);
  }, [rooms]);

  return {
    rooms,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoom,
    searchRooms,
    filterRooms,
    getTotalRooms,
    getActiveRooms
  };
};
