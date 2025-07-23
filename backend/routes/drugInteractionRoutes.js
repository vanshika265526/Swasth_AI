const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ Step 1: Define whitelisted safe combos 
//Using it for defining some very common cases- will take less time and make task easier for common drugs 
const safeCombos = [
  ['paracetamol', 'cetirizine'],
  ['pantoprazole', 'ibuprofen'],
  ['paracetamol', 'pantoprazole'],
  ['omeprazole', 'ibuprofen'],
  ['loratadine', 'paracetamol'],
  ['cetirizine', 'ranitidine']
].map(pair => pair.map(name => name.toLowerCase()).sort().join('+'));

const getRxcui = async (drugName) => {
  const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}`;
  const response = await axios.get(url);
  return response.data.idGroup.rxnormId?.[0] || null;
};

const getInteractions = async (rxcuiList) => {
  const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuiList.join('+')}`;
  const response = await axios.get(url);
  return response.data;
};

router.post('/check', async (req, res) => {
  const { drugs } = req.body;

  if (!drugs || drugs.length < 2) {
    return res.status(400).json({ error: 'Please provide at least two drug names.' });
  }

  try {
    // ✅ Step 2: Whitelist check before fetching interaction data
    const userCombo = [...drugs].map(d => d.toLowerCase()).sort().join('+');
    if (safeCombos.includes(userCombo)) {
      return res.json({
        isSafe: true,
        message: `✅ This combination is commonly used and considered safe: ${drugs.join(', ')}.`,
        whitelisted: true,
      });
    }

    const rxcuis = await Promise.all(drugs.map(getRxcui));
    if (rxcuis.includes(null)) {
      return res.status(404).json({ error: 'One or more drugs not found in RxNorm database.' });
    }

    const interactionData = await getInteractions(rxcuis);
    const interactionGroups = interactionData.fullInteractionTypeGroup || [];
    let interactionDescriptions = [];

    interactionGroups.forEach(group => {
      group.fullInteractionType?.forEach(type => {
        type.interactionPair?.forEach(pair => {
          const drugA = pair.interactionConcept[0]?.minConceptItem?.name || 'Unknown Drug A';
          const drugB = pair.interactionConcept[1]?.minConceptItem?.name || 'Unknown Drug B';
          const desc = pair.description || 'No description provided.';
          interactionDescriptions.push(`⚠️ ${drugA} + ${drugB}: ${desc}`);
        });
      });
    });

    if (interactionDescriptions.length > 0) {
      return res.json({
        isSafe: false,
        messages: interactionDescriptions
      });
    }

    res.json({
      isSafe: true,
      message: `✅ No known interactions found between: ${drugs.join(', ')}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
