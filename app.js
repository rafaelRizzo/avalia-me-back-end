import express from 'express';
import AvaliacaoRoutes from './src/routes/AvaliacaoRoutes.js';
import './src/config/db.js'; // Conexão com o banco de dados
import { logger } from './src/logger/index.js';

const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.use('/', AvaliacaoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
