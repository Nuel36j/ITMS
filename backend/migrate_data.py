from sqlalchemy import create_engine, MetaData, select
import psycopg
from app.core.config import settings

sqlite_engine = create_engine("sqlite:///itm_backup.db")

postgres_engine = create_engine(
  settings.DATABASE_URL)
)

metadata = MetaData()
metadata.reflect(bind=sqlite_engine)

with sqlite_engine.connect() as source, \
     postgres_engine.begin() as destination:

    for table in metadata.sorted_tables:
        rows = source.execute(select(table)).mappings().all()

        if rows:
            destination.execute(table.insert(), rows)

print("Migration complete!")