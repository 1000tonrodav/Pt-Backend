const ProductoService = require('../bl/ProductoService');
const { validateProducto } = require('../validators/productoValidator');

class ProductoController {
  static async getAll(req, res, next) {
    try {
      const productos = await ProductoService.getAll();
      res.json(productos);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { error } = validateProducto(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const producto = await ProductoService.create(req.body);
      res.status(201).json(producto);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductoController;