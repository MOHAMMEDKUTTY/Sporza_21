// db/models.js
const mongoose = require("mongoose");

// ---------------------- DATABASE SCHEMAS ----------------------
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    weight: Number,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ['student', 'trainer'], required: true },
    trainerCode: { type: String, default: null } 
});
const User = mongoose.model("User", userSchema);

const foodLogSchema = new mongoose.Schema({
    food: { type: String, required: true },
    calories: { type: Number, required: true }
});

const mealSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
    date: { type: Date, required: true },
    foods: [foodLogSchema]
});
const Meal = mongoose.model("Meal", mealSchema);

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    exercise: { type: String, default: 'No Log' },
    caloriesBurned: { type: Number, default: 0 },
    sport: { type: String, default: 'None' },
    runningSteps: { type: Number, default: 0 }
});
const Activity = mongoose.model("Activity", activitySchema);

const classroomSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    classCode: { type: String, required: true, unique: true }
});
const Classroom = mongoose.model("Classroom", classroomSchema);

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema)
module.exports = { User, Meal, Activity, Classroom , Assignment };