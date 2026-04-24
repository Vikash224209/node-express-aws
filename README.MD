# node-express-aws 🚀

A production-ready **Node.js / Express REST API** built for deployment on **AWS EC2** with Docker, managed by a **Jenkins CI/CD** pipeline.

---

## Project Structure

```
node-express-aws/
├── src/
│   ├── app.js                  # Express app (middleware, routes)
│   ├── server.js               # HTTP server + graceful shutdown
│   ├── routes/
│   │   ├── health.js           # GET /health
│   │   └── api.js              # GET|POST /api/v1/items
│   ├── controllers/
│   │   └── itemsController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── config/
│       └── logger.js           # Winston JSON logger
├── tests/
│   └── api.test.js             # Jest + Supertest
├── scripts/
│   └── ec2-setup.sh            # One-time EC2 provisioning script
├── infra/
│   └── README.md               # AWS security group / IAM notes
├── Dockerfile                  # Multi-stage, non-root image
├── docker-compose.yml          # Local development
├── Jenkinsfile                 # Full CI/CD pipeline
├── .env.example                # Environment variable template
├── .gitignore
├── .eslintrc.json
└── package.json
```

---

## Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/<your-org>/node-express-aws.git
cd node-express-aws

# 2. Set environment variables
cp .env.example .env

# 3a. Run with Node directly
npm install
npm run dev

# 3b. OR run with Docker Compose
docker-compose up --build
```

API is available at **http://localhost:3000**

| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | /health           | Health check     |
| GET    | /api/v1/items     | List items       |
| POST   | /api/v1/items     | Create item      |
| GET    | /api/v1/items/:id | Get item by ID   |

---

## Running Tests

```bash
npm test              # Jest + coverage
npm run lint          # ESLint
```

---

## Deploying to AWS EC2

### 1. Launch EC2 Instance
- AMI: **Amazon Linux 2023** or **Ubuntu 22.04**
- Instance type: `t3.small` (dev) / `t3.medium` (prod)
- Security group: allow **TCP 22** (SSH) and **TCP 3000** (app)
- Attach an IAM role with ECR/SSM read permissions (see `infra/README.md`)

### 2. First-time EC2 Setup
```bash
# Copy and run the setup script on your EC2 instance
scp -i key.pem scripts/ec2-setup.sh ec2-user@<EC2_IP>:~
ssh -i key.pem ec2-user@<EC2_IP> "bash ~/ec2-setup.sh"
```

### 3. Create `.env` on the EC2 instance
```bash
mkdir -p ~/app
nano ~/app/.env    # fill in values from .env.example
```

---

## Jenkins CI/CD Pipeline

### Pipeline Stages

```
Checkout → Install & Lint → Test → Docker Build → Docker Push → Deploy to EC2
```

### Jenkins Setup

1. Install plugins: **Docker Pipeline**, **SSH Agent**, **Credentials Binding**
2. Add credentials in **Manage Jenkins → Credentials**:

| ID               | Type                | Value                     |
|------------------|---------------------|---------------------------|
| `EC2_HOST`       | Secret text         | EC2 public DNS or IP      |
| `ec2-ssh-key`    | SSH Username+PK     | Contents of your `.pem`   |
| `DOCKERHUB_CREDS`| Username+Password   | Docker Hub login          |

3. Create a **Pipeline** job pointing to this repo — Jenkins will auto-discover the `Jenkinsfile`.

---

## Environment Variables

| Variable    | Default       | Description               |
|-------------|---------------|---------------------------|
| `NODE_ENV`  | `development` | Runtime environment       |
| `PORT`      | `3000`        | HTTP listen port          |
| `LOG_LEVEL` | `info`        | Winston log level         |

---

## Security Checklist

- [x] Non-root Docker user
- [x] `helmet` HTTP security headers
- [x] `.env` excluded from git
- [x] Secrets injected via Jenkins credentials (never in code)
- [x] Graceful SIGTERM handling for zero-downtime restarts
- [ ] Add HTTPS / TLS termination at ALB or Nginx
- [ ] Enable AWS WAF on ALB for production

---

## License

MIT

