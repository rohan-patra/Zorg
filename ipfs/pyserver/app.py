from flask import Flask, request, jsonify
import os
import requests  # Import the requests library
from flask_cors import CORS

app = Flask(__name__)
CORS(app)







import pandas as pd
from sentence_transformers import SentenceTransformer
from sqlalchemy import create_engine, text
# import os
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

# @app.route("/getFromIPFS", methods=["POST"])
# def get_from_ipfs():
#     cid = request.form.get('cid', '')
#     filename = request.form.get("filename", '')
#     key = request.form.get("key", '')
#     response = requests.get(f'http://localhost:5002/getFromIPFS?cid={cid}&fileName={filename}')
#     if response.status_code == 200:
#         # Assuming the Express server returns the file
#         file = response.content
#         os.makedirs("downloads", exist_ok=True)
#         file.save(f'downloads/{filename}')

#         # Decrypt the file
#         decrypted_path = os.path.join('decrypted', filename)
#         os.makedirs("decrypted", exist_ok=True)
#         os.system(f"./decrypt {key} downloads/{filename} {decrypted_path}")

#         return file, 200
#     else:
#         return jsonify({'error': 'Failed to get from IPFS', 'details': response.text}), 500
@app.route("/getFromIPFS", methods=["POST"])
def get_from_ipfs():
    cid = request.form.get('cid', '')
    filename = request.form.get("fileName", '')
    key = request.form.get("key", '')
    response = requests.get(f'http://localhost:5002/getFromIPFS?cid={cid}&fileName={filename}')
    if response.status_code == 200:
        # Create downloads directory if it doesn't exist
        os.makedirs("downloads", exist_ok=True)
        download_path = os.path.join('downloads', filename)
        
        # Write the content to a file
        with open(download_path, 'wb') as f:
            f.write(response.content)

        # Decrypt the file
        decrypted_path = os.path.join('decrypted', filename)
        os.makedirs("decrypted", exist_ok=True)
        os.system(f"./decrypt {key} {download_path} {decrypted_path}")

        # To return the file directly, use send_file from Flask
        from flask import send_file
        return send_file(decrypted_path, as_attachment=True)
    else:
        return jsonify({'error': 'Failed to get from IPFS', 'details': response.text}), 500


@app.route("/findRelevant", methods=["POST"])
def find_relevant_cids():
    description_search = request.form.get('searchQuery', '')
    search_vector = model.encode(description_search, normalize_embeddings=True).tolist() # Convert search phrase into a vector

    with engine.connect() as conn:
        with conn.begin():
            # sql = text("""
            #     SELECT TOP 3 * FROM embeddings_reviews 
            #     ORDER BY VECTOR_DOT_PRODUCT(description_vector, TO_VECTOR(:search_vector)) DESC
            # """)
            sql = text("""
                SELECT TOP 3 CID FROM embeddings_reviews 
                ORDER BY VECTOR_DOT_PRODUCT(description_vector, TO_VECTOR(:search_vector)) DESC
            """)
            
            results = conn.execute(sql, {'search_vector': str(search_vector)}).fetchall()
    print(results)
    resultCids = {}
    for index in range(len(results)):
        resultCids[index] = results[index][0]
    return jsonify(resultCids), 200



@app.route('/storeToIPFS', methods=['POST'])
def store_to_ipfs():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    encryption_key = request.form.get('encryptionKey', '')
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and encryption_key:
        filename = file.filename

        # Optionally use the encryption key here for actual encryption before saving
        save_path = os.path.join('uploads', filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(save_path)

        # Encrypt the file
        encrypted_path = os.path.join('encrypted', filename)
        os.makedirs("encrypted", exist_ok=True)
        os.system(f"./encrypt {encryption_key} uploads/{filename} {encrypted_path}")

        # Send the encrypted file to the Express IPFS server
        with open(encrypted_path, 'rb') as encrypted_file:
            files = {'file': (filename, encrypted_file)}
            response = requests.post('http://localhost:5002/storeToIPFS', files=files)
            if response.status_code == 200:
                # Assuming the Express server returns JSON with a 'cid' field
                cid = response.json().get('cid').get('/')
                print(cid)
                # Store the CID in a database
                # TODO add the storage thing for if the file is a json -> basically just use hte code already done by vardhan to actually put it on intersystems
                if filename.endswith('.json'):
                    with open(save_path, 'r') as json_file:
                        data = json.load(json_file)
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
                                        'cid': cid,
                                        'type': 'json',
                                        'description': chunks[i],
                                        'description_vector': str(list(embeddings[i]))
                                    })


                return jsonify({'cid': cid}), 200
            else:
                return jsonify({'error': 'Failed to store to IPFS', 'details': response.text}), 500

    return jsonify({'error': 'Missing file or encryption key'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
