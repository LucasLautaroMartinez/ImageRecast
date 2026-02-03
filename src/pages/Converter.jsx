import { useState, useEffect, useRef } from 'react'
// import camara from '../assets/Camara.webp'
import DropBox from '../components/image/DropBox.jsx'
// import FreeSticker from '../assets/free-text.svg'
// import SparklesSticker from '../assets/pop.svg'
// import Sparkles2Sticker from '../assets/pop2.svg'
// import StarSticker from '../assets/tiny-star.svg'
import SquigglyArrowSticker from '../assets/squiggly-arrow.svg'
import FormatSelect from '../components/ui/FormatSelector.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import ImageCard from '../components/image/ImageCard.jsx'
import upload_files from '../services/upload_files.js'
import { Toaster } from 'anni'
import { toast } from 'anni'
import stylesConverter from '../styles/converter.module.css'
import ImageViewer from '../components/image/ImageViewer.jsx'

export default function Converter() {
  const [imageFormat, setImageFormat] = useState('image/png');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [originalFiles, setOriginalFiles] = useState([]);
  const [images, setImages] = useState([]);
  const isDeletingRef = useRef(false);
  const [svgPreset, setSvgPreset] = useState('logo-clean');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (isDeletingRef.current) { isDeletingRef.current = false; return; }
    if (originalFiles.length === 0) { setImages([]); return; }

    let cancelled = false;

    async function run() {
      const { images, hadError } = await upload_files(originalFiles, {
        format: imageFormat,
        svgPreset,
        onStart: () => setUploading(true),
        onProgress: setProgress,
        onFinish: () => setUploading(false),
        onSlow: () => {
          toast.info('Este proceso puede tardar un poco...');
        },
        slowAfter: 2500,
        onError: ({ file }) => {
          toast.error(`Formato no soportado: ${file.name}`);
        }
      });

      if (cancelled) return;

      setImages(images);

      if (images.length > 0 && !hadError) {
        const extensionMap = { 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WEBP', 'image/svg+xml': 'SVG' };
        toast.success(`Conversión completa a ${extensionMap[imageFormat]}`);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [originalFiles, imageFormat, svgPreset]);

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

  function handleDeleteAll() {
    isDeletingRef.current = true;
    setImages([]);
    setOriginalFiles([]);
    toast(<div className={stylesConverter['toast-delete-images']}>🗑️&nbsp; Se eliminaron todas las imágenes</div>)
  }

  function openViewer(img) {
    setActiveImage(img);
    setViewerOpen(true);
  }

  function closeViewer() {
    setViewerOpen(false);
    setActiveImage(null);
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
      </section>


        <section className={stylesConverter['format-select-container']}>
          <FormatSelect
            value={imageFormat}
            onChange={setImageFormat}
            svgPreset={svgPreset}
            onSvgPresetChange={setSvgPreset}
          />
          <img src={SquigglyArrowSticker} alt="" className={`${stylesConverter['sticker-arrow']} ${imageFormat === 'image/svg+xml' ? stylesConverter['sticker-arrow-svg'] : ''}`} />
        </section>



      {/* <div className={stylesConverter['floating-camera']}>
        <img src={camara} alt="Camara fotografica ilustrativa" className={stylesConverter['camera-photo']} />
        <img src={FreeSticker} alt="" className={stylesConverter['sticker-1']} />
        <img src={Sparkles2Sticker} alt="" className={stylesConverter['sticker-2']} />
        <img src={SparklesSticker} alt="" className={stylesConverter['sticker-3']} />
        <img src={StarSticker} alt="" className={stylesConverter['sticker-4']} />
      </div> */}

      <section className={stylesConverter['main-bottom']}>
        <div className={stylesConverter['processed-image-container']}>
          {Array.isArray(images) && images.length === 0 && (
            <div className={stylesConverter['empty-state']}>
              No hay imágenes cargadas
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={stylesConverter["no-image-icon"]}>
                <path 
                  className={stylesConverter["no-image-icon__frame"]} 
                  d="M21 3H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"
                />
                <line
                  className={stylesConverter["no-image-icon__line1"]} 
                  x1="1" 
                  y1="1" 
                  x2="22" 
                  y2="23" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <line 
                  className={stylesConverter["no-image-icon__line2"]} 
                  x1="3.78" 
                  y1="1" 
                  x2="24.78" 
                  y2="23" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
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
              onPreview={() => openViewer(img)}
            />
          ))}
        </div>
        <div className={stylesConverter['image-toolbar']}>
          <button
            className={stylesConverter['delete-all-btn']}
            onClick={handleDeleteAll}
            disabled={images.length === 0}
          >
            Eliminar todo
          </button>
        </div>
      </section>

      {viewerOpen && activeImage && (
        <ImageViewer
          image={activeImage}
          onClose={closeViewer}
          onDelete={() => {
            handleDelete(activeImage.id);
            closeViewer();
          }}
          onDownload={handleDownload}
        />
      )}
    </main>
  );
}