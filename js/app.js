// Brújula · lógica de la interfaz y del flujo por fases.
const FASES = [
  { id: "F0", nombre: "Diagnóstico del brief" },
  { id: "F1", nombre: "Mercado y categoría" },
  { id: "F2", nombre: "Competencia y benchmarking" },
  { id: "F3", nombre: "Buyer personas" },
  { id: "F4", nombre: "Insights" },
  { id: "F5", nombre: "Territorios de contenido" },
  { id: "F6", nombre: "Funnel y proyección de leads" },
  { id: "F7", nombre: "Estructura del deck" },
];

const $ = (id) => document.getElementById(id);
const estado = { systemPrompt: "", historial: [], faseActual: -1, respuestas: [], ocupado: false };

// ---------- Almacenamiento local (solo en este navegador) ----------
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
const leer = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };

function config() {
  const proveedor = $("proveedor").value;
  return {
    proveedor,
    apiKey: $("apiKey").value.trim(),
    modelo: $("modelo").value.trim() || PROVEEDORES[proveedor].modeloPorDefecto,
    usarBusqueda: $("busqueda").checked,
  };
}

// Cada proveedor guarda su propia key, modelo y preferencia de búsqueda.
function cargarConfigProveedor(proveedor) {
  const p = PROVEEDORES[proveedor];
  const keyVieja = proveedor === "gemini" ? leer("brujula_api_key") : null; // compatibilidad con la versión anterior
  $("apiKey").value = leer(`brujula_key_${proveedor}`) || keyVieja || "";
  $("modelo").value = leer(`brujula_modelo_${proveedor}`) || p.modeloPorDefecto;
  const b = leer(`brujula_busqueda_${proveedor}`);
  $("busqueda").checked = b === null ? p.busquedaPorDefecto : b === "1";
  $("modelos").innerHTML = p.modelos.map((m) => `<option value="${m}"></option>`).join("");
  $("ayudaKey").innerHTML = p.ayudaKey;
  $("textoBusqueda").textContent = p.textoBusqueda;
  $("ayudaBusqueda").innerHTML = p.ayudaBusqueda;
  $("estadoConexion").textContent = "";
}

function guardarConfig() {
  const c = config();
  guardar("brujula_proveedor", c.proveedor);
  guardar(`brujula_key_${c.proveedor}`, c.apiKey);
  guardar(`brujula_modelo_${c.proveedor}`, c.modelo);
  guardar(`brujula_busqueda_${c.proveedor}`, c.usarBusqueda ? "1" : "0");
}

// ---------- UI ----------
function pintarFases() {
  $("fases").innerHTML = FASES.map((f, i) => {
    const cls = i < estado.faseActual ? "hecha" : i === estado.faseActual ? "actual" : "";
    return `<li class="${cls}">${f.id} · ${f.nombre}</li>`;
  }).join("");
  const hayRespuestas = estado.respuestas.length > 0;
  $("btnSiguiente").disabled = estado.ocupado || estado.faseActual < 0 || estado.faseActual >= FASES.length - 1;
  $("btnSiguiente").textContent = estado.faseActual >= FASES.length - 1
    ? "Flujo completo ✓"
    : estado.faseActual >= 0 ? `Validar y pasar a ${FASES[estado.faseActual + 1].id} →` : "Validar y pasar a la siguiente fase →";
  $("btnMD").disabled = !hayRespuestas;
  $("btnFuentes").disabled = !hayRespuestas || estado.ocupado;
  $("btnPPT").disabled = !estado.respuestas.some((r) => extraerJSONDeck(r));
  $("btnIniciar").disabled = estado.ocupado;
}

function agregarMensaje(rol, contenido, fuentes = []) {
  const div = document.createElement("div");
  div.className = `msg ${rol}`;
  if (rol === "bot") {
    div.innerHTML = DOMPurify.sanitize(marked.parse(contenido));
    if (fuentes.length) {
      const unicas = [...new Map(fuentes.map((f) => [f.url, f])).values()];
      div.insertAdjacentHTML("beforeend",
        `<div class="fuentes-web"><strong>Búsquedas web usadas:</strong><br>${unicas
          .map((f) => `<a href="${DOMPurify.sanitize(f.url)}" target="_blank" rel="noopener">${DOMPurify.sanitize(f.titulo || f.url)}</a>`)
          .join(" · ")}</div>`);
    }
  } else {
    div.textContent = contenido;
  }
  $("mensajes").appendChild(div);
  $("mensajes").scrollTop = $("mensajes").scrollHeight;
  return div;
}

// ---------- Conversación ----------
async function enviar(textoUsuario, { mostrar = textoUsuario } = {}) {
  const cfg = config();
  if (!cfg.apiKey) {
    $("config").classList.remove("hidden");
    agregarMensaje("error", `Primero pega tu API key de ${PROVEEDORES[cfg.proveedor].nombre} en Configuración.`);
    return false;
  }
  if (!estado.systemPrompt) {
    try { estado.systemPrompt = await cargarContexto(); }
    catch (e) {
      agregarMensaje("error", `${e.message}. Si abriste el archivo con doble clic, publícalo en GitHub Pages o usa un servidor local (ver README).`);
      return false;
    }
  }

  agregarMensaje("user", mostrar);
  estado.historial.push({ role: "user", parts: [{ text: textoUsuario }] });
  estado.ocupado = true; pintarFases();
  const cargando = agregarMensaje("bot cargando", "Investigando y pensando… (con modelos gratis puede tardar hasta un minuto)");

  try {
    const { texto, fuentes, modeloUsado } = await llamarIA(cfg.proveedor, { ...cfg, systemPrompt: estado.systemPrompt, historial: estado.historial });
    cargando.remove();
    estado.historial.push({ role: "model", parts: [{ text: texto }] });
    estado.respuestas.push(texto);
    const div = agregarMensaje("bot", texto, fuentes);
    if (modeloUsado) div.insertAdjacentHTML("beforeend", `<div class="fuentes-web">Respondió: ${DOMPurify.sanitize(modeloUsado)}</div>`);
    return true;
  } catch (e) {
    cargando.remove();
    estado.historial.pop(); // no dejar el mensaje sin respuesta en el historial
    agregarMensaje("error", e.message);
    return false;
  } finally {
    estado.ocupado = false; pintarFases();
  }
}

async function iniciar() {
  const brief = $("brief").value.trim();
  if (brief.length < 40) { agregarMensaje("error", "Pega un brief un poco más completo para arrancar."); return; }
  estado.historial = []; estado.respuestas = []; estado.faseActual = 0; pintarFases();
  const ok = await enviar(
    `BRIEF DEL CLIENTE:\n"""\n${brief}\n"""\n\nEjecuta SOLO la fase F0 · ${FASES[0].nombre}, siguiendo 03-entregables.md. Termina pidiendo validación.`,
    { mostrar: "📄 Brief cargado. Arranca con F0 · Diagnóstico del brief." }
  );
  if (!ok) { estado.faseActual = -1; pintarFases(); }
}

async function siguienteFase() {
  const sig = estado.faseActual + 1;
  if (sig >= FASES.length) return;
  const f = FASES[sig];
  const extra = f.id === "F7" ? " Incluye el bloque ```json con la estructura exacta definida." : "";
  const ok = await enviar(
    `Valido la fase anterior (con los ajustes que hayamos conversado). Ejecuta SOLO la fase ${f.id} · ${f.nombre}, siguiendo 03-entregables.md.${extra}`,
    { mostrar: `✅ Validado. Pasemos a ${f.id} · ${f.nombre}.` }
  );
  if (ok) { estado.faseActual = sig; pintarFases(); }
}

// ---------- Exportar ----------
function descargar(nombre, contenido, tipo) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = Object.assign(document.createElement("a"), { href: url, download: nombre });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- Eventos ----------
document.addEventListener("DOMContentLoaded", () => {
  const proveedorGuardado = leer("brujula_proveedor");
  $("proveedor").value = PROVEEDORES[proveedorGuardado] ? proveedorGuardado : "gemini";
  cargarConfigProveedor($("proveedor").value);
  if (!$("apiKey").value) $("config").classList.remove("hidden");
  $("proveedor").onchange = () => cargarConfigProveedor($("proveedor").value);
  pintarFases();

  cargarContexto()
    .then((p) => { estado.systemPrompt = p; $("estadoCtx").textContent = `Contexto cargado: ${ARCHIVOS_CONTEXTO.length} archivos.`; })
    .catch(() => { $("estadoCtx").textContent = "⚠️ No se pudo cargar /contexto. Ábrelo desde GitHub Pages o un servidor local."; });

  $("btnConfig").onclick = () => $("config").classList.toggle("hidden");
  $("btnGuardar").onclick = () => {
    guardarConfig();
    $("config").classList.add("hidden");
  };
  $("btnProbar").onclick = async () => {
    const c = config();
    if (!c.apiKey) { $("estadoConexion").textContent = "Pega primero la API key."; return; }
    $("estadoConexion").textContent = "Probando…";
    try { $("estadoConexion").textContent = await PROVEEDORES[c.proveedor].probar(c.apiKey); guardarConfig(); }
    catch (e) { $("estadoConexion").textContent = `❌ ${e.message}`; }
  };

  $("archivoBrief").onchange = async (e) => {
    const f = e.target.files[0]; if (f) $("brief").value = await f.text();
  };
  $("btnEjemplo").onclick = async () => {
    try { $("brief").value = await (await fetch("briefs/ejemplo-brief.md")).text(); }
    catch (_) { agregarMensaje("error", "No se pudo cargar el brief de ejemplo."); }
  };

  $("btnIniciar").onclick = iniciar;
  $("btnSiguiente").onclick = siguienteFase;

  $("formChat").onsubmit = async (e) => {
    e.preventDefault();
    const t = $("input").value.trim();
    if (!t || estado.ocupado) return;
    if (estado.faseActual < 0) { agregarMensaje("error", "Primero pega un brief e inicia el diagnóstico."); return; }
    $("input").value = "";
    await enviar(t);
  };
  $("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("formChat").requestSubmit(); }
  });

  $("btnFuentes").onclick = () => enviar(
    "Consolida la matriz de fuentes de TODO el proyecto hasta ahora: dato | fuente | año | link | confiabilidad. Marca lo que quedó como 'Sin dato verificado'.",
    { mostrar: "📚 Matriz de fuentes consolidada, por favor." }
  );

  $("btnMD").onclick = () => descargar("brujula-proyecto.md", estado.respuestas.join("\n\n---\n\n"), "text/markdown");

  $("btnPPT").onclick = async () => {
    const deck = [...estado.respuestas].reverse().map(extraerJSONDeck).find(Boolean);
    if (!deck) { agregarMensaje("error", "No encontré la estructura del deck. Corre la fase F7 primero."); return; }
    try { await exportarPPT(deck); } catch (e) { agregarMensaje("error", `No se pudo generar el PPT: ${e.message}`); }
  };

  $("btnReiniciar").onclick = () => {
    if (estado.ocupado) return;
    estado.historial = []; estado.respuestas = []; estado.faseActual = -1;
    $("mensajes").querySelectorAll(".msg:not(.intro)").forEach((n) => n.remove());
    pintarFases();
  };
});
