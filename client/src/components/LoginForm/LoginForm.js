import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './loginform.css';
import { FcGoogle } from "react-icons/fc";

// Bibliotecas para criação e verificação de Usuário
import { auth, db } from '../../firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

const LoginComp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Novo estado para controle de visibilidade da senha

  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  const [action, setAction] = useState('Login');

  // Verificação de login
  useEffect(() => {
    const verifyLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
        const userData = {
          uid: user.uid,
          email: user.email
        };
        setUserInfo(userData);
        // Salva informações no sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(userData));
      } else {
        setUser(false);
        setUserInfo([]);
        sessionStorage.removeItem('userData');
      }
    });
    return () => verifyLogin();
  }, []);

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Função para salvar o username junto com email e uid no sessionStorage após o login
  async function loginUser(event) {
    event.preventDefault();
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      alert('Usuário logado com sucesso!');

      // Busca o usuário na coleção "users" para obter o username
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userDoc = querySnapshot.docs.find(doc => doc.data().email === email);

      if (userDoc) {
        const userData = {
          uid: value.user.uid,
          email: value.user.email,
          username: userDoc.data().username, // adiciona o username recuperado
          userImage: userDoc.data().userImage || 'https://images.unsplash.com/photo-1664548726438-8ca4728829b1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        };
        setUser(true);
        setUserInfo(userData);
        sessionStorage.setItem('userData', JSON.stringify(userData)); // Salva todos os dados no sessionStorage
      } else {
        console.log("Erro: Usuário não encontrado na coleção 'users'.");
      }

      setEmail('');
      setPassword('');
    } catch {
      alert('Erro ao fazer o login!');
    }
  }

  async function createUser(event) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('Por favor, preencha o email e a senha.');
      return null; // Retorna null se os campos estiverem vazios
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Obtém o uid do usuário criado
      setEmail('');
      setPassword('');
      return uid; // Retorna o uid em caso de sucesso
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        alert('Senha muito fraca!');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('Email já cadastrado!');
      }
      return null; // Retorna null em caso de erro
    }
  }

  async function createUserInfo(uid) {
    if (!username.trim()) {
      alert('Por favor, preencha o campo Apelido.');
      return;
    }

    try {
      await addDoc(collection(db, 'users'), {
        uid: uid,
        username: username,
        userImage: 'https://images.unsplash.com/photo-1664548726438-8ca4728829b1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: email,
        password: password
      });

      setUsername('');
      setUserImage('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log("Erro ao salvar informações adicionais do usuário:", error);
    }
  }

  async function createFinalUser(event) {
    event.preventDefault();

    // Primeiro, tenta criar o usuário com createUser
    const uid = await createUser(event);

    // Se createUser for bem-sucedido e uid não for null, então executa createUserInfo
    if (uid) {
      await createUserInfo(uid);

      // Salva o uid, username e email no sessionStorage após as duas operações serem concluídas
      sessionStorage.setItem('userData', JSON.stringify({ uid, username, email }));
      alert('Cadastro completo com sucesso!');
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
                type={showPassword ? "text" : "password"} // Alterna entre "text" e "password"
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
