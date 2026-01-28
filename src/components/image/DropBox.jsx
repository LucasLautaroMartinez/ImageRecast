import { useState, useRef } from 'react';
import '../../styles/dropbox.css';

const ImageUploadDropzone = ({ onFilesSelected }) => {
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

      <div className="dropzone-content">
        <div className="dropzone-header">
          <svg 
            className="dropzone-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 640 640"
          >
            <path d="M192 64C156.7 64 128 92.7 128 128L128 368L310.1 368L279.1 337C269.7 327.6 269.7 312.4 279.1 303.1C288.5 293.8 303.7 293.7 313 303.1L385 375.1C394.4 384.5 394.4 399.7 385 409L313 481C303.6 490.4 288.4 490.4 279.1 481C269.8 471.6 269.7 456.4 279.1 447.1L310.1 416.1L128 416.1L128 512.1C128 547.4 156.7 576.1 192 576.1L448 576.1C483.3 576.1 512 547.4 512 512.1L512 234.6C512 217.6 505.3 201.3 493.3 189.3L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/>
          </svg>

          <div className="dropzone-size-info">
            <p className="dropzone-info-big">WEBP, JPG, PNG, SVG</p>
            <p className="dropzone-size-description">Formatos de archivo admitidos</p>
          </div>
        </div>

        <p className="dropzone-instructions">
          Arrastre hasta aquí los archivos, o haga clic para
          abrir el explorador de archivos
        </p>
      </div>

      {isDragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-plus">+</div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadDropzone;