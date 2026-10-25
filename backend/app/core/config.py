import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "Industrial Training Management API  + AI Integration"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    DATABASE_URL: str = os.getenv("DATABASE_URL")

    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 2

    CORS_ORIGINS:str= os.getenv("CORS_ORIGINS")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    MODEL:str = os.getenv("MODEL")
    FALLBACK_MODELS: str = "gemini-3.7-flash,gemini-flash-latest"


    @property
    def cors_origins(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.CORS_ORIGINS.split(",") if o.strip()]

    
    @property
    def model_chain(self) -> list[str]:
        extras = [m.strip() for m in self.FALLBACK_MODELS.split(",") if m.strip()]
        return list(dict.fromkeys([self.MODEL, *extras]))  # primary first, no duplicates
    
    class Config:
        env_file= ".env"
        env_file_encoding= "utf-8"

settings = Settings()