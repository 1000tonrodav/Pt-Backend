const { query } = require('../config/db');
const ProductoDTO = require('../dto/ProductoDTO');

class ProductoService {
  static async getAll() {
    const result = await query(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.categoria_id
       WHERE p.disponible = true`
    );
    return result.rows.map(row => new ProductoDTO(row));
  }

  static async create(productoData) {
    const result = await query(
      `INSERT INTO productos (
        codigo_barras, nombre, descripcion, precio, precio_compra,
        stock, stock_minimo, categoria_id, imagen_url, unidad_medida
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        productoData.codigo_barras, productoData.nombre, productoData.descripcion,
        productoData.precio, productoData.precio_compra, productoData.stock,
        productoData.stock_minimo, productoData.categoria_id, productoData.imagen_url,
        productoData.unidad_medida
      ]
    );
    return new ProductoDTO(result.rows[0]);
  }

  // ... otros métodos (getById, update, delete)
}

module.exports = ProductoService;