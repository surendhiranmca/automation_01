import React, { useState } from 'react';
import { clearAllData, exportAllData, importData } from '../utils/storage';
import { useNotification } from '../hooks/useNotification';
import './Settings.css';

const Settings = () => {
  const { success, error } = useNotification();
  const [isImporting, setIsImporting] = useState(false);

  const handleClearAllData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all data? This action cannot be undone and will reset the entire application to its initial state.'
      )
    ) {
      clearAllData();
      success('All data has been cleared. Application reset to initial state.');
    }
  };

  const handleExportData = () => {
    try {
      const data = exportAllData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rnl-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success('Data exported successfully!');
    } catch (err) {
      error('Failed to export data');
      console.error(err);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (importData(data)) {
          success('Data imported successfully! Please refresh the page.');
          // Reload after a short delay
          setTimeout(() => window.location.reload(), 1000);
        } else {
          error('Failed to import data');
        }
      } catch (err) {
        error('Invalid file format');
        console.error(err);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="settings-subtitle">Manage application settings and data</p>
      </div>

      <div className="settings-container">
        {/* Data Management Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Data Management</h2>
          
          <div className="settings-card">
            <div className="card-content">
              <h3>Export Data</h3>
              <p className="card-description">
                Download your data as a JSON file for backup or transfer to another device.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleExportData}>
              📥 Export
            </button>
          </div>

          <div className="settings-card">
            <div className="card-content">
              <h3>Import Data</h3>
              <p className="card-description">
                Restore data from a previously exported JSON file. This will replace all current data.
              </p>
            </div>
            <div className="import-wrapper">
              <input
                type="file"
                id="importFile"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
              <button
                className="btn btn-secondary"
                onClick={() => document.getElementById('importFile').click()}
              >
                📤 Import
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <h2 className="settings-section-title">Danger Zone</h2>
          
          <div className="settings-card danger-card">
            <div className="card-content">
              <h3>Clear All Data</h3>
              <p className="card-description">
                Permanently delete all rooms, people, and history. This action cannot be undone.
              </p>
            </div>
            <button className="btn btn-danger" onClick={handleClearAllData}>
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Application Info Section */}
        <div className="settings-section info-section">
          <h2 className="settings-section-title">Application Information</h2>
          
          <div className="info-grid">
            <div className="info-box">
              <h4>Application Name</h4>
              <p>Room Name List Automation</p>
            </div>

            <div className="info-box">
              <h4>Version</h4>
              <p>1.0.0</p>
            </div>

            <div className="info-box">
              <h4>Update Interval</h4>
              <p>15 days</p>
            </div>

            <div className="info-box">
              <h4>Storage Type</h4>
              <p>Browser localStorage</p>
            </div>

            <div className="info-box">
              <h4>Last Backup</h4>
              <p>Available in Export Data</p>
            </div>

            <div className="info-box">
              <h4>Data Persistence</h4>
              <p>Survives browser refresh</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="settings-section features-section">
          <h2 className="settings-section-title">Features</h2>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Automatic 15-Day Updates</h4>
                <p>Automatically generates new name lists every 15 days without manual intervention</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Room Management</h4>
                <p>Create, edit, and delete rooms with capacity tracking</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Person Management</h4>
                <p>Add, edit, delete, and transfer people between rooms</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>History Tracking</h4>
                <p>View and access all previous name lists and their details</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Search & Filter</h4>
                <p>Quickly find rooms and people with advanced search and filtering</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Responsive Design</h4>
                <p>Works seamlessly on desktop, tablet, and mobile devices</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Data Backup</h4>
                <p>Export and import your data for backup and migration</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Real-time Updates</h4>
                <p>All changes are immediately persisted to browser storage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
