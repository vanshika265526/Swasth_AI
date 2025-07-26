console.log('=== prescriptionRoutes.js LOADED ===');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const prescriptionController = require('../controllers/prescriptionController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), prescriptionController.uploadPrescription);
router.post('/ask-ai', prescriptionController.askAI);

module.exports = router; 