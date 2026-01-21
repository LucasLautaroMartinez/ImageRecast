import { Outlet, useMatches } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Menu from "./components/layout/Menu.jsx";

export default function App() {
  const matches = useMatches();
  const current = matches[matches.length - 1];

  return (
    <>
      <Header title={current?.handle?.title} />
      <Menu />

      <Outlet />

      <Footer />
    </>
  );
}
