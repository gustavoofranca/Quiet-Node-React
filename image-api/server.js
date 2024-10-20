// server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Exemplo de banco de dados local de URLs de imagens
const localImageUrls = [
    'https://i.ibb.co/xgXYCZP/imagem6.jpg',
    'https://i.ibb.co/58sz8w1/imagem5.jpg',
    'https://i.ibb.co/tByvW6Q/imagem4.jpg',
    'https://i.ibb.co/JdhWnb9/imagem3.jpg',
    'https://i.ibb.co/4gnDyzV/imagem2.jpg',
    'https://i.ibb.co/SvNNP18/imagem.jpg',
  ];
  

// Rota para pegar imagens aleatórias
app.get('/random-images', (req, res) => {
    const randomImages = [];
    
    // Gerar 5 imagens aleatórias do banco de dados local
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * localImageUrls.length);
      randomImages.push(localImageUrls[randomIndex]);
    }
    
    res.json({ images: randomImages });
  });

// API para obter imagens aleatórias de uma fonte externa (ex: Unsplash)
app.get('/unsplash-images', async (req, res) => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: { count: 5 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });
    const imageUrls = response.data.map((image) => image.urls.small);
    res.json({ images: imageUrls });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar imagens do Unsplash' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
