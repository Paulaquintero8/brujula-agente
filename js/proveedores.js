// Registro de proveedores de IA. Para agregar otro, suma una entrada aquí y su archivo en /js.
const PROVEEDORES = {
  gemini: {
    nombre: "Google Gemini",
    modeloPorDefecto: "gemini-2.5-flash",
    modelos: ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro"],
    busquedaPorDefecto: true,
    ayudaKey: 'Sácala gratis en <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> (empieza por AQ. o AIza). Nunca la subas a GitHub.',
    textoBusqueda: "Buscar en Google para citar fuentes reales",
    ayudaBusqueda: "Incluida en el plan gratis, con un límite de consultas.",
    llamar: (opts) => llamarGemini(opts),
    probar: (key) => probarGemini(key),
  },
  openrouter: {
    nombre: "OpenRouter",
    modeloPorDefecto: "openrouter/free",
    modelos: [
      "openrouter/free",
      "google/gemini-2.5-flash",
      "openai/gpt-4o-mini",
    ],
    busquedaPorDefecto: false,
    ayudaKey: 'Sácala en <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">openrouter.ai/keys</a> (empieza por sk-or-). Nunca la subas a GitHub.',
    textoBusqueda: "Buscar en la web para citar fuentes reales (con costo)",
    ayudaBusqueda: 'openrouter/free y los modelos que terminan en :free no cuestan (ver <a href="https://openrouter.ai/models?pricing=free" target="_blank" rel="noopener">lista</a>). La búsqueda web sí cobra por consulta y necesita créditos en tu cuenta.',
    llamar: (opts) => llamarOpenRouter(opts),
    probar: (key) => probarOpenRouter(key),
  },
};

function llamarIA(proveedor, opts) {
  const p = PROVEEDORES[proveedor];
  if (!p) throw new Error(`Proveedor desconocido: ${proveedor}`);
  return p.llamar(opts);
}
