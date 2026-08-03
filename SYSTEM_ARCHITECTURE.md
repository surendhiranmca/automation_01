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

| Custom Hook | Primary Responsibility | Data Source |
| :--- | :--- | :--- |
| `useRooms` | CRUD state management for room records & capacity tracking | API + `localStorage` fallback |
| `usePeople` | Person management, room assignments, and student transfers | API + `localStorage` fallback |
| `useListGeneration` | 15-day period date calculations, countdown, and list archiving | Automated timer & trigger logic |
| `useNotification` | Dispatches toast alerts for success, error, and info updates | Application UI State |

### 2. Page Hierarchy & Component Tree

- **`App.js`**: Top-level router, state orchestrator, global toast notification portal.
  - **`Header.js`**: System health status, current list period display, next update countdown.
  - **`Sidebar.js`**: Navigation bar with collapse toggles for desktop & mobile viewports.
  - **Pages**:
    - **`Dashboard.js`**: Key Performance Indicators (KPIs), room utilization meters, countdown progress bar.
    - **`Rooms.js`**: Room registry table, modal trigger forms (`AddRoomModal.js`), capacity indicators.
    - **`NameList.js`**: Interactive resident list, search/filter bars, room transfer modal (`TransferPersonModal.js`).
    - **`History.js`**: Read-only periodic list snapshots (`HistoryCard.js`) with full detail modal view.
    - **`Settings.js`**: Data backup JSON exporter/importer, database purge actions, app diagnostics.

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
