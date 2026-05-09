# NGO Pro

A full-stack NGO (Non-Governmental Organization) management application built with **Node.js**, **Express**, **MongoDB**, and **React**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18%2B-green)
![React](https://img.shields.io/badge/react-v19%2B-blue)

## ✅ GitHub Ready
- MIT `LICENSE` included
- `.gitignore` already configured for backend, frontend, and OS artifacts
- GitHub Actions CI workflow builds frontend and validates dependencies
- Deployment documentation provided in `DEPLOYMENT.md`

## 🌟 Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 📢 **Campaign Management** - Create, manage, and track campaigns
- 💰 **Donation Tracking** - Record and manage donations
- 👥 **Volunteer Coordination** - Manage volunteer activities
- 📧 **Email Notifications** - Automated email updates
- 📊 **Dashboard** - User-friendly admin dashboard
- 🔒 **Role-Based Access Control** - Admin and user roles

## 📋 Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **MongoDB** local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database)
- **npm** or **yarn**
- **Git** installed

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ngo-pro.git
cd ngo-pro
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
MONGO_URI=mongodb://127.0.0.1:27017/ngo-pro
ADMIN_EMAIL=admin@ngo-pro.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_from_email@gmail.com
```

**Important:** Never commit `.env` to git. It's already in `.gitignore`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### 4. Run Locally

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Frontend opens at `http://localhost:3000`

## 🐳 Docker Setup

Run the entire application with Docker Compose:

```bash
docker-compose up
```

This starts:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

## 📦 Production Deployment

### Quick Links

- 📖 **[Full Deployment Guide](./DEPLOYMENT.md)** - Comprehensive deployment instructions

### Supported Platforms

- ✅ **Heroku** - Quick deployment with `Procfile`
- ✅ **AWS Elastic Beanstalk** - Scalable deployment
- ✅ **Docker** - Container-based deployment
- ✅ **Vercel** (Frontend) + Heroku (Backend) - Optimal combo
- ✅ **Self-hosted** - VPS or dedicated servers

### Deploy to Heroku (Quick)

1. Create a [Heroku](https://www.heroku.com/) account
2. Create MongoDB Atlas database ([free tier](https://www.mongodb.com/cloud/atlas))
3. Create Heroku app:

```bash
heroku login
heroku create ngo-pro-app
```

4. Set environment variables:

```bash
heroku config:set MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/ngo-pro"
heroku config:set JWT_SECRET="your_secure_jwt_secret_here"
```

5. Deploy:

```bash
git push heroku main
```

View app: `https://ngo-pro-app.herokuapp.com`

## 📁 Project Structure

```
ngo-pro/
├── backend/
│   ├── config/              # Database & seed configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Authentication & authorization
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helper utilities
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Docker image config
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Context API
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Docker image config
│   └── package.json
├── DEPLOYMENT.md            # Deployment guide
├── docker-compose.yml       # Docker Compose setup
├── Procfile                 # Heroku deployment config
├── .github/workflows/       # GitHub Actions CI/CD
├── .gitignore              # Git exclusions
└── package.json            # Root package config
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `GET /api/donations/:id` - Get donation details

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `POST /api/volunteers` - Register volunteer
- `PUT /api/volunteers/:id` - Update volunteer

### Notifications
- `POST /api/notifications/email` - Send email notification

## 🔐 Authentication

The app uses **JWT (JSON Web Tokens)** for authentication:

- Tokens stored in localStorage
- Automatically included in API requests
- Tokens expire after 7 days
- Protected routes require valid token

## 🧪 Demo Account

```
Email: admin@sevafoundation.test
Password: admin123
```

The backend automatically seeds demo data on first connection to MongoDB.

## 🛠️ Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `ADMIN_EMAIL` | No | Admin email address |
| `SMTP_HOST` | No | SMTP server |
| `SMTP_PORT` | No | SMTP port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | Email sender address |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | API base URL for frontend requests |

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
| `REACT_APP_API_URL` | No | Backend API URL (default: http://localhost:5000/api) |

## 📝 Development Workflow

### Install All Dependencies

```bash
npm run install:all
```

### Start Both Services

```bash
npm run backend &
npm run frontend
```

### Code Style

- Use ES6+ JavaScript features
- Follow RESTful API conventions
- Comment complex logic
- Use meaningful variable names

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` is correct
- Check MongoDB is running locally or Atlas connection is valid
- Ensure network access is allowed in MongoDB Atlas

### CORS Errors
- Verify frontend URL is in backend CORS whitelist
- Check API requests use correct baseURL

### Email Not Sending
- Verify SMTP credentials are correct
- Enable "Less secure app access" for Gmail
- Use Gmail App Passwords for enhanced security

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

## 🚀 CI/CD Pipeline

The project includes **GitHub Actions** workflows:

- **ci-cd.yml** - Runs tests on push, deploys to Heroku on main branch
- **security.yml** - Weekly security checks

### Setup GitHub Actions

1. Go to your GitHub repository settings
2. Add secrets:
   - `HEROKU_API_KEY` - Your Heroku API key
3. Workflows trigger automatically on push

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/)

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support

- 📖 Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/ngo-pro/issues)
- 💡 Feature requests welcome
- 📧 Contact: admin@ngo-pro.com

---

**Made with ❤️ for NGOs and non-profit organizations**