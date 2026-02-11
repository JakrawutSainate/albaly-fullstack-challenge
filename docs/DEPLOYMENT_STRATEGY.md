# Deployment Strategy: Immutable Infrastructure

This project utilizes a **Container-based Deployment** strategy to ensure consistency, reliability, and scalability across any environment. By building a single Docker image that contains the application and all its dependencies, we eliminate "works on my machine" issues and ensure that what we test is exactly what we deploy.

## Why use this approach?

> "ผมเน้นทำ Immutable Infrastructure ครับ การทำ CD Pipeline นี้ทำให้มั่นใจว่าเรามี Docker Image ที่ผ่านการ Test (CI) และ Build สำเร็จพร้อม Deploy เสมอ ไม่ว่าจะเอาไปรันบน Kubernetes, AWS ECS หรือ DigitalOcean ก็แค่ Pull Image นี้ไปใช้ได้เลย ลดความเสี่ยงเรื่อง Environment Drift ได้ 100% ครับ"

## Pipeline Overview

1.  **Code Push**: Changes are pushed to the `main` branch.
2.  **CI/CD Trigger**: GitHub Actions triggers the `Deploy Production Image` workflow.
3.  **Build**: Docker image is built with all dependencies.
4.  **Publish**: The image is tagged (latest + sha) and pushed to GitHub Container Registry (GHCR).
5.  **Deploy**: Target production environment (e.g., K8s, DigitalOcean App Platform) simply pulls the new image tag.
