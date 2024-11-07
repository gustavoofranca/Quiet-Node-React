import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login_page/login_p'; 
import HomePage from './pages/Home/home_p';
import UserConfig from './components/userConfig/userConfig_comp';

// import NotFound from './components/NotFound'; // exemplo de uma página 404

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user-config" element={<UserConfig />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;