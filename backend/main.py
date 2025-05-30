from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uuid
from pathlib import Path
import os

app = FastAPI(title="MOOC Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for sessions
sessions: Dict[str, dict] = {}

# Data models
class UserSession(BaseModel):
    user_name: str

class ModuleProgress(BaseModel):
    module_id: int
    completed: bool = False

class QuizAnswer(BaseModel):
    question_id: int
    selected_option: int

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]

# Initial module structure
INITIAL_MODULES = [
    {
        "id": 1,
        "title": "Info Capsule",
        "description": "Watch the animation",
        "status": "unlocked",
        "type": "video"
    },
    {
        "id": 2,
        "title": "Fun Quiz",
        "description": "Who Wants to Be a Millionaire style",
        "status": "locked",
        "type": "quiz"
    },
    {
        "id": 3,
        "title": "Comic World",
        "description": "Read the story",
        "status": "locked",
        "type": "comic"
    },
]

# API Routes
@app.post("/api/session/start")
async def start_session(user_data: UserSession):
    """Create a new user session"""
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "user_name": user_data.user_name,
        "modules": INITIAL_MODULES.copy(),
        "current_module": 1,
        "quiz_score": 0,
        "completed_modules": [],
        "quiz_completed": False
    }
    return {"session_id": session_id, "user_name": user_data.user_name}

@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    """Get session data"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]

@app.get("/api/session/{session_id}/modules")
async def get_modules(session_id: str):
    """Get user's module progress"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]["modules"]

@app.post("/api/session/{session_id}/module/{module_id}/complete")
async def complete_module(session_id: str, module_id: int):
    """Mark a module as completed and unlock next module"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    # Update module status
    for module in session["modules"]:
        if module["id"] == module_id:
            module["status"] = "completed"
            session["completed_modules"].append(module_id)
        elif module["id"] == module_id + 1:
            module["status"] = "unlocked"
    
    # Check if all modules completed
    all_completed = len(session["completed_modules"]) == len(INITIAL_MODULES)
    
    return {
        "success": True,
        "all_completed": all_completed,
        "modules": session["modules"]
    }

@app.get("/api/module/{module_id}/content")
async def get_module_content(module_id: int):
    """Get content for a specific module"""
    if module_id == 1:
        # Video module with real video file
        video_path = Path(__file__).parent / "static" / "videos" / "animation-odl.MP4"
        if video_path.exists():
            return {
                "type": "video",
                "title": "Understanding Peace",
                "description": "Educational video about promoting peace and understanding",
                "video_url": "/api/videos/animation-odl.MP4",
                "filename": "animation-odl.MP4"
            }
        else:
            raise HTTPException(status_code=404, detail="Video file not found")
    elif module_id == 2:
        # Genially Quiz module
        return {
            "type": "quiz",
            "title": "Millionaire Quiz: Peace Knowledge",
            "description": "Test your understanding with this interactive millionaire-style quiz",
            "quiz_type": "genially",
            "iframe_url": "https://view.genially.com/682cd17f7e26505a343ccfa1",
            "iframe_html": '''<div style="width: 100%;"><div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Millionaire Quiz" frameborder="0" width="1200px" height="675px" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genially.com/682cd17f7e26505a343ccfa1" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div> </div>''',
            "completion_method": "manual"
        }
    elif module_id == 3:
        # Comic module - Updated for real comic images
        return {
            "type": "comic",
            "title": "Visual Journey: The Power of Unity",
            "pages": [
                {
                    "id": 1,
                    "title": "A New Friend",
                    "description": "Sarah is new to the community and feels nervous about making connections.",
                    "image_url": "/api/comics/comic-1.jpeg"
                },
                {
                    "id": 2,
                    "title": "Building Bridges", 
                    "description": "The community welcomes Sarah with open arms and understanding.",
                    "image_url": "/api/comics/comic-2.jpeg"
                },
                {
                    "id": 3,
                    "title": "Growing Together",
                    "description": "Through shared activities, new friendships begin to bloom.",
                    "image_url": "/api/comics/comic-3.jpeg"
                },
                {
                    "id": 4,
                    "title": "Supporting Each Other",
                    "description": "The community comes together to celebrate their diversity.",
                    "image_url": "/api/comics/comic-4.jpeg"
                }
            ]
        }
    else:
        raise HTTPException(status_code=404, detail="Module not found")

@app.post("/api/session/{session_id}/quiz/submit")
async def submit_quiz(session_id: str, submission: QuizSubmission):
    """Submit quiz answers and get score - For Genially quiz, this is manual completion"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # For Genially quiz, we just mark it as completed manually
    # Score is not tracked since it's external quiz
    sessions[session_id]["quiz_completed"] = True
    
    return {
        "success": True,
        "message": "Quiz completed successfully",
        "quiz_type": "genially"
    }

# Add a simpler endpoint for manual quiz completion
@app.post("/api/session/{session_id}/quiz/complete")
async def complete_quiz_manual(session_id: str):
    """Mark Genially quiz as completed manually"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    sessions[session_id]["quiz_completed"] = True
    
    return {
        "success": True,
        "message": "Quiz marked as completed"
    }

# Video serving endpoint
@app.get("/api/videos/{filename}")
async def serve_video(filename: str):
    """Serve video files"""
    video_path = Path(__file__).parent / "static" / "videos" / filename
    if video_path.exists():
        return FileResponse(
            path=video_path,
            media_type="video/mp4",
            headers={
                "Accept-Ranges": "bytes",
                "Content-Disposition": f"inline; filename={filename}"
            }
        )
    else:
        raise HTTPException(status_code=404, detail="Video not found")

# Comic serving endpoint
@app.get("/api/comics/{filename}")
async def serve_comic(filename: str):
    """Serve comic image files"""
    comic_path = Path(__file__).parent / "static" / "comics" / filename
    if comic_path.exists():
        return FileResponse(
            path=comic_path,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"inline; filename={filename}"
            }
        )
    else:
        raise HTTPException(status_code=404, detail="Comic image not found")

# Placeholder endpoints for media content
@app.get("/api/placeholder/comic/{page_id}")
async def placeholder_comic(page_id: int):
    return {"message": f"Comic page {page_id} will be served here"}

# Serve frontend static files
frontend_dist_path = Path(__file__).parent.parent / "frontend" / "dist"

# Mount static files
if frontend_dist_path.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist_path / "assets")), name="assets")

# Serve index.html for all frontend routes
@app.get("/")
async def serve_frontend():
    index_path = frontend_dist_path / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    else:
        return {"message": "Frontend not built. Run 'npm run build' in frontend directory."}

@app.get("/{path:path}")
async def serve_frontend_routes(path: str):
    # If it's an API route, let it pass through
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    # For all other routes, serve the frontend
    index_path = frontend_dist_path / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    else:
        return {"message": "Frontend not built. Run 'npm run build' in frontend directory."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 