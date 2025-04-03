const AuthService = require('../bl/AuthService');
const { validateRegister, validateLogin } = require('../validators/authValidator');

class AuthController {
  static async register(req, res, next) {
    try {
      // Validar los datos de entrada
      const { error } = validateRegister(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      // Preparar datos para registro (asignar rol por defecto)
      const registrationData = {
        ...req.body,
        rol_id: req.body.rol_id || 1 // Asigna cliente (1) por defecto si no se especifica
      };

      // Verificar si se está intentando crear un admin sin permisos
      if (registrationData.rol_id === 2) {
        // Asumimos que el middleware isAdmin agrega req.esAdmin
        if (!req.esAdmin) { 
          return res.status(403).json({ 
            error: 'No tienes permisos para crear cuentas de administrador' 
          });
        }
      }

      // Registrar el usuario
      const cliente = await AuthService.register(registrationData);
      
      // Excluir información sensible en la respuesta
      const responseData = {
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email,
        rol_id: cliente.rol_id
      };

      res.status(201).json(responseData);

    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      // Validar datos de login
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      // Autenticar usuario
      const authData = await AuthService.login(req.body.email, req.body.password);
      
      // Formatear respuesta
      const response = {
        user: {
          id: authData.user.id,
          nombre: authData.user.nombre,
          email: authData.user.email,
          rol_id: authData.rol_id
        },
        token: authData.token
      };

      res.json(response);
    } catch (error) {
      // Manejar errores específicos
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }
      next(error);
    }
  }
}

module.exports = AuthController;