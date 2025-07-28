console.log('=== THIS IS THE REAL BACKEND INDEX.JS ===');
require('dotenv').config();
require('dotenv').config({ path: './backend/.env' });
const geminiApiKey = process.env.GEMINI_API_KEY;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swasthai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const path = require('path');
const fs = require('fs');
const mealPlannerRoutes = require('./routes/mealPlannerRoutes');
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));
const cohereRoutes = require('./routes/cohereRoutes');
app.use('/api/cohere', cohereRoutes);

app.use('/api/user', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/mealplanner', mealPlannerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
