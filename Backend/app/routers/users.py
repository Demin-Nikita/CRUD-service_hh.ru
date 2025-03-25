import jwt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, TokenRefreshRequest
from app.auth import (create_access_token, verify_password, get_password_hash,
                      decode_token)

router = APIRouter(prefix="/users")

# Register new user
@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    async with db as session:
        # Check if the username already exists
        result = await session.execute(select(User).filter(User.username == user_data.username))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")

        # Hash the password and create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(username=user_data.username, hashed_password=hashed_password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

# Login user and return tokens
@router.post("/login", response_model=TokenResponse)
async def login_user(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    async with db as session:
        # Fetch user by username
        result = await session.execute(select(User).filter(User.username == user_data.username))
        user = result.scalars().first()

        # Check if user exists and if the password is correct
        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        # Generate access and refresh tokens
        access_token = create_access_token({"sub": user.username})
        refresh_token = create_access_token({"sub": user.username})

        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# Refresh access token using the refresh token
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: TokenRefreshRequest):
    try:
        # Decode the refresh token to get the username
        username = decode_token(token_data.refresh_token)
        if not username:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        # Generate a new access token and return it with the original refresh token
        new_access_token = create_access_token({"sub": username})
        return {"access_token": new_access_token, "refresh_token": token_data.refresh_token, "token_type": "bearer"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")