// LoginForm.js
import React, { useContext, useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './loginform.css';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext'; // Importar o contexto do tema

// Bibliotecas para criação e verificação de Usuário
import { auth, db } from '../../firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

const LoginComp = () => {
  const { theme } = useContext(ThemeContext); // Acessar o tema atual
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        sessionStorage.setItem('userData', JSON.stringify(userData));
      } else {
        setUser(false);
        setUserInfo([]);
        sessionStorage.removeItem('userData');
      }
    });
    return () => verifyLogin();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function loginUser(event) {
    event.preventDefault();
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Usuário logado com sucesso!', { className: 'toast-success' });

      const querySnapshot = await getDocs(collection(db, 'users'));
      const userDoc = querySnapshot.docs.find(doc => doc.data().email === email);

      if (userDoc) {
        const userData = {
          uid: value.user.uid,
          email: value.user.email,
          username: userDoc.data().username,
          userImage: userDoc.data().userImage || 'https://images.unsplash.com/photo-1664548726438-8ca4728829b1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        };
        setUser(true);
        setUserInfo(userData);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        // Redireciona para a página "home" após o login bem-sucedido
        navigate('/home');
      } else {
        console.log("Erro: Usuário não encontrado na coleção 'users'.");
      }

      setEmail('');
      setPassword('');
    } catch {
      toast.error('Erro ao fazer o login!', { className: 'toast-error' });
    }
  }

  async function createUser(event) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.warn('Por favor, preencha o email e a senha.', { className: 'toast-warn' });
      return null;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      setEmail('');
      setPassword('');
      return uid;
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        toast.error('Senha muito fraca!', { className: 'toast-error' });
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email já cadastrado!', { className: 'toast-error' });
      }
      return null;
    }
  }

  async function createUserInfo(uid) {
    if (!username.trim()) {
      toast.warn('Por favor, preencha o campo Apelido.', { className: 'toast-warn' });
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
    const uid = await createUser(event);

    if (uid) {
      await createUserInfo(uid);
      sessionStorage.setItem('userData', JSON.stringify({ uid, username, email }));
      toast.success('Cadastro completo com sucesso!', { className: 'toast-success' });
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`login-box ${theme}`}>
        <div className="logo-container">
          {/* Troca da logo com base no tema */}
          <img
            src={require(`../../images/quiet-logo${theme === 'light' ? '-preto' : ''}.png`)}
            alt="Quiet Racing Club"
            className="logo"
          />
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
