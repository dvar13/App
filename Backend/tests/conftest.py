import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Cambiar el path para importar módulos del backend
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, get_db
from database.db import Base, SessionLocal, PlayerDB, MetricDB
from datetime import datetime, timedelta
import random

# Base de datos de prueba en memoria
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    return engine

@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(autocommit=False, autoflush=False, bind=connection)(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def sample_data(db_session):
    """Crea datos de ejemplo para pruebas"""
    
    # Crear jugadores
    players = [
        PlayerDB(
            name="Alex 'Phantom' Chen",
            age=22,
            team="Thunder Gaming",
            country="South Korea",
            role="Mid Laner"
        ),
        PlayerDB(
            name="Maria 'Viper' Rodriguez",
            age=20,
            team="Eclipse Squad",
            country="Spain",
            role="ADC"
        ),
        PlayerDB(
            name="Lucas 'Shadow' Silva",
            age=24,
            team="Phoenix Rising",
            country="Brazil",
            role="Jungle"
        )
    ]
    
    for player in players:
        db_session.add(player)
    
    db_session.commit()
    
    # Crear métricas
    for player in players:
        base_time = datetime.utcnow() - timedelta(hours=8)
        
        for i in range(20):
            timestamp = base_time + timedelta(minutes=15 * i)
            hr_variation = random.randint(-15, 25)
            o2_variation = random.randint(-3, 1)
            
            metric = MetricDB(
                player_id=player.id,
                heart_rate=min(200, max(40, 70 + hr_variation)),
                oxygen_saturation=min(100, max(80, 98 + o2_variation)),
                timestamp=timestamp
            )
            db_session.add(metric)
    
    db_session.commit()
    
    return {
        "players": players,
        "player_ids": [p.id for p in players]
    }
