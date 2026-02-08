import { useState, useRef, useEffect } from 'react';
import '../../styles/dropbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'

export default function ImageUploadDropzone({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  function handleFiles(files) {
    const images = Array.from(files).filter(f =>
      f.type.startsWith('image/')
    );
    if (images.length) {
      onFilesSelected?.(images);
    }
  }

  useEffect(() => {
    function handlePaste(e) {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files = [];

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length) {
        handleFiles(files);
      }
    }

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  function handleDragEnter(e) {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleClick() {
    document.getElementById('file-input-hidden').click();
  }

  return (
    <div
      className={`dropzone-container ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        id="file-input-hidden"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        hidden
        onChange={e => {
          handleFiles(e.target.files);
          e.target.value = null;
        }}
      />
      <div className='dropzone-blank-border'>
        <div className="dropzone-content">
          <FontAwesomeIcon icon={faImages} className="dropzone-icon" />
          <h1 className='dropbox-h1'>
            Arrastre hasta aquí los archivos
          </h1>
          <p className='dropzone-main-info-text'>o</p>
          <div className='dropzone-controls'>
            <span className='dropzone-controls-btn'>Explorar archivos</span>
            <p className='dropzone-main-info-text'>o puedes</p>
            <span className='dropzone-controls-btn dropzone-controls-btn-ctrl'>Ctrl</span>
            <p className='dropzone-main-info-text'>+</p>
            <span className='dropzone-controls-btn dropzone-controls-btn-v'>V</span>
          </div>
        </div>
        <div className='dropzone-format-info'>
          <p className="dropzone-format-info-text">WEBP</p>
          <p className="dropzone-format-info-text">JPG</p>
          <p className="dropzone-format-info-text">PNG</p>
          <p className="dropzone-format-info-text">SVG</p>
        </div>
      </div>

      {isDragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-plus">+</div>
        </div>
      )}
    </div>
  );
}