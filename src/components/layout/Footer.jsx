import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faCopy, faCheck, faClone } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import imageRecastLogo from "../../assets/image-recast-logo.svg?react";
import '../../styles/footer.css';

const Footer = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const socialLinks = [
    { icon: <FontAwesomeIcon icon={faGithub} />, base: 'https://github.com/', user: 'LucasLautaroMartinez', type: 'link', tooltip: 'GitHub' },
    { 
      icon: <FontAwesomeIcon icon={copiedEmail ? faCheck : faClone} />, 
      email: 'lucaslautaromartinez@gmail.com', 
      user: 'lucaslautaromartinez@gmail.com',
      type: 'email',
      tooltip: 'Copiar mail'
    }
  ];

  const handleSocialClick = (link) => {
    if (link.type === 'email') {
      const emailText = link.email || link.user;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText).then(() => {
          setCopiedEmail(true);
          setTimeout(() => {
            setCopiedEmail(false);
          }, 2000);
        }).catch(() => {
          usarFallback(emailText);
        });
      } else {
        usarFallback(emailText);
      }
    } else {
      window.open(link.base + link.user, '_blank', 'noopener,noreferrer');
    }
  };

  const usarFallback = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedEmail(true);
        setTimeout(() => {
          setCopiedEmail(false);
        }, 2000);
      }
    } catch (fallbackErr) {
      alert('No se pudo copiar el email. Por favor, copielo manualmente: ' + text);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="footer-container">
        <div className="footer-author">
          <span className="footer-author-label">Página creada por:</span>
          <span className="footer-author-name">Lucas L<span>.</span> Martinez</span>
        </div>

        <div className="footer-logo">
          <img src={imageRecastLogo} alt="logo" className='logo-footer-svg' />
        </div>

        <div className="footer-social">
          {socialLinks.map((link, index) => (
            <button
              key={index}
              className={`footer-social-link ${link.type === 'email' ? 'footer-social-email' : ''}`}
              onClick={() => handleSocialClick(link)}
              aria-label={link.type === 'email' ? 'Copiar email al portapapeles' : `Visitar perfil de ${link.user}`}
            >
              {link.icon}
              <span className="footer-social-text" data-user={link.user}>
                {link.type === 'email' ? link.email : `@${link.user}`}
              </span>
              <span className="footer-tooltip">
                {link.type === 'email' && copiedEmail ? '¡Copiado!' : link.tooltip}
              </span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;