import express from 'express';
import AvaliacaoController from '../controllers/AvaliacaoController.js';

const router = express.Router();

// Rota para criar avaliação
router.post('/generate', AvaliacaoController.criarAvaliacao);

// Rota para validar JWT
router.get('/validate/:uuid', AvaliacaoController.validarJWT);

// Rota para listar avaliações com filtros
router.get('/list', AvaliacaoController.listarAvaliacoes);

// Rota para atualizar avaliação
router.put('/avaliacao/:uuid', AvaliacaoController.atualizarAvaliacao);

export default router;
