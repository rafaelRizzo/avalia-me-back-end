# Usar uma imagem base do Node.js
FROM node:22-alpine

ENV TZ=America/Sao_Paulo
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo "$TZ" > /etc/timezone

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos de dependências
COPY package.json package-lock.json ./

# Instalar as dependências usando npm
RUN npm install

# Copiar o restante do código da aplicação para o contêiner
COPY . .

# Definir o comando para rodar a aplicação
CMD ["node", "app.js"]