import '../../styles/progressBar.css';

const ProgressBar = ({visible, progress}) => {

  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: `${progress}%`, display: `${visible ? 'block' : 'none'}` }}>
        {progress}%
      </div>
    </div>
  );
}

export default ProgressBar