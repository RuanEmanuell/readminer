import React from 'react';
import logo from './logo.svg';
import Inserir from './pages/inserir';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Busca from './pages/busca';
import Layout from './components/layout';
import Resultado from './pages/resultado';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Inserir></Inserir>} />
          <Route path='/busca' element={<Busca></Busca>}></Route>
          <Route path='/resultado' element={<Resultado></Resultado>}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
