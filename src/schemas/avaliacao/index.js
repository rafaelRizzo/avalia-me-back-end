import { z } from 'zod';

// Schema de validação para a rota de criação
export const createAvaliacaoSchema = z.object({
    nome_atendente: z.string().min(1, "Nome do atendente é obrigatório"),
    nome_empresa: z.string().min(1, "Nome da empresa é obrigatório"),
    protocolo_atendimento: z.string().min(1, "Protocolo é obrigatório"),
});

// Schema de validação para a rota de verificação
export const verifyAvaliacaoSchema = z.object({
    token: z.string().min(1, "Token é obrigatório"),
});

// Schema de validação para a rota de listagem
export const listAvaliacoesSchema = z.object({
    data_inicial: z.string().optional(), // Deve ser uma string que pode ser convertida para data (ISO ou yyyy-mm-dd)
    data_final: z.string().optional(),
    status: z.enum(['expirado', 'pendente', 'avaliado']).optional(),
    nome_atendente: z.string().optional(),
    nome_empresa: z.string().optional(),
    protocolo_atendimento: z.string().optional(),
    problema_resolvido: z.boolean().optional(),
    nota_atendimento: z.number().min(1).max(5).optional(),
    nota_empresa: z.number().min(1).max(5).optional(),
});

// nota_atendimento, nota_empresa, obs
export const sendAvaliacoesSchema = z.object({
    problema_resolvido: z.boolean(),
    nota_atendimento: z.number().min(1).max(5),
    nota_empresa: z.number().min(1).max(5),
    obs: z.string().max(1000)
});
