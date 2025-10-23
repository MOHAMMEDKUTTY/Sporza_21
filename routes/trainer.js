// routes/trainer.js
const express = require("express");
const router = express.Router();
const { User, Meal, Activity, Classroom, Assignment } = require("../db/models");

router.get("/trainer/class-code/:trainerId", async (req, res) => {
    try {
        const { trainerId } = req.params;
        const classroom = await Classroom.findOne({ trainerId });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        res.json({ classCode: classroom.classCode });
    } catch (err) {
        console.error("Get Class Code Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

router.get("/trainer/students/:trainerId", async (req, res) => {
    try {
        const { trainerId } = req.params;
        const classroom = await Classroom.findOne({ trainerId });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        const students = await User.find({ role: 'student', trainerCode: classroom.classCode }).select('-password -__v');
        res.json(students);
    } catch (err) {
        console.error("Get Students Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

router.get("/trainer/student-meals/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const meals = await Meal.find({ userId: studentId }).sort({ date: -1 }).limit(5);
        res.json(meals);
    } catch (err) {
        console.error("Get Student Meals Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

router.get('/assignments', async (req, res) => {
  try {
    const { authorId } = req.query;
    if (!authorId) {
      return res.status(400).json({ msg: 'Author ID is required' });
    }
    const assignments = await Assignment.find({ author: authorId })
                                        .populate('author', 'name')
                                        .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/trainer/student-activity/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const activities = await Activity.find({ userId: studentId }).sort({ date: -1 }).limit(5);
        res.json(activities);
    } catch (err) {
        console.error("Get Student Activity Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

router.post('/post-assignment/:teacherId', async (req, res) => {
    const { title, description, dueDate } = req.body;
    const { teacherId } = req.params;
    if (!title || !description || !teacherId) {
        return res.status(400).json({ msg: 'Missing Title, Description, or Trainer ID in URL.' });
    }
    try {
        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            author: teacherId,
        });
        const assignment = await newAssignment.save();
        res.status(201).json({ msg: 'Assignment created successfully', assignment });
    } catch (err) {
        console.error("Assignment POST Error:", err.message);
        res.status(500).json({ msg: 'Server Error: Failed to save assignment. Check server logs.' });
    }
});

module.exports = router;