import React from 'react';
import { FaEye } from 'react-icons/fa';
import './loginform.css';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const LoginComp = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    // Aqui você pode adicionar a lógica para criar a conta (se necessário)

    // Após a lógica de criação da conta, redireciona para a página home
    navigate('/home');
  };

  return (
    <div className="login-box">
      <div className="logo-container">
        <img src={require('../../images/quiet-logo.png')} alt="Quiet Racing Club" className="logo" />
      </div>

      <h2>Criar uma conta</h2>

      <form onSubmit={handleSubmit}> {/* Adiciona a função handleSubmit */}
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