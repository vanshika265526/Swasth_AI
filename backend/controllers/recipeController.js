const Recipe = require('../models/Recipe');
const axios = require('axios');

exports.createRecipe = async (req, res) => {
  // TODO: Implement create logic
  res.json({ message: 'Recipe created (stub)' });
};

exports.getRecipes = async (req, res) => {
  // TODO: Implement get all logic
  res.json({ message: 'Get all recipes (stub)' });
};

exports.getRecipeById = async (req, res) => {
  // TODO: Implement get by id logic
  res.json({ message: 'Get recipe by id (stub)' });
};

exports.updateRecipe = async (req, res) => {
  // TODO: Implement update logic
  res.json({ message: 'Update recipe (stub)' });
};

exports.deleteRecipe = async (req, res) => {
  // TODO: Implement delete logic
  res.json({ message: 'Delete recipe (stub)' });
};

exports.askAI = async (req, res) => {
  try {
    const { recipeText, preferences, symptomsText } = req.body;
    if (!recipeText) return res.status(400).json({ message: 'No recipe text provided' });
    // Build prompt for Gemini
    const formatPrompt = `You are a health-focused AI assistant.\n\nA user will give:\n1. A list of symptoms (e.g., fever, cold, headache)\n2. A list of foods they are currently consuming that may not be ideal for those symptoms (e.g., meat, alcohol, hot Cheetos)\n\nYour tasks:\n1. For each food item, suggest 5 to 7 healthier and symptom-friendly alternatives, especially considering dietary preferences like vegan, Jain, gluten-free, dairy-free, etc.\n2. Then, provide 5 to 7 practical health tips that are relevant across all the symptoms provided.\n\nAlways use this format, and adapt alternatives and tips based on the symptoms and food given by the user.`;
    const preferencesList = preferences && Array.isArray(preferences) ? preferences.join(', ') : '';
    const inputContent = `${formatPrompt}\n\nSymptoms: ${symptomsText || ''}\nPreferences: ${preferencesList}\nFood: ${recipeText}`;
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: inputContent }] }]
      }
    );
    res.json({ ai: geminiRes.data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
