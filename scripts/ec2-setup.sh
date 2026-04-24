#!/usr/bin/env bash
# scripts/ec2-setup.sh
# Run ONCE on a fresh EC2 Amazon Linux 2023 / Ubuntu instance to install Docker
# and pull the initial image.
#
# Usage:
#   chmod +x scripts/ec2-setup.sh
#   scp -i key.pem scripts/ec2-setup.sh ec2-user@<EC2_IP>:~
#   ssh -i key.pem ec2-user@<EC2_IP> "bash ~/ec2-setup.sh"

set -euo pipefail

DOCKER_IMAGE="${DOCKER_IMAGE:-youruser/node-express-aws:latest}"
ENV_FILE="${ENV_FILE:-/home/ec2-user/app/.env}"

echo "==> Installing Docker..."
if command -v apt-get &>/dev/null; then
  # Ubuntu
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl gnupg
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
  echo "deb [signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io
else
  # Amazon Linux 2023
  sudo dnf update -y
  sudo dnf install -y docker
fi

sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

echo "==> Creating app directory..."
mkdir -p /home/ec2-user/app

echo "==> Pulling Docker image: ${DOCKER_IMAGE}..."
docker pull "${DOCKER_IMAGE}"

echo "==> Starting container..."
docker stop node_api 2>/dev/null || true
docker rm   node_api 2>/dev/null || true
docker run -d \
  --name node_api \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file "${ENV_FILE}" \
  "${DOCKER_IMAGE}"

echo ""
echo "✅  Setup complete. API running on port 3000."
echo "    Test: curl http://localhost:3000/health"

