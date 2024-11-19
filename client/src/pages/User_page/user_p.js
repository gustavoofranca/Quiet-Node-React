// user_p.js - Caminhos corrigidos
import React from 'react';
import './user_p.css';
import UserConfig from '../../components/userConfig/userConfig_comp';

// Corrigir os caminhos para subir um nível da pasta User_page
import LoginPage from '../login_page/login_p'; // Corrigido: subir um nível
import HomePage from '../Home/home_p';         // Corrigido: subir um nível
import LocalizacaoPage from '../Localizacao/localizacao_p'; // Corrigido: subir um nível

const UserPage = () => {
    return (
        <div>
            <UserConfig />
        </div>
    );
};

export default UserPage;
