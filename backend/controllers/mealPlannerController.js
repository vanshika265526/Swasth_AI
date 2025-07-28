require('dotenv').config();
/* console.log('GEMINI API Key:', process.env.GEMINI_API_KEY?.slice(0, 10), '...'); */
const MealPlan = require('../models/MealPlan');
const axios = require('axios');

// Helper function to capitalize first letter
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate and save meal plan based on symptoms input
exports.generateMealPlan = async (req, res) => {
  try {
    const { userId, symptoms } = req.body;
/* console.log('Received generateMealPlan request with symptoms:', symptoms); */

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim() === '') {
      return res.status(400).json({ message: 'symptoms must be a non-empty string' });
    }

    const prompt = `You are a health-focused AI assistant. Generate a personalized weekly meal plan based on the following symptoms or disease: ${symptoms}. Provide meals for each day of the week with breakfast, lunch, and dinner. Format the response as raw JSON with a "weekly_meal_plan" object containing "symptom" and "meals" with days and meals. Do not include any extra explanation or markdown.`;

    let aiResponse;
    try {
      aiResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": process.env.GEMINI_API_KEY
          }
        }
      );
      // Log minimal info to reduce terminal clutter
/* console.log('Gemini API response received'); */
    } catch (apiErr) {
      // Log the full error response
      console.error('AI API call failed:', apiErr.response?.data || apiErr.message);

      const fallbackPlan = [
        {
          day: 'Monday',
          meals: [
            { time: 'Breakfast', dish: 'Oatmeal' },
            { time: 'Lunch', dish: 'Grilled Chicken Salad' },
            { time: 'Dinner', dish: 'Steamed Vegetables' }
          ]
        },
        {
          day: 'Tuesday',
          meals: [
            { time: 'Breakfast', dish: 'Fruit Smoothie' },
            { time: 'Lunch', dish: 'Turkey Sandwich' },
            { time: 'Dinner', dish: 'Baked Fish' }
          ]
        }
      ];

      const mealPlanData = { symptoms, weeklyPlan: fallbackPlan, user: userId || 'guest' };
      const mealPlan = new MealPlan(mealPlanData);
      await mealPlan.save();

      return res.json({ message: 'Meal plan generated with fallback due to AI API error', mealPlan });
    }

    let plainTextPlan = '';
    let weeklyPlan = [];
    try {
      let contentText = aiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      contentText = contentText.trim();
      // Remove markdown code block delimiters if present
      if (contentText.startsWith('```')) {
        contentText = contentText.replace(/^```.*\n/, '');
      }
      if (contentText.endsWith('```')) {
        contentText = contentText.replace(/\n?```$/, '');
      }
      // Try to parse JSON
      let jsonData = null;
      try {
        jsonData = JSON.parse(contentText);
      } catch (jsonErr) {
        // Not JSON, treat as plain text
      }
      if (jsonData) {
        if (jsonData.weekly_meal_plan && jsonData.weekly_meal_plan.meals) {
          // Type 1: weekly_meal_plan with meals object
          const plan = jsonData.weekly_meal_plan;
          plainTextPlan = `Symptoms: ${plan.symptom || symptoms}\n\n`;
          weeklyPlan = Object.entries(plan.meals).map(([day, meals]) => ({
            day,
            meals: Object.entries(meals).map(([mealTime, dish]) => ({
              time: capitalize(mealTime),
              dish,
            })),
          }));
          for (const [day, meals] of Object.entries(plan.meals)) {
            plainTextPlan += `${day}:\n`;
            for (const [mealTime, dish] of Object.entries(meals)) {
              plainTextPlan += `${capitalize(mealTime)}: ${dish}\n`;
            }
            plainTextPlan += '\n';
          }
        } else if (jsonData.meal_plan && jsonData.meal_plan.days) {
          // Type 2: meal_plan with days array
          const plan = jsonData.meal_plan;
          plainTextPlan = `Focus: ${plan.focus || ''}\nRecommendations: ${plan.recommendations || ''}\n\n`;
          weeklyPlan = plan.days.map(dayObj => ({
            day: dayObj.day,
            meals: Object.entries(dayObj.meals).map(([mealTime, dish]) => ({
              time: capitalize(mealTime),
              dish,
            })),
          }));
          for (const dayObj of plan.days) {
            plainTextPlan += `${dayObj.day}:\n`;
            for (const [mealTime, dish] of Object.entries(dayObj.meals)) {
              plainTextPlan += `${capitalize(mealTime)}: ${dish}\n`;
            }
            plainTextPlan += '\n';
          }
        } else if (jsonData.meal_plan && typeof jsonData.meal_plan === 'object') {
          // Type 3: meal_plan with day keys
          const plan = jsonData.meal_plan;
          plainTextPlan = `Symptoms: ${jsonData.symptoms || symptoms}\n\n`;
          weeklyPlan = Object.entries(plan).map(([day, meals]) => ({
            day,
            meals: Object.entries(meals).map(([mealTime, dish]) => ({
              time: capitalize(mealTime),
              dish,
            })),
          }));
          for (const [day, meals] of Object.entries(plan)) {
            plainTextPlan += `${day}:\n`;
            for (const [mealTime, dish] of Object.entries(meals)) {
              plainTextPlan += `${capitalize(mealTime)}: ${dish}\n`;
            }
            plainTextPlan += '\n';
          }
        } else if (jsonData.mealPlan && typeof jsonData.mealPlan === 'object') {
          // Type 4: mealPlan with day keys
          const plan = jsonData.mealPlan;
          plainTextPlan = `Symptoms: ${jsonData.symptoms || symptoms}\n\n`;
          weeklyPlan = Object.entries(plan).map(([day, meals]) => ({
            day,
            meals: Object.entries(meals).map(([mealTime, dish]) => ({
              time: capitalize(mealTime),
              dish,
            })),
          }));
          for (const [day, meals] of Object.entries(plan)) {
            plainTextPlan += `${day}:\n`;
            for (const [mealTime, dish] of Object.entries(meals)) {
              plainTextPlan += `${capitalize(mealTime)}: ${dish}\n`;
            }
            plainTextPlan += '\n';
          }
        } else {
          // Unknown JSON format, fallback to raw text
          plainTextPlan = contentText;
          weeklyPlan = [];
        }
      } else {
        // Not JSON, treat as plain text
        plainTextPlan = contentText;
        weeklyPlan = [];
      }
    } catch (err) {
      console.error('Failed to parse AI response:', err.message);
      plainTextPlan = `Symptoms: ${symptoms}\nMonday:\nBreakfast: Oatmeal\nLunch: Grilled Chicken Salad\nDinner: Steamed Vegetables\nTuesday:\nBreakfast: Fruit Smoothie\nLunch: Turkey Sandwich\nDinner: Baked Fish`;
      weeklyPlan = [
        {
          day: 'Monday',
          meals: [
            { time: 'Breakfast', dish: 'Oatmeal' },
            { time: 'Lunch', dish: 'Grilled Chicken Salad' },
            { time: 'Dinner', dish: 'Steamed Vegetables' }
          ]
        },
        {
          day: 'Tuesday',
          meals: [
            { time: 'Breakfast', dish: 'Fruit Smoothie' },
            { time: 'Lunch', dish: 'Turkey Sandwich' },
            { time: 'Dinner', dish: 'Baked Fish' }
          ]
        }
      ];
    }
      
      // Remove markdown code block delimiters if present

    const mealPlanData = {
      symptoms,
      plainTextPlan,
      weeklyPlan,
      user: userId || 'guest',
    };

    const mealPlan = new MealPlan(mealPlanData);
    await mealPlan.save();

/* console.log('Plain text meal plan sent to frontend:', plainTextPlan); */

    res.json({ message: 'Meal plan generated and saved', mealPlan, plainTextPlan, geminiRaw: aiResponse.data });
  } catch (err) {
    console.error('Server error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Get saved meal plans for a user
exports.getSavedMealPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = { user: userId || 'guest' };
    const mealPlans = await MealPlan.find(query).sort({ createdAt: -1 });
    res.json({ mealPlans });
  } catch (err) {
    console.error('Failed to fetch meal plans:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
