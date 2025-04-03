class ProductoDTO {
    constructor({
      producto_id,
      codigo_barras,
      nombre,
      descripcion,
      precio,
      precio_compra,
      stock,
      stock_minimo,
      categoria_id,
      disponible,
      imagen_url,
      unidad_medida,
      created_at,
      updated_at,
      categoria_nombre
    }) {
      this.id = producto_id;
      this.codigoBarras = codigo_barras;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = precio;
      this.precioCompra = precio_compra;
      this.stock = stock;
      this.stockMinimo = stock_minimo;
      this.categoriaId = categoria_id;
      this.disponible = disponible;
      this.imagenUrl = imagen_url;
      this.unidadMedida = unidad_medida;
      this.creadoEn = created_at;
      this.actualizadoEn = updated_at;
      this.categoriaNombre = categoria_nombre;
    }
  }
  
  module.exports = ProductoDTO;