# Home y About — Arcade Vault

**Estado:** Implementado
**Depende de:** SPEC 01 (mvp-visual)
**Fecha:** 2026-11-08
**Objetivo:** Añadir las pantallas Home (landing page) y About (acerca de + formulario de contacto) como componentes Next.js integrados en el sistema de routing por estado existente, y cambiar la ruta inicial de la app a `home`.

---

## Alcance

**Incluido:**
- Pantalla `Home` (`components/Home.tsx`): hero con silhouettes flotantes, sección "¿Por qué Arcade Vault?", mini-rail de juegos, stats strip, actividad en vivo, pricing/FAQ, CTA final
- Pantalla `About` (`components/About.tsx`): sección de misión, highlights, divider animado, formulario de contacto con estado local y terminal de éxito
- Componente auxiliar `FloatingSilhouettes` y `FeatureIcon` dentro de `Home.tsx`
- Componente auxiliar `HighlightIcon` dentro de `About.tsx`
- Hook `useReveal` (IntersectionObserver para animación `.reveal`) compartido entre Home y About
- Nuevos tokens CSS para Home y About en `app/globals.css` (clases `.home-*`, `.about-*`, `.feature-*`, `.mini-*`, `.stat-*`, `.activity-*`, `.contact-*`, `.terminal-success`, etc.)
- Extensión de `RouteName` en `lib/types.ts` para incluir `'home'` y `'about'`
- Actualización del router en `app/page.tsx`: ruta inicial cambiada a `{ name: 'home' }`, switch con dos nuevos cases
- Actualización de `components/Nav.tsx`: añadir links "INICIO" y "ACERCA" al menú desktop y al panel móvil

**No incluido:**
- Backend real para el formulario de contacto (es solo visual con estado React)
- Datos dinámicos en "Actividad en vivo" (hardcodeados como en el template)
- Datos "Top jugadores · hoy" dinámicos (hardcodeados como en el template)
- Nuevos juegos ni modificación de `lib/data.ts`
- Tests

---

## Modelo de datos

No se introducen nuevas interfaces. Solo se extiende el tipo existente:

```typescript
// lib/types.ts — modificación
export type RouteName = 'home' | 'biblioteca' | 'detalle' | 'player' | 'auth' | 'salon' | 'about';
```

Estado local del formulario en `About.tsx` (no persiste, no va a ningún store):

```typescript
interface ContactForm { name: string; email: string; msg: string; }
// Estados: form: ContactForm, sent: string | null, shake: boolean
```

---

## Plan de implementación

1. **Extender `RouteName` en `lib/types.ts`**
   - Añadir `'home'` y `'about'` al union type existente.

2. **Tokens CSS de Home y About en `app/globals.css`**
   - Añadir todos los bloques de estilos marcados como `/* ===== HOME PAGE ===== */` y `/* ===== ABOUT PAGE ===== */` del archivo `references/templates/home-about/styles.css`.
   - Incluir también: `.reveal`, `.mini-rail`, `.mini-card`, `.mini-cover`, `.mini-meta`, `.mini-title`, `.mini-cat`, `.home-stats`, `.stats-inner`, `.stat-block`, `.stat-n`, `.stat-u`, `.stat-s`, `.home-final`, `.final-title`, `.final-cta`, `.final-tag`, `.feature-grid`, `.feature-card`, `.home-silos`, `.silo`, `.activity-grid`, `.activity-card`, `.ticker`, `.tick-row`, `.top-list`, `.top-row`, `.pricing-grid`, `.price-card`, `.pricing-faq`, `.about-hero`, `.about-title`, `.about-mission`, `.highlight-row`, `.highlight`, `.about-divider`, `.div-bar`, `.div-pixels`, `.about-contact`, `.contact-grid`, `.contact-intro`, `.contact-tips`, `.contact-form`, `.terminal-success`, `.term-bar`, `.term-body`, `.btn.press`.
   - Añadir `@keyframes float`, `@keyframes bounce`, `@keyframes pxblink`, `@keyframes gridscroll` si no están ya definidos.

3. **Crear `components/Home.tsx`**
   - Marcar como `"use client"`.
   - Props: `{ navigate: (route: Route) => void }`.
   - Implementar hook `useReveal` con IntersectionObserver (threshold 0.12) que activa clase `in` en elementos `.reveal`.
   - Componente `FloatingSilhouettes`: 8 SVGs pixel-art con las siluetas del template (nave, fantasma, pac, cruz, UFO, moneda, corazón, D-pad).
   - Componente `FeatureIcon`: íconos SVG para GAMEPAD, FREE, TROPHY, ROCKET.
   - Secciones en orden: Hero → ¿Por qué? → Juegos disponibles → Stats → Actividad en vivo → Pricing → CTA final.
   - Mini-rail: importar `GAMES` de `@/lib/data` y renderizar `slice(0, 6)`.
   - Actividad en vivo y Top jugadores: datos hardcodeados inline igual que el template.
   - Todos los botones llaman a `navigate` con la ruta correspondiente.

4. **Crear `components/About.tsx`**
   - Marcar como `"use client"`.
   - Props: `{ navigate: (route: Route) => void }`.
   - Reusar `useReveal` (definirlo localmente o exportarlo desde un módulo compartido — preferible definirlo localmente en cada componente para no crear abstracciones prematuras).
   - Componente `HighlightIcon`: íconos SVG para HEART, BROWSER, PLANT.
   - Secciones en orden: About Hero → Divider animado → Contact.
   - Formulario con validación: si algún campo está vacío, activar `shake` y no enviar.
   - Al enviar correctamente: mostrar terminal de éxito con animación typewriter y botón "Enviar otro mensaje" que resetea el formulario.

5. **Actualizar `components/Nav.tsx`**
   - Añadir link "INICIO" que navega a `{ name: 'home' }`.
   - Añadir link "ACERCA" que navega a `{ name: 'about' }`.
   - Incluir ambos links también en el panel móvil.
   - El link activo sigue usando la clase `active` basada en `route.name`.

6. **Actualizar `app/page.tsx`**
   - Cambiar estado inicial de `{ name: 'biblioteca' }` a `{ name: 'home' }`.
   - Añadir casos al switch: `'home'` → `<Home navigate={navigate} />`, `'about'` → `<About navigate={navigate} />`.

---

## Criterios de aceptación

- [x] La app carga mostrando el Home (landing page) en lugar de la Biblioteca
- [x] Los links "INICIO" y "ACERCA" aparecen en la Nav desktop y en el panel móvil
- [x] El link activo en la Nav se resalta según la pantalla actual
- [x] El Home muestra las secciones: Hero, ¿Por qué?, Juegos, Stats, Actividad, Pricing, CTA final
- [x] Los SVG silhouettes aparecen flotando en el hero con animación `float`
- [x] El mini-rail muestra 6 tarjetas usando datos de `GAMES` y navega a Detalle al hacer click
- [x] Los botones del Home navegan correctamente: "EXPLORAR JUEGOS" → biblioteca, "CREAR CUENTA" → auth, "VER TODOS LOS JUEGOS →" → biblioteca, "INSERTAR MONEDA →" → biblioteca
- [x] Las secciones con clase `.reveal` aparecen con animación de entrada al hacer scroll
- [x] La pantalla About muestra la misión, los 3 highlights con iconos SVG y el divider animado
- [x] El formulario de contacto valida campos vacíos: agita el form y no envía
- [x] Al enviar el formulario con datos válidos, se muestra la terminal de éxito con el nombre del usuario
- [x] "Enviar otro mensaje" resetea el formulario y vuelve al estado vacío
- [x] El botón "VER SALÓN →" en Actividad en vivo navega a `{ name: 'salon' }`
- [x] El diseño es usable en pantallas de 375px (mobile-first)
- [x] `npm run lint` pasa sin errores nuevos (errores preexistentes del Spec 01 en GamePlayer.tsx y UserContext.tsx no forman parte de este spec)
- [x] `npm run build` completa sin errores de TypeScript

---

## Decisiones tomadas y descartadas

| Decisión | Elegida | Descartada | Motivo |
|---|---|---|---|
| Alcance | Home + About en un solo spec | Solo Home | Están acopladas en el mismo grupo de templates y el About es pequeño |
| Ruta inicial | `home` | Mantener `biblioteca` | El landing page es el punto de entrada natural de la app |
| Datos mini-rail | Importar `GAMES` de `lib/data.ts` | Hardcodear en componente | Evitar duplicación; los datos ya existen tipados |
| Formulario contacto | Estado local React (sin backend) | Integración con servicio externo | Consistencia con el resto del MVP visual; fuera del alcance actual |
| Hook `useReveal` | Definido localmente en cada componente | Extraer a `hooks/useReveal.ts` | No crear abstracciones prematuras para dos usos |

---

## Riesgos identificados

- **Colisión de clases CSS**: Varias clases del template (`field`, `btn`, etc.) ya están definidas en `globals.css` desde el Spec 01. Hay que verificar antes de añadir para evitar duplicados o sobreescrituras inesperadas.
- **`useReveal` y SSR**: El hook usa `document.querySelectorAll` que no existe en server-side. El componente debe estar marcado como `"use client"` para evitar errores en el render del servidor.
- **Animaciones `@keyframes` duplicadas**: `gridscroll`, `pulse` y `blink` pueden estar ya definidos en globals.css. Verificar antes de añadirlos nuevamente.
