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
    const avaliacao = await this.buscarPorUUID(uuid);

    if (!avaliacao) {
      throw new Error('Avaliação não encontrada');
    }
    logger.info(`Avaliação localizada: ${avaliacao.nome_atendente}, ${avaliacao.nome_empresa}, ${avaliacao.protocolo_atendimento}`);

    logger.info('Status da avaliação:', avaliacao.status); // Log para verificar o status

    // Validar JWT usando o JWTManager
    try {
      const decoded = await JWTManager.validarToken(avaliacao.jwt);

      // Se o JWT for válido, retornamos o decodificado
      return decoded;
    } catch (error) {
      // Se o JWT estiver expirado e o status for 'pendente', atualize o status
      if (error.message === 'JWT expirado' && avaliacao.status === 'pendente') {
        logger.info("Atualizando status para expirado.");
        const sql = `UPDATE avaliacoes SET status = 'expirado', jwt = null WHERE uuid = ?`;
        await pool.execute(sql, [uuid]);
        logger.info('Status atualizado para expirado');
      }
      throw new Error('JWT expirado ou inválido');
    }
  }

  async listarAvaliacoes(filtros = {}) {
    const { data_inicial, data_final, status, nome_atendente, nome_empresa } = filtros;

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

    if (nome_atendente) {
      sql += ' AND nome_atendente LIKE ?';
      params.push(`%${nome_atendente}%`);
    }

    if (nome_empresa) {
      sql += ' AND nome_empresa LIKE ?';
      params.push(`%${nome_empresa}%`);
    }

    sql += ' ORDER BY data_criacao DESC'; // Ordena pela data de criação, da mais recente para a mais antiga

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  async atualizarAvaliacao(uuid, dados) {
    const { nota_atendimento, nota_empresa, ip_client, obs } = dados;

    // Atualizar avaliação no banco
    const sql = `
      UPDATE avaliacoes
      SET nota_atendimento = ?, nota_empresa = ?, ip_client = ?, obs = ?, status = ?, jwt = null
      WHERE uuid = ?
    `;

    const params = [nota_atendimento, nota_empresa, ip_client, obs, 'avaliado', uuid];

    const [result] = await pool.execute(sql, params);
    return result;
  }
}

export default new AvaliacaoModel();
