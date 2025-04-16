#!/bin/bash

# Nome do container
CONTAINER_NAME="backend-avaliacao"

# Nome da imagem
IMAGE_NAME="backend-avaliacao"

# Atualiza o repositório
echo "Atualizando código do repositório..."
git pull

# Faz o build da nova imagem
echo "Buildando nova imagem..."
docker build -t $IMAGE_NAME .

# Garante que os arquivos existem como arquivos (não diretórios)
touch combined.log error.log

# Para e remove o container antigo (se ele existir)
echo "Parando e removendo o container antigo..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Sobe o novo container com a nova imagem e configura os volumes para logs
echo "Subindo novo container..."
docker run -d --restart always -p 127.0.0.1:3101:3101 \
  -v $(pwd)/combined.log:/app/combined.log \
  -v $(pwd)/error.log:/app/error.log \
  -v $(pwd)/.env:/app/.env \
  --name $CONTAINER_NAME $IMAGE_NAME

echo "Deploy concluído!"