README.md
# 🚀 MERN + Kafka + Kubernetes Project

This project demonstrates a **scalable event-driven architecture** using:

- Node.js (Express)
- Apache Kafka
- Docker & Docker Compose
- Kubernetes (local cluster)

---

# 🧠 Project Overview

This system follows an **event-driven architecture**:
Client → Server (Producer) → Kafka → Consumers

### Flow:

1. Client sends a POST request (`/order`)
2. Server (Producer) sends event to Kafka topic (`orders`)
3. Kafka stores & distributes the event
4. Multiple consumers process the event independently

---

# 📁 Project Structure


mern-kafka/
├── server.js # Producer (API)
├── consumer.js # Consumer 1
├── consumer2.js # Consumer 2
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
├── k8s/ # Kubernetes configs
│ ├── kafka-deployment.yaml
│ ├── kafka-service.yaml
│ ├── server-deployment.yaml
│ ├── server-service.yaml
│ ├── consumer1.yaml
│ └── consumer2.yaml


---

# ⚙️ Prerequisites

- Node.js
- Docker Desktop
- Kubernetes enabled (Docker Desktop or Minikube)
- kubectl installed

---
# 🐳 Run using Docker Compose (Recommended for local)

## Step 1: Start services

```bash
docker-compose up --build

Step 2: Send request
curl -X POST http://localhost:3000/order \
-H "Content-Type: application/json" \
-d '{"userId":"user1","product":"Phone","price":20000}'

Step 3: Check logs
docker-compose logs -f

☸️ Run using Kubernetes :(Run All Command)

Step 1: Enable Kubernetes
Docker Desktop → Settings → Kubernetes → Enable
Verify: 
kubectl get nodes

Step 2: Build Docker image:-

docker build -t mern-kafka-server .

Step 3: Deploy to Kubernetes
kubectl apply -f k8s/

Step 4: Check pods
kubectl get pods

Step 5: Port forward (IMPORTANT)
kubectl port-forward service/server 3000:3000

Step 6: Send request
curl -X POST http://localhost:3000/order \
-H "Content-Type: application/json" \
-d '{"userId":"user1","product":"Phone","price":20000}'

Step 7: View logs
kubectl logs -f deployment/server
kubectl logs -f deployment/consumer1
kubectl logs -f deployment/consumer2

🔄 Data Flow
POST /order
   ↓
Server (Producer)
   ↓
Kafka Topic (orders)
   ↓
Consumer 1 → Process Order
Consumer 2 → Send Notification