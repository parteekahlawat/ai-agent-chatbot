# AI Chatbot with LangChain, Flask and React JS

This project demonstrates an AI chatbot built using **LangChain** and **Flask** for backend development, and **ReactJS** for frontend. The chatbot integrates a **Google Gemini model** for natural language processing, with live **internet search capabilities** via **DuckDuckGo**.

## Tools and Technologies

- **Frontend**: ReactJS, Material UI
- **Backend**: Flask, LangChain, LangChain Google Generative AI, DuckDuckGoSearch
- **LLM**: Google Gemini (via LangChain)
- **Search Integration**: DuckDuckGo API via LangChain
- **Deployment**: Docker, Kubernetes

---

## Project Setup

### 1. Local Setup

#### Prerequisites:

- Docker (for containerized setup)

#### Backend Setup (Flask):

1. Clone the repository and run the project:

   ```bash
   git clone https://github.com/your-repository-name.git
   cd your-repository-name
   
   Note: Add the google gemini api key in the docker-compose.yml file

   Run command:
   docker compose build
   docker compose up

## URLs
### Access the website at http://localhost:3000/
Frontend url - localhost:3000

Backend url - localhost:5000

## How Internet Search is Integrated
The chatbot uses DuckDuckGoSearch integrated with LangChain to perform live internet searches. This integration allows the bot to fetch real-time information to answer user queries.

### Process:
When a user sends a query, the Flask backend receives it.

LangChain’s DuckDuckGoSearch tool is triggered to fetch relevant search results from DuckDuckGo.

The tool returns the search results (or observations), which the bot processes and generates a response based on those results.

The response is then returned to the frontend and displayed to the user.

### Backend (Flask) Request to DuckDuckGo:
The backend makes use of the DuckDuckGoSearchResults tool from LangChain, which uses the DuckDuckGo API to perform the actual search queries.

The results are analyzed, and the bot generates a response.

## Folder Structure
### The project is divided into two main parts: frontend (ReactJS) and backend (Flask + LangChain).
  ```bash
AI-Chatbot
├── backend/                  # Backend folder (Flask + LangChain)
│   ├── app.py                # Flask app with LangChain agent
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Dockerfile for backend
│   └── .env                  # Environment variables (e.g., API keys)
├── frontend/                 # Frontend folder (ReactJS)
│   ├── src/
│   │   ├── App.js            # ReactJS main component
│   ├── package.json          # NPM dependencies
│   ├── Dockerfile            # Dockerfile for frontend
├── docker-compose.yml        # Docker Compose to manage services
└── README.md                 # This README file
```

## Folder Structure Details:
### backend/: Contains all backend code related to Flask, LangChain, and DuckDuckGoSearch integration.

- app.py: The main Flask app that handles POST requests, integrates LangChain with Google Gemini LLM, and makes DuckDuckGo searches.

- requirements.txt: Lists all Python dependencies for the backend.

- Dockerfile: Dockerfile to build the Flask container.

- .env: Stores API keys and other environment variables.

### frontend/: Contains the ReactJS frontend for interacting with the chatbot.

- src/: Contains React components and services.

- package.json: Lists all frontend dependencies.

- Dockerfile: Dockerfile to build the ReactJS container.

### docker-compose.yml: This file defines the services (frontend and backend) and their relationship in Docker. You can build and run both containers together using this.

## Conclusion
This project provides a chatbot interface using LangChain and Flask with live internet search integration using DuckDuckGo. It is containerized with Docker, and you can also deploy it to a Kubernetes cluster.

Frontend: ReactJS for chat interaction with the user.

Backend: Flask + LangChain to process user queries and make real-time internet searches.

Search Integration: DuckDuckGo via LangChain for fetching live search results.
