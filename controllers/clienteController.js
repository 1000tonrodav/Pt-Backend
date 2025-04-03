// controllers/clienteController.js
const pool = require('../config/db');

const getClientes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener clientes:', err.message);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

module.exports = { getClientes };