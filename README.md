# 🧭 Brújula — Agente de arranque estratégico

Agente de IA que convierte un **brief** en un **primer borrador estratégico** verificable: diagnóstico, mercado, competencia, buyer personas, insight, territorios de contenido, funnel con proyección de leads y estructura del deck (descargable en PPT).

Funciona con **Google Gemini** (plan gratis de AI Studio) o con **OpenRouter** (cientos de modelos, varios gratis). Está hecho en HTML, CSS y JavaScript y no necesita servidor.

## El caso de uso
Cada proyecto estratégico arranca en blanco. Brújula toma el brief, detecta sus vacíos, investiga la competencia, propone buyer personas, el insight, los territorios de contenido, el funnel con proyección de leads y la estructura del deck. La meta es pasar de días a horas y dedicar el tiempo a la idea y al cliente.

## Cómo usarlo
1. Saca tu API key:
   - **Gemini:** https://aistudio.google.com/apikey (las claves nuevas empiezan por `AQ.`)
   - **OpenRouter:** https://openrouter.ai/keys (empiezan por `sk-or-`)
2. Abre el agente (link de GitHub Pages del repo).
3. En **⚙️ Configuración** elige el proveedor, pega la API key, dale **Probar conexión** y luego **Guardar**. La key se queda solo en tu navegador, nunca se sube a GitHub.
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
- Busca en la web para citar fuentes reales: con Gemini usa Google Search (incluido en el plan gratis); con OpenRouter usa su plugin web (cobra por consulta). Se puede desactivar.
- Solo acepta las fuentes listadas en `contexto/05-fuentes.md`.
- No proyecta leads sin supuestos explícitos.

## Estructura
```
index.html              Interfaz
css/styles.css          Estilos
js/app.js               Flujo por fases y chat
js/proveedores.js       Registro de proveedores (Gemini, OpenRouter)
js/gemini.js            Llamada a la API de Gemini
js/openrouter.js        Llamada a la API de OpenRouter
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
- **Límites de los planes gratis:** si aparece el error 429, espera un minuto, desactiva la búsqueda web o cambia de modelo.
- **Modelos:** Gemini viene con `gemini-2.5-flash`. OpenRouter viene con `openrouter/free`, que elige solo un modelo gratis disponible. Puedes escribir cualquier modelo de https://openrouter.ai/models (los gratis terminan en `:free`).
- **OpenRouter sin créditos:** si aparece el error 402, usa un modelo gratis y desactiva la búsqueda web.
- **Si lo abres con doble clic** (`file://`), el navegador bloquea la carga de `/contexto`. Úsalo desde GitHub Pages o con un servidor local: `python3 -m http.server` y luego entra a http://localhost:8000
