from app.services.ai_service import call_ai_with_cache


# 🧠 Data Analyst
def data_analyst_agent(data, db, question=None):
    prompt = f"""
    You are a data analyst.

    Data:
    {data}
    """

    if question:
        prompt += f"\nUser Question:\n{question}"

    prompt += "\nAnalyze patterns, trends, anomalies."

    return call_ai_with_cache(prompt, db)


# 📈 Growth Agent
def growth_agent(data, db, question=None):
    prompt = f"""
    You are a growth expert.

    Data:
    {data}
    """

    if question:
        prompt += f"\nQuestion:\n{question}"

    prompt += "\nSuggest improvements and experiments."

    return call_ai_with_cache(prompt, db)


# ⚠️ Risk Agent
def risk_agent(data, db, question=None):
    prompt = f"""
    You are a risk analyst.

    Data:
    {data}
    """

    if question:
        prompt += f"\nQuestion:\n{question}"

    prompt += "\nIdentify risks and issues."

    return call_ai_with_cache(prompt, db)


# 🤖 Orchestrator
def run_agents(data, db, question=None):
    return {
        "data_agent": data_analyst_agent(data, db, question),
        "growth_agent": growth_agent(data, db, question),
        "risk_agent": risk_agent(data, db, question),
    }


# 🧠 Final Summary
def summarize_agents_output(agent_outputs, db):
    prompt = f"""
    You are a senior product strategist.

    Combine the following insights:

    {agent_outputs}

    Provide:
    - key takeaway
    - main problem
    - recommended action
    """

    return call_ai_with_cache(prompt, db)


# 🎯 Intent Classifier
def classify_intent(message: str):
    prompt = f"""
    Classify the message into:
    casual OR analytics

    Message:
    {message}
    """

    return call_ai_with_cache(prompt, None).lower()


# 💬 Chat
def normal_chat_reply(message: str):
    prompt = f"""
    You are a friendly assistant.

    Respond casually.

    User:
    {message}
    """

    return call_ai_with_cache(prompt, None)