import { useMemo } from 'react'

function useRacha(destinos = []) {
  const resultado = useMemo(() => {
    function claveFecha(fecha) {
      const anio = fecha.getFullYear()
      const mes = String(fecha.getMonth() + 1).padStart(2, '0')
      const dia = String(fecha.getDate()).padStart(2, '0')
      return `${anio}-${mes}-${dia}`
    }

    // Reunir todas las fechas con actividad
    const diasConActividad = new Set()

    destinos.forEach(destino => {
      const fechaBase = destino.fechaActividad || destino.fechaRegistro
      if (!fechaBase) return

      const fecha = new Date(fechaBase)
      if (Number.isNaN(fecha.getTime())) return

      diasConActividad.add(claveFecha(fecha))
    })

    // Calcular racha hacia atrás desde hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const claveHoy = claveFecha(hoy)
    const activo = diasConActividad.has(claveHoy)

    let racha = 0
    let cursor = new Date(hoy)

    // Si hoy no tiene actividad, revisamos desde ayer
    if (!activo) {
      cursor.setDate(cursor.getDate() - 1)
    }

    while (diasConActividad.has(claveFecha(cursor))) {
      racha += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return { racha, activo, diasConActividad }
  }, [destinos])

  return resultado
}

export default useRacha