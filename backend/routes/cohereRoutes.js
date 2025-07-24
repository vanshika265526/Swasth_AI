const { CohereClient } = require("cohere-ai");

const router = require("express").Router();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

router.post("/check", async (req, res) => {
  const { drugs } = req.body;

  if (!drugs || drugs.length < 2) {
    return res.status(400).json({ error: "Please provide at least two drug names." });
  }

  const prompt = `Are there any interactions between the following drugs? ${drugs.join(", ")}. Explain in simple terms.`;

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    const output = response.generations[0].text.trim();

    const isSafe = !/interact|dangerous|contraindicated|risk/i.test(output);

    res.json({
      isSafe,
      message: output,
    });
  } catch (error) {
    console.error("🔥 Cohere API Error:", error);
    res.status(500).json({ error: "Failed to fetch drug interaction info from Cohere." });
  }
});

module.exports = router;
