import azure.functions as func
import json
import uuid
from typing import Dict, List, Optional
import logging
import os
from pathlib import Path

# Initialize the Azure Functions app
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# In-memory storage for sessions (in production, use Azure Storage or Cosmos DB)
sessions: Dict[str, dict] = {}

# Azure Storage configuration
STORAGE_ACCOUNT_NAME = "odlwebsitestorage"
BLOB_BASE_URL = f"https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net"

# Data models (simplified for Azure Functions)
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

# Helper function to handle CORS
def create_response(data, status_code=200):
    return func.HttpResponse(
        json.dumps(data),
        status_code=status_code,
        headers={
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    )

def create_error_response(message, status_code=400):
    return func.HttpResponse(
        json.dumps({"error": message}),
        status_code=status_code,
        headers={
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    )

# Helper function to create redirect response
def create_redirect_response(url):
    return func.HttpResponse(
        "",
        status_code=302,
        headers={
            "Location": url,
            "Access-Control-Allow-Origin": "*"
        }
    )

# Handle CORS preflight requests
@app.route(route="api/{*path}", methods=["OPTIONS"])
def handle_cors(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        "",
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    )

# Session endpoints
@app.route(route="api/session/start", methods=["POST"])
def start_session(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        user_name = req_body.get('user_name')
        
        if not user_name:
            return create_error_response("user_name is required", 400)
        
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            "user_name": user_name,
            "modules": INITIAL_MODULES.copy(),
            "current_module": 1,
            "quiz_score": 0,
            "completed_modules": [],
            "quiz_completed": False
        }
        
        return create_response({
            "session_id": session_id, 
            "user_name": user_name
        })
    except Exception as e:
        logging.error(f"Error in start_session: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/session/{session_id}", methods=["GET"])
def get_session(req: func.HttpRequest) -> func.HttpResponse:
    try:
        session_id = req.route_params.get('session_id')
        
        if session_id not in sessions:
            return create_error_response("Session not found", 404)
        
        return create_response(sessions[session_id])
    except Exception as e:
        logging.error(f"Error in get_session: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/session/{session_id}/modules", methods=["GET"])
def get_modules(req: func.HttpRequest) -> func.HttpResponse:
    try:
        session_id = req.route_params.get('session_id')
        
        if session_id not in sessions:
            return create_error_response("Session not found", 404)
        
        return create_response(sessions[session_id]["modules"])
    except Exception as e:
        logging.error(f"Error in get_modules: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/session/{session_id}/module/{module_id}/complete", methods=["POST"])
def complete_module(req: func.HttpRequest) -> func.HttpResponse:
    try:
        session_id = req.route_params.get('session_id')
        module_id = int(req.route_params.get('module_id'))
        
        if session_id not in sessions:
            return create_error_response("Session not found", 404)
        
        session = sessions[session_id]
        
        # Update module status
        for module in session["modules"]:
            if module["id"] == module_id:
                module["status"] = "completed"
                if module_id not in session["completed_modules"]:
                    session["completed_modules"].append(module_id)
            elif module["id"] == module_id + 1:
                module["status"] = "unlocked"
        
        # Check if all modules completed
        all_completed = len(session["completed_modules"]) == len(INITIAL_MODULES)
        
        return create_response({
            "success": True,
            "all_completed": all_completed,
            "modules": session["modules"]
        })
    except Exception as e:
        logging.error(f"Error in complete_module: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/module/{module_id}/content", methods=["GET"])
def get_module_content(req: func.HttpRequest) -> func.HttpResponse:
    try:
        module_id = int(req.route_params.get('module_id'))
        
        if module_id == 1:
            # Video module - now using Azure Storage URL
            return create_response({
                "type": "video",
                "title": "Understanding Peace",
                "description": "Educational video about promoting peace and understanding",
                "video_url": f"{BLOB_BASE_URL}/videos/animation-odl.MP4",
                "filename": "animation-odl.MP4"
            })
        elif module_id == 2:
            # Genially Quiz module
            return create_response({
                "type": "quiz",
                "title": "Millionaire Quiz: Peace Knowledge",
                "description": "Test your understanding with this interactive millionaire-style quiz",
                "quiz_type": "genially",
                "iframe_url": "https://view.genially.com/682cd17f7e26505a343ccfa1",
                "iframe_html": '''<div style="width: 100%;"><div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Millionaire Quiz" frameborder="0" width="1200px" height="675px" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genially.com/682cd17f7e26505a343ccfa1" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div> </div>''',
                "completion_method": "manual"
            })
        elif module_id == 3:
            # Comic module - now using Azure Storage URLs
            return create_response({
                "type": "comic",
                "title": "Visual Journey: The Power of Unity",
                "pages": [
                    {
                        "id": 1,
                        "title": "A New Friend",
                        "description": "Sarah is new to the community and feels nervous about making connections.",
                        "image_url": f"{BLOB_BASE_URL}/comics/comic-1.jpeg"
                    },
                    {
                        "id": 2,
                        "title": "Building Bridges", 
                        "description": "The community welcomes Sarah with open arms and understanding.",
                        "image_url": f"{BLOB_BASE_URL}/comics/comic-2.jpeg"
                    },
                    {
                        "id": 3,
                        "title": "Growing Together",
                        "description": "Through shared activities, new friendships begin to bloom.",
                        "image_url": f"{BLOB_BASE_URL}/comics/comic-3.jpeg"
                    },
                    {
                        "id": 4,
                        "title": "Supporting Each Other",
                        "description": "The community comes together to celebrate their diversity.",
                        "image_url": f"{BLOB_BASE_URL}/comics/comic-4.jpeg"
                    }
                ]
            })
        else:
            return create_error_response("Module not found", 404)
    except Exception as e:
        logging.error(f"Error in get_module_content: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/session/{session_id}/quiz/submit", methods=["POST"])
def submit_quiz(req: func.HttpRequest) -> func.HttpResponse:
    try:
        session_id = req.route_params.get('session_id')
        
        if session_id not in sessions:
            return create_error_response("Session not found", 404)
        
        # For Genially quiz, we just mark it as completed manually
        sessions[session_id]["quiz_completed"] = True
        
        return create_response({
            "success": True,
            "message": "Quiz completed successfully",
            "quiz_type": "genially"
        })
    except Exception as e:
        logging.error(f"Error in submit_quiz: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/session/{session_id}/quiz/complete", methods=["POST"])
def complete_quiz_manual(req: func.HttpRequest) -> func.HttpResponse:
    try:
        session_id = req.route_params.get('session_id')
        
        if session_id not in sessions:
            return create_error_response("Session not found", 404)
        
        sessions[session_id]["quiz_completed"] = True
        
        return create_response({
            "success": True,
            "message": "Quiz marked as completed"
        })
    except Exception as e:
        logging.error(f"Error in complete_quiz_manual: {str(e)}")
        return create_error_response("Internal server error", 500)

# Static file serving endpoints (redirect to Azure Storage)
@app.route(route="api/videos/{filename}", methods=["GET"])
def serve_video(req: func.HttpRequest) -> func.HttpResponse:
    try:
        filename = req.route_params.get('filename')
        
        # Redirect to Azure Blob Storage
        blob_url = f"{BLOB_BASE_URL}/videos/{filename}"
        return create_redirect_response(blob_url)
    except Exception as e:
        logging.error(f"Error in serve_video: {str(e)}")
        return create_error_response("Internal server error", 500)

@app.route(route="api/comics/{filename}", methods=["GET"])
def serve_comic(req: func.HttpRequest) -> func.HttpResponse:
    try:
        filename = req.route_params.get('filename')
        
        # Redirect to Azure Blob Storage
        blob_url = f"{BLOB_BASE_URL}/comics/{filename}"
        return create_redirect_response(blob_url)
    except Exception as e:
        logging.error(f"Error in serve_comic: {str(e)}")
        return create_error_response("Internal server error", 500) 