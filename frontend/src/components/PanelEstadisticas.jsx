import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { CATEGORIAS_VIAJE } from '../utils/categorias'
import './PanelEstadisticas.css'

const formatoDia = new Intl.DateTimeFormat('es-GT', {
  weekday: 'short',
  day: '2-digit'
})

function claveFecha(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

function obtenerPresupuesto(destino) {
  const presupuesto = Number(destino.atributos?.presupuesto)
  return Number.isFinite(presupuesto) && presupuesto > 0 ? presupuesto : null
}

function formatearQuetzales(valor) {
  return `Q${Number(valor || 0).toLocaleString('es-GT')}`
}

function GraficaVacia({ texto }) {
  return <div className="grafica-vacia">{texto}</div>
}

function PanelEstadisticas({ destinos = [], estadisticas = {} }) {
  const datosActividad = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const ultimosDias = Array.from({ length: 7 }, (_, indice) => {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - (6 - indice))
      return {
        clave: claveFecha(fecha),
        dia: formatoDia.format(fecha),
        actividad: 0
      }
    })

    const porDia = new Map(ultimosDias.map(dia => [dia.clave, dia]))

    destinos.forEach(destino => {
      const fechaBase = destino.fechaActividad || destino.fechaRegistro
      if (!fechaBase) return

      const fecha = new Date(fechaBase)
      if (Number.isNaN(fecha.getTime())) return

      const registro = porDia.get(claveFecha(fecha))
      if (registro) registro.actividad += 1
    })

    return ultimosDias
  }, [destinos])

  const datosCategorias = useMemo(() => (
    CATEGORIAS_VIAJE
      .map(categoria => ({
        categoria: categoria.nombre,
        cantidad: destinos.filter(destino => destino.categoriaId === categoria.id).length,
        color: categoria.color
      }))
      .filter(categoria => categoria.cantidad > 0)
  ), [destinos])

  const datosPresupuesto = useMemo(() => (
    CATEGORIAS_VIAJE
      .map(categoria => {
        const presupuestos = destinos
          .filter(destino => destino.categoriaId === categoria.id)
          .map(obtenerPresupuesto)
          .filter(Boolean)

        const total = presupuestos.reduce((suma, valor) => suma + valor, 0)

        return {
          categoria: categoria.nombre,
          promedio: presupuestos.length > 0 ? Math.round(total / presupuestos.length) : 0,
          cantidad: presupuestos.length,
          color: categoria.color
        }
      })
      .filter(categoria => categoria.cantidad > 0)
  ), [destinos])

  return (
    <section className="panel-estadisticas" aria-label="Estadisticas de destinos">
      <div className="estadisticas-resumen">
        <div className="resumen-dato">
          <span>Total filtrado</span>
          <strong>{estadisticas.total ?? 0}</strong>
        </div>
        <div className="resumen-dato">
          <span>Visitados</span>
          <strong>{estadisticas.visitados ?? 0}</strong>
        </div>
        <div className="resumen-dato">
          <span>Promedio</span>
          <strong>{formatearQuetzales(estadisticas.presupuestoPromedio ?? 0)}</strong>
        </div>
      </div>

      <div className="grilla-estadisticas">
        <article className="grafica-panel">
          <h2>Actividad ultimos 7 dias</h2>
          <div className="grafica-contenedor">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosActividad} margin={{ top: 12, right: 18, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actividad"
                  name="Actividad"
                  stroke="#3b6fd4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="grafica-panel">
          <h2>Destinos por categoria</h2>
          <div className="grafica-contenedor">
            {datosCategorias.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={datosCategorias}
                    dataKey="cantidad"
                    nameKey="categoria"
                    outerRadius={78}
                    innerRadius={42}
                    paddingAngle={3}
                  >
                    {datosCategorias.map(categoria => (
                      <Cell key={categoria.categoria} fill={categoria.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <GraficaVacia texto="No hay categorias en este filtro" />
            )}
          </div>
        </article>

        <article className="grafica-panel grafica-panel--ancha">
          <h2>Presupuesto promedio por categoria</h2>
          <div className="grafica-contenedor">
            {datosPresupuesto.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosPresupuesto} margin={{ top: 12, right: 18, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="categoria" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatearQuetzales} tickLine={false} axisLine={false} />
                  <Tooltip formatter={valor => [formatearQuetzales(valor), 'Presupuesto promedio']} />
                  <Legend />
                  <Bar dataKey="promedio" name="Presupuesto promedio" radius={[6, 6, 0, 0]}>
                    {datosPresupuesto.map(categoria => (
                      <Cell key={categoria.categoria} fill={categoria.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <GraficaVacia texto="No hay presupuestos en este filtro" />
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

export default PanelEstadisticas
