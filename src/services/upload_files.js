// Esto está acá para solucionar el error de la librería Anni para alertas tipo Toast, esta utiliza el método crypto.randomUUID que mi navegador no soporta
if (!crypto.randomUUID) {
  crypto.randomUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}


export default async function upload_files(files, {
  format,
  onStart,
  onProgress,
  onFinish,
  onError
}) {
  const allowed = ['image/jpeg','image/png','image/webp'];
  const image_collection = [];
  let hadError = false;

  onStart?.();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!allowed.includes(file.type)) {
      hadError = true;
      onError?.({
        code: 'UNSUPPORTED_FORMAT',
        message: 'Formato no soportado',
        file
      });
      continue;
    }

    const blob = await convertImage(file, { type: format });

    const extensionMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };

    const ext = extensionMap[blob.type] || 'jpg'; // valor por defecto

    const baseName = file.name.replace(/\.[^.]+$/, '');

    image_collection.push({
      id: generateId(),
      name: `${baseName}.${ext}`,
      size: blob.size,
      blob,
      previewUrl: URL.createObjectURL(blob),
      sourceFile: file
    });


    const percent = Math.round(((i + 1) / files.length) * 100);
    onProgress?.(percent);
  }

  onFinish?.();
  
  return {
    images: image_collection,
    hadError
  };
}


async function convertImage(file, {
  width,
  height,
  type = "image/webp",
  quality = 0.9
}) {

  const bitmap = await loadBitmap(file, 1024); // este 1024 es un valor al azar

  const canvas = document.createElement("canvas");

  if (width && height) {
    canvas.width = width;
    canvas.height = height;
  } else {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
  }

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), type, quality);
  });
}


async function loadBitmap(file, targetWidth) {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, {
        resizeWidth: targetWidth,
        resizeQuality: "high"
      });
    } catch {
      return await createImageBitmap(file);
    }
  }
}


function generateId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}