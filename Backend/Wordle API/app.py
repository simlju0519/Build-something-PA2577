from flask import Flask, redirect, request, session, url_for, jsonify
from flask_cors import CORS
from components.database_connection import DatabaseConnection

import requests
import os
from asgiref.wsgi import WsgiToAsgi  # For ASGI compatibility

db = DatabaseConnection()

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Use a secure method for this
# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000", "http://51.12.49.77", "http://localhost:5000"], supports_credentials=True)



@app.route("/", methods=["GET"])
def home():
    print("Executing query", flush=True)
    result = db.execute_query("SELECT * FROM word")
    return jsonify({"message": result}), 200



@app.route("/insert/words", methods=["POST"])
def insert_data():
    # Get JSON from body
    words = request.get_json()

    if not words:
        return jsonify({"error": "No words provided"}), 400

    try:
        # Use executemany for batch insertion
        db.execute_many(
            "INSERT INTO word (word) VALUES (%s)",
            [(word,) for word in words]
        )
        print(f"Inserted {len(words)} words", flush=True)
    except Exception as e:
        print(f"Error inserting words: {e}", flush=True)
        return jsonify({"error": "Failed to insert words"}), 500
    
    return jsonify({"message": "Data inserted"}), 200

@app.route("/make-guess", methods=["GET"])
def make_guess():
    """
    Params of the request
    correctChars - characters    
        Example: correctChars=_s__d
    excludedChars - Plai string of excluded characters
        Example: excludedChars='cdfe'
    includedChars - Plain string of included characters
        Example: includedChars='ab'
    """

    # Get the parameters from the request
    correct_chars = request.args.get("correctChars")
    excluded_chars = request.args.get("excludedChars")
    included_chars = request.args.get("includedChars")

    print(correct_chars, excluded_chars, included_chars, flush=True)

    # Make the request to the Wordle API
    formated_correct_chars = ""
    for c in correct_chars:
        if c == " ":
            formated_correct_chars += "_"
        else:
            formated_correct_chars += c
    
    print(formated_correct_chars, flush=True)

    query = "SELECT word FROM word WHERE word LIKE (%s)", (formated_correct_chars,)


    print(query, flush=True)

    response = db.execute_query(
        "SELECT word FROM word WHERE word LIKE (%s)",
        (formated_correct_chars,)
    )

    # print(response, flush=True)

    # Return the response from the Wordle API
    return jsonify({"answare": response}), 200



# Convert the WSGI Flask app to ASGI
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
