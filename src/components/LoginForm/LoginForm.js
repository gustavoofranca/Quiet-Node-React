import React from 'react';
import { FaEye, FaGoogle } from 'react-icons/fa'; 
import './loginform.css';
import { FcGoogle } from "react-icons/fc";

const LoginComp = () => {
  return (
    <div className="login-box">
      <div className="logo-container">
        <img src={require('../../images/quiet-logo.png')} alt="Quiet Racing Club" className="logo" />
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
        <FcGoogle className="icon-google" /> Continue com Google
        </button>

        <p className="login-footer">
          Já tem uma conta? <a href="/login">Faça Login</a>
        </p>
      </form>
    </div>
  );
};

export default LoginComp;
