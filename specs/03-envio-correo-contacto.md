# Envío de Correo — Formulario de Contacto

**Estado:** Implementado
**Depende de:** SPEC 02 (home-y-about)
**Fecha:** 2026-11-08
**Objetivo:** Conectar el formulario de contacto del About con Resend para que los mensajes lleguen realmente a marino249907@gmail.com.

---

## Alcance

**Incluido:**
- Instalar el paquete `resend` como dependencia de producción
- Crear la API route `app/api/contact/route.ts` (POST) que usa Resend para enviar el correo
- Modificar `components/About.tsx`: el `onSubmit` hace `fetch` a la nueva route en lugar de llamar a `setSent` directamente
- Nuevo estado `error: string | null` en el formulario para mostrar mensajes de fallo al usuario
- Variable de entorno `RESEND_API_KEY` documentada en `.env.local` (creado si no existe, excluido del repo)

**No incluido:**
- Verificación de dominio propio en Resend (se usa `onboarding@resend.dev`)
- Rate limiting o protección contra spam en la API route
- Plantilla HTML enriquecida para el correo (se usa texto plano)
- Tests
- Reintento automático en caso de error

---

## Modelo de datos

No se introducen interfaces nuevas. La API route recibe y valida el body existente del formulario:

```typescript
// Payload que llega al POST /api/contact
interface ContactPayload {
  name: string;
  email: string;
  msg: string;
}
```

Estado adicional en `About.tsx` (local, no persiste):

```typescript
// Añadir a los estados ya existentes
const [error, setError] = useState<string | null>(null);
const [sending, setSending] = useState(false);
```

---

## Plan de implementación

1. **Instalar `resend`**
   ```bash
   npm install resend
   ```

2. **Crear `.env.local`** (si no existe) con:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   ```
   - Verificar que `.gitignore` ya incluye `.env.local` (el scaffold de Next.js lo hace por defecto).

3. **Crear `app/api/contact/route.ts`**
   - Importar `Resend` de `resend`.
   - Instanciar con `new Resend(process.env.RESEND_API_KEY)`.
   - Parsear y validar el body: si falta `name`, `email` o `msg`, devolver `400`.
   - Llamar a `resend.emails.send(...)`:
     - `from`: `"Arcade Vault <onboarding@resend.dev>"`
     - `to`: `["marino249907@gmail.com"]`
     - `subject`: `"[Arcade Vault] Mensaje de {name}"`
     - `text`: cuerpo con nombre, correo del usuario y mensaje
   - Si Resend responde con error, devolver `500` con `{ error: "..." }`.
   - Si tiene éxito, devolver `200` con `{ ok: true }`.

4. **Modificar `components/About.tsx`**
   - Añadir estados `sending` y `error`.
   - Reemplazar el cuerpo de `onSubmit` (después de la validación de campos vacíos):
     - Poner `setSending(true)` y `setError(null)`.
     - `fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })`.
     - Si la respuesta no es `ok`: `setError("Error al enviar. Por favor intenta de nuevo.")`, `setSending(false)`.
     - Si es `ok`: `setSent(form.name.trim())`, `setSending(false)`.
   - Deshabilitar el botón de envío mientras `sending` sea `true` (añadir `disabled={sending}`).
   - Mostrar `error` justo antes del botón si no es `null`:
     ```tsx
     {error && <p className="contact-error pixel neon-red">{error}</p>}
     ```

5. **Añadir estilo `.contact-error`** en `app/globals.css`:
   ```css
   .contact-error { font-size: 0.75rem; margin-bottom: 0.5rem; }
   ```

---

## Criterios de aceptación

- [ ] `npm install resend` completa sin errores y `resend` aparece en `package.json` bajo `dependencies`
- [ ] `.env.local` existe con `RESEND_API_KEY` y `.gitignore` lo excluye del repositorio
- [ ] `POST /api/contact` con body válido devuelve `200` y el correo llega a marino249907@gmail.com
- [ ] `POST /api/contact` con body incompleto devuelve `400`
- [ ] `POST /api/contact` con `RESEND_API_KEY` inválida devuelve `500`
- [ ] Al enviar el formulario con datos válidos, se muestra la terminal de éxito (comportamiento idéntico al Spec 02)
- [ ] Durante el envío (`sending: true`), el botón "ENVIAR MENSAJE" queda deshabilitado
- [ ] Si el envío falla, aparece el mensaje de error encima del botón y los campos conservan sus valores
- [ ] `npm run lint` pasa sin errores nuevos
- [ ] `npm run build` completa sin errores de TypeScript

---

## Decisiones tomadas y descartadas

| Decisión | Elegida | Descartada | Motivo |
|---|---|---|---|
| Remitente | `onboarding@resend.dev` | Dominio propio | No requiere configuración de DNS; suficiente para MVP |
| Destinatario | `marino249907@gmail.com` | Otra dirección | Es el correo del propietario del proyecto |
| Error en envío | Mostrar mensaje y conservar datos | Mostrar terminal de éxito siempre | Mantener confianza con el usuario |
| Ubicación API key | `.env.local` | Hardcodeada | Seguridad básica: nunca exponer keys en el repositorio |
| Rate limiting | Fuera de alcance | Implementar en esta spec | Complejidad añadida innecesaria para el MVP |
| Plantilla HTML | Texto plano | HTML enriquecido | Menor complejidad; el contenido es funcional sin diseño |

---

## Riesgos identificados

- **Sandbox de Resend**: Con `onboarding@resend.dev` como remitente, Resend solo permite enviar a la dirección verificada en la cuenta (marino249907@gmail.com). Si en el futuro se quiere enviar a otras direcciones habrá que verificar un dominio propio.
- **API key ausente en producción**: Si se despliega sin configurar `RESEND_API_KEY` en las variables de entorno del hosting, todos los envíos fallarán con 500. Documentarlo en el README al hacer deploy.
