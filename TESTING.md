# Testing Guide - Room Name List Automation System

Complete testing procedures for all features of the application.

## 🧪 Test Environment Setup

1. **Start the application**
   ```bash
   npm start
   ```

2. **Open browser DevTools**
   - Press F12 or Right-click → Inspect
   - Go to Application → Storage → localStorage

3. **Load sample data** (if needed)
   - Visit: `http://localhost:3000?demo=true`
   - Or refresh page with DevTools open

## ✅ Feature Testing

---

### 4. Authentication & Security Testing

**Test 4.1: Admin Login**
- [ ] Navigate to `/login`
- [ ] Enter `admin` / `admin`
- [ ] Verify successful login redirect to Admin Dashboard
- [ ] Verify full sidebar menu is accessible

**Test 4.2: Student Login**
- [ ] Enter valid Registration Number (`REG2026001`) and formatted DOB (`15/08/2002`)
- [ ] Verify successful login redirect to Student Welcome Portal (`WelcomeDashboard`)
- [ ] Verify student view restricts access to admin-only settings

---

### 5. Fee Management & Receipt Printing Testing

**Test 5.1: Bill Student / Add Fee**
- [ ] Open Fees page → Click "+ Add Fee / Bill Student"
- [ ] Select student, enter fee amount, due date, category
- [ ] Click "Save Fee Record" → Verify entry in fee list

**Test 5.2: Generate Printable GST Receipt**
- [ ] Locate paid fee record → Click **"Receipt"** button
- [ ] Verify official receipt modal renders student registration #, amount, tax breakdown, and date
- [ ] Click "Print" button → Verify browser print preview triggers cleanly

---

### 6. Leave Application & Approval Desk Testing

**Test 6.1: Submit Student Leave Application**
- [ ] Open Leaves page → Click "+ Apply for Leave"
- [ ] Enter leave start date, end date, reason
- [ ] Click "Submit Request" → Verify request status displays as `Pending`

**Test 6.2: Admin Approval / Rejection Workflow**
- [ ] Log in as Admin/Staff → Navigate to Leaves page
- [ ] Locate pending leave request
- [ ] Click Approve (✅) → Verify status updates to `Approved`
- [ ] Test Reject (❌) → Verify status updates to `Rejected`

---

### 7. Maintenance Complaints Desk Testing

**Test 7.1: Lodge Maintenance Ticket**
- [ ] Open Complaints page → Click "+ New Complaint"
- [ ] Select category (Plumbing, Electrical, Furniture), set priority (`High`, `Medium`, `Low`)
- [ ] Enter ticket description → Click "Submit Ticket"

**Test 7.2: Ticket Status Resolution**
- [ ] Filter complaints by status or priority
- [ ] Toggle ticket status from `Pending` to `In-Progress` and `Resolved`
- [ ] Verify status badge color updates (`Pending` yellow, `Resolved` green)

---

### 8. Analytics & Reports Testing

**Test 8.1: Analytics Dashboard**
- [ ] Navigate to Reports page
- [ ] Verify occupancy distribution chart and category breakdown load
- [ ] Verify filter triggers update charts dynamically

**Test 8.2: Data Export Verification**
- [ ] Click "Export CSV" → Verify `.csv` downloads with correct headers and rows
- [ ] Click "Export JSON" → Verify valid JSON structure

---

### 2. Room Management Testing

**Test 2.1: Add Room**
- [ ] Click "+ Add New Room"
- [ ] Fill in: Room Number, Room Name, Capacity
- [ ] Click "Add Room"
- [ ] Verify room appears in table
- [ ] Verify notification shows "Room added successfully"
- [ ] Check localStorage has new room

**Test 2.2: Edit Room**
- [ ] Click edit icon on existing room
- [ ] Modify any field
- [ ] Click "Update Room"
- [ ] Verify changes appear in table
- [ ] Verify notification shows "Room updated successfully"

**Test 2.3: Delete Room**
- [ ] Click delete icon on room
- [ ] Confirm deletion dialog
- [ ] Verify room removed from table
- [ ] Verify room count decreased
- [ ] Verify notification shows "Room deleted successfully"

**Test 2.4: Room Validation**
- [ ] Try adding room without Room Number
- [ ] Verify error message: "Room number is required"
- [ ] Try duplicate Room Number
- [ ] Verify error message: "Room number already exists"
- [ ] Try invalid capacity (0 or negative)
- [ ] Verify error message: "Capacity must be greater than 0"

**Test 2.5: Search Rooms**
- [ ] Type in search bar
- [ ] Verify results filter in real-time
- [ ] Try searching by room number
- [ ] Try searching by room name
- [ ] Clear search to show all rooms

---

### 3. Name List Management Testing

**Test 3.1: Add Person**
- [ ] Click "+ Add New Person"
- [ ] Fill in: Name, Registration #, Room
- [ ] Click "Add Person"
- [ ] Verify person appears in table
- [ ] Verify notification shows "Person added successfully"
- [ ] Verify person assigned to correct room

**Test 3.2: Edit Person**
- [ ] Click edit icon on person
- [ ] Modify name, registration #, or room
- [ ] Click "Update Person"
- [ ] Verify changes in table
- [ ] Verify notification shows "Person updated successfully"

**Test 3.3: Transfer Person**
- [ ] Click transfer icon (🔄) on person
- [ ] Select new room
- [ ] Click "Transfer"
- [ ] Verify person moved to new room
- [ ] Verify status changed to "transferred"
- [ ] Verify notification shows "Person transferred successfully"

**Test 3.4: Delete Person**
- [ ] Click delete icon
- [ ] Confirm deletion
- [ ] Verify person removed from table
- [ ] Verify person count decreased

**Test 3.5: Person Validation**
- [ ] Try adding person without name
- [ ] Verify error: "Name is required"
- [ ] Try duplicate registration number
- [ ] Verify error: "Registration number already exists"
- [ ] Try adding person without room selection
- [ ] Verify error: "Room selection is required"

**Test 3.6: Search & Filter**
- [ ] Search by name
- [ ] Search by registration number
- [ ] Filter by specific room
- [ ] Filter by status (active/transferred/inactive)
- [ ] Combine search and filters
- [ ] Clear filters to show all

---

### 4. History Testing

**Test 4.1: History Page Loads**
- [ ] Navigate to History page
- [ ] Verify history cards display (if any)
- [ ] Verify current period shows as newest

**Test 4.2: Expand History**
- [ ] Click on history card arrow to expand
- [ ] Verify room distribution shows
- [ ] Verify people list preview shows
- [ ] Verify count matches

**Test 4.3: View Details**
- [ ] Click "View Full Details" on expanded card
- [ ] Verify modal opens with complete information
- [ ] Verify all people from that period listed
- [ ] Verify grouped by room
- [ ] Verify all details correct

**Test 4.4: Period Information**
- [ ] Verify start date and end date
- [ ] Verify generated date matches when created
- [ ] Verify total people count
- [ ] Verify total rooms count

---

### 5. Settings & Data Management Testing

**Test 5.1: Export Data**
- [ ] Click "📥 Export" button
- [ ] Verify JSON file downloads
- [ ] Open file in text editor
- [ ] Verify all data is present (rooms, people, periods)
- [ ] Verify JSON format is valid

**Test 5.2: Import Data**
- [ ] Click "📤 Import" button
- [ ] Select exported JSON file
- [ ] Verify data imports successfully
- [ ] Verify page reloads
- [ ] Check data matches exported

**Test 5.3: Clear All Data**
- [ ] Click "🗑️ Clear All" button
- [ ] Confirm in dialog
- [ ] Verify all data cleared
- [ ] Verify rooms and people tables empty
- [ ] Verify notification shows

**Test 5.4: Settings Information**
- [ ] View all info boxes
- [ ] Verify correct application name
- [ ] Verify correct version number
- [ ] Verify update interval is 15 days
- [ ] Verify storage type is localStorage

**Test 5.5: Features List**
- [ ] View all features listed
- [ ] Verify all features have checkmark
- [ ] Verify descriptions are accurate

---

### 6. 15-Day Automation Testing

**Test 6.1: Update Detection**
- [ ] Check localStorage nextUpdateDate
- [ ] Verify matches today + 15 days
- [ ] No update should trigger today

**Test 6.2: Manual Update (Testing Only)**
- [ ] Access browser console
- [ ] Run: `localStorage.setItem('rnl_current_period', JSON.stringify({...currentPeriod, nextUpdateDate: today}))`
- [ ] Refresh page
- [ ] Verify update trigger message
- [ ] Check that old period moved to history

**Test 6.3: Auto-Update Calculation**
- [ ] Create multiple people
- [ ] Record the nextUpdateDate
- [ ] Verify calculation: current date + 15 days
- [ ] Verify format is correct (YYYY-MM-DD)

---

### 7. Responsive Design Testing

**Test 7.1: Desktop View (>1024px)**
- [ ] Full sidebar visible
- [ ] All content readable
- [ ] All buttons accessible
- [ ] Tables display properly

**Test 7.2: Tablet View (768px - 1024px)**
- [ ] Sidebar collapses to icons
- [ ] Content adjusts properly
- [ ] Touch interactions work
- [ ] Modals resize appropriately

**Test 7.3: Mobile View (<768px)**
- [ ] Sidebar converts to bottom nav
- [ ] Content full width
- [ ] Buttons are touch-friendly
- [ ] Tables scrollable horizontally
- [ ] All text readable
- [ ] Forms stack vertically

---

### 8. Data Persistence Testing

**Test 8.1: localStorage Persistence**
- [ ] Add room
- [ ] Refresh page (F5)
- [ ] Verify room still present
- [ ] Add person
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Verify person still present

**Test 8.2: Complex Data Persistence**
- [ ] Create multiple rooms (3+)
- [ ] Assign people to each room
- [ ] Transfer some people
- [ ] Delete some data
- [ ] Refresh page multiple times
- [ ] Verify all changes persisted

**Test 8.3: Edge Cases**
- [ ] Close browser tab
- [ ] Reopen app in new tab
- [ ] Verify all data present
- [ ] Clear browser cache
- [ ] Verify localStorage data still present

---

### 9. Notifications Testing

**Test 9.1: Success Notifications**
- [ ] Add room → "Room added successfully!" appears
- [ ] Update room → "Room updated successfully!" appears
- [ ] Add person → "Person added successfully!" appears
- [ ] Verify green background and checkmark

**Test 9.2: Error Notifications**
- [ ] Try invalid form → Error message appears
- [ ] Try duplicate entry → Error notification shown
- [ ] Verify red background and X icon

**Test 9.3: Notification Auto-dismiss**
- [ ] Create notification
- [ ] Wait ~4 seconds
- [ ] Verify it disappears automatically
- [ ] Click X to close manually
- [ ] Verify instant removal

---

### 10. UI/UX Testing

**Test 10.1: Navigation**
- [ ] Click each sidebar item
- [ ] Verify page changes
- [ ] Verify header title updates
- [ ] Verify active page highlighted

**Test 10.2: Forms**
- [ ] Verify all form fields have labels
- [ ] Verify input validation works
- [ ] Verify error messages are clear
- [ ] Verify buttons are accessible

**Test 10.3: Accessibility**
- [ ] All buttons have hover states
- [ ] All inputs have focus states
- [ ] All text has sufficient contrast
- [ ] Verify keyboard navigation works

---

### 11. Performance Testing

**Test 11.1: Large Dataset**
- [ ] Add 50+ people
- [ ] Add 10+ rooms
- [ ] Verify app still responsive
- [ ] Search with large dataset
- [ ] Filter with large dataset
- [ ] Verify no lag

**Test 11.2: Memory Usage**
- [ ] Open DevTools Performance tab
- [ ] Perform actions (add, delete, transfer)
- [ ] Check memory doesn't grow unexpectedly
- [ ] Refresh page
- [ ] Verify memory releases

---

## 🧪 Test Scenarios

### Scenario 1: New User Setup
1. [ ] Load app for first time
2. [ ] Verify sample data loads
3. [ ] Navigate all pages
4. [ ] Verify everything displays correctly

### Scenario 2: Complete Workflow
1. [ ] Add 3 rooms
2. [ ] Add 10 people across rooms
3. [ ] Transfer 2 people
4. [ ] Search and filter
5. [ ] Export data
6. [ ] Clear data
7. [ ] Import data back
8. [ ] Verify everything restored

### Scenario 3: 15-Day Cycle (Simulated)
1. [ ] Create rooms and people
2. [ ] Note nextUpdateDate
3. [ ] Simulate date passing to nextUpdateDate
4. [ ] Verify automatic update triggers
5. [ ] Check period moved to history
6. [ ] Verify new period created
7. [ ] Verify people kept in their rooms

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Environment: Desktop / Tablet / Mobile

Test Results:
- Dashboard: ✅ / ❌
- Room Management: ✅ / ❌
- Name List: ✅ / ❌
- History: ✅ / ❌
- Settings: ✅ / ❌
- Automation: ✅ / ❌
- Responsive: ✅ / ❌

Issues Found:
1. _________________________
2. _________________________

Notes:
_____________________________
```

---

## 🐛 Known Issues / Limitations

- localStorage limited to ~5MB per browser
- No automatic backup (manual export required)
- No user authentication
- Single browser per user

---

## ✨ Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | Latest  | ✅ Tested |
| Firefox | Latest  | ✅ Tested |
| Safari  | Latest  | ✅ Tested |
| Edge    | Latest  | ✅ Tested |

---

Automated testing completed on: _______________
