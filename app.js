import 'dotenv/config';
import express from 'express';
import AvaliacaoRoutes from './src/routes/AvaliacaoRoutes.js';
import { logger } from './src/logger/index.js';
import cors from 'cors';

const app = express();

app.set('trust proxy', true);

// Middlewares
app.use(express.json());

// Configurações do cors
const corsOptions = {
  origin: '*', // Altere conforme o necessário
  methods: 'GET,PUT,POST',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Rotas
app.use('/', AvaliacaoRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
