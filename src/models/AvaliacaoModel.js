import pool from '../config/db.js';
import { logger } from '../logger/index.js';
import JWTManager from '../utils/JWTManager.js';

class AvaliacaoModel {
  async criarAvaliacao(dados) {
    const sql = `
      INSERT INTO avaliacoes (
          uuid, nome_atendente, nome_empresa, 
          ip_generated, jwt, protocolo_atendimento
      ) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const { uuid, nome_atendente, nome_empresa, ip_generated, protocolo_atendimento } = dados;

    // Criar o JWT usando a classe JWTManager
    const token = JWTManager.criarToken({ uuid, nome_atendente, nome_empresa, protocolo_atendimento });

    const [result] = await pool.execute(sql, [
      uuid, nome_atendente, nome_empresa, ip_generated, token, protocolo_atendimento,
    ]);

    return result;
  }

  async buscarPorUUID(uuid) {
    const sql = `SELECT * FROM avaliacoes WHERE uuid = ?`;
    const [rows] = await pool.execute(sql, [uuid]);
    return rows[0]; // Retorna o primeiro registro encontrado
  }

  async validarJWT(uuid) {
    // Buscar avaliação pelo UUID
    const avaliacao = await this.buscarPorUUID(uuid);

    if (!avaliacao) {
      throw new Error('Avaliação não encontrada');
    }

    // Log de informações básicas da avaliação
    logger.info(`Avaliação localizada: Atendente: ${avaliacao.nome_atendente}, Empresa: ${avaliacao.nome_empresa}, Protocolo: ${avaliacao.protocolo_atendimento}, Status: ${avaliacao.status}, UUID: ${avaliacao.uuid}`);
    logger.info(`Status atual da avaliação: ${avaliacao.status}`);

    if (avaliacao.status === 'avaliado') {
      throw new Error('UUID avaliado');
    }

    if (avaliacao.status === 'expirado') {
      throw new Error('UUID expirado');
    }


    try {
      // Validar JWT usando o JWTManager
      const decoded = await JWTManager.validarToken(avaliacao.jwt);

      // Retornar o JWT decodificado se válido
      return decoded;
    } catch (error) {
      // Verificar se o erro é devido ao JWT expirado e o status está pendente
      if (error.message === 'JWT expirado' && avaliacao.status === 'pendente') {
        logger.info('JWT expirado. Atualizando status para "expirado".');

        // Atualizar o status no banco de dados
        const sql = `UPDATE avaliacoes SET status = 'expirado', jwt = NULL WHERE uuid = ?`;
        try {
          await pool.execute(sql, [uuid]);
          logger.info('Status atualizado para "expirado".');
        } catch (dbError) {
          logger.error('Erro ao atualizar o status no banco de dados:', dbError);
          throw new Error('Erro interno ao atualizar o status da avaliação.');
        }

        // Lançar erro com uma mensagem de JWT expirado
        throw new Error('JWT expirado');
      }

      // Propagar erro para JWT inválido ou outros problemas
      throw new Error('JWT inválido');
    }
  }

  async listarAvaliacoes(filtros = {}) {
    const { data_inicial, data_final, status, nome_atendente, nome_empresa, atendimento_resolvido, nota_atendimento, nota_empresa } = filtros;

    let sql = 'SELECT * FROM avaliacoes WHERE 1=1';
    const params = [];

    if (data_inicial) {
      sql += ' AND data_criacao >= ?';
      params.push(data_inicial);
    }

    if (data_final) {
      sql += ' AND data_criacao <= ?';
      params.push(data_final);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (atendimento_resolvido) {
      sql += ' AND atendimento_resolvido = ?';
      params.push(`${atendimento_resolvido}`);
    }

    if (nome_atendente) {
      sql += ' AND nome_atendente = ?';
      params.push(`${nome_atendente}`);
    }

    if (nome_empresa) {
      sql += ' AND nome_empresa = ?';
      params.push(`${nome_empresa}`);
    }

    if (nota_atendimento) {
      sql += ' AND nota_atendimento = ?';
      params.push(`${nota_atendimento}`);
    }

    if (nota_empresa) {
      sql += ' AND nota_empresa = ?';
      params.push(`${nota_empresa}`);
    }

    sql += ' ORDER BY data_criacao DESC'; // Ordena pela data de criação, da mais recente para a mais antiga

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  async atualizarAvaliacao(uuid, dados) {
    const { atendimento_resolvido, nota_atendimento, nota_empresa, ip_client, obs } = dados;

    // Atualizar avaliação no banco
    const sql = `
      UPDATE avaliacoes
      SET atendimento_resolvido = ?, nota_atendimento = ?, nota_empresa = ?, ip_client = ?, obs = ?, status = ?, jwt = null
      WHERE uuid = ?
    `;

    const params = [atendimento_resolvido, nota_atendimento, nota_empresa, ip_client, obs, 'avaliado', uuid];

    const [result] = await pool.execute(sql, params);
    return result;
  }
}

export default new AvaliacaoModel();
