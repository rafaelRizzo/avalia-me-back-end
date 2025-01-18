import express from 'express';
import AvaliacaoController from '../controllers/AvaliacaoController.js';

const router = express.Router();

// Rota para criar avaliação
router.post('/api/generate', AvaliacaoController.criarAvaliacao);

// Rota para validar JWT
router.get('/api/validate/:uuid', AvaliacaoController.validarJWT);

// Rota para listar avaliações com filtros
router.get('/api/list', AvaliacaoController.listarAvaliacoes);

// Rota para atualizar avaliação
router.put('/api/avaliacao/:uuid', AvaliacaoController.atualizarAvaliacao);

export default router;
