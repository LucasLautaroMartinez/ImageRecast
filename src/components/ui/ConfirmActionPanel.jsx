import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../../styles/confirmActionPanel.css';

export default function ConfirmPanel({ open, title, message, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else if (visible) {
      closePanel();
    }
  }, [open]);

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

  const closePanel = () => {
    gsap.to(panelRef.current, {
      scale: 0.85,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setVisible(false);
      },
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onCancel?.();
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="confirm-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div ref={panelRef} className="confirm-panel">
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}