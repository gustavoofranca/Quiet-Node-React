// router.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage'; // ajuste os imports para seu projeto
import LoginPage from './pages/login_page/login_p'; // ajuste os imports para
// import NotFound from './components/NotFound'; // exemplo de uma página 404

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        {/* Adicione outras rotas conforme necessário */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
