// Convierte el JSON de la fase F7 en un archivo .pptx con PptxGenJS.
function extraerJSONDeck(texto) {
  const bloques = [...texto.matchAll(/```json\s*([\s\S]*?)```/g)].map((m) => m[1]);
  for (const b of bloques.reverse()) {
    try {
      const obj = JSON.parse(b);
      if (Array.isArray(obj.slides)) return obj;
    } catch (_) { /* sigue buscando */ }
  }
  return null;
}

async function exportarPPT(deck) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  const NARANJA = "C2410C", TINTA = "1D1D1F", GRIS = "6B6B70";

  // Portada
  const portada = pptx.addSlide();
  portada.background = { color: TINTA };
  portada.addText(deck.titulo_deck || "Estrategia", { x: 0.7, y: 2.4, w: 12, h: 1.2, fontSize: 40, bold: true, color: "FFFFFF", fontFace: "Arial" });
  portada.addText("Primer borrador estratégico · Brújula", { x: 0.7, y: 3.6, w: 12, h: 0.6, fontSize: 18, color: "F97316", fontFace: "Arial" });

  deck.slides.forEach((s, i) => {
    const slide = pptx.addSlide();
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: NARANJA } });
    slide.addText(s.titulo || `Slide ${i + 1}`, { x: 0.6, y: 0.4, w: 12, h: 0.8, fontSize: 28, bold: true, color: TINTA, fontFace: "Arial" });
    if (s.mensaje) {
      slide.addText(s.mensaje, { x: 0.6, y: 1.25, w: 12, h: 0.7, fontSize: 18, color: NARANJA, fontFace: "Arial" });
    }
    const bullets = (s.bullets || []).map((b) => ({ text: b, options: { bullet: true, breakLine: true } }));
    if (bullets.length) {
      slide.addText(bullets, { x: 0.6, y: 2.2, w: 12, h: 4.5, fontSize: 18, color: TINTA, fontFace: "Arial", valign: "top", paraSpaceAfter: 8 });
    }
    slide.addText(String(i + 1), { x: 12.3, y: 6.9, w: 0.6, h: 0.4, fontSize: 10, color: GRIS, align: "right" });
  });

  const nombre = (deck.titulo_deck || "brujula-deck").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-");
  await pptx.writeFile({ fileName: `${nombre || "brujula-deck"}.pptx` });
}
