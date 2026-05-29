import { Router } from 'express'
import { bd } from '../db/conexion.js'
import { v4 as generarUUID } from 'uuid'

const rutasDestinos = Router()

// GET /api/items — devuelve todos los destinos activos
rutasDestinos.get('/', async (req, res) => {
  try {
    const resultado = await bd.query(
      'SELECT * FROM destinos WHERE activo = 1 ORDER BY fecha_registro DESC'
    )

    // parsear atributos JSON antes de enviar
    const destinos = resultado.rows.map(fila => ({
      ...fila,
      atributos: fila.atributos ? JSON.parse(fila.atributos) : {},
      activo: fila.activo === 1
    }))

    res.json(destinos)
  } catch (error) {
    console.error('Error al obtener destinos:', error)
    res.status(500).json({ error: 'No se pudieron obtener los destinos' })
  }
})

// POST /api/items — crear nuevo destino
rutasDestinos.post('/', async (req, res) => {
  const {
    nombre, categoriaId, estado, puntuacion,
    fechaRegistro, fechaActividad, notas, atributos
  } = req.body

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' })
  }

  const idNuevo = generarUUID()

  try {
    await bd.query(
      `INSERT INTO destinos
        (id, nombre, categoria_id, estado, puntuacion, fecha_registro, fecha_actividad, notas, atributos, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)`,
      [
        idNuevo,
        nombre,
        categoriaId || null,
        estado || 'pendiente',
        puntuacion ?? null,
        fechaRegistro || new Date().toISOString(),
        fechaActividad || new Date().toISOString(),
        notas || '',
        atributos ? JSON.stringify(atributos) : '{}'
      ]
    )

    res.status(201).json({ id: idNuevo, mensaje: 'Destino creado' })
  } catch (error) {
    console.error('Error al crear destino:', error)
    res.status(500).json({ error: 'No se pudo crear el destino' })
  }
})

// PUT /api/items/:id — actualizar destino
rutasDestinos.put('/:id', async (req, res) => {
  const { id } = req.params
  const {
    nombre, categoriaId, estado, puntuacion,
    fechaActividad, notas, atributos
  } = req.body

  try {
    const resultado = await bd.query(
      `UPDATE destinos SET
        nombre = COALESCE($1, nombre),
        categoria_id = COALESCE($2, categoria_id),
        estado = COALESCE($3, estado),
        puntuacion = $4,
        fecha_actividad = $5,
        notas = COALESCE($6, notas),
        atributos = COALESCE($7, atributos)
       WHERE id = $8`,
      [
        nombre || null,
        categoriaId || null,
        estado || null,
        puntuacion ?? null,
        fechaActividad || new Date().toISOString(),
        notas || null,
        atributos ? JSON.stringify(atributos) : null,
        id
      ]
    )

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' })
    }

    res.json({ mensaje: 'Destino actualizado' })
  } catch (error) {
    console.error('Error al actualizar destino:', error)
    res.status(500).json({ error: 'No se pudo actualizar el destino' })
  }
})

// DELETE /api/items/:id — archivar destino (activo = 0)
rutasDestinos.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const resultado = await bd.query(
      'UPDATE destinos SET activo = 0 WHERE id = $1',
      [id]
    )

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' })
    }

    res.json({ mensaje: 'Destino archivado' })
  } catch (error) {
    console.error('Error al archivar destino:', error)
    res.status(500).json({ error: 'No se pudo archivar el destino' })
  }
})

// POST /api/items/:id/registro — crear registro de actividad diaria
rutasDestinos.post('/:id/registro', async (req, res) => {
  const { id } = req.params
  const { fecha, valor, notas } = req.body

  if (!valor) {
    return res.status(400).json({ error: 'El valor del registro es obligatorio' })
  }

  try {
    // verificar que el destino existe
    const destino = await bd.query('SELECT id FROM destinos WHERE id = $1', [id])
    if (destino.rows.length === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' })
    }

    const idRegistro = generarUUID()

    await bd.query(
      'INSERT INTO registros (id, item_id, fecha, valor, notas) VALUES ($1, $2, $3, $4, $5)',
      [
        idRegistro,
        id,
        fecha || new Date().toISOString(),
        Number(valor),
        notas || ''
      ]
    )

    // actualizar fecha_actividad del destino
    await bd.query(
      'UPDATE destinos SET fecha_actividad = $1 WHERE id = $2',
      [new Date().toISOString(), id]
    )

    res.status(201).json({ id: idRegistro, mensaje: 'Registro creado' })
  } catch (error) {
    console.error('Error al crear registro:', error)
    res.status(500).json({ error: 'No se pudo crear el registro' })
  }
})

export default rutasDestinos