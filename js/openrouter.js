// Llamada a la API de OpenRouter (compatible con el formato de OpenAI).
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Convierte el historial interno (formato Gemini) al formato de mensajes de OpenRouter.
function historialAMensajes(systemPrompt, historial) {
  return [
    { role: "system", content: systemPrompt },
    ...historial.map((h) => ({
      role: h.role === "model" ? "assistant" : "user",
      content: h.parts.map((p) => p.text).join(""),
    })),
  ];
}

async function llamarOpenRouter({ apiKey, modelo, systemPrompt, historial, usarBusqueda }) {
  const body = {
    model: modelo,
    messages: historialAMensajes(systemPrompt, historial),
    temperature: 0.4,
    max_tokens: 8192,
  };
  // La búsqueda web de OpenRouter tiene costo (requiere créditos en la cuenta).
  if (usarBusqueda) body.plugins = [{ id: "web" }];

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": location.origin,
      "X-Title": "Brujula - Agente de arranque estrategico",
    },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.error) {
    const msg = data?.error?.message || `Error ${r.status}`;
    const code = data?.error?.code || r.status;
    if (code === 401) throw new Error(`OpenRouter no reconoce la API key (401). Cópiala de nuevo desde openrouter.ai/keys.\n\n${msg}`);
    if (code === 402) throw new Error(`Tu cuenta de OpenRouter no tiene créditos para esta solicitud (402). Usa un modelo gratis (termina en :free u openrouter/free) y desactiva la búsqueda web.\n\n${msg}`);
    if (code === 429) throw new Error(`Llegaste al límite de solicitudes (429). Los modelos gratis tienen límites bajos: espera un minuto o prueba otro modelo.\n\n${msg}`);
    if (code === 404) throw new Error(`OpenRouter no encontró ese modelo o no está disponible ahora (404). Revisa el nombre en openrouter.ai/models.\n\n${msg}`);
    throw new Error(msg);
  }

  const msgIA = data.choices?.[0]?.message || {};
  const texto = typeof msgIA.content === "string"
    ? msgIA.content
    : (msgIA.content || []).map((p) => p.text || "").join("");
  const fuentes = (msgIA.annotations || [])
    .filter((a) => a.type === "url_citation" && a.url_citation)
    .map((a) => ({ titulo: a.url_citation.title, url: a.url_citation.url }));

  if (!texto) throw new Error("El modelo no devolvió texto. Intenta de nuevo o prueba otro modelo.");
  return { texto, fuentes, modeloUsado: data.model };
}

async function probarOpenRouter(apiKey) {
  const r = await fetch("https://openrouter.ai/api/v1/key", { headers: { Authorization: `Bearer ${apiKey}` } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d?.error?.message || `Error ${r.status}`);
  return "Conectado a OpenRouter ✓";
}
