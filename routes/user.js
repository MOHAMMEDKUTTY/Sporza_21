// routes/user.js
const express = require("express");
const router = express.Router();
const { User, Meal, Activity, Classroom, Assignment } = require("../db/models");

// ---------------------- USER/STUDENT DATA ROUTES ----------------------

// Weight Update Route 
router.put("/user/update-weight/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { weight } = req.body;
        const user = await User.findByIdAndUpdate(userId, { weight: weight }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Weight updated successfully", newWeight: user.weight });
    } catch (err) {
        console.error("Weight Update Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Meal Log Route 
router.post("/meal", async (req, res) => {
    try {
        const { userId, type, food, calories } = req.body;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Normalize date to start of day
        
        let meal = await Meal.findOne({
            userId,
            type,
            date: startOfDay 
        });

        if (!meal) {
            meal = new Meal({
                userId,
                type,
                date: startOfDay,
                foods: []
            });
        }
        
        meal.foods.push({ food, calories: parseInt(calories) });
        await meal.save();

        res.status(201).json({ message: "Meal entry saved successfully." });
    } catch (err) {
        console.error("Meal Log Save Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Activity Log Route 
router.post("/activity", async (req, res) => {
    try {
        const { userId, exercise, caloriesBurned, sport, runningSteps } = req.body;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        let activity = await Activity.findOne({
            userId,
            date: startOfDay
        });

        if (!activity) {
            activity = new Activity({
                userId,
                date: startOfDay
            });
        }

        // Update all fields for today's entry (allows overwriting/updating the log)
        activity.exercise = exercise || 'No Log';
        activity.caloriesBurned = parseInt(caloriesBurned) || 0;
        activity.sport = sport || 'None';
        activity.runningSteps = parseInt(runningSteps) || 0;

        await activity.save();

        res.status(201).json({ message: "Activity entry saved successfully." });
    } catch (err) {
        console.error("Activity Log Save Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Daily Summary (Meals + Activity) - used by site.html
router.get("/student/daily-summary", async (req, res) => {
    try {
        const { userId } = req.query;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const meals = await Meal.find({
            userId,
            date: { $gte: startOfDay }
        });

        const activity = await Activity.findOne({
            userId,
            date: { $gte: startOfDay }
        });

        const totalCaloriesConsumed = meals.reduce((sum, meal) => 
            sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0), 0);

        res.json({
            meals,
            activity: activity || { exercise: 'None', caloriesBurned: 0, sport: 'None', runningSteps: 0 },
            totalCaloriesConsumed
        });
    } catch (err) {
        console.error("Daily Summary Fetch Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});


// Food Log Weekly route to accept startDate/endDate
router.get("/food-log/weekly", async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;

        // Use precise date range if provided by client (weekly-calendar.html)
        let start = new Date(startDate);
        let end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Ensure end date covers the whole day

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            // Fallback: If dates are missing, use the last 7 full days
            start = new Date();
            start.setDate(start.getDate() - 7);
            start.setHours(0, 0, 0, 0);
            end = new Date();
            end.setHours(23, 59, 59, 999);
        }

        const meals = await Meal.find({
            userId,
            date: { $gte: start, $lte: end }
        });

        const weeklySummary = {};
        meals.forEach(meal => {
            // Use the stored date (start of day) to key the summary
            const dateStr = meal.date.toISOString().split('T')[0];
            if (!weeklySummary[dateStr]) {
                weeklySummary[dateStr] = { totalCalories: 0 };
            }
            meal.foods.forEach(food => {
                weeklySummary[dateStr].totalCalories += food.calories;
            });
        });

        res.json(weeklySummary);
    } catch (err) {
        console.error("Weekly Data Fetch Error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});


// GET /assignment/:assignmentId: Fetches a single assignment detail (for viewing)
router.get("/assignment/:assignmentId", async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId)
            .populate('author', 'name') // Populate the author's name
            .lean(); // Use .lean() for performance

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        res.status(200).json(assignment);

    } catch (err) {
        console.error(`Error fetching assignment ${assignmentId}:`, err.message);
        // Check for invalid ID format errors which Mongoose throws as CastError
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ message: "Invalid assignment ID format." });
        }
        res.status(500).send('Server Error fetching assignment detail.');
    }
});
router.get('/api/student-assignments/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    const trainerCode = student.trainerCode;
    if (!trainerCode) {
      return res.status(400).json({ msg: 'Student is not enrolled in a class' });
    }
    const classroom = await Classroom.findOne({ classCode: trainerCode });
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found for code' });
    }
    const trainerId = classroom.trainerId;
    const assignments = await Assignment.find({ author: trainerId })
                                        .populate('author', 'name') // Get trainer's name
                                        .sort({ createdAt: -1 });

    res.json(assignments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;