// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './styles/index.css'
// import App from './pages/App.jsx'

// const router = createBrowserRouter([
//   {path: "/", element: <App/>},
// ]);

// createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <RouterProvider router={router} />
//     </StrictMode>
  
// )

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import ReactDOM from "react-dom/client";
import './styles/index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);