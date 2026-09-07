# 🚀 BuildPath — AI-Powered Project Discovery Platform

> Find real unsolved problems from the internet. Get a project scoped to your exact skills.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-FF6B6B?style=for-the-badge)

---

## 📌 What is BuildPath?

BuildPath is a full-stack AI platform that solves the **blank canvas problem** every developer faces — *"I have skills but I don't know what to build."*

Instead of generating generic ideas from thin air, BuildPath runs a **five-agent AI pipeline** that:

1. Scrapes real developer complaints from Reddit and GitHub
2. Clusters them semantically using vector embeddings
3. Matches the best problems to your specific tech stack
4. Validates that no solution already exists
5. Generates a fully scoped project spec with a week-by-week roadmap

**Every idea is backed by real human pain from the internet — not an AI guess.**

---

## 🎯 The Problem It Solves

| Existing Solution | Why It Fails |
|---|---|
| Ask ChatGPT for ideas | Hallucinated, generic, same output for everyone |
| Browse Reddit manually | Hours of effort, no structure, no stack matching |
| Google "project ideas" | Same 10 tutorial projects repeated everywhere |
| Ask friends/mentors | Limited perspective, no data validation |

---

## ✨ Features

- 🔍 **Real internet scraping** — Tavily searches Reddit and GitHub for genuine pain points
- 🧠 **Semantic clustering** — Mistral embeddings + ChromaDB group similar problems
- 🎯 **Stack matching** — Scores each problem against your exact tech stack and skill level
- ✅ **Idea validation** — Checks if solutions already exist before suggesting
- 📋 **Complete project specs** — Title, problem statement, solution, tech stack, MVP features
- 🗓️ **Week-by-week roadmap** — Tailored to your available time
- ⚡ **Live pipeline streaming** — Watch each agent work in real time via SSE
- 💾 **Save and revisit** — Save favorite ideas, view past pipeline runs

---

## 🏗️ Architecture

```
React Frontend
      │
      ▼
Node.js + Express (REST API + SSE)
      │
      ├── MongoDB Atlas (users, sessions, projects)
      │
      └── Python FastAPI Microservice
               │
               ├── LangGraph (agent orchestration)
               ├── Groq — Llama 3.3 70B (LLM)
               ├── Mistral AI (embeddings only)
               ├── ChromaDB (vector storage)
               └── Tavily API (web scraping)
```

---

## 🤖 Agent Pipeline

```
POST /pipeline/run
        │
        ▼
🔍 Scout Agent
   Tavily scrapes Reddit + GitHub → Groq extracts pain points
        │
        ▼
🗂️ Clustering Agent
   Mistral embeds pain points → ChromaDB → Groq clusters into themes
        │
        ▼
🎯 Match Agent
   Groq scores each cluster against your tech stack + skill level
        │
        ▼
✅ Validator Agent
   Tavily checks existing solutions → Groq filters saturated ideas
        │
        ▼
🏗️ Architect Agent
   Groq generates full project spec + roadmap → sent to Node
        │
        ▼
📊 Results Dashboard
   3-5 ranked project ideas with complete build plans
```

Each agent streams live status updates to the frontend via **Server Sent Events (SSE)**.

---

## 🛠️ Tech Stack

### Backend (Node.js)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API, auth, session management |
| MongoDB Atlas | Users, sessions, saved projects |
| JWT + HTTP-only Cookies | Secure authentication |
| Server Sent Events | Real-time agent status streaming |
| axios | HTTP client for Python service calls |

### AI Microservice (Python)
| Technology | Purpose |
|---|---|
| FastAPI + uvicorn | Python microservice entry point |
| LangGraph | Multi-agent orchestration |
| Groq (Llama 3.3 70B) | LLM for all agent reasoning |
| Mistral AI (mistral-embed) | Vector embeddings |
| ChromaDB | Local vector database |
| Tavily API | Web scraping (Reddit, GitHub, HN) |
| httpx | Async HTTP callbacks to Node |
| Pydantic | Request/response validation |

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Tailwind CSS | Styling |

---

## 📁 Project Structure

```
buildpath/
├── buildpath-backend/          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── session.js
│   │   │   └── projects.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── pipeline.route.js
│   │   │   └── project.route.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── pipeline.controller.js
│   │   │   └── project.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   └── services/
│   │       └── python.service.js
│   ├── .env.example
│   └── server.js
│
└── buildpath-python/           # Python AI Microservice
    ├── agents/
    │   ├── scout_agent.py
    │   ├── clustering_agent.py
    │   ├── match_agent.py
    │   ├── validator_agent.py
    │   └── architect_agent.py
    ├── pipeline/
    │   └── graph.py
    ├── services/
    │   ├── scraper.py
    │   ├── embeddings.py
    │   └── node_callback.py
    ├── models/
    │   └── schemas.py
    ├── config/
    │   └── settings.py
    ├── main.py
    ├── .env.example
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.11+
- MongoDB Atlas account (free M0 tier)
- API Keys: Mistral AI, Groq, Tavily

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/buildpath.git
cd buildpath
```

### 2. Setup Node.js Backend
```bash
cd buildpath-backend
npm install
cp .env.example .env
# fill in your values in .env
npm run dev
```

### 3. Setup Python Microservice
```bash
cd buildpath-python
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# fill in your values in .env
uvicorn main:app --reload --port 8000
```

### 4. Environment Variables

**Node.js `.env`**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PYTHON_SERVICE_URL=http://localhost:8000
```

**Python `.env`**
```
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key
GROQ_API_KEY=your_groq_key
NODE_CALLBACK_URL=http://localhost:5000/api/pipeline/callback
CHROMA_DB_PATH=./chroma_db
```

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login, set cookie |
| GET | `/me` | Yes | Get profile |
| POST | `/logout` | Yes | Clear session |

### Pipeline — `/api/pipeline`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/start` | Yes | Trigger pipeline |
| GET | `/stream/:sessionId` | Yes | SSE live updates |
| POST | `/callback/:sessionId` | No | Python agent callbacks |
| GET | `/status/:sessionId` | Yes | Pipeline status |
| GET | `/results/:sessionId` | Yes | Final project ideas |

### Projects — `/api/projects`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | All saved projects |
| GET | `/:id` | Yes | Single project + roadmap |
| POST | `/save` | Yes | Save a project |
| DELETE | `/:id` | Yes | Delete a project |

---

## 🔄 How SSE Streaming Works

```
1. Frontend hits POST /pipeline/start → gets sessionId
2. Frontend opens GET /pipeline/stream/:sessionId (SSE)
3. Python agents run in background
4. Each agent POSTs to /pipeline/callback/:sessionId when done
5. Node pushes update to open SSE connection
6. Frontend receives event and updates agent status card live
7. On completion → frontend fetches results
```

---

## 🗄️ Data Models

### User
```json
{
  "firstName": "string",
  "email": "string (unique)",
  "password": "hashed",
  "techStack": ["Node.js", "React"],
  "skillLevel": "beginner | intermediate | advanced",
  "goal": "placement | freelance | startup | learning"
}
```

### Session
```json
{
  "userId": "ObjectId",
  "status": "pending | running | completed | failed",
  "input": { "techStack": [], "skillLevel": "", "timeAvailable": "", "goal": "" },
  "agentLogs": [{ "agentName": "", "status": "", "message": "", "output": "" }],
  "results": ["ProjectId"]
}
```

### Project
```json
{
  "title": "string",
  "oneLiner": "string",
  "problemStatement": "string",
  "proposedSolution": "string",
  "techStack": ["string"],
  "matchScore": 87,
  "complexity": "easy | medium | hard",
  "estimatedTime": "1 month",
  "features": { "mvp": [], "stretch": [] },
  "roadmap": [{ "week": 1, "title": "", "tasks": [] }],
  "isSaved": false
}
```

---

## 🗓️ Build Roadmap

- [x] Node.js backend — auth, models, pipeline routes, project routes
- [x] Python microservice — FastAPI, all 5 agents, LangGraph orchestration
- [ ] End-to-end integration testing
- [ ] React frontend
- [ ] Deployment

---

## 👨‍💻 Author

**Om Vishwakarma** — 3rd Year B.Tech CSE  
Built as a flagship placement project demonstrating MERN + GenAI engineering.

---

## 📄 License

MIT
