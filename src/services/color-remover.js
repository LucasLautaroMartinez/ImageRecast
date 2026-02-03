function removeColor(ctx, width, height, target, tolerance = 30) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const [tr, tg, tb] = target; // color elegido

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      (r - tr) ** 2 +
      (g - tg) ** 2 +
      (b - tb) ** 2
    );

    if (dist < tolerance) {
      data[i + 3] = 0; // alpha = 0 → transparente
    }
  }

  ctx.putImageData(imgData, 0, 0);
}


function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}


canvas.toBlob(blob => {
  const url = URL.createObjectURL(blob);
  // descargar o mostrar preview
}, "image/png");
