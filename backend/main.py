from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from pathlib import Path
import logging
import json
import threading

# Admin credentials file lives next to this file (backend folder)
DB_PATH = Path(__file__).parent / "admins.json"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_lock = threading.Lock()

def init_store():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not DB_PATH.exists():
        # Default admin you can edit manually later
        default = {"admins": [{"username": "admin", "password": "adminlogin"}]}
        DB_PATH.write_text(json.dumps(default, ensure_ascii=False, indent=2), encoding="utf-8")

def load_admins():
    with _lock:
        try:
            data = json.loads(DB_PATH.read_text(encoding="utf-8"))
            return data
        except Exception:
            logger.exception("Failed to read admins.json; recreating")
            data = {"admins": [{"username": "admin", "password": "adminlogin"}]}
            DB_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            return data

def save_admins(data):
    with _lock:
        DB_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

class UserLogin(BaseModel):
    username: str
    password: str

@app.get("/health")
def health():
    logger.info("Health check called")
    data = load_admins()
    return {"status": "ok", "store": str(DB_PATH), "admin_count": len(data.get("admins", []))}

# Helpful root endpoint
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "AI Crowd Control backend",
        "endpoints": ["/health", "/api/login"]
    }

# No user signup in admin-only mode

@app.post("/api/login")
def login(user: UserLogin):
    logger.info("/api/login called for username=%s", user.username)
    data = load_admins()
    admins = data.get("admins", [])
    found = next((a for a in admins if a["username"].lower() == user.username.lower()), None)
    if not found:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    stored_pw = found.get("password", "")
    # Support either bcrypt hash (starts with $2) or plaintext for convenience
    if stored_pw.startswith("$2"):
        ok = pwd_context.verify(user.password, stored_pw)
    else:
        ok = (user.password == stored_pw)
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    return {"message": "Login successful."}

@app.on_event("startup")
def on_startup():
    init_store()
