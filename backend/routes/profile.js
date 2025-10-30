const express = require("express");
const { getProfile, createProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/', getProfile);
router.post('/', createProfile);
router.put('/:id', updateProfile);

module.exports = router;
