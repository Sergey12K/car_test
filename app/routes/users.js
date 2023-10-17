const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { User } = require('../models');

const app = express()

router.get('/', (req, res) => {
    res.send('<h2>Пользователи</h2>');
});


module.exports = router;