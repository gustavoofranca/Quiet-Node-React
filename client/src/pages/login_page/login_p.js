import React, { useContext } from 'react';
import './login_p.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import LoginLight from "../../images/login-bg-light.jpg"; // Imagem para o tema claro
import Login from "../../images/login-bg.png"; // Imagem para o tema escuro
import { useTheme } from '../../context/ThemeContext'; // Usando o hook useTheme para acessar o contexto do tema

const LoginPage = () => {
  const { currentTheme, toggleTheme } = useTheme(); // Acessando o tema atual e o método de alternância

  // Definir o caminho da imagem com base no tema atual
  const imageSrc = currentTheme === 'light' ? LoginLight : Login;

  return (
    <div className={`login-container ${currentTheme}`}>
      <div className="login-left">
        <div className="luz" />
        <img src={imageSrc} alt="Car Image" className="car-image" />
      </div>

      <div className="login-right">
        <div className="switch-container">
          <label htmlFor="theme-switch" className="switch-label">
            {currentTheme === 'light' ? '🌞' : '🌙'}
          </label>
          <input
            id="theme-switch"
            type="checkbox"
            onChange={toggleTheme}
            checked={currentTheme === 'dark'}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
