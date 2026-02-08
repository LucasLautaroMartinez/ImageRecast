import '../../styles/imageCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTrashCan, faClipboard } from '@fortawesome/free-solid-svg-icons'

export default function ImageCard({ fileName, fileSize, thumbnail, onDownload, onDelete, onPreview, onCopy }) {

  return (
    <div className="file-item">
      <div className="file-thumbnail" onClick={onPreview} style={{ cursor: 'pointer' }}>
        <img src={thumbnail} alt={fileName} />
      </div>
      
      <div className="file-info">
        <div className="file-name">{fileName}</div>
        <div className="file-size">{fileSize}</div>
      </div>
      
      <div className="file-actions">
        <button
          className="file-action-button copy-button"
          onClick={onCopy}
          aria-label="Copiar imagen"
        >
        <FontAwesomeIcon icon={faClipboard} />
        </button>
        <button 
          className="file-action-button download-button"
          onClick={onDownload}
          aria-label="Descargar archivo"
        >
        <FontAwesomeIcon icon={faDownload} />
        </button>
        
        <button 
          className="file-action-button delete-button"
          onClick={onDelete}
          aria-label="Eliminar archivo"
        >
        <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};