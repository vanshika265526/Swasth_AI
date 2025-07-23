require('dotenv').config();
const express = require('express');
const drugInteractionRoutes = require('./routes/drugInteractionRoutes');

const cors = require('cors');
const connectDB = require('./connection/Mongodb'); // <-- Import the connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Connect to MongoDB
connectDB();

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const path = require('path');
const fs = require('fs');
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/user', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/drugs', drugInteractionRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 