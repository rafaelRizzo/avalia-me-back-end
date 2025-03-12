import { ZodError } from "zod";

/**
 * Função para formatar erros do Zod
 * @param {ZodError} error - O erro do Zod
 * @returns {Object} - Objeto com campos e mensagens de erro formatados
 */
export function formatZodErrors(error) {
  if (error instanceof ZodError) {
    return error.errors.map((e) => ({
      field: e.path.join('.'), // Une os caminhos do campo em uma string
      message: e.message,     // Mensagem descritiva do erro
    }));
  }
  return [{ message: "Erro desconhecido." }];
}
