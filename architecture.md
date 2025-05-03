# Architecture Overview
## Project Design
This project is an AI-powered chatbot that uses LangChain to process user queries. The chatbot is built with a Flask backend and a ReactJS frontend, integrated with a Google Gemini model for natural language processing and DuckDuckGo for live internet search.

The architecture consists of the following main components:

- Frontend (ReactJS): The user interface where users interact with the chatbot.

- Backend (Flask + LangChain): The backend responsible for processing user queries using the LangChain agent and integrating live search through DuckDuckGo.

- LangChain Agent: The core logic that processes queries, performs actions (such as searching the web), and provides answers.

- DuckDuckGoSearch: A tool integrated into LangChain that allows the bot to search the internet for relevant information.

- Google Gemini (LLM): A large language model (LLM) used for natural language processing and generating responses.

## High level Architecture
```bash
+--------------------+        +----------------------+
|                    |        |                      |
|   User Interface   |        |     ReactJS Frontend  |
|   (Chat UI)        | <----> | (User Input / Output) |
|                    |        |                      |
+--------------------+        +----------------------+
            |
            | (HTTP requests)
            |
            v
+------------------------+     +-------------------------------+
|                        |     |                               |
|     Flask Backend      | <--> |     LangChain Agent (LLM)     |
|  (Handles Requests)    |     |   (Processing and Reasoning)  |
|                        |     |                               |
+------------------------+     +-------------------------------+
            |
            | (API calls, internet search requests)
            |
            v
+---------------------------+   +-----------------------------+
|                           |   |                             |
|    DuckDuckGoSearch Tool  |   |    Google Gemini (LLM)      |
|  (Internet Search Results)|   |   (Generates Responses)     |
|                           |   |                             |
+---------------------------+   +-----------------------------+
```

## Agent Workflow
The chatbot's processing workflow involves several steps, where the LangChain agent interacts with the DuckDuckGoSearch tool and the Google Gemini model to generate responses.

### 1. User Sends Query:
The user types a message in the ReactJS frontend and submits it.

The frontend sends a POST request to the Flask backend with the user’s query.

### 2. Backend Receives Query:
The Flask backend receives the user query and forwards it to the LangChain agent for processing.

The backend also manages session data and handles the state of conversations (message history).

### 3. LangChain Agent Processing:
The LangChain agent begins processing the query.

If the agent determines that it needs additional information (e.g., a real-time data point), it invokes the DuckDuckGoSearch tool.

### 4. Internet Search (DuckDuckGoSearch):
The DuckDuckGoSearch tool queries DuckDuckGo for the relevant information using the search input.

The DuckDuckGoSearch tool returns search results to the LangChain agent.

### 5. Agent's Reasoning:
The LangChain agent uses the search results from DuckDuckGo and any prior knowledge from its memory (conversation history) to reason about the most appropriate response.

The agent can then generate a response using Google Gemini, which processes the information and provides a final answer.

### 6. Response Generation:
Once the Google Gemini model has generated the response, the LangChain agent sends the final response back to the Flask backend.

The backend sends this response back to the ReactJS frontend.

### 7. Frontend Displays Response:
The ReactJS frontend displays the generated response from the bot in the chat interface.

## Detailed Workflow
### 1. User Input:
The user submits a question through the chat UI.

Example query: "What is the current price of Apple stock?"

### 2. Backend and Agent Invocation:
The backend sends the query to LangChain’s initialize_agent() method.

The agent checks if external information is needed and decides to search the internet.

### 3. Search Execution (DuckDuckGoSearch):
The LangChain agent calls the DuckDuckGoSearch tool with a search query like "current price of Apple stock".

DuckDuckGo returns search results, including snippets of relevant information.

### 4. Processing by Google Gemini:
The agent processes the search results and may decide to call Google Gemini to generate a well-formed response based on the search results.

Google Gemini processes the input and generates a textual response like:
"The current price of Apple stock (AAPL) as of May 1, 2025, is $212.89."

### 5. Final Answer:
The final response is sent back to the backend.

The backend forwards the response to the ReactJS frontend.

### 6. Display Response:
The frontend displays the final response in the chat interface for the user to view.

## Key Components
### Frontend (ReactJS):

Provides an interactive chat interface where users can input questions and view responses.

Sends POST requests to the Flask backend and displays the returned responses.

### Backend (Flask + LangChain):

Acts as the intermediary between the user input and the chatbot’s reasoning.

Initializes and runs the LangChain agent, handles session states, and sends queries to external tools like DuckDuckGoSearch.

### LangChain Agent:

The core of the chatbot’s logic. It processes user queries, interacts with external tools (DuckDuckGoSearch), and generates answers.

Integrates with the Google Gemini model for advanced natural language processing and response generation.

### DuckDuckGoSearch Tool:

Provides the bot with real-time search results from DuckDuckGo, allowing the agent to access up-to-date information on various topics.

### Google Gemini (LLM):

A large language model (LLM) used for natural language processing and generating responses based on the agent’s reasoning and the fetched search results.

## Summary
This architecture provides a flexible and powerful system for building intelligent chatbots with real-time search capabilities. By combining LangChain, DuckDuckGoSearch, and Google Gemini, the chatbot can process user input, search the web for relevant information, and generate accurate responses to a wide range of questions.
