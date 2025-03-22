from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta, datetime, timezone
from passlib.context import CryptContext
import jwt
import logging

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, TokenRefreshRequest

SECRET_KEY = "secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    async with db as session:
        result = await session.execute(select(User).filter(User.username == user_data.username))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        hashed_password = get_password_hash(user_data.password)
        new_user = User(username=user_data.username, hashed_password=hashed_password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user


@router.post("/login", response_model=TokenResponse)
async def login_user(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        logger.debug(f"Received login request for user: {user_data.username}")

        async with db as session:
            result = await session.execute(select(User).filter(User.username == user_data.username))
            user = result.scalars().first()
            if not user:
                logger.warning(f"User {user_data.username} not found.")
                raise HTTPException(status_code=401, detail="Invalid username or password")

            if not verify_password(user_data.password, user.hashed_password):
                logger.warning(f"Incorrect password for user {user_data.username}.")
                raise HTTPException(status_code=401, detail="Invalid username or password")

            logger.debug(f"User {user_data.username} successfully authenticated.")

            access_token = create_access_token({"sub": user.username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
            refresh_token = create_access_token({"sub": user.username}, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

            logger.debug(f"Generated tokens for user {user_data.username}. Access token: {access_token[:30]}...")
            logger.debug(f"Generated refresh token for user {user_data.username}. Refresh token: {refresh_token[:30]}...")

            return JSONResponse(
                content={
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "token_type": "bearer"
    }
            )

    except Exception as e:
        logger.error(f"Error during login process: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: TokenRefreshRequest):
    try:
        payload = jwt.decode(token_data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        new_access_token = create_access_token({"sub": username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": new_access_token, "refresh_token": token_data.refresh_token, "token_type": "bearer"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")