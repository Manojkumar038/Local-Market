import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import StorePage from "./pages/StorePage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<StorePage />} />
      </Routes>
    </>
  );
}
