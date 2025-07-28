console.log('=== cohereRoutes.js LOADED ===');
const router = require("express").Router();
const { checkDrugInteraction } = require("../controllers/cohereController");

router.post("/check", checkDrugInteraction);

module.exports = router;
