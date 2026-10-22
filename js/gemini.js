// Llamada a la API de Gemini (plan gratuito de Google AI Studio).
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

async function llamarGemini({ apiKey, modelo, systemPrompt, historial, usarBusqueda }) {
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: historial,
    generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
  };
  if (usarBusqueda) body.tools = [{ google_search: {} }];

  const r = await fetch(`${GEMINI_BASE}${encodeURIComponent(modelo)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = data?.error?.message || `Error ${r.status}`;
    if (r.status === 429) throw new Error(`Llegaste al límite del plan gratuito (429). Espera un minuto o desactiva la búsqueda en Google en Configuración.\n\n${msg}`);
    if (r.status === 400 || r.status === 403) throw new Error(`Revisa tu API key o el nombre del modelo.\n\n${msg}`);
    throw new Error(msg);
  }

  const cand = data.candidates?.[0];
  const texto = (cand?.content?.parts || []).map((p) => p.text || "").join("");
  const fuentes = (cand?.groundingMetadata?.groundingChunks || [])
    .map((c) => c.web)
    .filter(Boolean)
    .map((w) => ({ titulo: w.title, url: w.uri }));

  if (!texto) throw new Error("Gemini no devolvió texto. Intenta de nuevo o acorta el mensaje.");
  return { texto, fuentes };
}
