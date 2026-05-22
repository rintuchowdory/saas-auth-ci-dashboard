"""Pipeline model — CI/CD run records."""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Enum as SAEnum, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base
import enum


class PipelineStatus(str, enum.Enum):
    success = "success"
    running = "running"
    failed = "failed"
    pending = "pending"
    cancelled = "cancelled"


class Pipeline(Base):
    __tablename__ = "pipelines"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    branch: Mapped[str] = mapped_column(String(255), nullable=False)
    commit_sha: Mapped[str] = mapped_column(String(40), nullable=False)
    commit_message: Mapped[str] = mapped_column(String(512), nullable=False)
    status: Mapped[PipelineStatus] = mapped_column(
        SAEnum(PipelineStatus), default=PipelineStatus.pending, nullable=False, index=True
    )
    duration_seconds: Mapped[int | None] = mapped_column(nullable=True)
    stages: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

    # Author (FK to users)
    author_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    triggered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
