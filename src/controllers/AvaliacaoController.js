import { logger } from '../logger/index.js';
import AvaliacaoModel from '../models/AvaliacaoModel.js';
import { v7 as uuidv7 } from 'uuid';

class AvaliacaoController {
  async criarAvaliacao(req, res) {
    try {
      const { nome_atendente, nome_empresa, protocolo_atendimento } = req.body;

      // Capturar o IP do cliente diretamente
      let ipClient = req.ip;

      // Remover o prefixo "::ffff:" caso esteja presente
      if (ipClient.startsWith('::ffff:')) {
        ipClient = ipClient.replace('::ffff:', '');
      }

      const ip_generated = ipClient;

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
        case 'UUID expirado':
          status = 498; // Código específico para JWT expirado
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
      const { nota_atendimento, nota_empresa, obs } = req.body; // Dados a serem atualizados
  
      // Capturar o IP do cliente automaticamente
      let ip_client = req.ip;
  
      // Remover o prefixo "::ffff:" caso esteja presente
      if (ip_client.startsWith('::ffff:')) {
        ip_client = ip_client.replace('::ffff:', '');
      }
  
      // Validar o UUID e JWT no model
      try {
        // Verificar se a avaliação existe
        const avaliacaoExistente = await AvaliacaoModel.buscarPorUUID(uuid);
  
        if (!avaliacaoExistente) {
          return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
  
        // Verificar se o IP do cliente é igual ao `ip_generated` da avaliação existente
        if (avaliacaoExistente.ip_generated === ip_client) {
          return res.status(403).json({
            message: 'Avaliação não permitida. O IP gerado é igual ao IP do cliente.',
          });
        }
  
        // Validar se o JWT está ativo
        await AvaliacaoModel.validarJWT(uuid);
  
        // Atualizar avaliação no banco
        const dadosAtualizados = { nota_atendimento, nota_empresa, ip_client, obs };
  
        await AvaliacaoModel.atualizarAvaliacao(uuid, dadosAtualizados);
  
        res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
      } catch (error) {
        // Mensagens de erro específicas
        if (error.message === 'JWT expirado' || error.message === 'JWT inválido') {
          return res.status(401).json({ message: 'JWT expirado ou inválido' });
        }
  
        // UUID não encontrado ou qualquer outro erro
        return res.status(400).json({ message: error.message });
      }
    } catch (error) {
      // Log detalhado em ambiente de desenvolvimento
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
