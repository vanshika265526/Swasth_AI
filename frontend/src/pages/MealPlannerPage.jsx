const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  time: String,
  dish: String,
});

const dailyPlanSchema = new mongoose.Schema({
  day: String,
  meals: [mealSchema],
});

const mealPlanSchema = new mongoose.Schema({
  user: { type: String, required: true },
  symptoms: { type: String, required: true },
  weeklyPlan: [dailyPlanSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);

