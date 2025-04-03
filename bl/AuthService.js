const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const ClienteDTO = require('../dto/ClienteDTO');

class AuthService {
  static async register({ nombre, email, password, telefono, direccion, rol_id = 1 }) {
    // Validación básica de datos
    if (!nombre || !email || !password) {
      throw new Error('Datos incompletos para el registro');
    }

    // Verificar si el email ya existe
    const emailExists = await query(
      'SELECT 1 FROM clientes WHERE email = $1', 
      [email]
    );
    
    if (emailExists.rows.length > 0) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      await query('BEGIN');
      
      // 1. Insertar en clientes
      const clienteResult = await query(
        `INSERT INTO clientes (nombre, email, telefono, direccion)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [nombre, email, telefono, direccion]
      );
      
      // 2. Insertar en usuarios (con rol_id)
      await query(
        `INSERT INTO usuarios (cliente_id, password_hash, rol_id)
         VALUES ($1, $2, $3)`,
        [clienteResult.rows[0].cliente_id, hashedPassword, rol_id]
      );
      
      await query('COMMIT');
      
      return new ClienteDTO({
        ...clienteResult.rows[0],
        rol_id // Incluimos el rol_id en el DTO
      });
      
    } catch (error) {
      await query('ROLLBACK');
      console.error('Error en registro:', error);
      throw new Error('Error al registrar el usuario');
    }
  }

  static async login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Buscar usuario con join entre clientes y usuarios
    const result = await query(
      `SELECT 
         c.cliente_id, c.nombre, c.email, c.telefono, c.direccion,
         u.password_hash, u.rol_id, u.bloqueado
       FROM clientes c
       JOIN usuarios u ON c.cliente_id = u.cliente_id
       WHERE c.email = $1 AND c.activo = true`,
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Credenciales inválidas');
    }

    const user = result.rows[0];
    
    // Verificar si la cuenta está bloqueada
    if (user.bloqueado) {
      throw new Error('Cuenta bloqueada. Contacte al administrador.');
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        cliente_id: user.cliente_id,
        email: user.email,
        rol_id: user.rol_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Preparar respuesta
    return {
      user: new ClienteDTO({
        cliente_id: user.cliente_id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
        rol_id: user.rol_id
      }),
      token,
      rol_id: user.rol_id
    };
  }

  // Método adicional para verificar si un usuario es admin
  static async isAdmin(cliente_id) {
    const result = await query(
      'SELECT rol_id FROM usuarios WHERE cliente_id = $1',
      [cliente_id]
    );
    return result.rows.length > 0 && result.rows[0].rol_id === 2;
  }
}

module.exports = AuthService;