# HRMS Backend API

A production-ready Human Resource Management System (HRMS) backend API built with Node.js, Express, and MongoDB.

## Features

- Authentication - JWT-based login/logout with role-based access (Admin/Employee)
- Employee Management - Full CRUD with search, filter, and pagination
- Employment Types and Leave Policies - Configurable policies with auto-inheritance
- Leave Management - Apply, approve, reject with automatic balance updates
- Attendance Management - Punch in/out with working hours calculation
- Holiday Management - CRUD operations with calendar integration
- Payroll Processing - Auto-calculations with leave adjustment and deductions
- Salary Slips - PDF generation with detailed breakdown

## Tech Stack

- Runtime: Node.js v20 LTS
- Framework: Express.js v4.18+
- Database: MongoDB (Atlas)
- ODM: Mongoose v8.0+
- Authentication: JWT + bcrypt
- Validation: Zod
- PDF Generation: PDFKit
- Documentation: Swagger/OpenAPI

## Installation

### Prerequisites

- Node.js v20+
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository
   git clone https://github.com/shreyashtalele/hrms-backend.git
   cd hrms-backend

2. Install dependencies
   npm install

3. Configure environment variables
   cp .env.example .env

   Update the .env file with your values:
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hrms
   JWT_SECRET=secret_key
   JWT_REFRESH_SECRET=refresh_key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   BCRYPT_SALT_ROUNDS=12
   OFFICE_START_TIME=09:30
   OFFICE_END_TIME=18:00
   WEEKEND_DAYS=saturday,sunday

4. Create admin user
   node src/scripts/createAdmin.js

   This creates:
   Email: taleleshreyash44@gmail.com
   Password: admin123

5. Start development server
   npm run dev

6. Access the API
   Base URL: http://localhost:3000
   Health check: http://localhost:3000/health
   Swagger Docs: http://localhost:3000/api-docs

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login (Admin/Employee) |
| POST | /api/auth/logout | Logout |

### Employees (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| POST | /api/employees | Create employee |
| GET | /api/employees/:id | Get employee by ID |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |

### Leave Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/leave/apply | Apply for leave |
| GET | /api/leave/my-requests | My leave requests |
| GET | /api/leave/balance | My leave balance |
| GET | /api/leave/all | All leave requests (Admin) |
| PUT | /api/leave/:id/approve | Approve leave (Admin) |
| PUT | /api/leave/:id/reject | Reject leave (Admin) |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/attendance/punch-in | Punch in |
| POST | /api/attendance/punch-out | Punch out |
| GET | /api/attendance/today | Today's stats |
| GET | /api/attendance/history | Attendance history |
| GET | /api/attendance/calendar/:month/:year | Calendar view |
| GET | /api/attendance/admin | All attendance (Admin) |

### Holidays

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/holidays | List holidays |
| POST | /api/holidays | Create holiday (Admin) |
| PUT | /api/holidays/:id | Update holiday (Admin) |
| DELETE | /api/holidays/:id | Delete holiday (Admin) |

### Payroll

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payroll/run | Run payroll (Admin) |
| GET | /api/payroll/history | Payroll history (Admin) |
| GET | /api/payroll/:id | Get payroll by ID |
| PUT | /api/payroll/:id/finalize | Finalize payroll (Admin) |
| GET | /api/payroll/:id/download | Download salary slip PDF |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT secret key | - |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| ACCESS_TOKEN_EXPIRY | Access token expiry | 15m |
| REFRESH_TOKEN_EXPIRY | Refresh token expiry | 7d |
| BCRYPT_SALT_ROUNDS | Password hashing salt rounds | 12 |
| OFFICE_START_TIME | Office start time | 09:30 |
| OFFICE_END_TIME | Office end time | 18:00 |
| WEEKEND_DAYS | Weekend days | saturday,sunday |

## Project Structure

hrms-backend/
├── src/
│   ├── config/          Configuration files
│   ├── controllers/     Request handlers
│   ├── docs/            Swagger documentation
│   ├── middleware/      Auth, validation, error handling
│   ├── models/          Database schemas
│   ├── routes/          API routes
│   ├── services/        Business logic
│   ├── utils/           Helpers and constants
│   └── validators/      Zod validation schemas
├── .env.example         Environment variables template
├── .gitignore           Git ignore rules
├── package.json         Dependencies
└── README.md            Documentation

## Testing

npm test

## License

ISC

## Author

Shreyash Talele

GitHub: https://github.com/shreyashtalele
Email: taleleshreyash44@gmail.com