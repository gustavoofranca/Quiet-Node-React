import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login_page/login_p';
import HomePage from './pages/Home/home_p';
import LocalizacaoPage from './pages/Localizacao/locaizacao_p'; // Caminho corrigido

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/localizacao" element={<LocalizacaoPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
