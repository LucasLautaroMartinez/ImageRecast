import { useEffect, useRef, useState } from "react";
import { initDesktopMenu, initMobileMenu } from "../../services/menu-interactions";
import { Link } from 'react-router-dom';
import imageRecastImagotipo from "../../assets/image-recast-imagotipo.svg?react";
import "../../styles/menu.css";

function Menu() {
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;

    let cleanup;
    if (isMobile) {
      cleanup = initMobileMenu(menuRef.current);
    } else {
      cleanup = initDesktopMenu(menuRef.current);
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isMobile]);

  const menuItems = [
    { id: "a", label: "Herramientas" },
    { id: null, label: "Quién soy", link: "/converter" },
    { id: null, label: "Contactos", link: "#footer" },
    { id: "c", label: "Ayuda" }
  ];

  const menuContent = {
    a: (
      <>
        <Link id="1" to="/converter" className="nav-button">
          Convertidor de imágenes
        </Link>
        <Link id="2" to="#" className="nav-button">
          PickUp Color
        </Link>
        <Link id="3" to="/color-remover" className="nav-button">
          ColorRemover
        </Link>
      </>
    ),
    c: (
      <>
        <Link id="4" to="#" className="nav-button">
          Formatos de archivos
        </Link>
        <Link id="5" to="#" className="nav-button">
          Método de conversión
        </Link>
      </>
    )
  };

  return (
    <div className="menu-wrapper" ref={menuRef}>
      {/* DESKTOP MENU */}
      {!isMobile && (
        <div className="menu-hover-area" id="menu-desktop">
          <nav className="navbar">
            <div className="logo">
              <img src={imageRecastImagotipo} alt="" className='imagotipo-svg' />
            </div>

            <ul className="nav-items">
              {menuItems.map((item, idx) => (
                <li key={idx} data-menu={item.id} className={!item.id ? "no-menu" : ""}>
                  <span 
                    className="menu-label"
                    onClick={item.label === "Contactos" ? (e) => {
                      e.preventDefault();
                      const el = document.querySelector("#footer");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                      }
                    } : undefined}
                    style={item.label === "Contactos" ? { cursor: 'pointer' } : undefined}
                  >
                    {item.label}
                  </span>
                  {item.id && (
                    <svg
                      className="menu-arrow"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mega-menu">
            {Object.entries(menuContent).map(([key, content]) => (
              <div key={key} className="menu-panel" data-panel={key}>
                {content}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {isMobile && (
        <>
          <div className="mobile-topbar" id="menu-mobile">
            <div className="logo">
              <img src={imageRecastImagotipo} alt="" className='imagotipo-svg' />
            </div>
            <button className="hamburger" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div className="mobile-overlay"></div>

          <aside className="mobile-sidebar">
            <div className="sidebar-header">
              <div className="logo">
                <img src={imageRecastImagotipo} alt="" className='imagotipo-svg' />
              </div>
            </div>

            <nav className="sidebar-nav">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  {item.id ? (
                    <div className="sidebar-item" data-submenu={item.id}>
                      <span>{item.label}</span>
                      <svg
                        className="submenu-arrow"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                      >
                        <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
                      </svg>
                    </div>
                  ) : item.label === "Contactos" ? (   /* ← CAMBIO */
                    <div
                      className="sidebar-item sidebar-item-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.querySelector("#footer");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                        }
                      }}
                    >
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link to={item.link || "#"} className="sidebar-item sidebar-item-link">
                      <span>{item.label}</span>
                    </Link>
                  )}
                  {item.id && (
                    <div className="sidebar-submenu" data-submenu-content={item.id}>
                      <div className="submenu-inner">
                        {menuContent[item.id]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}

export default Menu;