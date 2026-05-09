# Deployment Guide for NGO Pro

## Table of Contents

1. [Local Development with Docker](#local-development-with-docker)
2. [Deploy to Heroku](#deploy-to-heroku)
3. [Deploy to AWS](#deploy-to-aws)
4. [Deploy to Vercel + Backend](#deploy-to-vercel--backend)
5. [Production Checklist](#production-checklist)

---

## Local Development with Docker

### Prerequisites

- Docker and Docker Compose installed
- Git installed

### Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ngo-pro.git
cd ngo-pro
```

2. Create a `.env` file in the `backend` directory (copy from `.env.example`):

```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your MongoDB connection and email settings:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
MONGO_URI=mongodb://admin:password@mongodb:27017/ngo-pro?authSource=admin
ADMIN_EMAIL=admin@ngo-pro.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_from_email@gmail.com
```

4. Start the application with Docker Compose:

```bash
docker-compose up
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://admin:password@localhost:27017

---

## Deploy to Heroku

### Prerequisites

- Heroku account ([signup here](https://www.heroku.com/))
- Heroku CLI installed
- MongoDB Atlas account for cloud database

### Steps

1. **Create MongoDB Atlas Database:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and database user
   - Get the connection string (MONGO_URI)

2. **Create Heroku App:**

```bash
heroku login
heroku create ngo-pro-app
```

3. **Set Environment Variables:**

```bash
heroku config:set MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/ngo-pro"
heroku config:set JWT_SECRET="your_secure_jwt_secret_here"
heroku config:set ADMIN_EMAIL="admin@ngo-pro.com"
heroku config:set SMTP_HOST="smtp.gmail.com"
heroku config:set SMTP_PORT="587"
heroku config:set SMTP_USER="your_email@gmail.com"
heroku config:set SMTP_PASS="your_app_password"
heroku config:set SMTP_FROM="your_from_email@gmail.com"
```

4. **Deploy:**

```bash
git push heroku main
```

5. **View Logs:**

```bash
heroku logs --tail
```

Your app will be available at: `https://ngo-pro-app.herokuapp.com`

---

## Deploy to AWS

### Using AWS Elastic Beanstalk

1. **Install EB CLI:**

```bash
pip install awsebcli --upgrade --user
```

2. **Initialize EB Project:**

```bash
eb init -p node.js-18 ngo-pro
```

3. **Create Environment:**

```bash
eb create ngo-pro-env
```

4. **Set Environment Variables:**

```bash
eb setenv MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/ngo-pro"
eb setenv JWT_SECRET="your_secure_jwt_secret_here"
eb setenv ADMIN_EMAIL="admin@ngo-pro.com"
eb setenv SMTP_HOST="smtp.gmail.com"
eb setenv SMTP_PORT="587"
eb setenv SMTP_USER="your_email@gmail.com"
eb setenv SMTP_PASS="your_app_password"
eb setenv SMTP_FROM="your_from_email@gmail.com"
```

5. **Deploy:**

```bash
eb deploy
```

6. **Open Application:**

```bash
eb open
```

---

## Deploy to Vercel + Backend

### Frontend on Vercel

1. **Push code to GitHub**

2. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set build command: `npm install --prefix frontend && npm run build --prefix frontend`
   - Set output directory: `frontend/build`

3. **Set Environment Variables in Vercel:**
   - `REACT_APP_API_URL`: Your backend URL (e.g., https://ngo-pro-api.herokuapp.com/api)

### Backend on Heroku

Follow the [Heroku deployment steps](#deploy-to-heroku) above.

---

## Production Checklist

Before deploying to production:

- [ ] Update `REACT_APP_API_URL` in frontend environment to your production backend URL
- [ ] Set strong `JWT_SECRET` (use `crypto` to generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Configure SMTP settings for email notifications
- [ ] Set up MongoDB Atlas with proper security:
  - [ ] Enable IP whitelist
  - [ ] Use strong password
  - [ ] Enable backup
- [ ] Enable CORS properly in backend (update in `server.js` if needed)
- [ ] Test all features before going live:
  - [ ] User authentication
  - [ ] Campaign creation
  - [ ] Donations
  - [ ] Email notifications
- [ ] Set up error tracking (optional: Sentry, DataDog)
- [ ] Enable HTTPS/SSL
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Regular database backups
- [ ] Monitor application logs

---

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port for backend server (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `ADMIN_EMAIL` | No | Admin email address |
| `SMTP_HOST` | No | SMTP server host |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP username/email |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | Email sender address |

---

## Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI format
- Check MongoDB Atlas IP whitelist includes your server's IP
- Verify username and password are URL-encoded if they contain special characters

### CORS Errors
- Ensure frontend URL is allowed in backend CORS configuration
- Check that API requests have correct baseURL

### Email Not Sending
- Verify SMTP credentials
- Check "Less secure app access" is enabled (for Gmail)
- Consider using Gmail App Password instead of regular password

### Build Failures
- Clear node_modules: `rm -rf backend/node_modules frontend/node_modules`
- Reinstall: `npm install --prefix backend && npm install --prefix frontend`
- Check Node.js version compatibility (v14+)

---

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
