// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, Classroom } = require("../db/models"); // Import models

// ---------------------- AUTH ROUTES ----------------------
router.post("/register", async (req, res) => {
    try {
        const { name, age, weight, email, phone, password, role, trainerCode } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "❌ Email already registered" });
        }

        if (role === 'student' && !trainerCode) {
            return res.status(400).json({ message: "❌ Student must provide a trainer code" });
        }
        
        if (role === 'student' && trainerCode) {
            const classroom = await Classroom.findOne({ classCode: trainerCode });
            if (!classroom) {
                return res.status(400).json({ message: "❌ Invalid trainer code" });
            }
        } else if (role === 'trainer' && trainerCode) {
             return res.status(400).json({ message: "❌ Trainer cannot have a trainer code" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, age, weight, email, phone, password: hashedPassword, role, trainerCode: role === 'student' ? trainerCode : null
        });
        await newUser.save();

        if (role === 'trainer') {
            // Generate a unique, 6-digit uppercase code
            const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const newClassroom = new Classroom({ trainerId: newUser._id, classCode: generatedCode });
            await newClassroom.save();
        }

        res.json({ message: "✅ Registration successful. Please log in." });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "❌ Invalid credentials: Email not found" });
        }
        if (user.role !== role) {
             return res.status(400).json({ message: `❌ Invalid credentials: You are registered as a ${user.role}, not a ${role}` });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "❌ Invalid credentials: Incorrect password" });
        }
        
        // Successful login
        res.json({
            message: "✅ Login successful",
            user: { id: user._id, name: user.name, email: user.email, age: user.age, weight: user.weight, role: user.role }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

module.exports = router;