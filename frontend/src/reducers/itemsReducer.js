export const initialState = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
  historial: []
}

export const TIPOS_ACCION = {
  HIDRATAR: 'HIDRATAR',
  AGREGAR: 'AGREGAR',
  ELIMINAR: 'ELIMINAR',
  CAMBIAR_ESTADO: 'CAMBIAR_ESTADO',
  ACTUALIZAR: 'ACTUALIZAR',
  FILTRAR: 'FILTRAR',
  LIMPIAR_FILTROS: 'LIMPIAR_FILTROS',
  REGISTRAR_ACTIVIDAD: 'REGISTRAR_ACTIVIDAD'
}

const filtrosIniciales = {
  filtroCategoria: initialState.filtroCategoria,
  filtroEstado: initialState.filtroEstado,
  busqueda: initialState.busqueda
}

export function itemsReducer(state, action) {
  switch (action.type) {
    case TIPOS_ACCION.HIDRATAR:
      return {
        ...state,
        lista: Array.isArray(action.payload) ? action.payload : []
      }

    case TIPOS_ACCION.AGREGAR:
      return {
        ...state,
        lista: [action.payload, ...state.lista]
      }

    case TIPOS_ACCION.ELIMINAR:
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                activo: false,
                fechaActividad: action.payload.fechaActividad ?? item.fechaActividad
              }
            : item
        )
      }

    case TIPOS_ACCION.CAMBIAR_ESTADO:
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                estado: action.payload.estado ?? item.estado,
                puntuacion: action.payload.puntuacion ?? item.puntuacion,
                fechaActividad: action.payload.fechaActividad ?? item.fechaActividad
              }
            : item
        )
      }

    case TIPOS_ACCION.ACTUALIZAR:
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      }

    case TIPOS_ACCION.FILTRAR:
      return {
        ...state,
        ...action.payload
      }

    case TIPOS_ACCION.LIMPIAR_FILTROS:
      return {
        ...state,
        ...filtrosIniciales
      }

    case TIPOS_ACCION.REGISTRAR_ACTIVIDAD:
      return {
        ...state,
        historial: [action.payload, ...state.historial]
      }

    default:
      return state
  }
}
