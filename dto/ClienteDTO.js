class ClienteDTO {
    constructor({
      cliente_id,
      nombre,
      email,
      telefono,
      direccion,
      fecha_registro,
      activo,
      created_at,
      updated_at
    }) {
      this.id = cliente_id;
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
      this.direccion = direccion;
      this.fechaRegistro = fecha_registro;
      this.activo = activo;
      this.creadoEn = created_at;
      this.actualizadoEn = updated_at;
    }
  
    toJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        direccion: this.direccion,
        fechaRegistro: this.fechaRegistro,
        activo: this.activo
      };
    }
  }
  
  module.exports = ClienteDTO;