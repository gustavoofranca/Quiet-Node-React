import React, { useContext } from 'react';
import './login_p.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import Login from "../../images/login-bg.png";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext'; // Usando o hook useTheme para acessar o contexto do tema

const LoginPage = () => {
  const { currentTheme, toggleTheme } = useTheme(); // Acessando o tema atual e o método de alternância

  return (
    <div className={`login-container ${currentTheme}`}> {/* Aplicando o tema ao container */}
      <div className="login-left">
        <div className="luz" />
        <img 
          src={currentTheme === 'light' ? require('../../images/login-bg-light.jpg') : Login} 
          alt="Car Image" 
          className="car-image" 
        />
      </div>

      <div className="login-right">
        {/* Switch de tema */}
        <div className="switch-container">
          <label htmlFor="theme-switch" className="switch-label">
            {currentTheme === 'light' ? <FaSun /> : <FaMoon />}
          </label>
          <input
            id="theme-switch"
            type="checkbox"
            onChange={toggleTheme}
            checked={currentTheme === 'dark'}
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
