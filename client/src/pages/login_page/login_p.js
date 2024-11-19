import React, { useContext } from 'react';
import './login_p.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import Login from "../../images/login-bg.png";
import { ThemeContext } from '../../context/ThemeContext'; // Importar o contexto do tema

const LoginPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Acessar o tema atual e o método de alternância

  return (
    <div className={`login-container ${theme}`}>
      <div className="login-left">
        <div className="luz" />
        <img src={Login} alt="Car Image" className="car-image" />
      </div>

      <div className="login-right">
        {/* Switch de tema */}
        <div className="switch-container">
          <label htmlFor="theme-switch" className="switch-label">
            {theme === 'light' ? '🌞' : '🌙'}
          </label>
          <input
            id="theme-switch"
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === 'dark'}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Formulário de login */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;