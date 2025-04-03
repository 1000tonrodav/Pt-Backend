// routes/cliente.js
const express = require('express');
const { getClientes } = require('../controllers/clienteController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getClientes);

module.exports = router;