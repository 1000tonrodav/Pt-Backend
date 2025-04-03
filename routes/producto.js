const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const ProductoController = require('../controllers/productoController');

router.get('/', ProductoController.getAll);
router.post('/', authenticate, isAdmin, ProductoController.create);

module.exports = router;