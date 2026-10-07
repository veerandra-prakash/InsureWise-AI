import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import InsuranceInputSchema, PredictionResponseSchema, HealthResponseSchema
from app.predictor import predictor

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("insurewise.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Loads the ML model pipeline and initializes SHAP TreeExplainer ONCE on application startup.
    """
    logger.info("Starting up InsureWise AI FastAPI ML Service...")
    try:
        predictor.load_model()
        logger.info("ML Service initialization completed successfully.")
    except Exception as e:
        logger.critical(f"Failed to load ML model artifact during startup: {e}", exc_info=True)
        raise e
    yield
    logger.info("Shutting down InsureWise AI FastAPI ML Service.")


app = FastAPI(
    title="InsureWise AI — ML Prediction Service",
    description="Explainable Machine Learning REST API for Personalized Insurance Premium Prediction",
    version="1.0.0",
    lifespan=lifespan
)

import os

# CORS Configuration for Node.js / Express Backend and Web Clients
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponseSchema, tags=["Health"])
async def health_check():
    """
    Health check endpoint returning service operational status and model load state.
    """
    return HealthResponseSchema(
        status="ok",
        model_loaded=predictor.is_loaded()
    )


@app.post("/predict", response_model=PredictionResponseSchema, tags=["Inference"])
async def predict_premium(payload: InsuranceInputSchema):
    """
    Predicts annual medical insurance premium in USD and returns individual SHAP feature contributions.
    """
    if not predictor.is_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML prediction model is not loaded or available."
        )

    try:
        input_data = payload.model_dump()
        prediction, version, explanation = predictor.predict(input_data)
        
        return PredictionResponseSchema(
            prediction=prediction,
            model_version=version,
            explanation=explanation
        )
    except Exception as e:
        logger.error(f"Prediction execution error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the prediction request."
        )


# Global Exception Handlers (Ensures stack traces are NEVER exposed to clients)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({
            "detail": "Input validation failed. Please check the feature names and data types.",
            "errors": exc.errors()
        })
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
