import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True


def test_predict_success(client):
    payload = {
        "age": 38,
        "gender": "Female",
        "bmi": 26.2,
        "children": 1,
        "smoker": "No",
        "region": "Southeast",
        "occupation": "Nurse",
        "annual_income_usd": 68000.0,
        "exercise_level": "Moderate",
        "chronic_diseases": 0,
        "doctor_visits_per_year": 4,
        "hospitalizations_last_year": 0,
        "alcohol_consumption_per_week": 3,
        "insurance_plan": "Standard",
        "blood_pressure": "122/78",
        "diabetes": "No",
        "cholesterol": 195.0,
        "sleep_hours": 7.2,
        "stress_level": 4.5,
        "marital_status": "Married"
    }

    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "model_version" in data
    assert "explanation" in data
    assert isinstance(data["prediction"], float)
    assert isinstance(data["model_version"], str)
    assert isinstance(data["explanation"], dict)
    assert len(data["explanation"]) > 0


def test_predict_invalid_input(client):
    payload = {
        "age": 38,
        "gender": "Female",
        "bmi": 26.2,
        "children": 1,
        "smoker": "No",
        "region": "Southeast",
        "occupation": "Nurse",
        "annual_income_usd": 68000.0,
        "exercise_level": "Moderate",
        "chronic_diseases": 0,
        "doctor_visits_per_year": 4,
        "hospitalizations_last_year": 0,
        "alcohol_consumption_per_week": 3,
        "insurance_plan": "Standard",
        "blood_pressure": "invalid_bp_string",
        "diabetes": "No",
        "cholesterol": 195.0,
        "sleep_hours": 7.2,
        "stress_level": 4.5,
        "marital_status": "Married"
    }

    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
