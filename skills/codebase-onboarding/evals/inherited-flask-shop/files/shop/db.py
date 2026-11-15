import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(os.environ.get("DATABASE_URL", "sqlite:///dev.db"))
Session = sessionmaker(engine)
