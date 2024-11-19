import express from 'express';
import cors from 'cors';
const PORT = process.env.PORT || 8000;

import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

// Inicializar as rotas
app.use('/api', userRoute, postRoute);

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})