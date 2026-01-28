import ImageTracer, { colorquantization, imageToSVG } from "imagetracerjs";
import { presetMap } from './vector-presets';

// This fixes an Anni error. Anni's Toasts use crypto.randomUUID that some browsers doesn't support
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
  svgPreset = 'logo-clean',
  onStart,
  onProgress,
  onFinish,
  onError,
  onSlow,
  slowAfter = 3000
}) {
  const allowed = ['image/jpeg','image/png','image/webp', 'image/svg+xml'];
  const image_collection = [];
  let hadError = false;

  onStart?.();

  const slowTimer = setTimeout(() => {
    onSlow?.();
  }, slowAfter);

  try {
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

      const blob = await convertImage(file, { type: format, svgPreset });

      const extensionMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/svg+xml': 'svg'
      };

      const ext = extensionMap[blob.type] || 'jpg';
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
  } finally {
    clearTimeout(slowTimer);
    onFinish?.();
  }

  return {
    images: image_collection,
    hadError
  };
}


async function convertImage(file, {
  width,
  height,
  type = "image/webp",
  quality = 0.9,
  svgPreset
}) {

  if (file.type === "image/svg+xml" && type === "image/svg+xml") {
    return file;
  }

  if (type === "image/svg+xml") {
    const svgString = await fileToSvg(file, presetMap[svgPreset] || {});
    return new Blob([svgString], { type: "image/svg+xml" });
  }

  if (file.type === "image/svg+xml") {
    const img = await loadSvgAsImage(file);
    const canvas = document.createElement("canvas");

    canvas.width = width || img.width;
    canvas.height = height || img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), type, quality);
    });
  }

  const bitmap = await loadBitmap(file, 1024); // random value

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


function loadSvgAsImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}


function generateId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


export async function fileToSvg(file, options = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      ImageTracer.imageToSVG(
        reader.result,
        svg => resolve(svg),
        {
          scale: 1,
          numberofcolors: 8,
          colorquantcycles: 3,
          ltres: 5,
          qtres: 5,
          pathomit: 4,
          blurradius: 0,
          linefilter: true,
          
          ...options
        }
      );
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}