from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

# Importar módulos locales SIN puntos
from database import Base, engine
import auth
import models
from summary_routes import router as summary_router
import admin


app = FastAPI(title="API Equipo 5 con JWT")


origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://10.5.20.50:4200",
    "http://localhost:9305",
    "http://127.0.0.1:9305",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


app.include_router(auth.router)

app.include_router(summary_router)

app.include_router(admin.router) 


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/mensaje")
def mensaje():
    return {"mensaje": "Hola desde el backend del equipo 5 (FastAPI)!"}

@app.get("/")
def root():
    return {"message": "API equipo5 funcionando correctamente"}
