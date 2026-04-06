from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

from app.services.ai_agents import (
    run_agents,
    summarize_agents_output,
    classify_intent,
    normal_chat_reply
)

from app.services.ai_service import generate_insight

router = APIRouter()


# 📊 Insights
@router.get("/ai/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()

    if not events:
        return {"insight": ["No data available yet."]}

    clean_data = [
        {column.name: getattr(e, column.name) for column in e.__table__.columns}
        for e in events
    ]

    data_for_ai = str(clean_data)

    insight = generate_insight(data_for_ai, db)

    return {"insight": insight}


# 🤖 Multi-agent
@router.get("/ai/agents")
def run_multi_agents(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()

    event_counts = {}
    for e in events:
        event_counts[e.event_name] = event_counts.get(e.event_name, 0) + 1

    data = {
        "total_events": len(events),
        "event_counts": event_counts
    }

    agents_output = run_agents(data, db)
    final_summary = summarize_agents_output(agents_output, db)

    return {
        "agents": agents_output,
        "final": final_summary
    }


# 💬 Chat
@router.post("/ai/chat")
def chat_with_agents(req: schemas.ChatRequest, db: Session = Depends(get_db)):
    user_message = req.question

    intent = classify_intent(user_message)

    if intent == "casual":
        reply = normal_chat_reply(user_message)

        return {
            "type": "casual",
            "agents": None,
            "final": reply
        }

    events = db.query(models.Event).all()

    event_counts = {}
    for e in events:
        event_counts[e.event_name] = event_counts.get(e.event_name, 0) + 1

    data = {
        "total_events": len(events),
        "event_counts": event_counts
    }

    agents_output = run_agents(data, db, user_message)
    final = summarize_agents_output(agents_output, db)

    return {
        "type": "analytics",
        "agents": agents_output,
        "final": final
    }