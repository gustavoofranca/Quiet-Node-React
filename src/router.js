// router.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login_page/login_p'; // ajuste os imports para
import HomePage from './pages/Home/home_p'; // ajuste os imports para seu projeto
// import NotFound from './components/NotFound'; // exemplo de uma página 404

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;