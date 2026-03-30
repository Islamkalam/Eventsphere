# 🌐 EventSphere Management

A full-stack MERN event management platform built for Aptech institute project.

## Tech Stack
- **Frontend:** React 18, React Router v6, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **Deployment:** Vercel

## Features
- 3 roles: Admin/Organizer, Exhibitor, Attendee
- Expo creation & management
- Exhibitor application & approval workflow
- Session scheduling
- Attendee registration & bookmarks
- Analytics dashboard
- Real-time search & filtering

## Setup

### 1. MongoDB Atlas
Create a free cluster at https://mongodb.com/atlas and get your connection URI.

### 2. Environment Variables (set in Vercel dashboard)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eventsphere
JWT_SECRET=your_secret_key_here
```

### 3. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

## Project Structure
```
eventsphere/
├── client/          # React frontend
│   └── src/
│       ├── pages/   # All page components
│       ├── context/ # Auth context
│       └── utils/   # API helper
├── server/          # Express backend
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   └── middleware/  # JWT auth
└── vercel.json      # Deployment config
```
