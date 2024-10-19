import os
import logging

logger = logging.getLogger(__name__)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    if os.environ.get('K_SERVICE'):  # We're on Cloud Run
        logger.info("Running on Cloud Run, using PostgreSQL")
        db_socket_dir = os.environ.get("DB_SOCKET_DIR", "/cloudsql")
        cloud_sql_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")
        db_user = os.environ.get("DB_USER")
        db_pass = os.environ.get("DB_PASS")
        db_name = os.environ.get("DB_NAME")
        
        if not all([cloud_sql_connection_name, db_user, db_pass, db_name]):
            raise ValueError("Missing database configuration for Cloud SQL")
        
        SQLALCHEMY_DATABASE_URI = f"postgresql://{db_user}:{db_pass}@/{db_name}?host={db_socket_dir}/{cloud_sql_connection_name}"
    else:
        logger.info("Running locally, using SQLite")
        SQLALCHEMY_DATABASE_URI = 'sqlite:///pizzas.db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

logger.info(f"SQLALCHEMY_DATABASE_URI: {Config.SQLALCHEMY_DATABASE_URI}")