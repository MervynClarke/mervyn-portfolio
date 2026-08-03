"use client";
// Screenshot intake. Downscale before anything leaves the browser: a phone
// screenshot is often 3–8 MB, and the parser reads class titles fine at
// 1600px on the long edge. Returns { dataUrl, mediaType, base64 } — the API
// route wants the bare base64, the review card wants the data URL for its
// thumbnail.
export function fileToImagePayload(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith("image/")) {
      reject(new Error("That doesn't look like an image."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read that image."));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({
          dataUrl,
          mediaType: "image/jpeg",
          base64: dataUrl.slice(dataUrl.indexOf(",") + 1),
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/** First image file on a paste/drop event, or null. */
export function imageFromTransfer(dataTransfer) {
  if (!dataTransfer) return null;
  const items = dataTransfer.items ? [...dataTransfer.items] : [];
  for (const item of items) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) return file;
    }
  }
  const files = dataTransfer.files ? [...dataTransfer.files] : [];
  return files.find((f) => f.type.startsWith("image/")) || null;
}
