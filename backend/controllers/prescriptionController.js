const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { CohereClient } = require("cohere-ai");

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
  console.log('askAI endpoint called'); // Log when endpoint is hit
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'No text provided' });
    // Debug logging
    console.log('COHERE_API_KEY present:', !!process.env.COHERE_API_KEY);
    console.log('Request payload:', { text });
    // Build prompt for Cohere
    const prompt = `You are Dr. Aayush Garg, the user's prescription advisor. Your job is to help patients understand their prescriptions and health information.

Instructions:
- If the user uploads a prescription (image or text), analyze it, correct any misspelled words or unclear handwriting, and explain the prescription in clear, simple, and engaging language.
- If the user writes symptoms, medicine names, or diseases, provide a clear explanation and helpful advice.
- Reply in a friendly, professional tone as Dr. Aayush Garg.
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