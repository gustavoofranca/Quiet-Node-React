import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login_page/login_p';
import HomePage from './pages/Home/home_p';
import LocalizacaoPage from './pages/Localizacao/localizacao_p';
import UserPage from './pages/User_page/user_p';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/localizacao" element={<LocalizacaoPage />} />
                <Route path="/user-config" element={<UserPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
