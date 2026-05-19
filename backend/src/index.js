import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { inicializarBD } from './db/conexion.js'
import rutasDestinos from './routes/destinos.js'

dotenv.config()

const app = express()
const PUERTO = process.env.PORT || 3000

app.use(express.json())

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}))

// Rutas de la API
app.use('/api/items', rutasDestinos)

// Verificación rápida de que el server responde
app.get('/', (req, res) => {
  res.json({ mensaje: 'API viajes activa', endpoints: [
    'GET /api/items',
    'POST /api/items',
    'PUT /api/items/:id',
    'DELETE /api/items/:id',
    'POST /api/items/:id/registro'
  ]})
})

// Inicializar BD y levantar el servidor
inicializarBD()
  .then(() => {
    app.listen(PUERTO, () => {
      console.log(`Servidor en http://localhost:${PUERTO}`)
    })
  })
  .catch(error => {
    console.error('No se pudo inicializar la BD, abortando:', error)
    process.exit(1)
  })