"""
SaaS Auth CI Dashboard — FastAPI Backend
Stack: FastAPI + PostgreSQL + SQLAlchemy + JWT Auth + OAuth2
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import auth, pipelines, projects, users
from app.core.config import settings

app = FastAPI(
    title="SaaS Auth CI Dashboard API",
    description="Full-stack SaaS portfolio project — FastAPI + PostgreSQL + JWT Auth",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(pipelines.router, prefix="/api/v1/pipelines", tags=["pipelines"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])


@app.get("/api/health", tags=["health"])
async def health_check():
    return JSONResponse({"status": "ok", "version": "1.0.0"})


@app.get("/", include_in_schema=False)
async def root():
    return JSONResponse({"message": "SaaS Auth CI Dashboard API — see /api/docs"})
