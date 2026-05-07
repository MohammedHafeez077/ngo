# NGO Pro

## Run Manually

Open PowerShell and go to the project folder:

```powershell
cd "C:\Users\hafee\OneDrive\Desktop\ngo-pro"
```

Start the backend:

```powershell
cd backend
npm.cmd start
```

Make sure MongoDB is available and your backend env has the connection string configured in `backend/.env`:

```text
MONGO_URI=mongodb://127.0.0.1:27017/ngo-pro
```

The backend will automatically seed demo users, campaigns, donations, and volunteers when MongoDB is connected.

Open a new PowerShell window and start the frontend:

```powershell
cd "C:\Users\hafee\OneDrive\Desktop\ngo-pro\frontend"
npm.cmd start
```

Then open the app in your browser:

```text
http://localhost:3000
```

The backend API runs at:

```text
http://localhost:5000
```

Use `npm.cmd` instead of `npm` because PowerShell may block `npm.ps1` on Windows.


---login credentials

email :- admin@sevafoundation.test

password :- admin123