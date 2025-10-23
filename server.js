const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const trainerRouter = require("./routes/trainer");

const app = express();
const PORT = 5000;

// ===============================================
// ✅ CONSOLIDATED MIDDLEWARE SETUP
// ===============================================

// Serve static files (Place at the top)
app.use(express.static(path.join(__dirname, "public"))); 

// Body parser middleware - ESSENTIAL for req.body (Place before routes)
app.use(express.json()); 

// CORS middleware - Allow specific client origin (3000) (Place before routes)
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ===============================================
// 2. DATABASE CONNECTION
// ===============================================

mongoose.connect("mongodb://127.0.0.1:27017/sporza")
.then(() => console.log("✅ MongoDB Connected for Sporza"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));


// ===============================================
// 3. ROUTE MIDDLEWARES (APIs)
// ===============================================
// NOTE: These must come AFTER middleware setup (json, cors)
app.use("/", authRouter); 
app.use("/", userRouter);
app.use("/", trainerRouter);


// ===============================================
// 4. HTML/Legacy Routes
// ===============================================

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "site.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/site.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "site.html"));
});

app.get("/trainer.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "trainer.html"));
});
app.get("/weekly-calendar.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "weekly-calendar.html"));
});


// ---------------------- START SERVER ----------------------
app.listen(PORT, () => console.log(`🚀 Sporza Server running on port ${PORT}`));