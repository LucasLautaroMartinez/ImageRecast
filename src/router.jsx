import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
// import Home from "./pages/Home";
import Converter from "./pages/Converter.jsx";
// import About from "./pages/About";
import NotFound from "./pages/NotFound.jsx";

export const router = createBrowserRouter([
  {
    element: <App />,
    // errorElement: <NotFound />,
    children: [
      // { path: "/", element: <Home />, handle: { title: "" } },
      { path: "/converter", element: <Converter />, handle: { title: "Convertidor de imágenes" } },
      { path: "*", element: <NotFound />, handle: { title: "Página no encontrada" } }
      // { path: "/about", element: <About /> }
    ]
  }
]);