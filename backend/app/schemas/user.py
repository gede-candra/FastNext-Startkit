from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.role import RoleRead


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=255)
    is_active: bool = True
    role_id: int


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: str | None = Field(default=None, min_length=3, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=128)
    is_active: bool | None = None
    role_id: int | None = None


class UserProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: str | None = Field(default=None, min_length=3, max_length=255)
    current_password: str | None = Field(default=None, min_length=1, max_length=128)
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserRead(UserBase):
    id: int
    role: RoleRead
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
