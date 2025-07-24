const express = require('express');
const router = express.Router();
const mealPlannerController = require('../controllers/mealPlannerController');

// POST /api/mealplanner/generate - generate and save meal plan based on symptoms
router.post('/generate', mealPlannerController.generateMealPlan);

// GET /api/mealplanner/saved/:userId - get saved meal plans for user
router.get('/saved/:userId', mealPlannerController.getSavedMealPlans);

module.exports = router;
