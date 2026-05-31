import { useState } from 'react'
import { CATEGORIAS_VIAJE } from '../utils/categorias'
import './ModalEdicion.css'

// modal para editar un destino ya guardado
function ModalEdicion({ destino, alGuardar, alCerrar }) {
  // inicializar el form con los datos actuales del destino
  const [campos, setCampos] = useState({
    nombre: destino.nombre,
    categoriaId: destino.categoriaId,
    estado: destino.estado,
    puntuacion: destino.puntuacion ?? '',
    notas: destino.notas || '',
    pais: destino.atributos?.pais || '',
    ciudad: destino.atributos?.ciudad || '',
    transporte: destino.atributos?.transporte || '',
    clima: destino.atributos?.clima || '',
    presupuesto: destino.atributos?.presupuesto ?? '',
    duracionDias: destino.atributos?.duracionDias ?? ''
  })

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setCampos(prev => ({ ...prev, [name]: value }))
  }

  function manejarGuardar(evento) {
    evento.preventDefault()

    if (!campos.nombre.trim()) {
      alert('El nombre no puede estar vacío')
      return
    }

    const destinoActualizado = {
      ...destino,
      nombre: campos.nombre.trim(),
      categoriaId: campos.categoriaId,
      estado: campos.estado,
      puntuacion: campos.puntuacion !== '' ? Number(campos.puntuacion) : null,
      notas: campos.notas.trim(),
      atributos: {
        pais: campos.pais,
        ciudad: campos.ciudad,
        transporte: campos.transporte,
        clima: campos.clima,
        presupuesto: campos.presupuesto !== '' ? Number(campos.presupuesto) : null,
        duracionDias: campos.duracionDias !== '' ? Number(campos.duracionDias) : null
      }
    }

    alGuardar(destinoActualizado)
  }

  // cerrar al hacer click fuera del modal
  function manejarClickFondo(evento) {
    if (evento.target === evento.currentTarget) alCerrar()
  }

  return (
    <div className="modal-fondo" onClick={manejarClickFondo}>
      <div className="modal-caja">
        <div className="modal-cabecera">
          <h2>Editar destino</h2>
          <button className="boton-cerrar" onClick={alCerrar}>✕</button>
        </div>

        <form onSubmit={manejarGuardar} className="modal-formulario">
          <div className="grupo-campo">
            <label>Nombre del lugar *</label>
            <input type="text" name="nombre" value={campos.nombre} onChange={manejarCambio} />
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-campo">
              <label>Categoría</label>
              <select name="categoriaId" value={campos.categoriaId} onChange={manejarCambio}>
                {CATEGORIAS_VIAJE.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="grupo-campo">
              <label>Estado</label>
              <select name="estado" value={campos.estado} onChange={manejarCambio}>
                <option value="pendiente">⏳ Pendiente</option>
                <option value="visitado">✅ Visitado</option>
              </select>
            </div>
          </div>

          {campos.estado === 'visitado' && (
            <div className="grupo-campo">
              <label>Puntuación (0-10)</label>
              <input type="number" name="puntuacion" value={campos.puntuacion}
                onChange={manejarCambio} min="0" max="10" />
            </div>
          )}

          <div className="fila-dos-columnas">
            <div className="grupo-campo">
              <label>País</label>
              <input type="text" name="pais" value={campos.pais} onChange={manejarCambio} />
            </div>
            <div className="grupo-campo">
              <label>Ciudad</label>
              <input type="text" name="ciudad" value={campos.ciudad} onChange={manejarCambio} />
            </div>
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-campo">
              <label>Transporte</label>
              <select name="transporte" value={campos.transporte} onChange={manejarCambio}>
                <option value="">Sin especificar</option>
                <option value="avion">✈️ Avión</option>
                <option value="bus">🚌 Bus</option>
                <option value="auto">🚗 Auto</option>
                <option value="barco">🚢 Barco</option>
              </select>
            </div>
            <div className="grupo-campo">
              <label>Clima</label>
              <select name="clima" value={campos.clima} onChange={manejarCambio}>
                <option value="">Sin especificar</option>
                <option value="tropical">🌴 Tropical</option>
                <option value="frio">❄️ Frío</option>
                <option value="templado">🌤️ Templado</option>
                <option value="desertico">🏜️ Desértico</option>
              </select>
            </div>
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-campo">
              <label>Presupuesto (Q)</label>
              <input type="number" name="presupuesto" value={campos.presupuesto}
                onChange={manejarCambio} min="0" />
            </div>
            <div className="grupo-campo">
              <label>Duración (días)</label>
              <input type="number" name="duracionDias" value={campos.duracionDias}
                onChange={manejarCambio} min="1" />
            </div>
          </div>

          <div className="grupo-campo">
            <label>Notas</label>
            <textarea name="notas" value={campos.notas} onChange={manejarCambio} rows={3} />
          </div>

          <div className="modal-acciones">
            <button type="button" className="boton-cancelar" onClick={alCerrar}>Cancelar</button>
            <button type="submit" className="boton-guardar">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEdicion
