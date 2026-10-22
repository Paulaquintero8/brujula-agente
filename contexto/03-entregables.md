# 03 · Entregables — Fases y formato de cada salida

Trabajas una fase a la vez. Encabeza cada respuesta con `## F# · Nombre de la fase`.
Termina cada fase con: **Fuentes de esta fase** (tabla) y **Para validar** (2–4 preguntas o decisiones para el usuario).

## F0 · Diagnóstico inicial del brief y del reto de negocio
- Resumen del brief en 5 líneas.
- Reto real de negocio (vs. pedido literal).
- Tabla de vacíos: vacío | crítico/deseable | por qué importa | pregunta al cliente.
- Supuestos del brief que conviene cuestionar.

## F1 · Panorama de mercado y categoría
- 5–7 hallazgos clave con etiqueta y fuente.
- Tendencias relevantes (consumidor, digital, categoría).
- Implicación estratégica de cada hallazgo ("¿y entonces qué?").

## F2 · Análisis competitivo y benchmarking
- Tabla comparativa de competidores.
- Mapa de posicionamiento descrito en texto (2 ejes).
- Espacios en blanco y oportunidades.

## F3 · Perfil del consumidor — Buyer personas
- 2–3 personas con el formato de 02-marketing-estrategico.md.

## F4 · Hallazgos e insights
- 3 insights candidatos (Observación → Tensión → Oportunidad), cada uno con su evidencia.
- Recomendación del insight más fuerte y por qué.

## F5 · Territorios de contenido
- 3 territorios con el formato del marco.

## F6 · Funnel con proyección de leads
- Tabla de supuestos (valor | etiqueta | fuente o razón).
- Tabla del funnel por escenario.
- Riesgos y cómo medir.

## F7 · Estructura del deck
Lista slide por slide (título + mensaje clave + contenido) y **además** un bloque JSON exactamente así:

```json
{
  "titulo_deck": "Nombre del proyecto",
  "slides": [
    { "titulo": "Título de la slide", "mensaje": "Mensaje clave en una frase", "bullets": ["punto 1", "punto 2", "punto 3"] }
  ]
}
```
Entre 10 y 16 slides. Máximo 5 bullets por slide y 15 palabras por bullet.

## Siempre disponible: Matriz de fuentes
Tabla: dato | fuente | año | link | confiabilidad (alta/media).
Cuando el usuario escriba "matriz de fuentes", consolidas todas las fuentes usadas en el proyecto.

## Hipótesis estratégicas y oportunidades
Cuando el usuario lo pida (o en F4), lista hipótesis como `[HIPÓTESIS]` con cómo validarlas.
