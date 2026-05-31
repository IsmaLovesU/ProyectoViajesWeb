import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import FormularioDestino from './components/Formulariodestino'
import ListaDestinos from './components/ListaDestinos'
import ModalEdicion from './components/ModalEdicion'
import BotonTema from './components/BotonTema'
import ControlModo from './components/ControlModo'
import PanelEstadisticas from './components/PanelEstadisticas'
import { CATEGORIAS_VIAJE } from './utils/categorias'
import { initialState, itemsReducer, TIPOS_ACCION } from './reducers/itemsReducer'
import { useStorage } from './contexts.jsx'
import './App.css'

function normalizarDestino(destino) {
  const ahora = new Date().toISOString()
  const fechaRegistro = destino.fechaRegistro ?? destino.fecha_registro ?? ahora

  return {
    id: destino.id,
    nombre: destino.nombre ?? destino.nombreLugar ?? '',
    categoriaId: destino.categoriaId ?? destino.categoria_id ?? 'ciudad',
    estado: destino.estado ?? 'pendiente',
    puntuacion: destino.puntuacion ?? null,
    fechaRegistro,
    fechaActividad: destino.fechaActividad ?? destino.fecha_actividad ?? fechaRegistro,
    notas: destino.notas ?? '',
    atributos: destino.atributos ?? {},
    activo: destino.activo ?? true
  }
}

function App() {
  const { obtenerItems, guardarItem, eliminarItem } = useStorage()
  const [estado, dispatch] = useReducer(itemsReducer, initialState)
  const [cargando, setCargando] = useState(true)
  const [destinoEnEdicion, setDestinoEnEdicion] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false)

  const { lista, filtroCategoria, filtroEstado, busqueda } = estado

  const inputNombreRef = useRef(null)
  const ultimoItemRef = useRef(null)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      try {
        const items = await obtenerItems()
        dispatch({
          type: TIPOS_ACCION.HIDRATAR,
          payload: items.map(normalizarDestino)
        })
      } catch (err) {
        console.error('Error al cargar destinos:', err)
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [obtenerItems])

  useEffect(() => {
    if (!mostrarFormulario) return

    const idTimeout = setTimeout(() => {
      inputNombreRef.current?.focus()
    }, 100)

    return () => clearTimeout(idTimeout)
  }, [mostrarFormulario])

  const destinosActivos = useMemo(
    () => lista.filter(destino => destino.activo !== false),
    [lista]
  )

  const listaFiltrada = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase()

    return destinosActivos.filter(destino => {
      const coincideCategoria =
        filtroCategoria === 'todas' || destino.categoriaId === filtroCategoria
      const coincideEstado =
        filtroEstado === 'todos' || destino.estado === filtroEstado
      const textoDestino = [
        destino.nombre,
        destino.notas,
        destino.atributos?.ciudad,
        destino.atributos?.pais
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return coincideCategoria && coincideEstado && textoDestino.includes(textoBusqueda)
    })
  }, [destinosActivos, filtroCategoria, filtroEstado, busqueda])

  const resumenGeneral = useMemo(() => destinosActivos.reduce(
    (resumen, destino) => {
      if (destino.estado === 'visitado') resumen.visitados += 1
      if (destino.estado === 'pendiente') resumen.pendientes += 1
      return resumen
    },
    { visitados: 0, pendientes: 0 }
  ), [destinosActivos])

  const estadisticas = useMemo(() => {
    const resumen = listaFiltrada.reduce(
      (acumulado, destino) => {
        const presupuesto = Number(destino.atributos?.presupuesto)

        acumulado.total += 1
        if (destino.estado === 'visitado') acumulado.visitados += 1
        if (destino.estado === 'pendiente') acumulado.pendientes += 1
        if (Number.isFinite(presupuesto) && presupuesto > 0) {
          acumulado.presupuestoTotal += presupuesto
          acumulado.destinosConPresupuesto += 1
        }

        return acumulado
      },
      {
        total: 0,
        visitados: 0,
        pendientes: 0,
        presupuestoTotal: 0,
        destinosConPresupuesto: 0
      }
    )

    return {
      ...resumen,
      presupuestoPromedio: resumen.destinosConPresupuesto > 0
        ? Math.round(resumen.presupuestoTotal / resumen.destinosConPresupuesto)
        : 0
    }
  }, [listaFiltrada])

  const hayFiltrosActivos =
    filtroCategoria !== 'todas' || filtroEstado !== 'todos' || busqueda.trim() !== ''

  const agregarDestino = useCallback(async (datosNuevo) => {
    try {
      const guardado = await guardarItem({
        ...datosNuevo,
        nombre: datosNuevo.nombreLugar
      })
      const destinoGuardado = normalizarDestino(guardado)

      dispatch({ type: TIPOS_ACCION.AGREGAR, payload: destinoGuardado })
      dispatch({
        type: TIPOS_ACCION.REGISTRAR_ACTIVIDAD,
        payload: {
          tipo: 'agregar',
          itemId: destinoGuardado.id,
          fecha: destinoGuardado.fechaActividad,
          descripcion: `Se agrego ${destinoGuardado.nombre}`
        }
      })

      setMostrarFormulario(false)

      setTimeout(() => {
        ultimoItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } catch (err) {
      console.error('Error al guardar destino:', err)
      throw err
    }
  }, [guardarItem])

  const guardarEdicion = useCallback(async (destinoEditado) => {
    const fechaActividad = new Date().toISOString()
    const destinoActualizado = normalizarDestino({
      ...destinoEditado,
      fechaActividad
    })

    try {
      await guardarItem(destinoActualizado)
      dispatch({ type: TIPOS_ACCION.ACTUALIZAR, payload: destinoActualizado })
      dispatch({
        type: TIPOS_ACCION.REGISTRAR_ACTIVIDAD,
        payload: {
          tipo: 'actualizar',
          itemId: destinoActualizado.id,
          fecha: fechaActividad,
          descripcion: `Se actualizo ${destinoActualizado.nombre}`
        }
      })
      setDestinoEnEdicion(null)
    } catch (err) {
      console.error('Error al editar destino:', err)
    }
  }, [guardarItem])

  const cambiarEstadoDestino = useCallback(async (destino) => {
    const nuevoEstado = destino.estado === 'visitado' ? 'pendiente' : 'visitado'
    const fechaActividad = new Date().toISOString()
    const destinoActualizado = {
      ...destino,
      estado: nuevoEstado,
      puntuacion: nuevoEstado === 'visitado' ? destino.puntuacion : null,
      fechaActividad
    }

    try {
      await guardarItem(destinoActualizado)
      dispatch({
        type: TIPOS_ACCION.CAMBIAR_ESTADO,
        payload: {
          id: destino.id,
          estado: nuevoEstado,
          puntuacion: destinoActualizado.puntuacion,
          fechaActividad
        }
      })
      dispatch({
        type: TIPOS_ACCION.REGISTRAR_ACTIVIDAD,
        payload: {
          tipo: 'cambiar_estado',
          itemId: destino.id,
          fecha: fechaActividad,
          descripcion: `${destino.nombre} paso a ${nuevoEstado}`
        }
      })
    } catch (err) {
      console.error('Error al cambiar estado:', err)
    }
  }, [guardarItem])

  const archivarDestino = useCallback(async (idDestino) => {
    const confirmado = window.confirm('Archivar este destino?')
    if (!confirmado) return

    const fechaActividad = new Date().toISOString()

    try {
      await eliminarItem(idDestino)
      dispatch({
        type: TIPOS_ACCION.ELIMINAR,
        payload: { id: idDestino, fechaActividad }
      })
      dispatch({
        type: TIPOS_ACCION.REGISTRAR_ACTIVIDAD,
        payload: {
          tipo: 'eliminar',
          itemId: idDestino,
          fecha: fechaActividad,
          descripcion: 'Se archivo un destino'
        }
      })
    } catch (err) {
      console.error('Error al archivar destino:', err)
    }
  }, [eliminarItem])

  const manejarBusqueda = useCallback((evento) => {
    dispatch({
      type: TIPOS_ACCION.FILTRAR,
      payload: { busqueda: evento.target.value }
    })
  }, [])

  const manejarFiltroCategoria = useCallback((evento) => {
    dispatch({
      type: TIPOS_ACCION.FILTRAR,
      payload: { filtroCategoria: evento.target.value }
    })
  }, [])

  const manejarFiltroEstado = useCallback((evento) => {
    dispatch({
      type: TIPOS_ACCION.FILTRAR,
      payload: { filtroEstado: evento.target.value }
    })
  }, [])

  const limpiarFiltros = useCallback(() => {
    dispatch({ type: TIPOS_ACCION.LIMPIAR_FILTROS })
  }, [])

  const cerrarFormularioDesdeFondo = useCallback((evento) => {
    if (evento.target === evento.currentTarget) setMostrarFormulario(false)
  }, [])

  const manejarAtajos = useCallback((e) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      setMostrarFormulario(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', manejarAtajos)
    return () => window.removeEventListener('keydown', manejarAtajos)
  }, [manejarAtajos])

  return (
    <div className="contenedor-app">
      <header className="cabecera">
        <div className="cabecera-texto">
          <h1>Mis Destinos ✈️</h1>
          <p className="subtitulo">
            Registro personal de viajes
            <span className="conteo-badge">{destinosActivos.length}</span>
          </p>
        </div>

        <div className="cabecera-controles">
          <BotonTema />
          <ControlModo />
          <div className="cabecera-stats">
            <span className="stat-chip stat-visitado">{resumenGeneral.visitados} visitados</span>
            <span className="stat-chip stat-pendiente">{resumenGeneral.pendientes} pendientes</span>
          </div>
          <button
            type="button"
            className="boton-primario"
            onClick={() => setMostrarFormulario(true)}
          >
            + Añadir
          </button>
        </div>
      </header>

      <main>
        {cargando ? (
          <p className="cargando">Cargando destinos...</p>
        ) : (
          <>
            <section className="barra-trabajo" aria-label="Controles de destinos">
              <button
                type="button"
                className={`boton-filtro ${mostrarFiltros || hayFiltrosActivos ? 'boton-filtro--activo' : ''}`}
                onClick={() => setMostrarFiltros(prev => !prev)}
              >
                {mostrarFiltros ? '▲' : '▼'} Filtro
              </button>

              <label className="campo-busqueda">
                <span>⌕</span>
                <input
                  type="search"
                  value={busqueda}
                  onChange={manejarBusqueda}
                  placeholder="Buscar destino"
                />
              </label>

              <button
                type="button"
                className={`boton-estadisticas ${mostrarEstadisticas ? 'boton-estadisticas--activo' : ''}`}
                onClick={() => setMostrarEstadisticas(prev => !prev)}
              >
                Estadisticas
              </button>
            </section>

            {mostrarFiltros && (
              <section className="panel-filtros" aria-label="Filtros">
                <div className="grupo-campo">
                  <label htmlFor="filtroCategoria">Categoria</label>
                  <select
                    id="filtroCategoria"
                    value={filtroCategoria}
                    onChange={manejarFiltroCategoria}
                  >
                    <option value="todas">Todas</option>
                    {CATEGORIAS_VIAJE.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.emoji} {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grupo-campo">
                  <label htmlFor="filtroEstado">Estado</label>
                  <select
                    id="filtroEstado"
                    value={filtroEstado}
                    onChange={manejarFiltroEstado}
                  >
                    <option value="todos">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="visitado">Visitado</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="boton-limpiar"
                  onClick={limpiarFiltros}
                  disabled={!hayFiltrosActivos}
                >
                  Limpiar filtros
                </button>
              </section>
            )}

            {mostrarEstadisticas && (
              <PanelEstadisticas
                destinos={listaFiltrada}
                estadisticas={estadisticas}
              />
            )}

            <ListaDestinos
              destinos={listaFiltrada}
              alEditar={setDestinoEnEdicion}
              alArchivar={archivarDestino}
              alCambiarEstado={cambiarEstadoDestino}
              ultimoItemRef={ultimoItemRef}
            />
          </>
        )}
      </main>

      {mostrarFormulario && (
        <div className="modal-fondo formulario-modal" onClick={cerrarFormularioDesdeFondo}>
          <div className="modal-caja formulario-modal-caja">
            <div className="modal-cabecera">
              <h2>Añadir destino</h2>
              <button
                type="button"
                className="boton-cerrar"
                onClick={() => setMostrarFormulario(false)}
              >
                ×
              </button>
            </div>
            <FormularioDestino
              alGuardar={agregarDestino}
              inputNombreRef={inputNombreRef}
              alCerrar={() => setMostrarFormulario(false)}
            />
          </div>
        </div>
      )}

      {destinoEnEdicion && (
        <ModalEdicion
          destino={destinoEnEdicion}
          alGuardar={guardarEdicion}
          alCerrar={() => setDestinoEnEdicion(null)}
        />
      )}
    </div>
  )
}

export default App
