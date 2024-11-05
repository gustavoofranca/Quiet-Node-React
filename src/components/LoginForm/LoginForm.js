import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import './loginform.css';
import { FcGoogle } from "react-icons/fc";
import { redirect, useNavigate } from 'react-router-dom';

// Bibliotecas para criação e verificação de Usuário
import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const LoginComp = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState(false);
  const [detalhesUsuario, setDetalhesUsuario] = useState({});

  // Verificação de login
  useEffect(() => {
    const verificarLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(true);
        setDetalhesUsuario({
          uid: user.uid,
          email: user.email
        });
      } else {
        setUsuario(false);
        setDetalhesUsuario({});
      }
    });
    return () => verificarLogin();
  }, []);

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert('Usuário cadastrado com sucesso!');
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert('Senha muito fraca!');
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já cadastrado!');
        }
      });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert('Usuário logado com sucesso!');
        setUsuario(true);
        setDetalhesUsuario({
          uid: value.user.uid,
          email: value.user.email
        });
        setEmail('');
        setSenha('');
        redirect('/home');
      })
      .catch(() => {
        alert('Erro ao fazer o login!');
      });
  }

  

  const navigate = useNavigate();




  return (
    <div className="login-box">
      <div className="logo-container">
        <img src={require('../../images/quiet-logo.png')} alt="Quiet Racing Club" className="logo" />
      </div>

      <h2>Criar uma conta</h2>

      <form>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Digite um email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="password-container">
            <input type="password" placeholder="Digite uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <FaEye className="icon-eye" />
          </div>
        </div>

        <button type="submit" className="btn-login" onClick={logarUsuario}>Entrar</button>

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