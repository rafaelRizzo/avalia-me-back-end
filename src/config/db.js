import mysql from 'mysql2/promise';
import 'dotenv/config';

// Substitua pela sua URI no arquivo .env ou diretamente no código
const DATABASE_URI = process.env.DB_URL_CONNECTION || 'mysql://root:sua_senha@localhost/sistema_avaliacao';

const pool = mysql.createPool({
  uri: DATABASE_URI,
  waitForConnections: true,        // Aguarda conexões quando o limite é atingido
  connectionLimit: 10,             // Número máximo de conexões no pool
  queueLimit: 0,                   // Sem limite para a fila de requisições
  enableKeepAlive: true,           // Mantém as conexões vivas
  keepAliveInitialDelay: 10000,    // Tempo antes de enviar o primeiro sinal de keep-alive
});

export default pool;
