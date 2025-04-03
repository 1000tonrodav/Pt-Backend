const Joi = require('joi');

const registerSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  telefono: Joi.string().min(8).max(20).required(),
  direccion: Joi.string().min(5).max(200).required(),
  rol_id: Joi.number().integer().valid(1, 2).default(1) // 1=cliente, 2=admin
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  validateRegister: (data) => registerSchema.validate(data),
  validateLogin: (data) => loginSchema.validate(data)
};