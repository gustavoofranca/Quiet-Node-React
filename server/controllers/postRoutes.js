const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// **1. Rota para obter todos os posts**
router.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();  // Retorna todos os posts
        res.json(posts);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).send('Erro ao buscar posts.');
    }
});

// **2. Rota para adicionar um novo post**
router.post('/api/posts', async (req, res) => {
    const { owner, description, image } = req.body;

    const newPost = new Post({
        owner,
        description,
        image,
    });

    try {
        const savedPost = await newPost.save();  // Salva o novo post no banco
        res.json(savedPost);
    } catch (error) {
        console.error('Erro ao adicionar post:', error);
        res.status(500).send('Erro ao adicionar post.');
    }
});

// **3. Rota para editar um post**
router.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { owner, description, image } = req.body;

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { owner, description, image },
            { new: true }  // Retorna o post atualizado
        );
        if (!updatedPost) {
            return res.status(404).send('Post não encontrado');
        }
        res.json(updatedPost);
    } catch (error) {
        console.error('Erro ao editar post:', error);
        res.status(500).send('Erro ao editar post.');
    }
});

// **4. Rota para excluir um post**
router.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;  // Obtendo o ID da URL
    console.log("Excluindo post com ID:", id);  // Log para verificar o ID

    try {
        const deletedPost = await Post.findByIdAndDelete(id);  // Tentando excluir o post
        if (!deletedPost) {
            console.log("Post não encontrado com ID:", id);  // Log para verificar o que aconteceu
            return res.status(404).send('Post não encontrado');
        }
        console.log("Post excluído:", deletedPost);  // Log para verificar se o post foi excluído
        res.status(200).send('Post excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir post:', error);
        res.status(500).send('Erro ao excluir post.');
    }
});


module.exports = router;