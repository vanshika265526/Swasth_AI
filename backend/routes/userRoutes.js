const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/profile', authenticate, userController.createOrUpdateUser);
router.get('/profile', authenticate, userController.getUserProfile);

module.exports = router;
