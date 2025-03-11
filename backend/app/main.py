from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import stream

app = FastAPI(title="CamPy RTSP Streaming API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stream.router, prefix="/api/stream", tags=["stream"])

@app.get("/")
async def root():
    return {"message": "Welcome to CamPy RTSP Streaming API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 