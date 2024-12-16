import express from 'express';
import AvaliacaoRoutes from './src/routes/AvaliacaoRoutes.js';
import { logger } from './src/logger/index.js';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());

// Configurações do cors
const corsOptions = {
  origin: '*', // Altere conforme o necessário
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Rotas
app.use('/', AvaliacaoRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
