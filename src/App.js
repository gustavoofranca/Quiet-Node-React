import React from 'react';
import { FaEye, FaGoogle, FaEyeSlash } from 'react-icons/fa'; 
import './App.css'; // Arquivo CSS para estilização
import  Login  from "./images/login-bg.png"
import Logo from "./images/quiet-logo.png"


const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <img src={Login} alt="Car Image" className="car-image" />
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="logo-container">
            <img src={Logo} alt="Quiet Racing Club" className="logo" />
          </div>
          
          <h2>Criar uma conta</h2>

          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="example@gmail.com" required />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="password-container">
                <input type="password" id="password" placeholder="Digite sua senha" required />
                <FaEye className="icon-eye" />
              </div>
            </div>

            <button type="submit" className="btn-primary">Criar Conta</button>

            <button type="button" className="btn-google">
              <FaGoogle className="icon-google" /> Continue com Google
            </button>

            <p className="login-footer">
              Já tem uma conta? <a href="/login">Faça Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
