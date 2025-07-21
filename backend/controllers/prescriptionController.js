const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Prepare file for Python OCR service
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    // Call Python OCR microservice
    const ocrRes = await axios.post('http://localhost:5001/ocr/', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    // Remove file after upload
    fs.unlinkSync(req.file.path);
    res.json({ text: ocrRes.data.text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.askAI = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'No text provided' });
    // Call Google Gemini API (replace with your actual API call)
    const geminiRes = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
      contents: [{ parts: [{ text: `You are a friendly doctor. Please explain this prescription in simple terms: ${text}` }] }]
    });
    res.json({ ai: geminiRes.data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 