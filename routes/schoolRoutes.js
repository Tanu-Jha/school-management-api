const express = require('express');
const router = express.Router();

const { addSchool, listSchools } = require('../controllers/schoolController');
const {
    validateAddSchool,
    validateListSchools,
    handleValidationErrors,
} = require('../middleware/validators');

// POST /addSchool
router.post('/addSchool', validateAddSchool, handleValidationErrors, addSchool);

// GET /listSchools?latitude=XX&longitude=YY
router.get('/listSchools', validateListSchools, handleValidationErrors, listSchools);

module.exports = router;
