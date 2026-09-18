# Exam Hall Seat Optimizer

An intelligent, full-stack examination seating optimization web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and a **live MongoDB Atlas cloud database**.

The application eliminates cheating and hall bottlenecks by generating conflict-minimized seating arrangements using an 8-way spatial constraint optimization algorithm.

---

## 🏛 System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Vite + React 18 UI                   │
│   Tailwind CSS • Modern Dashboard • Exam Hall Visual   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST API (Fetch/JSON)
┌───────────────────────────▼────────────────────────────┐
│                  Express.js REST API                   │
│    Controllers • Routes • Mongoose Middleware • CORS   │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
┌─────────────▼───────────────┐ ┌─────────▼──────────────┐
│  Seating Optimizer Engine   │ │  Mongoose Data Layer   │
│ • Modular Latin-Square      │ │ • 6 Collections        │
│ • 8-Way Neighbor Detection  │ │ • Compound Indexes     │
│ • Heuristic Swap Search     │ │ • Aggregation Pipelines│
└─────────────────────────────┘ └─────────┬──────────────┘
                                          │
                                ┌─────────▼──────────────┐
                                │   MongoDB Atlas Cloud  │
                                │ (exam_hall_optimizer)  │
                                └────────────────────────┘
```

---

## 🌟 Key Features

1. **Intelligent Constraint Seating Algorithm**:
   - Multi-stream shifted modular checkerboard distribution.
   - 8-Way spatial neighbor detection (horizontal, vertical, diagonal).
   - Iterative neighborhood swap optimization.
2. **Interactive Visual Examination Hall**:
   - Real-world hall perspective with Teacher's Desk / Blackboard at the front.
   - Distinct bench columns with aisle spacing and seat positions.
   - Color-coded badges for sections (A, B, C, D).
   - Click-to-inspect conflict modal detailing Student 1 vs Student 2 and penalty breakdown.
3. **Persistent MongoDB Atlas Storage**:
   - Every generated plan is saved as a distinct document.
   - Historical audit log (`allocationLogs`) tracking before/after conflicts and duration.
4. **MongoDB Aggregation Pipelines for Analytics**:
   - `$group`, `$match`, `$lookup`, `$unwind`, `$project` used for:
     - Real-time room capacity utilization percentages.
     - Student distribution across departments and sections.
     - Conflict breakdown by type.
     - Historical optimization efficiency trends.
5. **Full Entity Management & CSV Bulk Import**:
   - Students, Rooms, and Exams CRUD.
   - Bulk CSV import with template download and duplicate roll number protection.
   - Automatic room capacity calculation (`rows × columns × seatsPerBench`).
   - Real-time exam capacity verification (`Selected Students vs Available Capacity`).
6. **Export & Print**:
   - Download seating plans as CSV.
   - Print-optimized exam hall door charts (`@media print`).
7. **One-Click Demo Mode**:
   - Built-in "LOAD DEMO DATA" button and CLI `npm run seed` script creating 120 students, 3 rooms, and 2 exams in seconds.

---

## 🧠 Optimization Logic & Formula

### Constraints

#### Hard Constraints
1. No student allocated to multiple seats.
2. No seat allocated to multiple students.
3. Room capacity strictly enforced.
4. All selected students allocated or reported as unallocated.

#### Soft Constraints (Objective Function)
- **Same-Section Adjacency**: $+10\text{ penalty points}$ per neighbor pair.
- **Same-Department Adjacency**: $+5\text{ penalty points}$ per neighbor pair.
- **Sequential Roll Numbers** (e.g. `CS23001` & `CS23002`): $+5\text{ penalty points}$ per neighbor pair.

### Transparent Scoring System
$$\text{Penalties} = (10 \times \text{SectionConflicts}) + (5 \times \text{DeptConflicts}) + (5 \times \text{SequentialConflicts})$$

$$\text{Score} = \max(0, 100 - \text{Penalties})$$

When high density occurs, the engine also computes the conflict reduction efficiency:
$$\text{Efficiency} = 70\% + \left(28\% \times \frac{\text{InitialConflicts} - \text{FinalConflicts}}{\text{InitialConflicts}}\right)$$

---

## 🗄 MongoDB Collections & Schemas

- **`students`**: `rollNumber` (unique index), `name`, `department` (index), `section` (index), `semester` (index), `year`, `createdAt`.
- **`rooms`**: `roomNumber` (unique index), `building`, `rows`, `columns`, `seatsPerBench`, `capacity` (auto-calculated), `floor`.
- **`exams`**: `name`, `subject`, `date`, `startTime`, `duration`, `semester`, `departments`, `status`.
- **`seatingPlans`**: `examId` (ref Exam), `generatedAt`, `algorithm`, `studentsAllocated`, `totalStudents`, `conflicts`, `score`, `conflictDetails`, `rooms` (embedded bench/seat grid with conflict metadata), `unallocatedStudents`.
- **`allocationLogs`**: `examId`, `examName`, `generatedAt`, `userAction`, `studentsCount`, `roomsCount`, `conflictsBeforeOptimization`, `conflictsAfterOptimization`, `score`, `executionTimeMs`.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas cluster connection string

### 1. Clone & Configure Environment Variables
Create `.env` in the root folder (and/or `server/.env`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/exam_hall_optimizer?retryWrites=true&w=majority
DB_NAME=exam_hall_optimizer
PORT=5000
```

> **Note on Atlas Network Access**: Ensure your current IP address (or `0.0.0.0/0`) is added to your MongoDB Atlas **Network Access / IP Access List**.

### 2. Install Dependencies
From the root directory:
```bash
npm run install:all
```
Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed Demo Data (120 Students, 3 Rooms, 2 Exams)
```bash
npm run seed
```

### 4. Run Development Servers
From the root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health & Atlas status |
| `POST` | `/api/seed/demo` | Populates 120 demo students, 3 rooms, 2 exams |
| `GET` | `/api/students` | Search, filter by dept/section/semester |
| `POST` | `/api/students` | Create student (unique rollNumber check) |
| `PUT` | `/api/students/:id` | Update student |
| `DELETE` | `/api/students/:id` | Delete student |
| `POST` | `/api/students/import` | Bulk import students from CSV |
| `GET` | `/api/rooms` | List all examination halls |
| `POST` | `/api/rooms` | Create room (auto-calculates capacity) |
| `GET` | `/api/exams` | List scheduled examinations |
| `POST` | `/api/exams` | Create examination schedule |
| `POST` | `/api/seating/generate` | Run optimization algorithm & persist plan |
| `GET` | `/api/seating` | List historical seating plans |
| `GET` | `/api/seating/:id` | Get full seating plan with room seats |
| `GET` | `/api/seating/:id/export-csv` | Download seating plan as CSV |
| `GET` | `/api/analytics/dashboard` | Aggregated dashboard KPI counters |
| `GET` | `/api/analytics/conflicts` | Aggregation of conflict sums & score trends |
| `GET` | `/api/analytics/rooms` | Room utilization aggregated via `$unwind` & `$group` |
| `GET` | `/api/analytics/students` | Department and section demographics |

---

## 🎬 Step-by-Step Demonstration Flow

1. Open `http://localhost:5173`.
2. Observe the green **"MongoDB Atlas Live"** indicator in the navbar.
3. Click **"LOAD DEMO DATA"** to seed 120 students, 3 rooms, and 2 exams into Atlas.
4. Open **Students** (`/students`) to see real students across Computer Science, IT, and Cyber Security.
5. Open **Rooms** (`/rooms`) to see LH-101 (60 cap), LH-102 (40 cap), CS-LAB-1 (32 cap).
6. Open **Generate Seating** (`/generate`):
   - Select "Mid Term Examination" (DBMS).
   - Select the 3 rooms (Total capacity: 132).
   - Select all 120 students.
   - Verify the green indicator: `✓ Enough capacity`.
   - Click **"GENERATE OPTIMIZED SEATING"**.
7. Watch the live optimization stages and confetti celebration!
8. Click **"VIEW SEATING PLAN"**:
   - Inspect the Teacher's Desk / Blackboard at the front of the hall.
   - View the bench layout and color-coded section badges.
   - Click any conflicted seat to open the **Conflict Inspector Modal** displaying Student 1, Student 2, conflict type, and penalty points.
   - Switch between room tabs (LH-101, LH-102, CS-LAB-1).
9. Open **Analytics** (`/analytics`) to see MongoDB aggregation pipelines visualizing department distribution and room utilization rates.
10. Open **History** (`/history`) to confirm all generated plans remain persistently stored in MongoDB Atlas without overwriting.
