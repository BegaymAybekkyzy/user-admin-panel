# Admin Panel
Web interface for administering registered users of the site.  
The project implements a REST API on Node.js with a MySQL database.

## Contents
- [Technologies](#technologies)
- [Installation](#installation)
- [Database setup](#database-setup)
- [Test Accounts](#test-accounts)

## Technologies
**Backend**
- Node.js
- Express
- MySQL2
- JWT (authentication)
- Argon2 (password hashing)
- Nodemon

**Frontend**
- Vite
- React (or Vanilla JS)

## Installation
### Backend
```bash
cd backend
npm install
npm run start
```
Backend runs at http://localhost:8000

### frontend
```bash
cd frontend
npm install
npm run dev
```

## Database setup
Import the SQL dump (он уже есть в `backend/src/db/dump.sql`):
   ```bash
  mysql -u root -p admin_panel < src/db/dump.sql
   ```

## Test Accounts
All passwords: 123