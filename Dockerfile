# Usar uma imagem base do Node.js
FROM node:22-alpine

ENV TZ=America/Sao_Paulo
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo "$TZ" > /etc/timezone

# Instalar o pnpm globalmente
RUN npm install -g pnpm

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar o arquivo package.json e pnpm-lock.yaml (caso tenha)
COPY package.json pnpm-lock.yaml ./

# Instalar as dependências usando o pnpm
RUN pnpm install

# Copiar o restante do código da aplicação para o contêiner
COPY . .

# Expor a porta (ajuste conforme necessário)
EXPOSE 3101

# Definir o comando para rodar a aplicação
CMD ["pnpm", "start"]
