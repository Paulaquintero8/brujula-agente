# 🧭 Brújula — Agente de arranque estratégico

Agente de IA que convierte un **brief** en un **primer borrador estratégico** verificable: diagnóstico, mercado, competencia, buyer personas, insight, territorios de contenido, funnel con proyección de leads y estructura del deck (descargable en PPT).

Funciona con la **API gratuita de Gemini** (Google AI Studio). Está hecho en HTML, CSS y JavaScript y no necesita servidor.

## El caso de uso
Cada proyecto estratégico arranca en blanco. Brújula toma el brief, detecta sus vacíos, investiga la competencia, propone buyer personas, el insight, los territorios de contenido, el funnel con proyección de leads y la estructura del deck. La meta es pasar de días a horas y dedicar el tiempo a la idea y al cliente.

## Cómo usarlo
1. Saca tu API key gratis en https://aistudio.google.com/apikey
2. Abre el agente (link de GitHub Pages del repo).
3. En **⚙️ Configuración** pega la API key y guarda. Se queda solo en tu navegador, nunca se sube a GitHub.
4. Pega el brief (o usa el ejemplo) y dale **Iniciar diagnóstico (F0)**.
5. Revisa cada fase. Si algo no te sirve, ajústalo en el chat. Cuando estés de acuerdo, dale **Validar y pasar a la siguiente fase**.
6. Al terminar F7, descarga el **PPT**, el **.md** completo o pide la **matriz de fuentes**.

## Fases
| Fase | Entregable |
|---|---|
| F0 | Diagnóstico del brief y del reto de negocio |
| F1 | Panorama de mercado y categoría |
| F2 | Análisis competitivo y benchmarking |
| F3 | Buyer personas: motivaciones, necesidades y barreras |
| F4 | Hallazgos e insights sustentados en evidencia |
| F5 | Territorios de contenido |
| F6 | Funnel con proyección de leads (3 escenarios) |
| F7 | Estructura del deck + exportación a PPT |

## Cómo garantiza la confiabilidad
- Cada afirmación va etiquetada como `[DATO · fuente, año]`, `[SUPUESTO]` o `[HIPÓTESIS]`.
- Usa la búsqueda de Google de Gemini para citar fuentes reales (se puede desactivar).
- Solo acepta las fuentes listadas en `contexto/05-fuentes.md`.
- No proyecta leads sin supuestos explícitos.

## Estructura
```
index.html              Interfaz
css/styles.css          Estilos
js/app.js               Flujo por fases y chat
js/gemini.js            Llamada a la API de Gemini
js/contexto.js          Carga los .md y arma el system prompt
js/exportar-ppt.js      Genera el .pptx (PptxGenJS)
contexto/               El "cerebro" del agente
  00-identidad.md       Rol y gemelo digital
  01-reglas.md          Lo que debe y no debe hacer
  02-marketing-estrategico.md  Marcos de trabajo
  03-entregables.md     Formato de cada fase
  04-tono.md            Cómo habla
  05-fuentes.md         Fuentes oficiales permitidas
briefs/ejemplo-brief.md Brief de prueba (ficticio)
```

**Para personalizar el agente** solo hay que editar los archivos de `contexto/`. No se necesita tocar código.

## Notas
- **Límites del plan gratis:** si aparece el error 429, espera un minuto o desactiva la búsqueda en Google en Configuración.
- **Modelo:** viene con `gemini-2.5-flash`. Se puede cambiar en Configuración si Google publica uno nuevo.
- **Si lo abres con doble clic** (`file://`), el navegador bloquea la carga de `/contexto`. Úsalo desde GitHub Pages o con un servidor local: `python3 -m http.server` y luego entra a http://localhost:8000
