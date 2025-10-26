# Hospital Appointment MERN (scaffold)

This scaffold contains a minimal MERN application with the following features:
- Book appointment (generates Booking ID + QR)
- Track appointment by Booking ID or Phone
- Download appointment slip as PDF
- Admin dashboard to view and update statuses (no auth in scaffold)

## Setup instructions (local)

1. Install MongoDB locally or use MongoDB Atlas. Copy connection string into `backend/.env` as `MONGO_URI`.
2. Start backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   # edit .env to add MONGO_URI and FRONTEND_URL if needed
   npm run dev
   ```
3. Start frontend:
   ```
   cd frontend
   npm install
   npm start
   ```
4. Frontend expects the backend API to be available at `/api/...` (proxy). For local testing you can use a proxy via setupProxy or run frontend with `PORT=3000` and set `FRONTEND_URL` in backend .env

Notes:
- This is a scaffold to get you started. For production, add authentication on admin routes, validations, rate-limiting, and secure environment variables.
