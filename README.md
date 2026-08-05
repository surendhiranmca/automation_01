# Hostel Management & Automation System (Don Bosco Skill Mission)

A modern, full-stack React & Node.js enterprise application engineered to automate hostel administration, room and refectory table allocations, fee payments, leave approvals, visitor entry passes, daily attendance roll call, and security audit logging.

---

## 🎯 Master Features & System Modules

### 👨‍🎓 Don Bosco Skill Mission Bengaluru Allocations (AUG 2026)
- **9 Refectory Tables / Rooms**: Table 1, Table 2, Table 3, Table 4, Table 0 Extra, Table 5, Table 6, Table 7, Table 8.
- **95 Resident Students**: Allocated and mapped with unique User IDs (`DBSM20260001` through `DBSM20260095`).
- **Student Login Access**: Log in using User ID (`DBSM2026xxxx`) to view room info, roommates, fee dues, leave status, and notifications.

### 🛡️ 6 User Roles & Role-Based Access Control (RBAC)
1. **Super Admin**: Master system configuration, user accounts, audit logs, backup & reset.
2. **Hostel Admin**: Student management, room allocations, leave approvals, fee creation, and analytical reports.
3. **Warden**: Daily roll call attendance, leave approvals with custom remarks, maintenance complaints handling.
4. **Accountant**: Fee structure setup, online/offline payment processing, receipt generation, overdue tracking.
5. **Student**: Self-service portal for profile info, room details, leave applications, online fee payment, and receipts.
6. **Security Guard**: Gate visitor check-in, host student verification, and visitor exit timestamping.

### 💼 Core System Modules
- **Automated 15-Day Roster Cycle**: Periodic snapshot archive engine (`listGenerator.js`) calculating period start/end dates and countdowns.
- **Leave Request & Warden Decision Desk**: Student leave applications with emergency contact fields, status tabs (`Pending`, `Approved`, `Rejected`), and Warden Remarks modal.
- **Hostel Fee & Payment Gateway**: Fee broadcast targeting 1 student, an entire room, or all students. Includes simulated payment gateway (UPI, Credit/Debit Card, NetBanking) and printable GST receipts.
- **Overdue Fee & Late Fine Engine**: Automatic overdue date calculation and fine calculation ($\text{Total Payable} = \text{Base Amount} + [\text{Overdue Days} \times \text{Fine Per Day}]$).
- **Visitor Management Desk**: Visitor check-in pass issuance, contact details, host student lookup, and check-out timestamping.
- **Daily Roll Call & Night Attendance**: Date-picker attendance logging per table/room (`Present`, `Absent`, `On Leave`).
- **Notification Center**: Real-time bell alert dropdown with unread badge counter in Header.
- **Security Audit Logs**: Master activity log tracking user logins, fee payments, leave approvals, visitor entries, and system settings changes.

---

## 📋 Comprehensive Documentation Index

All technical, operational, and architectural documentation is available in the repository:

| Document | Description |
| :--- | :--- |
| **[SOFTWARE_REQUIREMENT_SPECIFICATION.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/SOFTWARE_REQUIREMENT_SPECIFICATION.md)** | Master 20-section SRS document detailing 3-tier architecture, 6 user roles, functional & non-functional requirements, data dictionary, security policies, and future scope. |
| **[REFECTORY_ALLOCATION_AUG_2026.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/REFECTORY_ALLOCATION_AUG_2026.md)** | Don Bosco Skill Mission Bengaluru 95 student refectory table allocations & User ID mappings. |
| **[DOCUMENTATION_INDEX.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/DOCUMENTATION_INDEX.md)** | Master documentation directory and navigation portal. |
| **[PROJECT_SUMMARY.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/PROJECT_SUMMARY.md)** | Complete project deliverables inventory, lines of code breakdown, and feature status metrics. |
| **[SYSTEM_ARCHITECTURE.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/SYSTEM_ARCHITECTURE.md)** | 3-tier architecture diagram, component hierarchy, custom React hooks, and design system. |
| **[API_DOCUMENTATION.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/API_DOCUMENTATION.md)** | REST API endpoints specification, payload examples, and MySQL database schemas. |
| **[QUICK_REFERENCE.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/QUICK_REFERENCE.md)** | 5-minute setup, user credentials, and operational shortcuts. |
| **[SETUP_INSTRUCTIONS.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/SETUP_INSTRUCTIONS.md)** | Step-by-step setup guide for Node.js backend, React frontend, and MySQL database. |
| **[TESTING.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/TESTING.md)** | Manual test cases, edge case validation, and verification procedure. |
| **[DELIVERABLES_CHECKLIST.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/DELIVERABLES_CHECKLIST.md)** | Compliance checklist and requirements matrix. |
| **[RENDER_DEPLOYMENT.md](file:///c:/Users/suren/Dropbox/Dacuments/Study%20Metirials/Automation/RENDER_DEPLOYMENT.md)** | Zero-config deployment guide for Render cloud hosting. |

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18, JavaScript ES6+, Vanilla CSS3 with CSS Variables, Context API.
- **Backend**: Node.js + Express.js REST API.
- **Database**: MySQL 8.0 (Primary) + Zero-Config In-Memory Storage (Fallback for Render/Offline).

---

## 🚀 Quick Start Guide

### 1. Run React Frontend
```bash
npm install
npm start
```
App runs at `http://localhost:3000`.

### 2. Run Express REST Backend
```bash
cd backend
npm install
node server.js
```
API server runs at `http://localhost:5000`.

---

## 🔑 Login Credentials

- **Admin Account**: Username: `admin` | Password: `admin` | Role: `Admin / Warden`
- **Student Accounts**: User ID: `DBSM20260001` to `DBSM20260095` | Password: `password` or DOB (`15/08/2003`)
