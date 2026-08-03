"use client";
// Screenshot OCR, entirely in the browser.
//
// Tesseract runs as WebAssembly in a worker: no API key, no per-use cost, no
// account that can lapse, and it keeps working offline once the assets are
// cached. Every asset is served from /public/ocr rather than a CDN, so there
// is no third party in the chain that can disappear or rate-limit us.
//
// The engine is loaded on first use, not on page load — it's ~6 MB, and most
// visits never paste a screenshot.

let workerPromise = null;

// Probe module compiled from `(func (result v128) i32.const 0 i8x16.splat)` —
// the standard WASM SIMD feature test.
const SIMD_PROBE = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0,
  10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
]);

function simdSupported() {
  try {
    return WebAssembly.validate(SIMD_PROBE);
  } catch {
    return false;
  }
}

/**
 * Pin the core file rather than handing tesseract a directory to choose from.
 *
 * Left to itself it probes for *relaxed* SIMD and asks for a fourth core build
 * we don't ship, which fails in the worker as an opaque importScripts error.
 * Plain SIMD is supported everywhere relaxed SIMD is, so two builds cover every
 * browser: SIMD, and a baseline fallback for anything older.
 */
function corePath() {
  return simdSupported()
    ? "/ocr/tesseract-core-simd-lstm.wasm.js"
    : "/ocr/tesseract-core-lstm.wasm.js";
}

/**
 * One worker for the lifetime of the tab. Spinning one up costs a few hundred
 * ms plus the asset fetch; reusing it makes the second screenshot feel instant.
 */
async function getWorker(onProgress) {
  if (workerPromise) return workerPromise;

  workerPromise = (async () => {
    const { createWorker } = await import("tesseract.js");
    return createWorker("eng", 1, {
      workerPath: "/ocr/worker.min.js",
      corePath: corePath(),
      langPath: "/ocr",
      gzip: true,
      logger: (m) => {
        if (onProgress && typeof m.progress === "number") onProgress(m);
      },
    });
  })().catch((err) => {
    // Don't cache a failed init — a reload-free retry should get a fresh go.
    workerPromise = null;
    throw err;
  });

  return workerPromise;
}

/**
 * Read an image into lines of text.
 *
 * Returns `{ lines, text }` where each line is `{ text, confidence, height }`.
 * Line geometry matters downstream: on a class page the title is typically the
 * tallest text on screen, which is a far better signal than reading order.
 */
export async function readImage(dataUrl, { onProgress } = {}) {
  const worker = await getWorker(onProgress);
  // `blocks: true` is required — recognize() returns plain text only by
  // default, and there is no flat `data.lines`. Without this the geometry
  // silently isn't there and title/channel detection quietly returns nothing.
  const { data } = await worker.recognize(dataUrl, {}, { text: true, blocks: true });

  const flat = (data.blocks || []).flatMap((block) =>
    (block.paragraphs || []).flatMap((p) => p.lines || [])
  );

  const lines = flat
    .map((line) => ({
      text: (line.text || "").replace(/\s+/g, " ").trim(),
      confidence: line.confidence ?? 0,
      height: line.bbox ? line.bbox.y1 - line.bbox.y0 : 0,
      top: line.bbox ? line.bbox.y0 : 0,
    }))
    // Sub-60 confidence on a UI screenshot is almost always chrome, icons, or
    // compression noise being read as letters.
    .filter((l) => l.text.length > 1 && l.confidence >= 60);

  return { lines, text: data.text || "" };
}

/** Free the worker and its memory — called when the log view unmounts. */
export async function releaseOcr() {
  if (!workerPromise) return;
  const pending = workerPromise;
  workerPromise = null;
  try {
    const worker = await pending;
    await worker.terminate();
  } catch {
    /* already gone */
  }
}

/**
 * Whether this browser can run the engine at all. WebAssembly has been
 * universal since 2017; this is really a guard against ancient browsers and
 * locked-down webviews, so we can say so plainly instead of hanging.
 */
export function ocrSupported() {
  return typeof WebAssembly === "object" && typeof Worker === "function";
}
