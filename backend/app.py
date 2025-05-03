import os
from flask import Flask, request, jsonify
from flask_cors import CORS 

from langchain.agents import initialize_agent, Tool, AgentType
from langchain.memory import ConversationBufferMemory
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app) 

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "GOOGLE-KEY-NOT-FOUND")

google_ai_llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)


ddg_search = DuckDuckGoSearchResults()

memory = ConversationBufferMemory(memory_key="history", return_messages=True)

# Define tools available to the agent
tools = [
    Tool(
        name="DuckDuckGoSearch",
        func=ddg_search.run,
        description="Search the web using DuckDuckGo for relevant information"
    ),
]

# Initialize LangChain agent with ChatGoogleGenerativeAI
agent = initialize_agent(
    tools,
    google_ai_llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    memory=memory,
    verbose=True,
    handle_parsing_errors=True
)


def get_answer_and_summary(question):

    final_answer = agent.run(question)
    reasoning_steps = memory.load_memory_variables({})

    step_summary = f"""{reasoning_steps}"""
    
    return final_answer, step_summary

# Flask route to handle queries
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get("question")
    print(question)
    if not question:
        return jsonify({"error": "Question is required"}), 400
    try:
        final_answer, step_summary = get_answer_and_summary(question)
        return jsonify({
            "final_answer": final_answer,
            "step_summary": step_summary
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
