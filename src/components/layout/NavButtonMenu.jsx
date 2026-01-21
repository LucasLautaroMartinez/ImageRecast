import { Link } from 'react-router-dom';

function NavButton() {
  return (
    <Link to="/tu-ruta" className="nav-button">
      Tu Texto
    </Link>
  );
}

export default NavButton;