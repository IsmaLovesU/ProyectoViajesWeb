# ✈️ ProyectoViajesWeb
Aplicación web Full Stack para registrar viajes personales, la cual se construyó con React + Express, 
siendo el proyecto final de Sistemas y tecnologías web.

### Enlace a Demo:
[viajes-frontend.vercel.app](https://proyecto-viajes-web-wa63.vercel.app)

### Enlace a API:
[viajes-backend.onrender.com]([https://viajes-backend-0mdv.onrender.com/api/items](https://viajes-backend-0mdv.onrender.com))

## Screenshots
 
### Modo claro — Vista principal
![Modo claro]()
 
### Modo oscuro — Vista principal
![Modo oscuro]()
 
### Panel de estadísticas con gráficas
![Estadística]()

## Stack tecnológico
 
| Parte | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.3.1 |
| Build tool | Vite | 5.4.x |
| Gráficas | Recharts | 3.8.1 |
| Backend | Express | 4.19.x |
| Base de datos | PostgreSQL | 15+ |
| ORM/Driver | pg (node-postgres) | 8.11.x |
| Deploy frontend | Vercel | — |
| Deploy backend | Render | — |
 
---

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
```

Edita el archivo `.env` con tus credenciales de PostgreSQL:
 
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://TU_USUARIO:TU_CONTRASENA@localhost:5432/viajes_db
```
Luego levantar el servidor:
 
```bash
npm run dev
```

### 3. Configurar el frontend
 
Abre otra terminal:
 
```bash
cd frontend
npm install
npm run dev
```
 
El frontend estará disponible en `http://localhost:5173`.

---
 
## 🪝 Hooks usados (Fase 4)
 
| Hook | Archivo | Qué hace |
|------|---------|----------|
| `useLocalStorage` | `src/hooks/useLocalStorage.js` | Envuelve `useState` + `useEffect` para sincronizar cualquier valor con `localStorage`. Soporta valores iniciales y JSON automático. |
| `useFetch` | `src/hooks/useFetch.js` | Fetch con estados `data / loading / error` + `AbortController` para cancelar peticiones al desmontar o cambiar URL. |
| `useAtajoTeclado` | `src/hooks/useAtajoTeclado.js` | Registra un listener `keydown` para un atajo específico con cleanup automático. Soporta `Ctrl`, ignora inputs opcionalmente. Reemplaza los `useEffect` manuales de `App.jsx` y `BotonTema.jsx`. |
| `useRacha` | `src/hooks/useRacha.js` | Hook de dominio: calcula la racha actual de días consecutivos con actividad (agregar, editar o visitar destinos). Devuelve `{ racha, activo, diasConActividad }`. |

## 👤 Sobre mí
 
| Campo | Valor |
|-------|-------|
| **Nombre** | _(tu nombre aquí)_ |
| **Carnet** | _(tu carnet aquí)_ |
| **Semestre** | _(tu semestre aquí)_ |
 
**Reflexión:** Antes de este proyecto no entendía por qué separar estado global de estado local, ni cuándo usar `useReducer` en lugar de `useState`. Construir la app me enseñó que los custom hooks no son magia: son simplemente funciones que encapsulan lógica con efectos, y que bien nombrados hacen el código mucho más legible y reutilizable.
 
## Fase 1 y 2: useContext

### Mis primeros destinos
![Captura de mis destinos](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/2709ef3557f53daf28273addc7b2ca3405173e7b/images/imagen_2026-05-31_000902564.png)

## Fase 3: useReducer, Recharts y optimizacion

### Graficas con Recharts

Las graficas aparecen al hacer click en el boton `Estadisticas` y reaccionan a los filtros activos.

- Actividad de los ultimos 7 dias.
- Distribucion de destinos por categoria.
- La grafica original es `Presupuesto promedio por categoria`. La elegi porque en una app de viajes no solo importa cuantos destinos hay, sino tambien que tipo de viaje requiere mayor inversion promedio.

### Capturas
![Estadistica1](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/4b1c2d541cfb19aa8d600b34d5d39c596f347bc2/images/Estadisticas1.png)
![Estadistica2](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/4b1c2d541cfb19aa8d600b34d5d39c596f347bc2/images/Estadisticas2.png)

## Optimizacion aplicada

Se usa `useMemo` para la lista filtrada, estadisticas generales y datos derivados para graficas.

Se usa `useCallback` para handlers que se pasan a componentes hijos, como editar, archivar, cambiar estado y actualizar filtros.

`TarjetaDestino` se exporta con `React.memo` para evitar renders innecesarios cuando sus props no cambian.

## Evidencia con React DevTools Profiler

### Antes:
![Antes](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/2709ef3557f53daf28273addc7b2ca3405173e7b/images/Antes.png)

### Despues:
![Despues](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/2709ef3557f53daf28273addc7b2ca3405173e7b/images/Despues.png)

Despues de memorizar la lista filtrada, estadisticas y datos de graficas, los calculos derivados solo se repiten cuando cambian `lista`, `filtroCategoria`, `filtroEstado` o `busqueda`. `TarjetaDestino` evita re-renderizar tarjetas cuyas props no cambiaron gracias a `React.memo` y handlers estables con `useCallback`.

### Mis 3 decisiones tecnicas

1. Estructura del reducer: separe las acciones de datos (`HIDRATAR`, `AGREGAR`, `ACTUALIZAR`, `ELIMINAR`) de las acciones de filtros (`FILTRAR`, `LIMPIAR_FILTROS`) y actividad (`REGISTRAR_ACTIVIDAD`).
2. Accion mas dificil: `CAMBIAR_ESTADO`, porque al volver un destino a pendiente debe permitir limpiar la puntuacion con `null` sin que el reducer conserve el valor anterior.
3. Grafica mas compleja: presupuesto promedio por categoria, porque transforma destinos filtrados, agrupa por categoria, descarta presupuestos vacios y calcula un promedio por grupo.



 ## Fases del proyecto
 
- **Fase 1** useState + useEffect + Backend Express base
- **Fase 2** useContext híbrido + useRef
- **Fase 3** useReducer + Gráficas
- **Fase 4** Custom hooks + Deploy
