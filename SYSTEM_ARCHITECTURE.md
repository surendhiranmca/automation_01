# System Architecture & Technical Specifications

## 🏗️ Architecture Overview

The **Room Name List Automation System** is engineered as a hybrid web application featuring client-side reactive rendering, client-to-server data synchronization, and automated 15-day cycle state management.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT FRONTEND CLIENT                             │
├─────────────┬─────────────┬──────────────────────────┬──────────────────────┤
│  Dashboard  │  Room Mgr   │  Person List / Transfer  │  History & Settings  │
└──────┬──────┴──────┬──────┴────────────┬─────────────┴──────────┬───────────┘
       │             │                   │                        │
       ▼             ▼                   ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CUSTOM HOOKS LAYER                               │
│        (useRooms, usePeople, useListGeneration, useNotification)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
┌──────────────────────────────────────┐┌─────────────────────────────────────┐
│        LOCAL STORAGE ENGINE          ││           EXPRESS REST API          │
│   (Browser-Side Persistent Sync)     ││    (http://localhost:5000/api)      │
└──────────────────────────────────────┘└──────────────────┬──────────────────┘
                                                           │
                                           ┌───────────────┴───────────────┐
                                           ▼                               ▼
                                  ┌─────────────────┐             ┌─────────────────┐
                                  │   MySQL DB      │             │ Fallback Memory │
                                  │  (Production)   │             │   (Zero Config) │
                                  └─────────────────┘             └─────────────────┘
```

---

## 🧩 Component Architecture

### 1. Data Flow & Custom Hooks

| Custom Hook / Provider | Primary Responsibility | Data Source |
| :--- | :--- | :--- |
| `AuthContext` | Multi-role user authentication & session state for 6 User Roles (Super Admin, Hostel Admin, Warden, Accountant, Student, Security Guard) | Session Storage & API |
| `useRooms` | CRUD state management for refectory tables & room records | API + `localStorage` fallback |
| `usePeople` | Resident student management, room assignments, and refectory transfers | API + `localStorage` fallback |
| `useListGeneration` | 15-day period date calculations, countdown, and list archiving | Automated timer & trigger logic |
| `useVisitors` | Visitor check-in pass issuance, contact details, host student lookup, and check-out timestamping | API + `localStorage` fallback |
| `useAttendance` | Daily roll call matrix per room/table (`Present`, `Absent`, `On Leave`) | API + `localStorage` fallback |
| `useAuditLogs` | System security & activity tracking log for authentications, payments, leave decisions | API + `localStorage` fallback |
| `useNotification` | Dispatches toast alerts for success, error, and info updates | Application UI State |

### 2. Page Hierarchy & Component Tree

- **`App.js`**: Top-level router with `AuthProvider` state orchestrator, global toast notification portal.
  - **`Header.js`**: System health status, interactive Notification Center bell dropdown with unread badge counter.
  - **`Sidebar.js`**: Role-aware navigation sidebar with responsive collapse toggles for desktop & mobile viewports.
  - **Pages (15 Full Views)**:
    - **`WelcomeDashboard.js`**: Student Home Portal - personal room metadata, roommates list, pending dues, receipt history.
    - **`Dashboard.js`**: Admin Executive Dashboard - 8 KPI cards, monthly fee chart, leave volume chart, payment distribution.
    - **`Login.js`**: Secure authentication portal supporting User IDs (`DBSM2026xxxx`) and admin logins.
    - **`Rooms.js`**: Refectory Table & Room management desk.
    - **`NameList.js`**: Resident student directory (95 refectory allocations).
    - **`Fees.js`**: Hostel fee management & student payment portal with online gateway simulation and printable GST receipts.
    - **`Leaves.js`**: Outstation leave request approval desk with Warden Remarks modal.
    - **`Attendance.js`**: Daily night roll call attendance matrix per table/room.
    - **`Visitors.js`**: Gate visitor check-in pass desk with exit timestamping.
    - **`Complaints.js`**: Maintenance complaint resolution desk.
    - **`Reports.js`**: Analytical exporter & multi-format data downloader (CSV/JSON/PDF).
    - **`AuditLogs.js`**: System security activity tracking log.
    - **`Users.js`**: User account management desk.
    - **`History.js`**: 15-day periodic snapshot archive viewer.
    - **`Settings.js`**: System configuration, data backup, and data reset.
    - **`Leaves.js`**: Student leave request tracking with Admin approval/rejection modal (`AddLeaveModal.js`).
    - **`Complaints.js`**: Maintenance complaint ticketing desk with priority levels (High, Medium, Low) and resolution status (`AddComplaintModal.js`).
    - **`Reports.js`**: Analytics graphs, room distribution matrix, and data export tools (CSV/JSON/PDF).
    - **`Users.js`**: Admin user permissions, accounts table, and role assignments.
    - **`History.js`**: Read-only 15-day periodic list snapshots (`HistoryCard.js`) with full detail modal view.
    - **`Settings.js`**: JSON backup exporter/importer, database purge actions, app diagnostics.

---

## 🔄 15-Day Automation Algorithm

The core innovation of the system is the **15-Day Automatic Cycle Engine** implemented in `src/utils/listGenerator.js` and `useListGeneration.js`.

### 1. Cycle Logic Flow

```
[ Application Load / Hourly Interval ]
                  │
                  ▼
   Check Current Date vs End Date
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 (Date <= End Date)   (Date > End Date)
        │                   │
   Keep Active        Trigger 15-Day Auto Refresh:
   Period             1. Snapshot active people list
                      2. Create History Record (Period #N)
                      3. Compute New Dates:
                         - StartDate = Current Date
                         - EndDate = Current Date + 15 Days
                         - NextUpdateDate = EndDate + 1 Day
                      4. Save updated metadata & persist snapshot
```

### 2. Date Utility Calculations (`src/utils/dateUtils.js`)
- **Period Start/End Calculation**:
  $$\text{EndDate} = \text{StartDate} + 15 \text{ days}$$
- **Countdown Calculation**:
  $$\text{Days Remaining} = \lceil \frac{\text{NextUpdateTimestamp} - \text{CurrentTimestamp}}{86,400,000 \text{ ms}} \rceil$$

---

## 🎨 Design System & CSS Tokens

The interface follows modern UX standards using a crisp blue-and-white theme with responsive glassmorphism accents. Defined in `src/index.css`:

```css
:root {
  --primary: #2563eb;         /* Main brand blue */
  --primary-hover: #1d4ed8;   /* Interactive primary blue */
  --primary-light: #eff6ff;   /* Soft blue accent background */
  --secondary: #64748b;       /* Neutral slate grey */
  --success: #10b981;         /* Status green */
  --warning: #f59e0b;         /* Caution amber */
  --danger: #ef4444;          /* Alert red */
  --bg-main: #f8fafc;         /* Main app background */
  --card-bg: #ffffff;         /* Card background surface */
  --text-main: #0f172a;       /* Dark high-contrast text */
  --text-muted: #64748b;      /* Muted text labels */
  --border: #e2e8f0;          /* Subdued border stroke */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --radius: 8px;
}
```

---

## 🔒 Security & Deployment Architecture

### Client-Side Isolation
- Inputs are parsed and validated via regex patterns (`src/utils/validators.js`) before DOM insertion to prevent XSS.
- Structured JSON imports validate schema before merging with application storage.

### Deployment Topologies
1. **Full-Stack (Recommended)**: Node.js + Express backend running with MySQL on local server or cloud provider (e.g. AWS EC2, DigitalOcean, Railway).
2. **Instant Cloud Container (Render)**: Express backend running on Render with automated fallback memory storage—zero database setup required for instant demos.
3. **Static Client Deployment**: Deploy React frontend build output (`build/`) directly to Vercel, Netlify, or GitHub Pages using client-side `localStorage` mode.
