import { useState, useEffect, useRef } from 'react'
import DropBox from '../components/image/DropBox.jsx'
import FormatSelect from '../components/ui/FormatSelector.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import ImageCard from '../components/image/ImageCard.jsx'
import upload_files from '../services/upload_files.js'
import { Toaster } from 'anni'
import { toast } from 'anni'
import stylesConverter from '../styles/converter.module.css'
import ImageViewer from '../components/image/ImageViewer.jsx'
import ConfirmPanel from '../components/ui/ConfirmActionPanel.jsx'

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
  const [pendingFiles, setPendingFiles] = useState([]);
  const [reprocessAll, setReprocessAll] = useState(false);
  const [pendingFormat, setPendingFormat] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSvgPreset, setPendingSvgPreset] = useState(null);

  useEffect(() => {
    if (isDeletingRef.current) { 
      isDeletingRef.current = false; 
      return; 
    }

    if (pendingFormat) return;

    const filesToProcess = reprocessAll ? originalFiles : pendingFiles;
    if (filesToProcess.length === 0) return;

    let cancelled = false;

    async function run() {
      const { images: newImages, hadError } = await upload_files(filesToProcess, {
        format: imageFormat,
        svgPreset,
        onStart: () => setUploading(true),
        onProgress: setProgress,
        onFinish: () => setUploading(false),
        onSlow: () => toast.info('Este proceso puede tardar un poco...'),
        slowAfter: 2500,
        onError: ({ file }) => toast.error(`Formato no soportado: ${file.name}`)
      });

      if (cancelled) return;

      if (reprocessAll) {
        setImages(newImages);
      } else {
        setImages(prev => [...newImages, ...prev]);
      }

      setPendingFiles([]);
      setReprocessAll(false);

      if (newImages.length > 0 && !hadError) {
        const extensionMap = {
          'image/jpeg': 'JPG',
          'image/png': 'PNG',
          'image/webp': 'WEBP',
          'image/svg+xml': 'SVG'
        };
        toast.success(`Conversión completa a ${extensionMap[imageFormat]}`);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [pendingFiles, imageFormat, svgPreset, reprocessAll]);


  function handleUpload(files) {
    isDeletingRef.current = false;

    setOriginalFiles(prev => {
      const existingKeys = new Set(
        prev.map(f => `${f.name}-${f.size}-${f.lastModified}`)
      );

      const newUniqueFiles = Array.from(files).filter(f => {
        const key = `${f.name}-${f.size}-${f.lastModified}`;
        return !existingKeys.has(key);
      });

      if (newUniqueFiles.length < files.length) {
        toast.info('Algunas imágenes ya estaban cargadas y se omitieron');
      }

      setPendingFiles(newUniqueFiles);
      return [...prev, ...newUniqueFiles];
    });
  }

  async function handleCopy(img) {
    try {
      const blob = img.blob;
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      toast.success('Imagen copiada al portapapeles');
    } catch (err) {
      toast.error('No se pudo copiar la imagen');
      console.error(err);
    }
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
        <p>Convertir imágenes a...</p>
        <FormatSelect
          value={imageFormat}
          onChange={(nextFormat) => {
            if (nextFormat === imageFormat) return;

            if (images.length <= 4) {
              setImageFormat(nextFormat);
              setReprocessAll(true);
              return;
            }

            setPendingFormat(nextFormat);
            setConfirmOpen(true);
          }}
          svgPreset={svgPreset}
          onSvgPresetChange={(nextPreset) => {
            if (nextPreset === svgPreset) return;

            if (images.length <= 4) {
              setSvgPreset(nextPreset);
              setReprocessAll(true);
              return;
            }

            setPendingFormat('image/svg+xml');
            setPendingSvgPreset(nextPreset);
            setConfirmOpen(true);
          }}
        />
      </section>


      <section className={stylesConverter['processed-image-container']}>
        <div className={stylesConverter['processed-image-inner-container-blank-border']}>
          <div className={stylesConverter['processed-image-inner-container']}>
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
                onCopy={() => handleCopy(img)}
              />
            ))}
          </div>
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
      <ConfirmPanel
        open={confirmOpen}
        title="¿Cambiar formato?"
        message="Hay varias imágenes cargadas. Esto volverá a convertirlas a todas."
        onConfirm={() => {
          if (pendingFormat) setImageFormat(pendingFormat);
          if (pendingSvgPreset) setSvgPreset(pendingSvgPreset);

          setReprocessAll(true);
          setPendingFormat(null);
          setPendingSvgPreset(null);
          setConfirmOpen(false);
        }}
        onCancel={() => {
          setPendingFormat(null);
          setPendingSvgPreset(null);
          setConfirmOpen(false);
        }}
      />

    </main>
  );
}