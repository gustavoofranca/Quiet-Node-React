import React from 'react';
import './login_p.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import Login from "../../images/login-bg.png";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="luz" />
        <img src={Login} alt="Car Image" className="car-image" />
      </div>

      <div className="login-right">
        <LoginForm /> 
      </div>
    </div>
  );
};

export default LoginPage;
