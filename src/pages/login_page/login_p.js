import React from 'react';
import './login_p.css';
import LoginForm from '../../components/LoginForm/LoginForm'; // Importando o componente
import Login from "../../images/login-bg.png";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="luz" /> {/* Novo contêiner para o efeito de iluminação */}
        <img src={Login} alt="Car Image" className="car-image" />
      </div>

      <div className="login-right">
        <LoginForm /> {/* Usando o componente LoginForm */}
      </div>
    </div>
  );
};

export default LoginPage;
