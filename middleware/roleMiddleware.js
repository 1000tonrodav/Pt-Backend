const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.rol_id !== requiredRole) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }
      next();
    };
  };
  
  module.exports = {
    isAdmin: checkRole(2),
    isCliente: checkRole(1)
  };