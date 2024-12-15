import axios from 'axios'; // Usando axios para fazer requisições HTTP
import { expect } from 'chai'; // Chai para asserções
import { logger } from './../src/logger/index.js';

const API_URL = 'http://localhost:3001'; // Porta padrão do servidor

let uuid_generated; // Declarando a variável no escopo global

describe('Testando a rota CREATE para avaliação', function () {
    // Aumenta o tempo limite do teste para evitar falhas por timeout
    this.timeout(5000);
    it('Deve gerar uma avaliação e retornar status 201', async () => {
        const body = {
            nome_atendente: 'RAFAEL',
            nome_empresa: 'SUPER INTERNET',
            ip_generated: '192.168.0.1',
            protocolo_atendimento: 'protocolo321',
        };

        try {
            const response = await axios.post(`${API_URL}/generate`, body, {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            logger.info('Resposta da API (CREATE):', data);

            uuid_generated = data.uuid; // Armazena o UUID para uso posterior

            // Validações
            expect(response.status).to.equal(201);
            expect(data.message).to.equal('Avaliação criada com sucesso');
            expect(data).to.have.property('uuid'); // Verifica se o UUID foi gerado
        } catch (error) {
            logger.error('Erro na requisição (CREATE):', error.response?.data || error.message);
            throw error;
        }
    });
});

describe('Testando a rota de validação do UUID', function () {
    it('Deve validar o UUID e retornar status 200', async () => {
        try {
            const response = await axios.get(`${API_URL}/validate/${uuid_generated}`, {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            logger.info('Resposta da API (VALIDATE):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data.message).to.equal('JWT válido');
            expect(data.data).to.have.property('uuid', uuid_generated); // Verifica se o UUID bate
        } catch (error) {
            logger.error('Erro na requisição (VALIDATE):', error.response?.data || error.message);
            throw error;
        }
    });
});

// describe('Testando a expiração do UUID após 1 minuto', function () {
//     it('Deve falhar na validação após 1 minuto', async function () {
//         this.timeout(70000); // Aumenta o tempo de timeout para garantir que aguarde 1 minuto

//         // Aguarda 1 minuto para garantir que o UUID expire
//         await new Promise(resolve => setTimeout(resolve, 60000)); // Aguardar 1 minuto

//         try {
//             const response = await axios.get(`${API_URL}/validate/${uuid_generated}`, {
//                 headers: { 'Content-Type': 'application/json' },
//             });

//             // Se a resposta chegar, ele não deve passar, pois esperamos um erro 401
//             expect.fail('O teste não deveria chegar aqui, pois o UUID deveria ter expirado');
//         } catch (error) {
//             // Verifica se o status de erro é 401 (não autorizado)
//             logger.info('Erro ao validar o UUID:', error.response?.data);

//             expect(error.response.status).to.equal(401);
//             expect(error.response.data.message).to.equal('JWT expirado ou inválido');
//         }
//     });
// });

describe('Testando a rota /list para buscar avaliações com filtros', function () {
    it('Deve retornar todas as avaliações quando não passar parâmetros', async () => {
        try {
            const response = await axios.get(`${API_URL}/list`, {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data.data; // Acessando o array de avaliações dentro da chave 'data'
            // logger.info('Resposta da API (LIST):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data).to.be.an('array'); // Espera que a resposta seja um array
            expect(data.length).to.be.greaterThan(0); // Deve ter pelo menos uma avaliação
        } catch (error) {
            logger.error('Erro na requisição (LIST - sem filtros):', error.response?.data || error.message);
            throw error;
        }
    });

    it('Deve retornar avaliações filtradas por data_inicial e data_final', async () => {
        const data_inicial = '2024-12-01';
        const data_final = '2024-12-31';

        try {
            const response = await axios.get(`${API_URL}/list`, {
                params: { data_inicial, data_final },
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data.data; // Acessando o array de avaliações
            // logger.info('Resposta da API (LIST - com filtros data_inicial e data_final):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data).to.be.an('array');
            data.forEach(item => {
                const date = new Date(item.data_criacao); // Supondo que cada item tenha um campo data_criacao
                const startDate = new Date(data_inicial);
                const endDate = new Date(data_final);
                expect(date).to.be.greaterThanOrEqual(startDate);
                expect(date).to.be.lessThanOrEqual(endDate);
            });
        } catch (error) {
            logger.error('Erro na requisição (LIST - com filtros data_inicial e data_final):', error.response?.data || error.message);
            throw error;
        }
    });

    it('Deve retornar avaliações filtradas por status', async () => {
        const status = 'pendente'; // Por exemplo, filtra pelo status "pendente"

        try {
            const response = await axios.get(`${API_URL}/list`, {
                params: { status },
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data.data; // Acessando o array de avaliações
            // logger.info('Resposta da API (LIST - com filtro status):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data).to.be.an('array');
            data.forEach(item => {
                expect(item.status).to.equal(status); // Verifica se o status de cada item é o mesmo do filtro
            });
        } catch (error) {
            logger.error('Erro na requisição (LIST - com filtro status):', error.response?.data || error.message);
            throw error;
        }
    });

    it('Deve retornar avaliações filtradas por nome_atendente e nome_empresa', async () => {
        const nome_atendente = 'RAFAEL';
        const nome_empresa = 'SUPER INTERNET';

        try {
            const response = await axios.get(`${API_URL}/list`, {
                params: { nome_atendente, nome_empresa },
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data.data; // Acessando o array de avaliações
            // logger.info('Resposta da API (LIST - com filtros nome_atendente e nome_empresa):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data).to.be.an('array');
            data.forEach(item => {
                expect(item.nome_atendente).to.equal(nome_atendente); // Verifica se o atendente é o mesmo
                expect(item.nome_empresa).to.equal(nome_empresa); // Verifica se a empresa é a mesma
            });
        } catch (error) {
            logger.error('Erro na requisição (LIST - com filtros nome_atendente e nome_empresa):', error.response?.data || error.message);
            throw error;
        }
    });

    it('Deve retornar avaliações filtradas por múltiplos parâmetros', async () => {
        const nome_atendente = 'RAFAEL';
        const status = 'pendente';
        const data_inicial = '2024-12-01';
        const data_final = '2024-12-31';

        try {
            const response = await axios.get(`${API_URL}/list`, {
                params: { nome_atendente, status, data_inicial, data_final },
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data.data; // Acessando o array de avaliações
            // logger.info('Resposta da API (LIST - com múltiplos filtros):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data).to.be.an('array');
            data.forEach(item => {
                expect(item.nome_atendente).to.equal(nome_atendente);
                expect(item.status).to.equal(status);
                const date = new Date(item.data_criacao); // Supondo que cada item tenha um campo data_criacao
                const startDate = new Date(data_inicial);
                const endDate = new Date(data_final);
                expect(date).to.be.greaterThanOrEqual(startDate);
                expect(date).to.be.lessThanOrEqual(endDate);
            });
        } catch (error) {
            logger.error('Erro na requisição (LIST - com múltiplos filtros):', error.response?.data || error.message);
            throw error;
        }
    });
});

describe('Testando a rota PUT para atualização da avaliação', function () {
    it('Deve atualizar uma avaliação e retornar status 200', async () => {
        const body = {
            nota_atendimento: "5",
            nota_empresa: "5",
            ip_client: "2.3.4.5",
            obs: "Legal",
        };

        try {
            const response = await axios.put(`${API_URL}/avaliacao/${uuid_generated}`, body, {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            logger.info('Resposta da API (UPDATE):', data);

            // Validações
            expect(response.status).to.equal(200);
            expect(data.message).to.equal('Avaliação atualizada com sucesso');
        } catch (error) {
            logger.error('Erro na requisição (UPDATE):', error.response?.data || error.message);
            throw error;
        }
    });
});