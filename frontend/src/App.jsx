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
