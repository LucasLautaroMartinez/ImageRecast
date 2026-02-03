import { createHashRouter } from "react-router-dom";
import App from "./App.jsx";
// import Home from "./pages/Home";
import Converter from "./pages/Converter.jsx";
import ColorRemover from "./pages/ColorRemover.jsx";
// import About from "./pages/About";
import NotFound from "./pages/NotFound.jsx";

export const router = createHashRouter([
  {
    element: <App />,
    // errorElement: <NotFound />,
    children: [
      // { path: "/", element: <Home />, handle: { title: "" } },
      { path: "/converter", element: <Converter />, handle: { title: "Convertidor de imágenes" } },
      { path: "/color-remover", element: <ColorRemover />, handle: { title: "Eliminador de colores" } },
      { path: "*", element: <NotFound />, handle: { title: "Página no encontrada" } }
      // { path: "/about", element: <About /> }
    ]
  }
]);