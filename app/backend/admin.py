# admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/admin", tags=["Admin"])

# Obtener todos los usuarios y sus resúmenes (solo admin)
@router.get("/users-summaries")
def get_users_summaries(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    users = db.query(models.User).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "summaries": [{"id": s.id, "texto_original": s.texto_original, "resumen": s.resumen} for s in u.summaries]
        })
    return result

# Eliminar un resumen
@router.delete("/summary/{summary_id}")
def delete_summary(summary_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    summary = db.query(models.Summary).filter(models.Summary.id == summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Resumen no encontrado")
    db.delete(summary)
    db.commit()
    return {"message": "Resumen eliminado"}

# Eliminar un usuario y todos sus resúmenes
@router.delete("/user/{user_id}")
def delete_user(user_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Eliminar todos los resúmenes asociados
    db.query(models.Summary).filter(models.Summary.user_id == user_id).delete()
    # Eliminar usuario
    db.delete(u)
    db.commit()
    return {"message": "Usuario y sus resúmenes eliminados"}
