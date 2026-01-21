import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons'
import imageRecastLogo from "../../assets/image-recast-logo.svg?react";
import '../../styles/footer.css';

const Footer = () => {
  const socialLinks = [
    { icon: <FontAwesomeIcon icon={faGithub} />, base: 'https://github.com/', user: 'LucasLautaroMartinez' },
    { icon: <FontAwesomeIcon icon={faFacebook} />, base: 'https://github.com/', user: 'otrousuario' },
    { icon: <FontAwesomeIcon icon={faFacebook} />, base: 'https://github.com/', user: 'usuario3' }
  ];

  const handleSocialClick = (base, user) => {
    window.open(base + user, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
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
              className="footer-social-link"
              onClick={() => handleSocialClick(link.base, link.user)}
              aria-label={`Visitar perfil de ${link.user}`}
            >
              {link.icon}
              <span className="footer-social-text" data-user={link.user}>
                @{link.user}
              </span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;