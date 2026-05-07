const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "NGO Pro API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message || "Server error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
