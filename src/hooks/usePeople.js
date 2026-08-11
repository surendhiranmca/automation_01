import { useState, useEffect, useCallback } from 'react';
import { generateUUID, getPeople as getLocalPeople, savePeople } from '../utils/storage';
import { validatePerson } from '../utils/validators';
import { API_BASE_URL } from '../config/api';

/**
 * Custom hook for people/person management
 */
export const usePeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch people from backend API with storage fallback
  const fetchPeople = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/people`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPeople(data);
        savePeople(data);
      } else {
        const localPeople = getLocalPeople();
        setPeople(localPeople && localPeople.length > 0 ? localPeople : []);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
      const localPeople = getLocalPeople();
      setPeople(localPeople || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  /**
   * Add new person
   */
  const addPerson = useCallback(async (personData) => {
    const dataToValidate = {
      ...personData,
      course: personData.course || 'Skill Development Course'
    };
    const validation = validatePerson(dataToValidate);
    
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const newPerson = {
      id: generateUUID(),
      name: personData.name.trim(),
      roomId: personData.roomId,
      dob: personData.dob || '2003-08-15',
      course: personData.course ? personData.course.trim() : 'Skill Development Course',
      assignedDate: new Date().toISOString().split('T')[0],
      listPeriod: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson)
      });
      const resData = await res.json();
      if (resData && resData.registrationNumber) {
        newPerson.registrationNumber = resData.registrationNumber;
      }
      await fetchPeople();
      return { success: true, person: newPerson };
    } catch (error) {
      console.error('Error adding person:', error);
      const currentPeople = getLocalPeople();
      const nextNum = currentPeople.length + 1;
      newPerson.registrationNumber = `DBSM2026${String(nextNum).padStart(4, '0')}`;
      const updated = [...currentPeople, newPerson];
      savePeople(updated);
      setPeople(updated);
      return { success: true, person: newPerson };
    }
  }, [fetchPeople]);


  /**
   * Update existing person
   */
  const updatePerson = useCallback(async (personId, personData) => {
    const validation = validatePerson(personData);
    
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      await fetch(`${API_BASE_URL}/api/people/${personId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: personData.name,
          roomId: personData.roomId,
          dob: personData.dob,
          course: personData.course,
          status: personData.status || 'active'
        })
      });
      await fetchPeople();
      return { success: true };
    } catch (error) {
      console.error('Error updating person:', error);
      return { success: false, errors: { form: 'Failed to update database' } };
    }
  }, [fetchPeople]);

  /**
   * Delete single person
   */
  const deletePerson = useCallback(async (personId) => {
    try {
      await fetch(`${API_BASE_URL}/api/people/${personId}`, {
        method: 'DELETE'
      });
      await fetchPeople();
      return { success: true };
    } catch (error) {
      console.error('Error deleting person:', error);
      return { success: false };
    }
  }, [fetchPeople]);

  /**
   * Clear all people
   */
  const clearAllPeople = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/people/all`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error clearing all people:', error);
    }
    savePeople([]);
    setPeople([]);
    return { success: true };
  }, []);

  /**
   * Transfer person to another room
   */
  const transferPerson = useCallback(async (personId, newRoomId) => {
    try {
      await fetch(`${API_BASE_URL}/api/people/${personId}/transfer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: newRoomId })
      });
      await fetchPeople();
      return { success: true };
    } catch (error) {
      console.error('Error transferring person:', error);
      return { success: false };
    }
  }, [fetchPeople]);

  /**
   * Get person by ID
   */
  const getPerson = useCallback((personId) => {
    return people.find(person => person.id === personId);
  }, [people]);

  /**
   * Get people by room ID
   */
  const getPeopleByRoom = useCallback((roomId) => {
    return people.filter(person => person.roomId === roomId);
  }, [people]);

  /**
   * Search people
   */
  const searchPeople = useCallback((query) => {
    if (!query || query.trim() === '') {
      return people;
    }

    const lowerQuery = query.toLowerCase();
    return people.filter(person =>
      person.name.toLowerCase().includes(lowerQuery) ||
      person.registrationNumber.toLowerCase().includes(lowerQuery)
    );
  }, [people]);

  /**
   * Filter people
   */
  const filterPeople = useCallback((filterFn) => {
    return people.filter(filterFn);
  }, [people]);

  /**
   * Get total people count
   */
  const getTotalPeople = useCallback(() => {
    return people.length;
  }, [people]);

  /**
   * Get people by status
   */
  const getPeopleByStatus = useCallback((status) => {
    return people.filter(person => person.status === status);
  }, [people]);

  /**
   * Get active people count
   */
  const getActivePeopleCount = useCallback(() => {
    return people.filter(person => person.status === 'active').length;
  }, [people]);

  /**
   * Get average people per room
   */
  const getAveragePeoplePerRoom = useCallback((totalRooms) => {
    if (!totalRooms || totalRooms === 0) return 0;
    return (people.length / totalRooms).toFixed(1);
  }, [people]);

  /**
   * Get active people
   */
  const getActivePeople = useCallback(() => {
    return people.filter(person => person.status === 'active');
  }, [people]);

  return {
    people,
    loading,
    addPerson,
    updatePerson,
    deletePerson,
    clearAllPeople,
    transferPerson,
    getPerson,
    getPeopleByRoom,
    searchPeople,
    filterPeople,
    getTotalPeople,
    getPeopleByStatus,
    getActivePeople,
    getActivePeopleCount,
    getAveragePeoplePerRoom
  };
};
