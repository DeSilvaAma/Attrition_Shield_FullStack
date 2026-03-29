from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
import os
import shap
import numpy as np 

# --- NEW: needed to serve image files ---
from fastapi.staticfiles import StaticFiles

# --- Import database and models ---
from database import engine, get_db
import models
import schemas

# --- Import ML utils ---
from utils import load_sentiment_model, load_lgbm_model, build_feature_vector, generate_waterfall_plot

# ---------- Create tables ----------
models.Base.metadata.create_all(bind=engine)

# ---------- FastAPI app ----------
app = FastAPI()

# ---------- New: Waterfall png ----------
app.mount("/static", StaticFiles(directory="static"), name="static")

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Password hashing ----------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------- SIGNUP ----------
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = pwd_context.hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pw)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Signup successful!"}


@app.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful", "email": db_user.email}


# ---------- Load sentiment model once at server startup ----------
tokenizer, sent_model = load_sentiment_model("sentiment_model")


# ---------- JOB MODEL CACHE (NEW) ----------
# Global dictionary to store loaded job models
MODEL_CACHE = {}


# ---------- Prediction Request Schema ----------
class PredictionRequest(BaseModel):
    job: str
    rating: int
    career: int
    comp: int
    culture: int
    diversity: int
    senior: int
    wlb: int
    recommend: str
    ceo: str
    outlook: str
    worked_years: str
    title: str
    pros: str
    cons: str


# ---------- Prediction Endpoint ----------
@app.post("/predict")
async def predict_attrition(data: PredictionRequest):
    inputs = data.dict()

    # --- Construct job model filename ---
    job_model_name = inputs["job"].replace(" ", "_") + "_model"
    model_path = os.path.join("Job_Model_Results", f"{job_model_name}.pkl")

    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model for this job role not found.")

    # --- Lazy load job model ---
    if job_model_name not in MODEL_CACHE:
        MODEL_CACHE[job_model_name] = load_lgbm_model(model_path)  # Load from disk first time
    model = MODEL_CACHE[job_model_name]  # Reuse from cache on subsequent calls

    # --- Build feature vector ---
    X = build_feature_vector(inputs, tokenizer, sent_model)

    # --- Predict ---
    probs = model.predict_proba(X)[0]

    # --- SHAP Explainer ---
    explainer = shap.TreeExplainer(model)
    shap_vals = explainer.shap_values(X)
    shap_v = shap_vals[1][0] if isinstance(shap_vals, list) else shap_vals[0]

    # --- This ensures the Waterfall plot starts at the model's average prediction ---
    raw_expected = explainer.expected_value
    base_val = raw_expected[1] if isinstance(raw_expected, (list, np.ndarray)) else raw_expected # ADDED

    # --- UI mapping for features ---
    UI_MAP = {
        "rating": "Overall Rating",
        "Recommend": "Recommendation",
        "CEO Approval": "CEO Approval",
        "Business Outlook": "Business Outlook",
        "Career Opportunities": "Career Opportunities",
        "Compensation and Benefits": "Comp & Benefits",
        "Culture & Values": "Culture & Values",
        "Senior Management": "Senior Management",
        "Work/Life Balance": "Work/Life Balance",
        "Diversity & Inclusion": "Diversity & Inclusion",
        "worked_years": "Worked Years",
        "overall_sentiment": "Overall Sentiment (pros and cons)",
        "title_sentiment": "Title Sentiment"
    }

    # --- Derived feature parents ---
    DERIVED_FEATURE_PARENTS = {
        "employee_satisfaction": ["Compensation and Benefits", "Work/Life Balance", "overall_sentiment"],
        "culture_to_pay_ratio": ["Culture & Values", "Compensation and Benefits"],
        "culture_outlook_alignment": ["Culture & Values", "Business Outlook"],
        "tenure_growth_score": ["worked_years", "Career Opportunities"],
        "recommended_satisfaction": ["Recommend", "Compensation and Benefits", "Work/Life Balance", "overall_sentiment"],
        "inclusion_culture_score": ["Culture & Values", "Diversity & Inclusion"],
        "executive_trust": ["CEO Approval", "Senior Management"],
        "satisfaction_summary": ["rating", "title_sentiment"]
    }

    # --- Aggregate SHAP contributions to parent features ---
    parent_impacts = {key: 0 for key in UI_MAP.keys()}

    for i, col in enumerate(X.columns):
        shap_value = float(shap_v[i])
        if col in parent_impacts:
            parent_impacts[col] += shap_value
        elif col in DERIVED_FEATURE_PARENTS:
            parents = DERIVED_FEATURE_PARENTS[col]
            split_value = shap_value / len(parents)
            for p in parents:
                if p in parent_impacts:
                    parent_impacts[p] += split_value

    contributions = []
    for col, val in parent_impacts.items():
        contributions.append({
            "feature": UI_MAP[col],
            "impact": round(val, 4)
        })

    # --- Sort only for waterfall plot ---
    sorted_impacts = dict(
        sorted(parent_impacts.items(), key=lambda x: abs(x[1]), reverse=True)
    )

    # --- Generate SHAP waterfall plot ---
    generate_waterfall_plot(
        parent_impacts=sorted_impacts, 
        UI_MAP=UI_MAP, 
        user_inputs=inputs, 
        base_value=base_val
    ) 

    return {
        "attrition_risk": float(probs[1]),
        "stay_probability": float(probs[0]),
        "impact_scores": contributions,
        "waterfall_plot": "http://127.0.0.1:8000/static/shap_waterfall.png"
    }

