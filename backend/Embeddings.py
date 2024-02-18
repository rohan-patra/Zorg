import pandas as pd
from sentence_transformers import SentenceTransformer
from sqlalchemy import create_engine, text
import os
import json

username = 'SUPERUSER'
password = 'Grover1234!'
hostname = 'localhost'
port = '1972'
namespace = 'USER'
CONNECTION_STRING = f"iris://{username}:{password}@{hostname}:{port}/{namespace}"

engine = create_engine(CONNECTION_STRING)
conn = engine.connect()


def create_table():
    sql = f"""
            CREATE TABLE embeddings_reviews (
        cid VARCHAR(255),
        type VARCHAR(255),
        description VARCHAR(3000),
        description_vector VECTOR(DOUBLE, 384)
    )
            """
    conn.execute(text(sql))

# create_table()

model = SentenceTransformer('all-MiniLM-L6-v2')


def chunkify(text, size):
    """Yield successive size chunks from text."""
    for i in range(0, len(text), size):
        yield text[i:i + size] 


def read_json_files(folder_path):
    # trans = conn.begin()
    json_files = [f for f in os.listdir(folder_path) if f.endswith('.json')]

    for file_name in json_files:
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            data_str = json.dumps(data)
            chunks = list(chunkify(data_str, 200))
            embeddings = model.encode(chunks, normalize_embeddings=True)
            embeddings.tolist()
            # for row in embeddings:
            for i in range(len(embeddings)):
                # print(type(row))
                with engine.connect() as conn:
                    with conn.begin():
                        sql = text("""
                            INSERT INTO embeddings_reviews 
                            (cid, type, description, description_vector) 
                            VALUES (:cid, :type, :description, TO_VECTOR(:description_vector))
                        """)
                        # print(row)
                        conn.execute(sql, {
                            'cid': 'aeruqioweuyrcon9y4o823qy4083q70c8ewya',
                            'type': 'json',
                            'description': chunks[i],
                            'description_vector': str(list(embeddings[i]))
                        })




# xml_file_path = './data'
# read_json_files(xml_file_path)



description_search = "diabetes diabetes"
search_vector = model.encode(description_search, normalize_embeddings=True).tolist() # Convert search phrase into a vector

with engine.connect() as conn:
    with conn.begin():
        sql = text("""
            SELECT TOP 3 CID FROM embeddings_reviews 
            ORDER BY VECTOR_DOT_PRODUCT(description_vector, TO_VECTOR(:search_vector)) DESC
        """)

        results = conn.execute(sql, {'search_vector': str(search_vector)}).fetchall()
print(results)