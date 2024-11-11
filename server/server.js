const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./controllers/postRoutes');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Usar as rotas de posts
app.use(postRoutes);


// Conexão com o MongoDB
const MONGO_URI = 'mongodb+srv://admin:47gqZtrB1p5sNegS@quiet.g7ahz.mongodb.net/?retryWrites=true&w=majority&appName=Quiet';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Definição do modelo de usuário
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userImage: String,
});

const User = mongoose.model('User', userSchema);

// Rotas de API para salvar e buscar usuários
app.post('/api/register', async (req, res) => {
    const { username, email, password, userImage } = req.body;

    try {
        const newUser = new User({ username, email, password, userImage });
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: 'Usuário logado com sucesso!', user });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para obter os dados do usuário com base no uid
app.get('/api/users/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findOne({ uid });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
