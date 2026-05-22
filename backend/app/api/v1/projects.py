"""Projects endpoints — GET /api/v1/projects"""
from fastapi import APIRouter, Depends
from app.api.v1.auth import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()


class ProjectOut(BaseModel):
    id: str
    name: str
    description: str
    language: str
    last_deploy: str
    status: str
    success_rate: float
    total_runs: int


# In production these come from DB; here we return static demo data
DEMO_PROJECTS = [
    ProjectOut(id="proj_1", name="saas-backend", description="FastAPI + PostgreSQL REST API with JWT auth",
               language="Python", last_deploy="2 minutes ago", status="success", success_rate=94.0, total_runs=127),
    ProjectOut(id="proj_2", name="saas-frontend", description="React + TypeScript + TanStack Query SPA",
               language="TypeScript", last_deploy="Running...", status="running", success_rate=98.0, total_runs=89),
    ProjectOut(id="proj_3", name="saas-infra", description="Docker Compose + GitHub Actions CI/CD",
               language="YAML", last_deploy="1 hour ago", status="success", success_rate=100.0, total_runs=34),
]


@router.get("", response_model=list[ProjectOut])
async def list_projects(current_user: User = Depends(get_current_user)):
    return DEMO_PROJECTS
