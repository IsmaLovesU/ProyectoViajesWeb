# ✈️ ProyectoViajesWeb
Aplicación web Full Stack para registrar viajes personales, la cual se construye con React + Express, 
siendo el proyecto final de Sistemas y tecnologías web.

## Cómo correr el proyecto localmente
 
### Requisitos previos
- Node.js 18+
- PostgreSQL instalado y corriendo
  
### 1. Clonar el repositorio
```bash
git clone https://github.com/usuarioDeGitHub/ProyectoViajesWeb.git
cd ProyectoViajesWeb
```
 
### 2. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
# editar .env
npm run dev
```
## Fase 2: useContext

 ## Mis primeros destinos
![Captura de mis destinos]()

## Fase 3: useReducer, Recharts y optimizacion

### Graficas con Recharts

Las graficas aparecen al hacer click en el boton `Estadisticas` y reaccionan a los filtros activos.

- Actividad de los ultimos 7 dias.
- Distribucion de destinos por categoria.
- La grafica original es `Presupuesto promedio por categoria`. La elegi porque en una app de viajes no solo importa cuantos destinos hay, sino tambien que tipo de viaje requiere mayor inversion promedio.

### Optimizacion aplicada

Se usa `useMemo` para la lista filtrada, estadisticas generales y datos derivados para graficas.

Se usa `useCallback` para handlers que se pasan a componentes hijos, como editar, archivar, cambiar estado y actualizar filtros.

`TarjetaDestino` se exporta con `React.memo` para evitar renders innecesarios cuando sus props no cambian.

### Evidencia con React DevTools Profiler

### Antes:
![Captura de mis destinos]()

### Despues:
![Captura de mis destinos]()

### Mis 3 decisiones tecnicas

1. Estructura del reducer: separe las acciones de datos (`HIDRATAR`, `AGREGAR`, `ACTUALIZAR`, `ELIMINAR`) de las acciones de filtros (`FILTRAR`, `LIMPIAR_FILTROS`) y actividad (`REGISTRAR_ACTIVIDAD`).
2. Accion mas dificil: `CAMBIAR_ESTADO`, porque al volver un destino a pendiente debe permitir limpiar la puntuacion con `null` sin que el reducer conserve el valor anterior.
3. Grafica mas compleja: presupuesto promedio por categoria, porque transforma destinos filtrados, agrupa por categoria, descarta presupuestos vacios y calcula un promedio por grupo.

 ## Fases del proyecto
 
- **Fase 1** useState + useEffect + Backend Express base
- **Fase 2** useContext híbrido + useRef
- **Fase 3** useReducer + Gráficas
- **Fase 4** Custom hooks + Deploy
