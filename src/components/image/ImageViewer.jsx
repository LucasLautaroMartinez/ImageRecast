import { useEffect, useRef, useState } from 'react';
import '../../styles/imageViewer.css';

export default function ImageViewer({ image, onClose, onDelete, onDownload }) {
  const [zoomed, setZoomed] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  function handleImageClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const offsetX = (clickX / rect.width) * 100;
    const offsetY = (clickY / rect.height) * 100;

    if (!zoomed) {
      setTransform({
        scale: 2.5,
        x: (50 - offsetX) * 2.5,
        y: (50 - offsetY) * 2.5
      });
      setZoomed(true);
    } else {
      setTransform({ scale: 1, x: 0, y: 0 });
      setZoomed(false);
    }
  }

  // evitar scroll cuando se abre la imagen
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);



  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal open">
        <div className="viewer-image-wrapper">
          <button className="viewer-close-top" onClick={onClose}>✕</button>
            <img
              src={image.previewUrl}
              alt={image.name}
              className="viewer-image"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(e);
              }}                style={{
                transform: `translate(${transform.x}%, ${transform.y}%) scale(${transform.scale})`,
                transition: 'transform 0.35s ease'
              }}
            />
          <div className="viewer-footer">
            <div className="viewer-filename">{image.name}</div>
            <div className="viewer-actions">
              <button className="viewer-btn delete" onClick={onDelete}>Eliminar</button>
              <button className="viewer-btn download" onClick={() => onDownload(image)}>Descargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}