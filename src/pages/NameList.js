import React, { useState, useMemo } from 'react';
import NameListTable from '../components/NameListTable';
import AddPersonModal from '../components/AddPersonModal';
import TransferPersonModal from '../components/TransferPersonModal';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useRooms } from '../hooks/useRooms';
import { usePeople } from '../hooks/usePeople';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import './NameList.css';

const NameList = () => {
  const { rooms } = useRooms();
  const { people, addPerson, updatePerson, deletePerson, clearAllPeople, transferPerson, searchPeople } = usePeople();
  const { success, error } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ roomId: '', status: '' });
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [transferPerson_data, setTransferPerson_data] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { currentUser } = useAuth();

  const handleClearAllPeople = async () => {
    if (window.confirm('⚠️ Are you sure you want to remove ALL students from the list? This action cannot be undone.')) {
      await clearAllPeople();
      success('All student records have been removed successfully!');
      setSelectedPersonId(null);
    }
  };

  // Filter people based on search and filters
  const filteredPeople = useMemo(() => {
    let result = searchPeople(searchQuery);

    if (currentUser && currentUser.role === 'student' && currentUser.roomId) {
      result = result.filter(p => p.roomId === currentUser.roomId);
    } else if (filters.roomId) {
      result = result.filter(p => p.roomId === filters.roomId);
    }

    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }

    return result;
  }, [searchQuery, filters, searchPeople, currentUser]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleOpenPersonModal = (person = null) => {
    setEditingPerson(person || null);
    setFormErrors({});
    setIsPersonModalOpen(true);
  };

  const handleClosePersonModal = () => {
    setIsPersonModalOpen(false);
    setEditingPerson(null);
    setFormErrors({});
  };

  const handleSavePerson = async (formData) => {
    let result;

    if (editingPerson) {
      result = await updatePerson(editingPerson.id, formData);
    } else {
      result = await addPerson(formData);
    }

    if (result.success) {
      success(editingPerson ? 'Person updated successfully!' : 'Person added successfully!');
      handleClosePersonModal();
    } else {
      setFormErrors(result.errors || {});
      error(editingPerson ? 'Failed to update person' : 'Failed to add person');
    }
  };

  const handleOpenTransferModal = (person) => {
    setTransferPerson_data(person);
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
    setTransferPerson_data(null);
  };

  const handleTransferPerson = async (personId, newRoomId) => {
    const result = await transferPerson(personId, newRoomId);
    if (result.success) {
      success('Person transferred successfully!');
      handleCloseTransferModal();
    } else {
      error('Failed to transfer person');
    }
  };

  const handleDeletePerson = async (personId) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      await deletePerson(personId);
      success('Person deleted successfully!');
      setSelectedPersonId(null);
    }
  };

  const filterOptions = [
    {
      id: 'roomId',
      label: 'Room',
      placeholder: 'All Rooms',
      values: rooms.map(room => ({
        id: room.id,
        label: `${room.roomNumber} - ${room.roomName}`
      }))
    },
    {
      id: 'status',
      label: 'Status',
      placeholder: 'All Status',
      values: [
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' },
        { id: 'transferred', label: 'Transferred' }
      ]
    }
  ];

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : 'Unknown';
  };

  const getCurrentRoom = (roomId) => {
    return rooms.find(r => r.id === roomId);
  };

  return (
    <div className="namelist-page">
      <div className="namelist-header">
        <div className="namelist-title-section">
          <h1>Name List Management</h1>
          <p className="namelist-subtitle">Manage and assign people to rooms</p>
        </div>

        {(!currentUser || currentUser.role === 'admin') && (
          <div className="namelist-action-buttons" style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => handleOpenPersonModal()}
              disabled={rooms.length === 0}
            >
              + Add New Person
            </button>
            {people.length > 0 && (
              <button
                className="btn btn-danger btn-lg"
                onClick={handleClearAllPeople}
                style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
              >
                🗑️ Clear All Students
              </button>
            )}
          </div>
        )}
      </div>

      {rooms.length === 0 && (
        <div className="info-message">
          <p>⚠️ Please create rooms first before adding people.</p>
        </div>
      )}

      <div className="namelist-controls">
        <div className="search-container">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name or registration number..."
          />
        </div>
        <p className="results-count">
          Showing {filteredPeople.length} of {people.length} people
        </p>
      </div>

      {(!currentUser || currentUser.role === 'admin') && (
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          options={filterOptions}
        />
      )}

      <div className="namelist-content">
        <NameListTable
          people={filteredPeople}
          rooms={rooms}
          onEdit={handleOpenPersonModal}
          onDelete={handleDeletePerson}
          onTransfer={handleOpenTransferModal}
          selectedId={selectedPersonId}
          isAdmin={!currentUser || currentUser.role === 'admin'}
        />
      </div>

      <AddPersonModal
        isOpen={isPersonModalOpen}
        person={editingPerson}
        rooms={rooms}
        onSave={handleSavePerson}
        onClose={handleClosePersonModal}
        errors={formErrors}
      />

      <TransferPersonModal
        isOpen={isTransferModalOpen}
        person={transferPerson_data}
        rooms={rooms}
        currentRoom={transferPerson_data ? getCurrentRoom(transferPerson_data.roomId) : null}
        onSave={handleTransferPerson}
        onClose={handleCloseTransferModal}
      />
    </div>
  );
};

export default NameList;
