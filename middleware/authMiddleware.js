const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // Verificar si existe token
  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso no autorizado. Token no proporcionado.' 
    });
  }

  try {
    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener información completa del usuario
    const userResult = await query(
      `SELECT u.cliente_id, u.rol_id, c.email 
       FROM usuarios u
       JOIN clientes c ON u.cliente_id = c.cliente_id
       WHERE u.cliente_id = $1`,
      [decoded.cliente_id]
    );
    
    // Verificar si el usuario existe
    if (userResult.rows.length === 0) {
      return res.status(403).json({ 
        error: 'Acceso denegado. Usuario no encontrado.' 
      });
    }
    
    const user = userResult.rows[0];
    
    // Adjuntar información del usuario al request
    req.user = {
      cliente_id: user.cliente_id,
      email: user.email,
      rol_id: user.rol_id
    };
    
    // Flag para identificar admins (rol_id = 2)
    req.esAdmin = (user.rol_id === 2);
    
    next();
  } catch (error) {
    // Manejar diferentes tipos de errores
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Sesión expirada. Por favor inicie sesión nuevamente.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido. Autenticación fallida.' 
      });
    }
    
    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      error: 'Error interno durante la autenticación.' 
    });
  }
};

module.exports = authenticate;