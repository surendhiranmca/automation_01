# 🏨 DBSM Hostel Management System — Complete Workflow

**Institution:** Don Bosco Skill Mission | **Version:** v2.0.0 SRS | **Server:** http://localhost:5000

---

## 📐 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                  WEB BROWSER (Client)                │
│         React App — http://localhost:5000            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Sidebar  │  │  Header  │  │   Page Content   │  │
│  │ (Nav)    │  │(Theme/   │  │(Dashboard, Fees, │  │
│  │          │  │ Logout)  │  │ NameList, etc.)  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└───────────────────────────┬─────────────────────────┘
                            │ HTTP API calls
                            ▼
┌─────────────────────────────────────────────────────┐
│           Node.js + Express Backend                  │
│              backend/server.js :5000                │
│  ┌────────────────┐   ┌──────────────────────────┐ │
│  │  Auth Routes   │   │   Data Routes             │ │
│  │ /api/auth/     │   │ /api/rooms /api/people    │ │
│  │ login          │   │ /api/fees  /api/leaves    │ │
│  │ student-login  │   │ /api/attendance /visitors │ │
│  └────────────────┘   └──────────────────────────┘ │
│  ┌─────────────────────────────────────────────┐   │
│  │  Storage Layer                               │   │
│  │  ✅ In-Memory Fallback DB (active now)       │   │
│  │  ⚙️  MySQL DB (when configured)              │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 👥 USER ROLES AND ACCESS

| Role | Credential | Access Level |
|---|---|---|
| **Admin** | `admin / admin` | Full access — all pages including Audit Logs, Settings, Users |
| **Student** | `DBSM20260001 / 15/08/2003` | Limited — Dashboard, own Name List table, own Fees, Leaves, Attendance, Complaints |

---

## 🔄 COMPLETE APPLICATION WORKFLOW

### STEP 1 — APP LAUNCH

```
User opens http://localhost:5000
         │
         ▼
  Loading Spinner
  (initializeStorage + initializeSampleData)
         │
         ▼
  ┌─────────────────────────────────────┐
  │   WELCOME DASHBOARD (Landing Page)  │
  │  Don Bosco Skill Mission Hostel     │
  │  • Animated gradient blobs          │
  │  • Live stats cards                 │
  │  • [Hostel Portal Login] button     │
  └──────────────┬──────────────────────┘
                 │
                 ▼
        Login Selection Page
      ┌───────────────────────┐
      │  [Admin Portal]       │
      │  [Student Portal]     │
      └───────────────────────┘
```

---

### STEP 2 — LOGIN FLOW

**Admin Login:**
```
Username: admin  |  Password: admin
       ↓
POST /api/auth/login
       ├─ ✅ Success → Admin Dashboard (all menus)
       └─ ❌ Fail   → Error message
```

**Student Login:**
```
Registration Number: DBSM20260001
Date of Birth:       15/08/2003
       ↓
POST /api/auth/student-login
       │
       Accepts multiple DOB formats:
       • 15/08/2003 (DD/MM/YYYY)
       • 2003-08-15 (YYYY-MM-DD)
       • 15-08-2003 (DD-MM-YYYY)
       • 15082003   (digits only)
       │
       ├─ ✅ Success → Student Dashboard (limited menus)
       └─ ❌ Fail   → "Invalid registration number or date of birth"
```

---

### STEP 3 — ADMIN WORKFLOW

```
Admin logs in → Admin Dashboard
│
├── 📊 DASHBOARD
│     • 15-Day Automatic Cycle Status bar
│     • Total Students count
│     • Monthly fee collection chart
│     • Monthly leave requests chart
│
├── 🏠 ROOMS / TABLES
│     • View 9 tables (Table 0–8, capacity 12 each)
│     • Add / Edit / Delete tables
│
├── 👥 NAME LIST (Student Management)
│     • Search by name or registration number
│     • Filter by Room/Table and Status
│     • Add / Edit / Transfer / Delete students
│     • Registration numbers: DBSM20260001 onwards
│
├── 💳 HOSTEL FEES
│     • Stats: Revenue | Pending | Paid | Total
│     • Filter tabs: All | Pending | Paid
│     • Issue fee requests per student or whole room
│     • [Pay Now] → opens Payment Gateway
│     • [Receipt] → view/download paid receipts
│     │
│     └── 💳 PAYMENT GATEWAY (see Step 5)
│
├── 📝 LEAVE REQUESTS
│     • View all leave applications
│     • Approve / Reject each request
│
├── 📅 DAILY ROLL CALL (Attendance)
│     • Select room/table
│     • Mark Present / Absent per student
│
├── 🪪 VISITOR LOGS
│     • Log visitor details and purpose
│     • Track entry/exit
│
├── ⚠️ COMPLAINTS
│     • View and manage all complaints
│
├── 📈 REPORTS
│     • Attendance and fee reports
│     • CSV export
│
├── 📜 LIST HISTORY
│     • Past 15-day cycle records
│
├── 🛡️ AUDIT LOGS  [Admin only]
│     • All actions with timestamps and user
│
├── ⚙️ SETTINGS  [Admin only]
│     • App config, data import/export
│
└── 👤 USERS  [Admin only]
      • Manage admin/staff accounts
```

---

### STEP 4 — STUDENT WORKFLOW

```
Student logs in → Student Dashboard
│
├── 📊 DASHBOARD
│     • My Room / Table assignment
│     • My roommates list
│     • My pending fees + total amount due
│     • My next fee due date
│     • My leave status
│
├── 👥 NAME LIST
│     • View ONLY own table members (read-only)
│
├── 💳 HOSTEL FEES
│     • View ONLY own fee records
│     • [Pay Now] → Payment Gateway
│     • [Receipt] → Download paid receipt
│
├── 📝 LEAVE REQUESTS
│     • Apply for leave (dates + reason)
│     • Track approval status
│
├── 📅 DAILY ROLL CALL
│     • View own attendance record
│
├── 🪪 VISITOR LOGS
│     • View visitors logged for them
│
└── ⚠️ COMPLAINTS
      • File new complaint
      • View own complaint status
```

---

### STEP 5 — PAYMENT GATEWAY WORKFLOW

```
Click [💳 Pay Now] on a Pending fee record
              │
              ▼
┌─────────────────────────────────────────┐
│   💳 Real-Time Online Fee Payment       │
│                                         │
│   Fee Summary Box:                      │
│   • Student Name + Reg#                 │
│   • Room / Table                        │
│   • Fee Type + Month                    │
│   • Total Payable: ₹XXXX               │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
📱 UPI/QR    💳 Card      🏦 Net Banking
    │
    ├── [🆔 Verify UPI ID tab]
    │     Enter UPI ID → [Verify] button
    │     600ms verification → ✅ Verified / ❌ Invalid
    │
    └── [📸 Live QR Code tab]
          QR generated via qrserver.com API
          Payee Name: "DBSM hostel fee"
          Amount: pre-filled from fee record
          │
          ⏱️ Countdown Timer: 02:00 → 00:00
          🔄 Auto-refresh cycle: 1 of 5
          │
          After 5 cycles (10 minutes total):
          🛑 "QR Session Expired"
          [🔄 Restart Session] resets all
          │
          Scan with: GPay / PhonePe / Paytm / BHIM / YONO SBI
          │
          ▼
    [🔒 Complete ₹XXXX Payment]
          │
          ▼
    Processing Animation (3 steps):
    Step 1: 🔍 Verifying UPI VPA & Bank...
    Step 2: 📲 Sending Authorization...
    Step 3: ✅ Payment Confirmed!
          │
          ▼
    Fee status → PAID
    Transaction ID: TXN2026XXXXXXXX
    [🧾 Receipt] button appears
```

---

### STEP 6 — 15-DAY AUTO CYCLE

```
App starts
    │
    Check: days since last name list update
    │
    ├── < 15 days  → Badge: ✅ Green "X days remaining"
    ├── ≤ 3 days   → Badge: 🟠 Orange "X days remaining"
    └── ≥ 15 days  → Badge: 🔴 Red "Overdue"
                     Auto-update triggered
                     New list generated
                     Saved to History
                     Timer reset to 15 days
```

---

### STEP 7 — THEME SWITCHER

```
Header → [🎨 Template] dropdown
    │
    ├── 🌙 Dark Sapphire Glass    ← Glassmorphism dark
    ├── ☀️ Clean Executive Light  ← Professional light
    ├── 🦄 Cyberpunk Neon Violet  ← Neon vibrant
    └── 🌲 Emerald Forest Theme   ← Nature green
```

---

## 🗄️ DATA RELATIONSHIPS

```
ROOMS (9 tables)
    └── PEOPLE (students assigned to rooms)
              ├── FEES (fee records per student)
              │     └── PAYMENT RECEIPTS
              ├── ATTENDANCE (daily per room)
              ├── LEAVES (leave requests)
              ├── COMPLAINTS (filed by student)
              └── VISITOR LOGS (visitors for student)
```

---

## 🌐 DEPLOYMENT

| Item | Value |
|---|---|
| App URL (local) | http://localhost:5000 |
| Backend | Node.js + Express, port 5000 |
| Frontend | React 18 (production build in `/build`) |
| Database | In-Memory Fallback (auto, no MySQL needed) |
| GitHub | https://github.com/surendhiranmca/automation_01 |

---

## 🚀 HOW TO RUN

```powershell
# Start backend (serves React build + API)
cd backend
node server.js

# Visit: http://localhost:5000
```

---

## 🔑 TEST CREDENTIALS

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin` |
| Student | `DBSM20260001` | `15/08/2003` |
| Any Student | `DBSM2026XXXX` | `15/08/2003` |

> Students range from DBSM20260001 to DBSM20260113
