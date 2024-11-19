import express from 'express';
import cors from 'cors';

import config from './config.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

// Inicializar as rotas
app.use('/api', userRoute, postRoute);

app.listen(config.port, () =>
    console.log(`Server is live @ ${config.hostUrl}`),
);