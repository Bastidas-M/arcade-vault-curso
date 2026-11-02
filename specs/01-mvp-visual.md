# MVP Visual — Arcade Vault

**Estado:** Implementado
**Depende de:** —
**Fecha:** 2026-11-01
**Objetivo:** Implementar las 5 pantallas visuales del MVP (Biblioteca, Detalle, Reproductor, Auth, Salón de la Fama) como componentes Next.js con navegación por estado React y estilos migrados a Tailwind v4.

---

## Alcance

**Incluido:**
- Componente `Nav` (barra de navegación compartida, menú hamburguesa móvil)
- Pantalla `Library` (hero, búsqueda, filtros por categoría, grid de tarjetas con efecto tilt)
- Pantalla `GameDetail` (cover, info, stats, tabla de mejores puntuaciones)
- Pantalla `GamePlayer` (HUD animado, pantalla CRT, efectos de pausa, modal Game Over con formulario de nombre)
- Pantalla `Auth` (tabs Login/Registro, campos de formulario, botones sociales, acceso invitado)
- Pantalla `HallOfFame` (podio Top 3, tabla completa, pestañas por juego, fila destacada del usuario)
- Sistema de tokens visuales en `app/globals.css` (colores neón, tipografías retro, animaciones)
- Tipos TypeScript y datos mock en `lib/`
- React Context para estado de autenticación (persistido en localStorage)
- Routing por estado React en `app/page.tsx` (sin rutas de fichero Next.js)
- Diseño responsive (mobile-first)

**No incluido:**
- Implementación de ningún juego real
- Autenticación real con backend
- API routes ni base de datos
- Rutas de fichero Next.js (todo ocurre en `/`)
- Tests

---

## Modelo de datos

```typescript
// lib/types.ts
export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: 'ARCADE' | 'PUZZLE' | 'SHOOTER' | 'VERSUS';
  cover: string;     // clase CSS para el fondo de la portada
  color: 'cyan' | 'magenta' | 'yellow' | 'green';
  best: number;
  plays: string;
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;
}

export interface User {
  name: string;
}

export type RouteName = 'biblioteca' | 'detalle' | 'player' | 'auth' | 'salon';

export interface Route {
  name: RouteName;
  id?: string;
}
```

```typescript
// lib/data.ts
// Exporta: GAMES: Game[], CATS: string[], seededScores(seed, count): ScoreRow[]
// Datos idénticos a references/templates/data.jsx, tipados con las interfaces anteriores
```

```typescript
// context/UserContext.tsx
// Exporta: UserProvider, useUser()
// Estado: user: User | null
// Persistencia: localStorage key "av_user"
// Acciones: login(user), signOut()
```

---

## Plan de implementación

1. **Tokens Tailwind v4 en `app/globals.css`**
   - Añadir `@import "tailwindcss"` y bloque `@theme inline` con variables CSS:
     `--color-cyan`, `--color-magenta`, `--color-yellow`, `--color-green`, `--color-gold`,
     `--color-bg`, `--color-ink`, `--color-ink-dim`, `--color-ink-faint`, `--color-line`
   - Definir fuentes: `--font-pixel` (Press Start 2P), `--font-mono` (JetBrains Mono), `--font-body` (Courier Prime)
   - Añadir `@keyframes` para: `flicker`, `blink`, `fade-in`, `pulse`, `slide-in`
   - Configurar fondo global (gradiente oscuro) y textura noise en `:root` / `body`
   - Cargar fuentes Google en `app/layout.tsx`

2. **Datos mock y tipos en `lib/`**
   - Crear `lib/types.ts` con las interfaces del modelo de datos
   - Crear `lib/data.ts` con `GAMES`, `CATS`, `seededScores` tipados
   - Asegurar que el cover CSS (`cover-bricks`, `cover-tetro`, etc.) esté definido en globals.css

3. **React Context de autenticación**
   - Crear `context/UserContext.tsx` con `UserProvider` y hook `useUser`
   - Leer/escribir localStorage con `"av_user"` (JSON de `User | null`)
   - Envolver `{children}` en `app/layout.tsx` con `<UserProvider>`

4. **Componente `Nav`** (`components/Nav.tsx`)
   - Navbar fija con logo, links (Biblioteca, Salón de la Fama), contador de créditos
   - Botón "Iniciar Sesión" / nombre de usuario con sign-out
   - Menú hamburguesa + panel lateral móvil con backdrop
   - Recibe `route` y `navigate` como props

5. **Componente `Library`** (`components/Library.tsx`)
   - Sección hero con título flickering y subtítulo con cursor parpadeante
   - Barra de búsqueda y chips de filtro por categoría
   - Grid de `GameCard` con efecto tilt 3D al hover
   - Estado vacío cuando no hay resultados

6. **Componente `GameDetail`** (`components/GameDetail.tsx`)
   - Layout two-column: portada + info a la izquierda, tabla de scores a la derecha
   - Cover con gradiente, tags, título neón, descripción, stat-strip (partidas, mejor global, dificultad)
   - Botones "JUGAR AHORA" (pulso) y "VOLVER AL VAULT"
   - Tabla de leaderboard con top 3 resaltados con colores

7. **Componente `GamePlayer`** (`components/GamePlayer.tsx`)
   - HUD con jugador, puntuación (auto-incremento con `setInterval`), vidas, nivel
   - Botones de pausa, fin y salir
   - Pantalla CRT: `game-arena` con fondo grid, enemigos animados, nave del jugador
   - Overlay de pausa sobre la pantalla CRT
   - Modal "Game Over" con puntuación final, input de nombre (máx 10 chars), botón guardar, confirmación y acciones (jugar de nuevo / volver)

8. **Componente `Auth`** (`components/Auth.tsx`)
   - Card centrada con logo, tabs Login/Registro
   - Campos: usuario, correo (solo en registro), contraseña
   - Botón principal y botón "Jugar como invitado"
   - Divider y botones sociales (Google, GitHub) — solo visual, sin acción real
   - Al enviar: llama a `login` del contexto y navega a biblioteca

9. **Componente `HallOfFame`** (`components/HallOfFame.tsx`)
   - Header con título y subtítulo
   - Chips de pestañas por juego
   - Podio Top 3 (plata, oro, bronce) con nombre, score y fecha
   - Tabla completa con filas animadas (delay escalonado)
   - Fila resaltada del usuario autenticado (si existe)
   - Botón "VOLVER A LA BIBLIOTECA"

10. **Router principal en `app/page.tsx`**
    - Estado `route: Route` inicializado a `{ name: 'biblioteca' }`
    - Switch que renderiza el componente correspondiente
    - Función `navigate(route: Route)` pasada a todos los componentes
    - Scroll a top en cada cambio de ruta (`useEffect`)
    - Incluye `<Nav>` y `<footer>` siempre visibles

---

## Criterios de aceptación

- [ ] La navegación entre las 5 pantallas funciona sin recarga de página
- [ ] El scroll vuelve al inicio al cambiar de pantalla
- [ ] Los tokens de color neón (cyan, magenta, yellow) y las fuentes retro están definidos en `@theme` de `globals.css`
- [ ] La Biblioteca muestra los 8 juegos del mock; la búsqueda filtra en tiempo real; los chips de categoría funcionan
- [ ] El efecto tilt 3D de las GameCard funciona al hacer hover en desktop
- [ ] El Detalle muestra info completa y tabla de scores generada con `seededScores`
- [ ] El Reproductor incrementa la puntuación automáticamente cada ~220 ms cuando no está en pausa
- [ ] La pausa detiene el contador y muestra el overlay "EN PAUSA"
- [ ] El modal "Game Over" permite guardar el nombre y muestra confirmación "PUNTUACIÓN GUARDADA"
- [ ] La pantalla Auth alterna entre Login y Registro; el campo de email aparece solo en Registro
- [ ] "Jugar como invitado" navega a biblioteca sin autenticar
- [ ] El usuario autenticado aparece en Nav y en la fila destacada del Salón de la Fama
- [ ] El estado de usuario persiste al refrescar la página (localStorage)
- [ ] El diseño es usable en pantallas de 375px de ancho (mobile-first)
- [ ] `npm run lint` pasa sin errores
- [ ] `npm run build` completa sin errores de TypeScript

---

## Decisiones tomadas y descartadas

| Decisión | Elegida | Descartada | Motivo |
|---|---|---|---|
| Routing | Estado React en `page.tsx` | Rutas de fichero Next.js | Fidelidad al template; evita recarga entre pantallas para el MVP visual |
| CSS | Migración completa a Tailwind v4 | Copiar `styles.css` | Consistencia con el stack del proyecto; un solo sistema de diseño |
| Auth state | localStorage + React Context | Solo visual sin estado | El MVP debe mostrar el comportamiento condicional (Nav con nombre, fila en Hall of Fame) |
| Player screen | CRT animada + HUD + modal | Pantalla estática | La animación es parte del valor visual del MVP |
| Juegos | Ninguno implementado | — | Fuera de alcance explícito de este spec |

---

## Riesgos identificados

- **Animaciones CSS complejas**: Los efectos `flicker`, `crt-screen` y `pulse` del template usan técnicas CSS avanzadas. Requieren bloques `@keyframes` personalizados en globals.css; no son reemplazables 1:1 con utilidades Tailwind.
- **Fuentes Google en SSR**: `Press Start 2P` y `JetBrains Mono` deben cargarse vía `next/font/google` o el tag `<link>` en layout para evitar FOUC (flash of unstyled content).
- **`useEffect` / `localStorage` en Server Components**: El `UserContext` y cualquier lectura de localStorage deben vivir en Client Components (`"use client"`). Con Cache Components activo en Next.js 16.4, hay que ser cuidadoso en qué componentes se marcan como client.
