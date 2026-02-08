import { createHashRouter } from "react-router-dom";
import App from "./App.jsx";
// import Home from "./pages/Home";
import Converter from "./pages/Converter.jsx";
import ColorRemover from "./pages/ColorRemover.jsx";
// import About from "./pages/About";
import NotFound from "./pages/NotFound.jsx";

import InfoConverter from './components/info/info-converter.jsx'

export const router = createHashRouter([
  {
    element: <App />,
    // errorElement: <NotFound />,
    children: [
      // { path: "/", element: <Home />, handle: { title: "" } },
      { path: "/converter",
        element: <Converter />,
        handle: {
          title: "Convertidor de imágenes",
          info: <InfoConverter/>
        }
      },
      { path: "/color-remover",
        element: <ColorRemover />,
        handle: {
          title: "Eliminador de colores",
          info: null
        }
      },
      { path: "*",
        element: <NotFound />,
        handle: {
          title: "Página no encontrada",
          info: null
        }
      }
      // { path: "/about", element: <About /> }
    ]
  }
]);