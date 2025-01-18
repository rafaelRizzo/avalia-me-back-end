import { z } from 'zod';

// Schema de validação para a rota de criação
export const createAvaliacaoSchema = z.object({
    nome_atendente: z.string().min(1, "Nome do atendente é obrigatório"),
    nome_empresa: z.string().min(1, "Nome da empresa é obrigatório"),
    protocolo_atendimento: z.string().min(1, "Protocolo é obrigatório"),
});

// Schema de validação para a rota de verificação
export const verifyAvaliacaoSchema = z.object({
    token: z.string().min(1, "Token é obrigatório"),  // Aqui estamos assumindo que o token é enviado no corpo
});

// Schema de validação para a rota de listagem
export const listAvaliacoesSchema = z.object({
    data_inicial: z.string().optional(), // Deve ser uma string que pode ser convertida para data (ISO ou yyyy-mm-dd)
    data_final: z.string().optional(),
    status: z.enum(['expirado', 'pendente', 'avaliado']).optional(),
    nome_atendente: z.string().optional(),
    nome_empresa: z.string().optional(),
    protocolo_atendimento: z.string().optional(),
    nota_atendimento: z.enum(['1', '2', '3', '4', '5']).optional(), // Alterado para string com valores específicos
    nota_empresa: z.enum(['1', '2', '3', '4', '5']).optional(), // Alterado para string com valores específicos
});
