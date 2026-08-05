# Software Requirement Specification (SRS) & System Architecture
## Hostel Management & Automation System (Don Bosco Skill Mission)

**Document Version:** 2.0.0  
**Project Name:** Hostel Management & Automation System  
**Organization:** Don Bosco Skill Mission Bengaluru  
**Date:** August 5, 2026  
**Status:** Production-Ready SRS & Technical Specification  

---

## 📋 1. Project Overview & System Purpose

The **Hostel Management System** is a full-stack web-based enterprise application engineered to automate, digitize, and simplify hostel administration for Don Bosco Skill Mission Bengaluru. It replaces manual record-keeping with a centralized digital platform where administrators can efficiently manage resident students, room and refectory table allocations, fee collections, leave requests, maintenance complaints, daily attendance, visitor logs, and audit reports.

Students can log in via their unique User ID (`DBSM2026xxxx`) to access their personalized profile, view room/table allocations, apply for outstation leave, pay hostel fees online via a simulated gateway, track maintenance tickets, view attendance, and receive real-time system notifications.

---

## 🎯 2. Prompt 1 – Requirement Analysis (Software Requirement Specification)

### 2.1 Functional Requirements

The system provides the following functional capabilities:
1. **User Authentication & RBAC**: Secure multi-role authentication supporting Super Admin, Hostel Admin, Warden, Accountant, Student, and Security Guard.
2. **Student & Refectory Allocation Management**: Registration of students and automated/manual allocation to refectory tables (Table 1 through Table 8, Table 0 Extra) and hostel rooms.
3. **Automated 15-Day Roster Cycle**: 15-day automatic period snapshot engine (`listGenerator.js`) calculating period start/end dates, countdowns, and archiving history.
4. **Hostel Fee & Payment System**: Fee generation targeting 1 student, an entire room, or all students with optional fine per day (`finePerDay`). Online payment gateway simulation with printable official GST receipts.
5. **Overdue Fee & Late Fine Engine**: Automated status calculation (`Overdue`), overdue days calculation, and late fee calculation ($\text{Total Payable} = \text{Base Amount} + [\text{Overdue Days} \times \text{Fine Per Day}]$).
6. **Leave Application & Warden Approval Workflow**: Outstation leave requests with emergency contact fields, tabbed status filters (`Pending`, `Approved`, `Rejected`), warden decision modal with custom remarks, and automated student notification.
7. **Maintenance Complaints Desk**: Ticket lodging with category filtering and priority levels (`High`, `Medium`, `Low`).
8. **Visitor Management**: Visitor registration, check-in/check-out timestamps, host student lookup, and security guard pass verification.
9. **Daily Roll Call / Attendance Management**: Daily night attendance tracking per room/table (`Present`, `Absent`, `On Leave`).
10. **Notification Center**: Interactive bell icon in Header displaying real-time alerts with unread badge counter.
11. **System Audit Logs**: Security log viewer tracking user logins, payments, leave approvals, visitor entries, and settings changes.
12. **Analytics & Reports**: Multi-format data exports (CSV, JSON, PDF) and visual dashboard charts.

### 2.2 Non-Functional Requirements

- **Performance**: Page load times under 1 second; instant search and filter debouncing.
- **Reliability & Availability**: Dual-layer storage ensuring 100% uptime through fallback in-memory database if primary MySQL database is disconnected.
- **Security**: Password validation, role-based route protection, XSS input sanitization, and structured JSON schema validation.
- **Usability & Responsiveness**: Modern glassmorphism UI design with 3 responsive breakpoints (Desktop, Tablet, Mobile).
- **Scalability**: Normalized database schema supporting thousands of student records and transaction histories.

### 2.3 User Roles & Permissions Matrix

| User Role | Primary Responsibilities | Access Level |
| :--- | :--- | :--- |
| **Super Admin** | Complete system configuration, user accounts, audit logs, data backup/reset | Full System Control |
| **Hostel Admin** | Student allocations, room management, leave approvals, fee distribution, reports | Administrative Control |
| **Warden** | Student supervision, attendance roll call, leave approvals with remarks, complaints | Operational Control |
| **Accountant** | Fee structures, billing, payment verification, financial reports, overdue tracking | Financial Control |
| **Student** | Personal profile, room info, leave applications, online fee payment, receipts, complaints | Self-Service Portal |
| **Security Guard** | Visitor check-in/check-out, visitor pass verification, gate entry logs | Gate Security Control |

### 2.4 System & Database Modules

- **Authentication Module**: `AuthContext.js`, `Login.js`, REST `/api/auth/login`, `/api/auth/student-login`.
- **Dashboard Module**: Admin Executive Dashboard (`Dashboard.js`), Student Portal (`WelcomeDashboard.js`).
- **Student Management Module**: Resident registry (`NameList.js`, `usePeople.js`).
- **Room & Table Management Module**: Room registry & refectory table allocations (`Rooms.js`, `useRooms.js`).
- **15-Day Automation Engine**: Snapshot archive engine (`listGenerator.js`, `useListGeneration.js`).
- **Leave Management Module**: Outstation leave requests & Warden approval desk (`Leaves.js`, `AddLeaveModal.js`).
- **Fee Management Module**: Billing & payment status desk (`Fees.js`, `AddFeeModal.js`).
- **Online Payment & Receipt Module**: Gateway simulation (`PaymentModal.js`), Printable receipt (`ReceiptModal.js`).
- **Visitor Management Module**: Gate check-in pass desk (`Visitors.js`, `AddVisitorModal.js`).
- **Attendance Module**: Daily roll call matrix (`Attendance.js`, `useAttendance.js`).
- **Notification Center**: Real-time bell alert dropdown (`NotificationCenter.js`, `useNotifications.js`).
- **Audit Logs Module**: System security activity tracking (`AuditLogs.js`, `useAuditLogs.js`).
- **Reports & Settings Module**: Analytical exporter & JSON backup (`Reports.js`, `Settings.js`).

---

## 🏗️ 3. Prompt 2 – Project Architecture

The Hostel Management System follows a classic **3-Tier Architecture**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER (REACT 18)                         │
│  Dashboards │ Rooms │ NameList │ Fees │ Leaves │ Complaints │ Visitors │ Log  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER (NODE.JS + EXPRESS)                 │
│  Auth Service │ 15-Day Generator │ Overdue Engine │ Payment │ Notifications   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ SQL / Memory CRUD
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
┌──────────────────────────────────────┐┌─────────────────────────────────────┐
│        PRIMARY DATABASE (MYSQL 8.0)  ││       FALLBACK IN-MEMORY STORAGE    │
│  Users, Rooms, People, Fees, Leaves  ││     (Zero-Config Offline Support)   │
└──────────────────────────────────────┘└─────────────────────────────────────┘
```

- **Presentation Layer**: Built with React 18, JavaScript ES6+, Vanilla CSS with CSS Variables, and Lucide/SVG icons.
- **Business Logic Layer**: Node.js + Express.js REST API with modular route handlers, input validators, and automated cron checking.
- **Data Layer**: Dual persistence supporting MySQL 8.0 for production deployments and browser `localStorage` / Express in-memory storage for offline development and instant container hosting (Render).

---

## 🔐 4. Security & Audit Specification

- **Authentication & JWT/Session Control**: Passwords checked against database credentials; active session persisted in safe storage.
- **Input Validation**: Regex sanitization via `validators.js` protecting against XSS and injection attacks.
- **Audit Logging**: All critical system actions (user logins, fee creation, payment execution, leave approvals, visitor entries) automatically logged with timestamps, user IDs, and action details in `audit_logs`.

---

## 🔮 5. Future Scope & Roadmap

1. **Biometric & RFID Entry**: Hardware integration with RFID readers for automated gate entry.
2. **Mobile Applications**: React Native mobile app for iOS and Android.
3. **AI Complaint Categorization**: Machine-learning auto-tagging for maintenance complaints.
4. **ERP Integration**: Direct API sync with university college management systems.
