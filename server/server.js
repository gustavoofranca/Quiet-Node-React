const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para servir arquivos estáticos do React (se já compilado)
app.use(express.static(path.join(__dirname, 'public')));



// Definir rotas para os diferentes endpoints

// Rota para a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página Home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a configuração do usuário
app.get('/user-config', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para página 404 (caso uma rota não seja encontrada)
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
