const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// Controller to save data for different categories: recipes, prescriptions, plans, etc.
exports.saveData = async (req, res) => {
  try {
    const { userId, category, data } = req.body;
    if (!userId || !category || !data) {
      return res.status(400).json({ message: 'Missing required fields: userId, category, or data' });
    }

    switch (category) {
      case 'recipes':
        // Save recipe data
        const recipe = new Recipe({ user: userId, ...data });
        await recipe.save();
        return res.status(201).json({ message: 'Recipe saved successfully', recipe });

      case 'prescriptions':
        // Save prescription data
        const prescription = new Prescription({ user: userId, ...data });
        await prescription.save();
        return res.status(201).json({ message: 'Prescription saved successfully', prescription });

      case 'plans':
        // Save meal plan data
        const mealPlan = new MealPlan({ user: userId, ...data });
        await mealPlan.save();
        return res.status(201).json({ message: 'Meal plan saved successfully', mealPlan });

      case 'drugChecker':
        // Implement saving drug checker data if applicable
        // Placeholder response
        return res.status(200).json({ message: 'Drug checker data saved (placeholder)' });

      default:
        return res.status(400).json({ message: 'Invalid category' });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get saved data by category for a user
exports.getSavedData = async (req, res) => {
  try {
    const { userId, category } = req.params;
    if (!userId || !category) {
      return res.status(400).json({ message: 'Missing userId or category' });
    }

    let results;
    switch (category) {
      case 'recipes':
        results = await Recipe.find({ user: userId }).sort({ createdAt: -1 });
        break;
      case 'prescriptions':
        results = await Prescription.find({ user: userId }).sort({ createdAt: -1 });
        break;
      case 'plans':
        results = await MealPlan.find({ user: userId }).sort({ createdAt: -1 });
        break;
      case 'drugChecker':
        // Implement fetching drug checker data if applicable
        results = []; // Placeholder empty array
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    res.json({ results });
  } catch (error) {
    console.error('Error fetching saved data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
