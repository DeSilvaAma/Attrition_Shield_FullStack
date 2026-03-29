# Attrition Shield

This project is a full-stack application consisting of a FastAPI backend and a React frontend.

## Prerequisites

* Python 3.12 or higher
* Node.js and npm

## Project Setup

The application is split into two main directories: backend and frontend. Two separate terminals are required to run both services simultaneously.

### 1. Backend Setup (FastAPI)

cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
fastapi dev main.py

The backend server runs on http://127.0.0.1:8000.

### 2. Frontend Setup (React)

cd frontend
npm install
npm run dev

The frontend application runs on http://localhost:5173.

## Project Structure

* backend/: FastAPI server, ML models (TinyBERT and LightGBM), and requirements.txt.
* frontend/: React application and package.json.

## Features

* User Authentication: Signup and Login for HR administrators.
* Attrition Prediction: Risk assessment based on employee data and feedback.
* Explainable AI: SHAP waterfall plots for prediction transparency.
* Sentiment Analysis: TinyBERT integration for qualitative review processing.

## Notes

* Virtual Environment: The environment must be activated before running backend commands.
* Dependencies: Backend libraries are managed via the requirements.txt file in the backend folder.
* Terminals: One terminal must stay dedicated to the backend and another to the frontend.

---
