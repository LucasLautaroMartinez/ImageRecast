import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../../styles/infoPanel.css';

export default function InfoPanel({ content }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (visible) {
      gsap.fromTo(
        panelRef.current,
        { y: '-120vh', scale: 0.95, opacity: 1 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'bounce.out',
        }
      );
    }
  }, [visible]);

  const openPanel = () => {
    setVisible(true);
    setOpen(true);
  };

  const closePanel = () => {
    gsap.to(panelRef.current, {
      scale: 0.85,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setOpen(false);
        setVisible(false);
      },
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      closePanel();
    }
  };

  return (
    <>
      <button className="info-button" onClick={openPanel} aria-label="Información">
        i
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="info-overlay"
          onMouseDown={handleOverlayClick}
        >
          <div ref={panelRef} className="info-panel">
            <button className="info-close" onClick={closePanel} aria-label="Cerrar">
              ×
            </button>

            <div className="info-content">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}