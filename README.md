# Avalia-me

Este repositório é licenciado sob a **Licença MIT**. Você pode usar, modificar e distribuir este software de forma gratuita, desde que mantenha o aviso de copyright e a licença nas versões do código fonte.

Para mais detalhes, consulte o arquivo LICENSE no repositório.

Este serviço é responsável pela geração e verificação de tokens JWT baseados em avaliações, armazenando-os no Redis e permitindo a validação posterior desses tokens e UUIDs.

Tecnologias Utilizadas

- Node.js
- Express.js
- Redis
- JWT (JSON Web Tokens)
- Zod (para validação de dados)
- UUID

### Instalação

Clone este repositório: 
```git
git clone https://github.com/rafaelRizzo/avalia-me-back-end
```

Navegue até o diretório do projeto:

````bash
cd avalia-me
````

Instale as dependências:

````bash
npm install
````

Crie o seguinte banco de dados no MySQL:

```
CREATE DATABASE sistema_avaliacao;
```

```
USE sistema_avaliacao;
```

```
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL,
    nome_atendente VARCHAR(255) NOT NULL,
    nome_empresa VARCHAR(255) NOT NULL,
    nota_atendimento INT DEFAULT NULL,
    nota_empresa INT DEFAULT NULL,
    obs VARCHAR(1000) DEFAULT NULL,
    ip_generated VARCHAR(255) NOT NULL,
    ip_client VARCHAR(255) DEFAULT NULL,
    jwt TEXT DEFAULT NULL,
    status ENUM('expirado', 'pendente', 'avaliado') DEFAULT 'pendente',
    protocolo_atendimento VARCHAR(255) NOT NULL,
    data_ultima_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente:

````bash
JWT_SECRET=secret
JWT_EXPIRES=tempo_para_expirar
DB_URL_CONNECTION=mysql://seu_usuario:sua_senha@host_banco:3306/sistema_avaliacao
````

Execute o servidor:
````bash
nodemon app.js
````
O servidor será iniciado na porta 3000 por padrão e estará pronto para receber requisições.
***

### Endpoints:

**[POST]** /api/generate

Este endpoint gera um token JWT baseado nas informações fornecidas e armazena o UUID e token no Redis.
Requisição

*Corpo (JSON):*
```json
{ 
    "nome_atendente": "Nome do Atendente",
    "nome_empresa": "Nome da Empresa",
    "protocolo": "Número do Protocolo" 
}
```

Respostas

*Sucesso (status 200):*
```json
{
    "uuid_generated": "UUID gerado", 
    "token": "Token gerado" 
}
```

*Erro (status 400/500):*
```JSON
{ 
    "message": "Erro de validação ou erro interno" 
}
```
***
**[GET]** /api/validate/**:uuid**

Este endpoint verifica se o UUID e o token enviados são válidos.
Requisição

Parâmetros de URL: `uuid: UUID da avaliação a ser verificada.`

*Corpo (JSON):* 
```json
{ 
    "token": "Token a ser verificado" 
}
```

Resposta

*Sucesso (status 200):*
```json
{ 
    "message": "Token válido"
}
```

*Erro (status 400/500):*
```json
{ 
    "message": "UUID ou token inválido"
}
```
***
**[GET]** /api/list

Este endpoint lista todos os UUIDs válidos com seus respectivos tokens armazenados no Redis.
Resposta

*Sucesso (status 200):*
```json
[ 
    { 
        "uuid": "UUID válido", 
        "token": "Token válido" 
    }, ... 
]
```

*Caso não haja UUIDs válidos:* 
```json
{ 
    "message": "Nenhum UUID válido encontrado"
}
```

**[PUT]** /api/avaliacao/**:uuid**

Este atualiza a avaliação com base no UUID fornecido.

*Corpo (JSON):*
```json
{ 
    "nota_atendimento": 5 , // (nota de 1 a 5)
    "nota_empresa": 1 , // (nota de 1 a 5)
    "obs": "PARA FICAR RUIM TEM QUE MELHORAR MUITO!" // (opcional)
}
```
*Sucesso (status 200):*
```json
{ 
    "message": "Avaliação atualizada com sucesso"
}
```

*Erro (status 500):*
```json
{ 
    "message": "Erro ao atualizar avaliação"
}
```
***
Validações

O serviço utiliza o Zod para garantir que os dados enviados para os endpoints atendem a todos os requisitos.

No endpoint create, os seguintes campos são validados:
- nome_atendente (deve ser uma string não vazia)
- nome_empresa (deve ser uma string não vazia)
- protocolo (deve ser uma string ou número válido)

@ Dev Full Stack ASTERISK | NEXTJS | NODEJS | MYSQL ~  Rafael Rizzo Breschi

Faça uma doação <3

PIX Chave aleatória: `f96b5084-db1d-4051-85c1-70a7e235c2c6` 
