import { useState, useEffect, useRef } from 'react'
import camara from '../assets/Camara.png'
import DropBox from '../components/image/DropBox.jsx'
import FreeSticker from '../assets/free-text.svg'
import SparklesSticker from '../assets/pop.svg'
import Sparkles2Sticker from '../assets/pop2.svg'
import StarSticker from '../assets/tiny-star.svg'
import SquigglyArrowSticker from '../assets/squiggly-arrow.svg'
import FormatSelect from '../components/ui/FormatSelector.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import ImageCard from '../components/image/ImageCard.jsx'
import upload_files from '../services/upload_files.js'
import { Toaster } from 'anni'
import { toast } from 'anni'
import stylesConverter from '../styles/converter.module.css'

export default function Converter() {
  const [imageFormat, setImageFormat] = useState('image/png');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [originalFiles, setOriginalFiles] = useState([]);
  const [images, setImages] = useState([]);
  const isDeletingRef = useRef(false);


  useEffect(() => {
    if (isDeletingRef.current) { isDeletingRef.current = false; return; }

    if (originalFiles.length === 0) { setImages([]); return; }

    let cancelled = false;

    async function run() {
      const { images, hadError } = await upload_files(originalFiles, {
        format: imageFormat,
        onStart: () => setUploading(true),
        onProgress: setProgress,
        onFinish: () => setUploading(false),
        onError: ({ file }) => {
          toast.error(`Formato no soportado: ${file.name}`);
        }
      });

      if (cancelled) return;

      setImages(images);

      if (images.length > 0 && !hadError) {
        const extensionMap = { 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WEBP' };
        toast.success(`Conversión completa a ${extensionMap[imageFormat]}`);
      }
    }
    run();
    return () => { cancelled = true; };

  }, [originalFiles, imageFormat]);


  
  function handleUpload(files) {
    isDeletingRef.current = false;
    setOriginalFiles(files);
  }

  function handleDownload(img) {
    const url = URL.createObjectURL(img.blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = img.name;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleDelete(id) {
    isDeletingRef.current = true;

    setImages(prev => prev.filter(i => i.id !== id));
    setOriginalFiles(prev => prev.filter(file => {
      return !images.some(img => img.id === id && img.sourceFile === file);
    }));
  }


  return (
    <main className={stylesConverter['main-converter']}>
      <Toaster 
        position='bottom-right'
        defaultTimeDuration={2000}
      />

      <section className={stylesConverter['dropbox']}>
        <DropBox onFilesSelected={handleUpload} />
        <ProgressBar visible={uploading} progress={progress} />

        <div className={stylesConverter['format-select-container']}>
          <FormatSelect value={imageFormat} onChange={setImageFormat} />
          <img src={SquigglyArrowSticker} alt="" className={stylesConverter['sticker-arrow']} />
        </div>
      </section>

      <div className={stylesConverter['floating-camera']}>
        <img src={camara} alt="Camara fotografica ilustrativa" className={stylesConverter['camera-photo']} />
        <img src={FreeSticker} alt="" className={stylesConverter['sticker-1']} />
        <img src={Sparkles2Sticker} alt="" className={stylesConverter['sticker-2']} />
        <img src={SparklesSticker} alt="" className={stylesConverter['sticker-3']} />
        <img src={StarSticker} alt="" className={stylesConverter['sticker-4']} />
      </div>

      <section className={stylesConverter['main-bottom']}>
        <div className={stylesConverter['processed-image-container']}>
          {Array.isArray(images) && images.length === 0 && (
            <div className={stylesConverter['empty-state']}>
              No hay imágenes
            </div>
          )}

          {Array.isArray(images) && images.map(img => (
            <ImageCard
              key={img.id}
              fileName={img.name}
              fileSize={(img.size / 1024 / 1024).toFixed(2) + ' Mb'}
              thumbnail={img.previewUrl}
              onDownload={() => handleDownload(img)}
              onDelete={() => handleDelete(img.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}