const Recipe = require('../models/Recipe');
const axios = require('axios');
const { CohereClient } = require("cohere-ai");

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
    const formatPrompt = `You are a health-focused AI assistant.  A user will give: 1. A list of symptoms (e.g., fever, cold, headache) 2. A list of foods they are currently consuming that may not be ideal for those symptoms (e.g., meat, alcohol, hot Cheetos)  Your tasks: 1. For each food item, suggest 5 to 7 healthier and symptom-friendly alternatives, especially considering dietary preferences like vegan, Jain, gluten-free, dairy-free, etc. 2. Then, provide 5 to 7 practical health tips that are relevant across all the symptoms provided.  Always use this format, and adapt alternatives and tips based on the symptoms and food given by the user.`;
    const preferencesList = preferences && Array.isArray(preferences) ? preferences.join(', ') : '';
    const inputContent = `${formatPrompt}  Symptoms: ${symptomsText || ''} Preferences: ${preferencesList} Food: ${recipeText}`;
    // const geminiRes = await axios.post(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    //   {
    //     contents: [{ parts: [{ text: inputContent }] }]
    //   }
    // );
    // Debug logging
    console.log('COHERE_API_KEY present:', !!process.env.COHERE_API_KEY);
    const text = `${symptomsText || ''} ${preferencesList ? 'Preferences: ' + preferencesList : ''} Food: ${recipeText}`;
    console.log('Request payload:', { text });

    // Build prompt for Cohere
    const prompt = `Hey, You are  Swasth AI, your medical advisor and helper. Instructions for your reply:- Always start with the above introduction.- If the user describes a symptom, disease, or problem (like fever), give:  - A short, clear summary of what it is  - The most likely causes   - The best medicines or treatments (with examples)   - What to do and what to avoid (in bullet points)   - When to see a doctor - If the user uploads a prescription, explain it in bullet points (not a paragraph), correcting any errors. - Never use \  or special symbols for spacing—use only natural language and clear formatting. - Never give generic disclaimers or say \"consult your doctor\" unless absolutely necessary. - Always be friendly, confident, and helpful, as a famous doctor would be. - Only output bullet points or numbered lists, never a long paragraph. Here is the user's input (prescription, symptoms, or question): 
     Instructions:
- If the user uploads a prescription (image or text), analyze it, correct any misspelled words or unclear handwriting, and explain the prescription in clear, simple, and engaging language.
- If the user writes symptoms, medicine names, or diseases, provide a clear explanation and helpful advice.
- Reply in a friendly, professional tone as Swasth AI, your health assistant.
- Present information in bullet points or numbered lists for clarity, not in a single long paragraph.
- Do NOT use \\n or special symbols for spacing; use natural language and clear formatting.
- Only include relevant, patient-friendly information. Avoid unnecessary disclaimers or generic statements.

Here is the user's input (prescription, symptoms, or question):
${text}`;
    // Call Cohere API
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });
    const output = response.generations[0].text.trim();
    res.json({ ai: output });
  } catch (err) {
    // Enhanced error logging
    console.error('askAI error (full object):', err);
    if (err.response) {
      console.error('Cohere API error response:', err.response.data);
      res.status(500).json({ message: err.message, cohereError: err.response.data });
    } else {
      console.error('Cohere API error:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
}; 
