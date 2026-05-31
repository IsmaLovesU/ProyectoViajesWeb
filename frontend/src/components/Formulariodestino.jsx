import { useState } from 'react'
import { CATEGORIAS_VIAJE } from '../utils/categorias'
import './FormularioDestino.css'

// valores vacíos del formulario — se reusan al limpiar después de guardar
const FORM_VACIO = {
  nombreLugar: '',
  categoriaId: 'ciudad',
  estado: 'pendiente',
  puntuacion: '',
  notas: '',
  pais: '',
  ciudad: '',
  transporte: '',
  clima: '',
  presupuesto: '',
  duracionDias: ''
}

function FormularioDestino({ alGuardar, inputNombreRef }) {
  const [campos, setCampos] = useState(FORM_VACIO)
  const [mostrarAtributos, setMostrarAtributos] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setCampos(prev => ({ ...prev, [name]: value }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    if (!campos.nombreLugar.trim()) {
      alert('El nombre del lugar es obligatorio')
      return
    }

    // El componente NO sabe de dónde vienen los datos, solo entrega los valores y App los pasa al contexto
    alGuardar({
      nombreLugar: campos.nombreLugar.trim(),
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
    })
 
    setCampos(FORM_VACIO)
    setMostrarAtributos(false)
  }

  return (
    <section className="seccion-formulario">
      <h2 className="titulo-seccion">Agregar destino</h2>
 
      <form onSubmit={manejarEnvio} className="formulario-destino">
 
        <div className="grupo-campo">
          <label htmlFor="nombreLugar">Nombre del lugar *</label>
          <input
            id="nombreLugar"
            ref={inputNombreRef}
            type="text"
            name="nombreLugar"
            value={campos.nombreLugar}
            onChange={manejarCambio}
            placeholder="ej: Machu Picchu, Ciudad de México..."
            autoComplete="off"
          />
        </div>
 
        <div className="fila-dos-columnas">
          <div className="grupo-campo">
            <label htmlFor="categoriaId">Categoría</label>
            <select
              id="categoriaId"
              name="categoriaId"
              value={campos.categoriaId}
              onChange={manejarCambio}
            >
              {CATEGORIAS_VIAJE.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.nombre}
                </option>
              ))}
            </select>
          </div>
 
          <div className="grupo-campo">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={campos.estado}
              onChange={manejarCambio}
            >
              <option value="pendiente">⏳ Pendiente</option>
              <option value="visitado">✅ Visitado</option>
            </select>
          </div>
        </div>
  
        {campos.estado === 'visitado' && (
          <div className="grupo-campo">
            <label htmlFor="puntuacion">Puntuación (0-10)</label>
            <input
              id="puntuacion"
              type="number"
              name="puntuacion"
              value={campos.puntuacion}
              onChange={manejarCambio}
              min="0"
              max="10"
              placeholder="¿Qué puntuación le darías al viaje?"
            />
          </div>
        )}
 
        <div className="grupo-campo">
          <label htmlFor="notas">Notas</label>
          <textarea
            id="notas"
            name="notas"
            value={campos.notas}
            onChange={manejarCambio}
            placeholder="Deja notas sobre tu viaje aquí..."
            rows={3}
          />
        </div>
 
        {/* atributos opcionales — se expanden */}
        <button
          type="button"
          className="boton-expandir"
          onClick={() => setMostrarAtributos(prev => !prev)}
        >
          {mostrarAtributos ? '▲' : '▼'} Detalles del viaje (opcional)
        </button>
 
        {mostrarAtributos && (
          <div className="atributos-extra">
            <div className="fila-dos-columnas">
              <div className="grupo-campo">
                <label htmlFor="pais">País</label>
                <input
                  id="pais"
                  type="text"
                  name="pais"
                  value={campos.pais}
                  onChange={manejarCambio}
                  placeholder="ej: Suiza"
                />
              </div>
              <div className="grupo-campo">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  name="ciudad"
                  value={campos.ciudad}
                  onChange={manejarCambio}
                  placeholder="ej: Berna"
                />
              </div>
            </div>
 
            <div className="fila-dos-columnas">
              <div className="grupo-campo">
                <label htmlFor="transporte">Transporte</label>
                <select id="transporte" name="transporte" value={campos.transporte} onChange={manejarCambio}>
                  <option value="">Sin especificar</option>
                  <option value="avion">✈️ Avión</option>
                  <option value="bus">🚌 Bus</option>
                  <option value="auto">🚗 Auto</option>
                  <option value="barco">🚢 Barco</option>
                </select>
              </div>
              <div className="grupo-campo">
                <label htmlFor="clima">Clima</label>
                <select id="clima" name="clima" value={campos.clima} onChange={manejarCambio}>
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
                <label htmlFor="presupuesto">Presupuesto (Q)</label>
                <input
                  id="presupuesto"
                  type="number"
                  name="presupuesto"
                  value={campos.presupuesto}
                  onChange={manejarCambio}
                  placeholder="ej: 6767"
                  min="0"
                />
              </div>
              <div className="grupo-campo">
                <label htmlFor="duracionDias">Duración (días)</label>
                <input
                  id="duracionDias"
                  type="number"
                  name="duracionDias"
                  value={campos.duracionDias}
                  onChange={manejarCambio}
                  placeholder="ej: 6"
                  min="1"
                />
              </div>
            </div>
          </div>
        )}
 
        <button type="submit" className="boton-guardar">
          Guardar destino
        </button>
      </form>
    </section>
  )
}
 
export default FormularioDestino