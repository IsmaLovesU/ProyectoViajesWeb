import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// pool de conexiones a PostgreSQL
const { Pool } = pg
export const bd = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl requerido en Render.com, opcional en local
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
})

// crear las tablas si no existen todavía
export async function inicializarBD() {
  const cliente = await bd.connect()

  try {
    console.log('Conectando a PostgreSQL...')

    await cliente.query(`
      CREATE TABLE IF NOT EXISTS destinos (
        id           TEXT PRIMARY KEY,
        nombre       TEXT NOT NULL,
        categoria_id TEXT,
        estado       TEXT,
        puntuacion   REAL,
        fecha_registro  TEXT,
        fecha_actividad TEXT,
        notas        TEXT,
        atributos    TEXT,
        activo       INTEGER DEFAULT 1
      )
    `)

    await cliente.query(`
      CREATE TABLE IF NOT EXISTS registros (
        id       TEXT PRIMARY KEY,
        item_id  TEXT NOT NULL,
        fecha    TEXT,
        valor    REAL,
        notas    TEXT,
        FOREIGN KEY (item_id) REFERENCES destinos(id)
      )
    `)

    console.log('Tablas listas ✓')
  } catch (error) {
    console.error('Error al inicializar la BD:', error)
    throw error
  } finally {
    cliente.release()
  }
}