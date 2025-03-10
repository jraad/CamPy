from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import cameras, settings, streams

app = FastAPI(
    title="CamPy API",
    description="Camera-Based Security System API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cameras.router, prefix="/api/v1", tags=["cameras"])
app.include_router(settings.router, prefix="/api/v1", tags=["settings"])
app.include_router(streams.router, prefix="/api/v1", tags=["streams"])

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "CamPy API",
        "version": "0.1.0"
    } 