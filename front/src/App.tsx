import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PolydisVae from "./pages/PolydisVae";
import Polyffusion from "./pages/Polyfffusion";

export type AiModel = {
  modelName: string;
  description: string;
  runPage: string;
}[];

export const aiModel: AiModel = [
  {
    modelName: "polydis-vae",
    description: "aaaaaaaaaaaaaaaa",
    runPage: "PolydisVae",
  },
  {
    modelName: "polyffusion ",
    description: "aaaaaaaaa",
    runPage: "Polyffusion",
  },
];

function App() {
  return (
    <>
      {/* BrowserRouter, Routes, Route の定義、path に一致する element を表示 */}
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/polydis-vae' element={<PolydisVae />} />
          <Route path='/polyffusion' element={<Polyffusion />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
