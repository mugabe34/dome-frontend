# doMe - Daily Activity Manager

A full-stack responsive To-Do App built with React, Tailwind CSS, Vite, and MongoDB.

## Features

- 🎯 **Task Management** - Add, organize, and track daily activities
- 📅 **Calendar View** - Interactive calendar for task scheduling
- ⏰ **Reminders** - Set and manage reminders for important events
- 📊 **Activity Analysis** - Visual charts and patterns
- 📄 **PDF Reports** - Generate weekly reports with smart summaries
- 🔐 **Authentication** - Secure login and registration

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Recharts
- React Calendar
- jsPDF
- Lucide React Icons
- React Hot Toast

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

3. Set up MongoDB (make sure MongoDB is running):
```bash
mongod
```

4. Create `.env` file in the project root:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dome
JWT_SECRET=your_secret_key_here
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. Start the frontend (in a new terminal):
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
doME/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── context/        # Context providers
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── backend/
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── config/         # Configuration files
│   └── server.js       # Express server
└── package.json
```

## Features Overview

### Pages

1. **Loader** - Shows on first app launch with circular animation
2. **Login/Register** - Simple authentication with name and password
3. **Tasks** - Hero section with activity input form
4. **Dashboard** - Multiple sections:
   - Tasks list
   - Performed More (frequent activities)
   - Overview (scatter chart)
   - Calendar view
   - Reminders
   - Report generation
5. **About** - App description and FAQs

### Design

- Font: Geist (Inter fallback)
- Colors: Dark Blue (#0A1A44) and White (#FFFFFF)
- Fully responsive
- Smooth animations and transitions
- Toast notifications for all actions

## License

© All rights reserved | Powered by Mugabe Herve

