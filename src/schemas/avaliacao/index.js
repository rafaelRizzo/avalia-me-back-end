import { z } from 'zod';

// Schema de validação para a rota de criação
export const createAvaliacaoSchema = z.object({
    nome_atendente: z.string().min(1, "Nome do atendente é obrigatório"),
    nome_empresa: z.string().min(1, "Nome da empresa é obrigatório"),
    protocolo: z.string().min(1, "Protocolo é obrigatório"),
});

// Schema de validação para a rota de verificação
export const verifyAvaliacaoSchema = z.object({
    token: z.string().min(1, "Token é obrigatório"),  // Aqui estamos assumindo que o token é enviado no corpo
});

// Não é necessário schema para listagem de UUIDs, pois não há dados de entrada