# KafkaFlowX – Event-Driven Microservices System

## Overview

KafkaFlowX is a distributed event-driven microservices application built using **Node.js**, **Apache Kafka**, **Docker**, and **Kubernetes**.

The project demonstrates how multiple producers publish events to Kafka and how multiple consumers independently process those events. It also implements an **Idempotent REST API** to prevent duplicate request processing.

---

# Technology Stack

* Node.js
* Express.js
* Apache Kafka
* KafkaJS
* Docker
* Docker Compose
* Kubernetes
* JavaScript

---

# Project Structure

```text
KafkaFlowX
│
├── server.js                 # Producer 1 (REST API)
├── producer2.js              # Producer 2 (Background Producer)
├── consumer.js               # Consumer 1
├── consumer2.js              # Consumer 2
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
│
├── k8s/
│   ├── kafka-deployment.yaml
│   ├── kafka-service.yaml
│   ├── server-deployment.yaml
│   ├── server-service.yaml
│   ├── producer2.yaml
│   ├── consumer1.yaml
│   └── consumer2.yaml
│
└── README.md
```

---

# System Flow

```text
Client
   │
HTTP Request
   │
   ▼
Producer (Server API)
   │
Produce Event
   │
   ▼
Kafka Topic (orders)
   │
   ├────────────► Consumer 1
   │              Process Order
   │
   └────────────► Consumer 2
                  Send Notification
```

---

# Prerequisites

Install the following software:

* Node.js
* Docker Desktop
* Kubernetes (enabled in Docker Desktop)
* kubectl

---

# Configure Environment

Create a `.env` file.

Example:

```env
PORT=3000
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC=orders
```

---

# Run with Docker Compose

## Step 1

Build and start all services.

```bash
docker-compose up --build
```

---

## Step 2

Verify running containers.

```bash
docker ps
```

Expected containers:

```text
kafka
server
producer2
consumer1
consumer2
```

---

## Step 3

View logs.

```bash
docker-compose logs -f
```

---

# Run with Kubernetes

## Step 1

Verify Kubernetes is running.

```bash
kubectl get nodes
```

Expected:

```text
STATUS = Ready
```

---

## Step 2

Deploy application.

```bash
kubectl apply -f k8s/
```

---

## Step 3

Verify Pods.

```bash
kubectl get pods
```

Expected:

```text
server
producer2
kafka
consumer1
consumer2
```

All pods should display:

```text
Running
```

---

## Step 4

Verify Services.

```bash
kubectl get services
```

Expected services:

* server
* kafka

---

## Step 5

Forward the API port.

```bash
kubectl port-forward service/server 3000:3000
```

Leave this terminal running.

---

# Verify Project Status

## Check Kubernetes Pods

```bash
kubectl get pods
```

---

## Check Services

```bash
kubectl get services
```

---

## Check Deployments

```bash
kubectl get deployments
```

---

## Describe a Pod

```bash
kubectl describe pod <pod-name>
```

Example:

```bash
kubectl describe pod server-xxxxxxxx
```

---

## View Logs

Server

```bash
kubectl logs deployment/server
```

Producer 2

```bash
kubectl logs deployment/producer2
```

Consumer 1

```bash
kubectl logs deployment/consumer1
```

Consumer 2

```bash
kubectl logs deployment/consumer2
```

Kafka

```bash
kubectl logs deployment/kafka
```

---

# Test the API

PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/order" `
-Method POST `
-Headers @{ "Content-Type"="application/json" } `
-Body '{
"userId":"user1",
"product":"Phone",
"price":20000,
"idempotencyKey":"order-001"
}'
```

Expected response:

```json
{
  "message": "Order sent"
}
```

---

# Test Idempotent API

Run the same request again using the same `idempotencyKey`.

Expected response:

```json
{
  "message": "Duplicate request ignored"
}
```

---

# Verify Kafka Processing

Open logs:

Consumer 1

```bash
kubectl logs -f deployment/consumer1
```

Consumer 2

```bash
kubectl logs -f deployment/consumer2
```

Expected:

```text
Consumer1:
Processing Order...

Consumer2:
Sending Notification...
```

---

# Useful Commands

Restart deployment

```bash
kubectl rollout restart deployment/server
```

Restart all deployments

```bash
kubectl rollout restart deployment/server
kubectl rollout restart deployment/producer2
kubectl rollout restart deployment/kafka
kubectl rollout restart deployment/consumer1
kubectl rollout restart deployment/consumer2
```

Delete all resources

```bash
kubectl delete -f k8s/
```

Redeploy

```bash
kubectl apply -f k8s/
```

---

# Troubleshooting

## Pods are not running

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

---

## API is not reachable

Verify:

```bash
kubectl port-forward service/server 3000:3000
```

---

## Kafka connection issue

Verify Kafka Pod:

```bash
kubectl get pods
kubectl logs deployment/kafka
```

---

## Consumer not receiving messages

Verify:

* Kafka Pod is Running
* Consumer Pod is Running
* Topic name in `.env` matches producer and consumer configuration

---

# Features

* Event-driven architecture
* Multiple producers
* Multiple consumers
* Apache Kafka integration
* Docker containerization
* Kubernetes deployment
* Idempotent REST API
* Independent service communication
* Scalable microservice architecture

---

# Future Enhancements

* Redis-based idempotency
* MongoDB persistence
* Dead Letter Queue (DLQ)
* Multiple Kafka brokers
* Horizontal Pod Autoscaling
* ConfigMap & Secrets
* Ingress Controller
* Monitoring with Prometheus & Grafana

---

# Author

**Parth**

**Project:** KafkaFlowX – Event-Driven Microservices System
