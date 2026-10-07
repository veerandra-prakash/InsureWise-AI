import re
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator


class InsuranceInputSchema(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Customer age in years (18-100)", json_schema_extra={"example": 38})
    gender: str = Field(..., description="Gender: Female, Male", json_schema_extra={"example": "Female"})
    bmi: float = Field(..., ge=10.0, le=70.0, description="Body Mass Index (10.0-70.0)", json_schema_extra={"example": 26.2})
    children: int = Field(..., ge=0, le=10, description="Number of children/dependents (0-10)", json_schema_extra={"example": 1})
    smoker: str = Field(..., description="Smoking status: No, Yes", json_schema_extra={"example": "No"})
    region: str = Field(..., description="Region: Central, Northeast, Northwest, Southeast, Southwest", json_schema_extra={"example": "Southeast"})
    occupation: str = Field(..., description="Occupation title", json_schema_extra={"example": "Nurse"})
    annual_income_usd: float = Field(..., ge=0.0, description="Annual income in USD", json_schema_extra={"example": 68000.0})
    exercise_level: str = Field(..., description="Exercise level: Low, Moderate, High", json_schema_extra={"example": "Moderate"})
    chronic_diseases: int = Field(..., ge=0, le=10, description="Count of chronic conditions (0-10)", json_schema_extra={"example": 0})
    doctor_visits_per_year: int = Field(..., ge=0, le=100, description="Doctor visits per year (0-100)", json_schema_extra={"example": 4})
    hospitalizations_last_year: int = Field(..., ge=0, le=10, description="Hospitalizations in past year (0-10)", json_schema_extra={"example": 0})
    alcohol_consumption_per_week: int = Field(..., ge=0, le=100, description="Alcoholic units/drinks per week (0-100)", json_schema_extra={"example": 3})
    insurance_plan: str = Field(..., description="Insurance plan tier: Basic, Standard, Premium, Gold", json_schema_extra={"example": "Standard"})
    blood_pressure: str = Field(..., description="Blood pressure string in 'systolic/diastolic' format", json_schema_extra={"example": "122/78"})
    diabetes: str = Field(..., description="Diabetes status: No, Yes", json_schema_extra={"example": "No"})
    cholesterol: float = Field(..., ge=50.0, le=600.0, description="Cholesterol level in mg/dL (50.0-600.0)", json_schema_extra={"example": 195.0})
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Average sleep hours per night (0.0-24.0)", json_schema_extra={"example": 7.2})
    stress_level: float = Field(..., ge=1.0, le=10.0, description="Self-reported stress level (1.0-10.0)", json_schema_extra={"example": 4.5})
    marital_status: str = Field(..., description="Marital status: Divorced, Married, Single, Widowed", json_schema_extra={"example": "Married"})

    @field_validator("exercise_level")
    @classmethod
    def normalize_exercise_level(cls, v: str) -> str:
        if v is None:
            return "Moderate"
        v_clean = str(v).strip().title()
        if v_clean in ["Medium", "Med"]:
            return "Moderate"
        return v_clean

    @field_validator("blood_pressure")
    @classmethod
    def validate_blood_pressure(cls, v: str) -> str:
        if not v or not isinstance(v, str):
            raise ValueError("blood_pressure must be a non-empty string in format 'systolic/diastolic' (e.g. '120/80')")
        v_clean = v.strip()
        if "/" not in v_clean:
            raise ValueError(f"Invalid blood_pressure format '{v}'. Expected format 'systolic/diastolic' (e.g., '120/80')")
        parts = v_clean.split("/")
        if len(parts) != 2 or not parts[0].isdigit() or not parts[1].isdigit():
            raise ValueError(f"Invalid blood_pressure components in '{v}'. Both systolic and diastolic values must be integers.")
        return v_clean


class PredictionResponseSchema(BaseModel):
    prediction: float = Field(..., description="Predicted annual medical insurance premium in USD")
    model_version: str = Field(..., description="Trained ML model version")
    explanation: Dict[str, float] = Field(..., description="SHAP feature contribution values in USD")


class HealthResponseSchema(BaseModel):
    status: str = Field("ok", description="Service health status")
    model_loaded: bool = Field(..., description="Whether the ML production model is loaded in memory")
