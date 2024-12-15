import crypto from 'crypto'
import { ZodError } from "zod";

// Configurações de criptografia
const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.CRYPTO_SECRET)).digest('base64').slice(0, 32); // Chave de 32 bytes gerada a partir de uma string
const iv = crypto.randomBytes(16); // Vetor de inicialização de 16 bytes

if (!process.env.CRYPTO_SECRET) {
  throw new Error('CRYPTO_SECRET NÃO CONFIGURADA! FAVOR CONFIGURE NO .ENV PARA CONTINUAR.');
}

// Função para criptografar
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex')
  };
}

// Função para descriptografar
const decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// // Exemplo de uso
// const text = 'Esta é uma mensagem secreta!';
// console.log('Texto original:', text);

// // Criptografar
// const encrypted = encrypt(text);
// console.log('Texto criptografado:', encrypted);

// // Descriptografar
// const decrypted = decrypt(encrypted.encryptedData, encrypted.iv);
// console.log('Texto descriptografado:', decrypted);

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
