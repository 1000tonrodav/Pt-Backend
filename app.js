const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/producto'));
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando' });
  });

// Manejo de errores
app.use(errorHandler);

module.exports = app;