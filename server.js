const app = require('./app');
const { pool } = require('./config/db');
const PORT = process.env.PORT || 3000;

// Verificar conexión a DB antes de iniciar
pool.query('SELECT NOW()')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a DB:', err);
    process.exit(1);
  });

// Manejo de cierre elegante
process.on('SIGINT', () => {
  pool.end()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error al cerrar conexión DB:', err);
      process.exit(1);
    });
});