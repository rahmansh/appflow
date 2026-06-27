# AppFlow — Job Application Tracker

A simple web app to track your job applications during your job search.

**Live Demo:** https://appflow-kim6xfx2w-shihabs-projects-66e34a5a.vercel.app/

---

## Features

- Add job applications with company, role, status, date, and notes
- View all applications on a dashboard with stats
- Filter by status: Applied, Interview, Offer, Rejected
- Edit or delete any application

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas + Mongoose
- **Deploy:** Vercel (frontend), Render (backend)

## Project Structure

```
appflow/
├── client/       # React frontend
└── server/       # Express backend
```

## Running Locally

**Backend**
```bash
cd server
npm install
npm run dev
```

Create a `.env` file in `server/`:
```
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Create a `.env` file in `client/`:
```
VITE_API_URL=http://localhost:8000
```
