const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/problems", require("./routes/problemRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/health", (req,res) => {
  return res.status(200).json({
      success:true,
      message : "Server is working"
  });
})
// ---------- Production: Serve Frontend Static Files ----------
// if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
// }

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
