# TransitOps

TransitOps — Smart Transport Operations Platform (MERN) built for a hackathon.

Features
- Authentication (JWT)
- Fleet, Driver, Trip management
- Maintenance, Fuel Logs, Expenses
- Dashboard KPIs and Reports
- Export CSV/PDF

Quickstart
1. Install server deps:
Full Quickstart (Dev)

Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

Install server dependencies and seed database:

```powershell
cd server
npm install
cp ../.env.example .env
# update .env if needed (MONGO_URI, EMAIL creds)
node seed/seed.js
```

Install client dependencies:

```powershell
cd ../client
npm install
```

Run server and client in two terminals:

Server:
```powershell
cd server
npm run dev
```

Client:
```powershell
cd client
npm run dev
```

Notes
- API runs on `http://localhost:5000` by default. The client expects `VITE_API_URL` (set in environment or `.env.local` for the Vite app).
- Real-time presence and sign-in notifications use Socket.IO. After login the client authenticates the socket and presence is visible on the Dashboard.
- Email reminders (license expiry) use the SMTP settings in the `.env` file. For development, you can set `EMAIL_HOST` to a testing SMTP or use Mailtrap.
Demo credentials
- admin@transitops.com / password (Fleet Manager)
- dispatch@transitops.com / password (Dispatcher)

Project Structure
- `server/` — Express API, Mongoose models, controllers, services (email, license reminders), Socket.IO integration
- `client/` — Vite + React frontend (Tailwind), pages for Vehicles, Drivers, Trips, Maintenance, Fuel, Expenses, Reports, Dashboard

Production notes
- Replace `.env` secrets with secure values; configure reverse proxy for the API; enable HTTPS; configure persistent storage for uploads.

License
MIT
