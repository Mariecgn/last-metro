# 🚇 Last Metro – EFREI DevOps

Projet DevOps (EFREI) – API Node.js + PostgreSQL, containerisée avec Docker et orchestrée via Docker Compose.

---

## 📆 Progression des Jours

| Jour | Objectif | Statut |
|------|-----------|--------|
| J1 | Setup PostgreSQL + connexion Node | ✅ |
| J2 | CRUD complet sur `/stations` + tests Jest | ✅ |
| J3 | Docker multi-stage + sécurité (Trivy) | ✅ |
| J4 | Déploiement Kubernetes (à venir) | 🔜 |

---

## ⚙️ Stack Technique

- Node.js (Express, ES modules)
- PostgreSQL (via conteneur `lm-postgres`)
- Docker & Docker Compose
- Swagger UI (documentation API)
- Tests : Jest + Supertest
- Trivy pour le scan de sécurité

---

## 🚀 Lancer le projet

### 1. Prérequis
- Docker Desktop installé et lancé

### 2. Cloner le repo
```bash
git clone https://github.com/Mariecgn/last-metro.git
cd last-metro
```

### 3. Démarrer les conteneurs
```bash
docker compose up --build
```

## Services disponibles :
API → http://localhost:3000
Swagger UI → http://localhost:8080
PostgreSQL → port 5432

---
| Méthode  | Route                     | Description               |
| -------- | ------------------------- | ------------------------- |
| `GET`    | `/health`                 | Vérifie la connexion DB   |
| `GET`    | `/next-metro?station=XXX` | Mock du prochain métro    |
| `GET`    | `/stations`               | Liste toutes les stations |
| `GET`    | `/stations/:id`           | Détail d’une station      |
| `POST`   | `/stations`               | Création                  |
| `PUT`    | `/stations/:id`           | Mise à jour               |
| `DELETE` | `/stations/:id`           | Suppression               |

---
### 🧪 Tests (J2)
Les tests utilisent Jest + Supertest.
Lancer les tests via Docker (sans rien installer localement)
```bash
docker run --rm -it \
  --network last-metro_default \
  -v "$PWD/api":/app -w /app node:18 sh -lc "
    npm install &&
    npm test
  "
```
> tests couverts :
GET /health
POST /stations
GET /stations/:id
---
### 🐳 Docker Multi-Stage (J3)
Le Dockerfile (api/Dockerfile) utilise un build multi-stage :
* Stage 1 : builder
Installe les dépendances et copie le code
* Stage 2 : image finale
>Ne garde que :
node_modules
src/
openapi.yaml
package*.json
Résultat :
➡️ Image optimisée d’environ 190 MB
---
### 🔒 Sécurité – Scan Trivy (J3)
Commande utilisée :
```bash
docker pull aquasec/trivy

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image last-metro-api:latest
```
---
### ❗ Problème rencontré
>Le scan échoue au téléchargement de la base de vulnérabilités :
context deadline exceeded
unexpected EOF
échec sur mirror.gcr.io ou ghcr.io
Tentatives effectuées :
changement de miroir (ghcr.io, public.ecr.aws)
ajout d’un cache local .trivy-cache
timeout augmenté
➡️ Conclusion : Trivy fonctionne, mais la récupération de la base échoue probablement à cause d’une restriction réseau externe.
➡️ Un scan des secrets a été généré avec succès.
---
### 🌿 Branches du Projet
- main
- 01-postgresql
- 02-db-schema
- 05-openapi
- 06-pool
- 07-rest
- 08-tests
- 09-optimize (Docker multi-stage + Trivy)