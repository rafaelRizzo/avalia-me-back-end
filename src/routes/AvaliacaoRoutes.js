import express from 'express';
import AvaliacaoController from '../controllers/AvaliacaoController.js';
import { authMiddleware } from '../middlewares/authToken.js';

const router = express.Router();

// Rota para criar avaliação
router.post('/api/generate', authMiddleware, AvaliacaoController.criarAvaliacao);

// Rota para validar JWT
router.get('/api/validate/:uuid', authMiddleware, AvaliacaoController.validarJWT);

// Rota para listar avaliações com filtros
router.get('/api/list', authMiddleware, AvaliacaoController.listarAvaliacoes);

// Rota para atualizar avaliação
router.put('/api/avaliacao/:uuid', authMiddleware, AvaliacaoController.atualizarAvaliacao);

export default router;
