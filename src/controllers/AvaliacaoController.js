import { logger } from '../logger/index.js';
import AvaliacaoModel from '../models/AvaliacaoModel.js';
import { v7 as uuidv7 } from 'uuid';

class AvaliacaoController {
  async criarAvaliacao(req, res) {
    try {
      const { nome_atendente, nome_empresa, ip_generated, protocolo_atendimento } = req.body;

      // Gerar UUID
      const uuid = uuidv7();

      // Criar avaliação no banco
      const avaliacao = {
        uuid, nome_atendente, nome_empresa, ip_generated, protocolo_atendimento,
      };

      await AvaliacaoModel.criarAvaliacao(avaliacao);

      res.status(201).json({
        message: 'Avaliação criada com sucesso',
        uuid,
      });
    } catch (error) {
      // Log detalhado apenas para desenvolvedores (em ambiente de desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        logger.error(error);  // Loga o erro completo no console, incluindo stack trace
      } else {
        logger.error(error.message); // Loga apenas a mensagem simples no console
      }
      res.status(500).json({ message: 'Erro ao criar avaliação', error: error.message });
    }
  }

  async validarJWT(req, res) {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res.status(400).json({ message: 'UUID é obrigatório' });
      }

      // Validar JWT no model
      const decoded = await AvaliacaoModel.validarJWT(uuid);

      // Responder com sucesso e o token decodificado
      return res.status(200).json({
        message: 'JWT válido',
        data: decoded
      });
    } catch (error) {
      // Log detalhado com separação de níveis
      const isDev = process.env.NODE_ENV === 'development';
      const logMessage = isDev ? error : error.message;
      logger.error(`[JWT Validation Error]: ${logMessage}`);

      // Determinar status HTTP com base no tipo de erro
      let status;
      switch (error.message) {
        case 'Avaliação não encontrada':
          status = 404;
          break;
        case 'JWT expirado':
          status = 498; // Código específico para JWT expirado
          break;
        case 'UUID avaliado':
          status = 498; // Código específico para JWT avaliado
          break;
        case 'JWT inválido':
          status = 401; // Código específico para JWT inválido
          break;
        default:
          status = 500; // Erros não esperados
          break;
      }

      // Responder com mensagem de erro apropriada
      return res.status(status).json({
        message: error.message || 'Erro interno no servidor'
      });
    }
  }

  async listarAvaliacoes(req, res) {
    try {
      const { data_inicial, data_final, status, nome_atendente, nome_empresa } = req.query;

      const filtros = {
        data_inicial,
        data_final,
        status,
        nome_atendente,
        nome_empresa,
      };

      // Filtrar e listar as avaliações
      const avaliacoes = await AvaliacaoModel.listarAvaliacoes(filtros);

      res.status(200).json({ message: 'Avaliações listadas com sucesso', data: avaliacoes });
    } catch (error) {
      // Log detalhado apenas para desenvolvedores (em ambiente de desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        logger.error(error);  // Loga o erro completo no console, incluindo stack trace
      } else {
        logger.error(error.message); // Loga apenas a mensagem simples no console
      }
      res.status(500).json({ message: 'Erro ao listar avaliações', error: error.message });
    }
  }

  async atualizarAvaliacao(req, res) {
    try {
      const { uuid } = req.params; // UUID da avaliação a ser atualizada
      const { nota_atendimento, nota_empresa, ip_client, obs } = req.body; // Dados a serem atualizados

      // Validar JWT no model
      try {
        await AvaliacaoModel.validarJWT(uuid);

        // Verificar se a avaliação existe
        const avaliacaoExistente = await AvaliacaoModel.buscarPorUUID(uuid);
        if (!avaliacaoExistente) {
          return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        // Atualizar avaliação no banco
        const dadosAtualizados = { nota_atendimento, nota_empresa, ip_client, obs };

        await AvaliacaoModel.atualizarAvaliacao(uuid, dadosAtualizados);

        res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
      } catch (error) {
        return res.status(401).json({ message: 'JWT expirado ou inválido' });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        logger.error(error);
      } else {
        logger.error(error.message);
      }
      res.status(500).json({ message: 'Erro ao atualizar avaliação', error: error.message });
    }
  }

}

export default new AvaliacaoController();
