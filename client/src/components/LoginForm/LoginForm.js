import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './loginform.css';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginComp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [action, setAction] = useState('Login');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function loginUser(event) {
    event.preventDefault();
    try {
      // Envia os dados para o backend para autenticação
      const response = await axios.post('http://localhost:5000/api/login', { username, password, email });

      const userData = response.data.user; // Ajuste conforme a resposta da API

      if (userData) {
        toast.success('Usuário logado com sucesso!', { className: 'toast-success' });

        // Salva os dados do usuário (incluindo a imagem) no sessionStorage
        const userDataToSave = {
          username: userData.username,
          email: userData.email,
          userImage: userData.userImage, // Incluindo a imagem aqui
        };

        sessionStorage.setItem('userData', JSON.stringify(userDataToSave));

        // Redireciona para a página "home" após o login bem-sucedido
        navigate('/home');
      } else {
        toast.error('Erro ao fazer o login! Dados não encontrados.', { className: 'toast-error' });
      }

      // Limpa os campos após o login
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error('Erro ao fazer o login!', { className: 'toast-error' });
    }
  }


  async function createFinalUser(event) {
    event.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.warn('Por favor, preencha todos os campos.', { className: 'toast-warn' });
      return;
    }

    try {
      const userImageURL = 'https://images.unsplash.com/photo-1664548726438-8ca4728829b1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      await axios.post('http://localhost:5000/api/register', {
        username: username,
        email: email,
        password: password,
        userImage: userImageURL,
      });

      toast.success('Cadastro completo com sucesso!', { className: 'toast-success' });
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error('Erro ao registrar usuário!', { className: 'toast-error' });
    }
  }

  return (
    <>

      <div className="login-box">
        <div className="logo-container">
          <img src={require('../../images/quiet-logo.png')} alt="Quiet Racing Club" className="logo" />
        </div>

        <h2>{action}</h2>

        {action === "Login" ? null : (
          <div className="input-group">
            <label htmlFor="username">Apelido</label>
            <input type="text" placeholder="Digite um apelido" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        )}

        <form>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Digite um email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash className="icon-eye" /> : <FaEye className="icon-eye" />}
              </span>
            </div>
          </div>

          {action === "Login" ? (
            <>
              <button className="btn-login" onClick={loginUser}>Entrar</button>
              <button type="button" className="btn-google">
                <FcGoogle className="icon-google" /> Continue com Google
              </button>
              <p className="login-footer">
                Ainda não tem uma conta? <a onClick={() => { setAction('Sign Up') }}>Cadastre-se</a>
              </p>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={createFinalUser}>Cadastrar-se</button>
              <p className="login-footer">
                Já possui uma conta? <a onClick={() => { setAction('Login') }}>Entre</a>
              </p>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginComp;
