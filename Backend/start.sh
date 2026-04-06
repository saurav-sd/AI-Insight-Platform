#!/bin/bash
cd Backend
uvicorn app.main:app --host 0.0.0.0 --port $PORT