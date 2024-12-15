import express from 'express';
import AvaliacaoRoutes from './src/routes/AvaliacaoRoutes.js';
import './src/config/db.js'; // Conexão com o banco de dados
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

// Configuração do cors
app.use(cors(corsOptions));

// Rotas
app.use('/', AvaliacaoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
