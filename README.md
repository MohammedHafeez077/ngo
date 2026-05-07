# NGO Pro

A full-stack NGO (Non-Governmental Organization) management application built with Node.js, Express, and React.

## Features

- Campaign management
- Donation tracking
- Volunteer coordination
- User authentication
- Email notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ngo-pro.git
cd ngo-pro
```

### 2. Backend Setup

```powershell
cd backend
npm install
```

Create a `.env` file in the `backend` folder (copy from `.env.example`):

```powershell
copy .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
MONGO_URI=mongodb://127.0.0.1:27017/ngo-pro
ADMIN_EMAIL=admin@sevafoundation.test
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_from_email@gmail.com
```

**Important:** Never commit `.env` to git. Use `.env.example` as a template.

### 3. Frontend Setup

```powershell
cd frontend
npm install
```

### 4. Run the Application

**Backend** (in a PowerShell window):

```powershell
cd backend
npm start
```

The backend API will run at `http://localhost:5000`

**Frontend** (in another PowerShell window):

```powershell
cd frontend
npm start
```

The frontend will open at `http://localhost:3000`

**Note:** Use `npm.cmd` instead of `npm` if you encounter PowerShell script execution issues on Windows.

## Demo Credentials

**Email:** admin@sevafoundation.test

The backend automatically seeds demo users, campaigns, donations, and volunteers when connected to MongoDB.

## Project Structure

```
ngo-pro/
├── backend/              # Express.js API
│   ├── config/          # Database & seed configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Authentication & authorization
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── utils/           # Helper functions
└── frontend/            # React application
    ├── public/
    ├── src/
    │   ├── components/   # React components
    │   ├── context/      # Context API
    │   ├── layouts/      # Layout components
    │   ├── pages/        # Page components
    │   └── services/     # API services
    └── build/           # Production build
```

## API Endpoints

- **Auth:** `/api/auth/*` - Login, register
- **Campaigns:** `/api/campaigns/*` - CRUD operations
- **Donations:** `/api/donations/*` - Donation management
- **Volunteers:** `/api/volunteers/*` - Volunteer management
- **Notifications:** `/api/notifications/*` - Email notifications

## Environment Variables

See `backend/.env.example` for all required environment variables.

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.

password :- admin123