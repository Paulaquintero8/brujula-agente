// Carga los archivos de /contexto y arma el system prompt del agente.
const ARCHIVOS_CONTEXTO = [
  "contexto/00-identidad.md",
  "contexto/01-reglas.md",
  "contexto/02-marketing-estrategico.md",
  "contexto/03-entregables.md",
  "contexto/04-tono.md",
  "contexto/05-fuentes.md",
];

async function cargarContexto() {
  const partes = await Promise.all(
    ARCHIVOS_CONTEXTO.map(async (ruta) => {
      const r = await fetch(ruta, { cache: "no-cache" });
      if (!r.ok) throw new Error(`No se pudo cargar ${ruta}`);
      return r.text();
    })
  );
  const hoy = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  return [
    `Fecha de hoy: ${hoy}. Prioriza datos recientes y di el año de cada dato.`,
    ...partes,
  ].join("\n\n---\n\n");
}
