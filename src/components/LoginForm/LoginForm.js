import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import './loginform.css';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

// Bibliotecas para criação e verificação de Usuário
import { auth, db } from '../../firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const LoginComp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const [action, setAction] = useState('Login');

  // Verificação de login
  useEffect(() => {
    const verifyLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
        setUserInfo({
          uid: user.uid,
          email: user.email
        });
      } else {
        setUser(false);
        setUserInfo({});
      }
    });
    return () => verifyLogin();
  }, []);

  async function loginUser(event) {
    event.preventDefault();
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      alert('Usuário logado com sucesso!');
      setUser(true);
      setUserInfo({
        uid: value.user.uid,
        email: value.user.email
      });
      setEmail('');
      setPassword('');
    } catch {
      alert('Erro ao fazer o login!');
    }
  }

  async function createUser(event) {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Usuário cadastrado com sucesso!');
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        alert('Senha muito fraca!');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('Email já cadastrado!');
      }
    }
  }

  async function createUserInfo(event) {
    event.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert('Por favor, preencha todos os campos (Apelido, email e senha).');
      return;
    }

    try {
      await addDoc(collection(db, 'users'), {
        username: username,
        email: email,
        password: password
      });
      alert('Cadastro realizado com sucesso!');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error);
    }
  }

  function createFinalUser(event) {
    event.preventDefault();
    createUserInfo(event);
    createUser(event);
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
              <input type="password" placeholder="Digite uma senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              <FaEye className="icon-eye" />
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
