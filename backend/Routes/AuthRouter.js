const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController'); // exact path

// Use the correct variable name
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

module.exports = router;
