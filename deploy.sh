#!/bin/bash

# PayWithCryptoCard - Backend Deployment Script
# This script deploys the backend Docker container on your VPS

set -e

echo "🚀 Deploying PayWithCryptoCard Backend..."

# Configuration
IMAGE_NAME="ghcr.io/shahisrail/paywithcryptocard-server:latest"
CONTAINER_NAME="paywithcrypto-backend"
PORT="5000"

# Pull latest Docker image
echo "📥 Pulling latest Docker image..."
docker pull $IMAGE_NAME

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Run new container
echo "🐳 Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -p $PORT:5000 \
  --env-file .env \
  --link paywithcrypto-mongodb:mongodb \
  $IMAGE_NAME

# Wait for container to be healthy
echo "⏳ Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Backend deployed successfully!"
    echo "🌐 Access at: http://localhost:$PORT"
    echo "🔍 Check logs: docker logs -f $CONTAINER_NAME"
else
    echo "❌ Deployment failed!"
    echo "🔍 Check logs: docker logs $CONTAINER_NAME"
    exit 1
fi

# Clean old images
echo "🧹 Cleaning old images..."
docker image prune -f

echo "🎉 Deployment complete!"