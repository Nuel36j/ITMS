from sqlalchemy import create_engine, MetaData, select
import psycopg2

sqlite_engine = create_engine("sqlite:///itm_backup.db")

postgres_engine = create_engine(
   "postgresql+psycopg2://postgres:BMWM3P678@localhost:5432/itmsdb"
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