from sqlalchemy.orm import Session
from app.models import AICache
import hashlib


def get_hash(query: str):
    return hashlib.sha256(query.encode()).hexdigest()


def get_cached_response(db: Session, query: str):
    query_hash = get_hash(query)
    return db.query(AICache).filter_by(query_hash=query_hash).first()


def save_response(db: Session, query: str, response: str):
    query_hash = get_hash(query)

    cache = AICache(
        query_hash=query_hash,
        response=response
    )

    db.add(cache)
    db.commit()
    db.refresh(cache)
    return cache