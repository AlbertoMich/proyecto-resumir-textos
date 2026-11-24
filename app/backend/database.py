from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base



DATABASE_URL = (
    "postgresql+psycopg2://equipo5_owner:pass_equipo5@10.5.20.50:5432/equipo5"
)

print("DATABASE_URL:", DATABASE_URL)

metadata = MetaData(schema="app")


Base = declarative_base(metadata=metadata)


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
