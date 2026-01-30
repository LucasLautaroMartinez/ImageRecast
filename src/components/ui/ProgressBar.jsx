import '../../styles/progressBar.css';

export default function ProgressBar({visible, progress}) {
  return (
    <div className="progress">
      <div
        className={`progress-bar ${visible ? '' : 'hidden'}`}
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
}