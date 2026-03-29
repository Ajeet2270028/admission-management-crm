# Admission Management & CRM System

A full-stack web application for managing college admissions, built for the **Edumerge Junior Software Developer Assignment**.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL
- **Frontend:** React 18, React Router v6, Axios, Recharts

## Features
- ✅ Master Setup — Institution → Campus → Department → Program → Academic Year
- ✅ Seat Matrix with KCET / COMEDK / Management quota allocation
- ✅ Real-time seat counter (no overbooking, pessimistic locking)
- ✅ Applicant management with 15-field application form
- ✅ Government flow (allotment number) & Management flow
- ✅ Auto-generated immutable admission number (e.g. `EIT/2025/UG/CSE/KCET/0001`)
- ✅ Fee & Document status tracking
- ✅ Role-based access — Admin, Admission Officer, Management
- ✅ JWT authentication
- ✅ Dashboard with charts

## Setup & Run

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

### Backend
```bash
cd backend
# Update src/main/resources/application.properties with your MySQL credentials
mvn spring-boot:run
```
Runs on http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

## Demo Credentials
| Username | Password | Role |
|---|---|---|
| admin | admin123 | Admin |
| officer | officer123 | Admission Officer |
| management | mgmt123 | Management (view only) |

## AI Disclosure
Claude AI was used for boilerplate code generation. All business logic, system rules, architecture decisions, and security implementation were written manually.
```

---

## Step 7 — Add Topics to your repo

On your GitHub repo page → click **"About"** (gear icon, top right) → Add topics:
```
spring-boot  react  java  mysql  jwt  admission-management  crm  full-stack
```

---

## Your repo will look like:
```
admission-management-crm/
├── backend/          ← Spring Boot
├── frontend/         ← React
└── README.md
```

Assignment for Junior Software Developer
