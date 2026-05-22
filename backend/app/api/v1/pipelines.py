"""
Pipelines endpoints
GET  /api/v1/pipelines
GET  /api/v1/pipelines/{id}
POST /api/v1/pipelines/{id}/retry
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.pipeline import Pipeline, PipelineStatus
from app.api.v1.auth import get_current_user
from app.models.user import User

router = APIRouter()


class PipelineOut(BaseModel):
    id: str
    project_name: str
    branch: str
    commit_sha: str
    commit_message: str
    status: str
    duration_seconds: Optional[int] = None
    stages: list
    triggered_at: str

    model_config = {"from_attributes": True}


@router.get("", response_model=list[PipelineOut])
async def list_pipelines(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0,
):
    result = await db.execute(
        select(Pipeline).order_by(desc(Pipeline.triggered_at)).limit(limit).offset(offset)
    )
    pipelines = result.scalars().all()
    return [
        PipelineOut(
            id=p.id,
            project_name=p.project_name,
            branch=p.branch,
            commit_sha=p.commit_sha,
            commit_message=p.commit_message,
            status=p.status.value,
            duration_seconds=p.duration_seconds,
            stages=p.stages,
            triggered_at=p.triggered_at.isoformat(),
        )
        for p in pipelines
    ]


@router.get("/{pipeline_id}", response_model=PipelineOut)
async def get_pipeline(
    pipeline_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Pipeline).where(Pipeline.id == pipeline_id))
    pipeline = result.scalar_one_or_none()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return PipelineOut(
        id=pipeline.id,
        project_name=pipeline.project_name,
        branch=pipeline.branch,
        commit_sha=pipeline.commit_sha,
        commit_message=pipeline.commit_message,
        status=pipeline.status.value,
        duration_seconds=pipeline.duration_seconds,
        stages=pipeline.stages,
        triggered_at=pipeline.triggered_at.isoformat(),
    )


@router.post("/{pipeline_id}/retry", status_code=202)
async def retry_pipeline(
    pipeline_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Pipeline).where(Pipeline.id == pipeline_id))
    pipeline = result.scalar_one_or_none()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline.status = PipelineStatus.pending
    pipeline.duration_seconds = None
    pipeline.finished_at = None
    await db.flush()
    return {"message": "Pipeline queued for retry", "id": pipeline_id}
