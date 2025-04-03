// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    // Respuesta al cliente
    res.status(500).json({
      success: false,
      message: err.message || 'Error interno del servidor',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  module.exports = errorHandler;
