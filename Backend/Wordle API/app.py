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
CORS(app)



@app.route("/", methods=["GET"])
def home():
    print("Executing query", flush=True)
    result = db.execute_query("SELECT * FROM words")
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
            "INSERT INTO words (word) VALUES (%s)",
            [(word,) for word in words]
        )
        print(f"Inserted {len(words)} words", flush=True)
    except Exception as e:
        print(f"Error inserting words: {e}", flush=True)
        return jsonify({"error": "Failed to insert words"}), 500
    
    return jsonify({"message": "Data inserted"}), 200

@app.route("/make_guess", methods=["POST"])
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

    print("Correct chars:", correct_chars, flush=True)
    print("Excluded chars:", excluded_chars, flush=True)
    print("Included chars:", included_chars, flush=True)


    # Make the request to the Wordle API
    formated_correct_chars = ""
    for c in correct_chars:
        if c == " " or c == "_":
            formated_correct_chars += "_"
        else:
            formated_correct_chars += c

    # Create wordle search object
    db.execute_query(
        "INSERT INTO wordle_search (correct_chars, excluded_chars, included_chars) VALUES (%s, %s, %s)", 
        (correct_chars, excluded_chars, included_chars)
    )
    # Get the id of the search
    wordle_search_id = db.execute_query(
        "SELECT wordle_search_id FROM wordle_search WHERE correct_chars = %s AND excluded_chars = %s AND included_chars = %s ORDER BY searched_time DESC LIMIT 1",
        (correct_chars, excluded_chars, included_chars)
    )[0]['wordle_search_id']


    base_query = "SELECT * FROM words WHERE word LIKE %s"
    params = [formated_correct_chars]

    if excluded_chars:
        for c in excluded_chars:
            base_query += " AND word NOT LIKE %s"
            params.append("%" + c + "%")

    if included_chars:
        for c in included_chars:
            base_query += " AND word LIKE %s"
            params.append("%" + c + "%")


    print(base_query, params, flush=True)

    original_response = db.execute_query(base_query, params)

    print("Response:", original_response, flush=True)

    db.execute_many(
        "INSERT INTO word_provided_link (word_search_id, words_id) VALUES (%s, %s)",
        [(wordle_search_id, word["words_id"]) for word in original_response]
    )
    
    # Response is a list of words for an example
    # [{"word": "apple"}, {"word": "apply"}]
    # Only provide the words
    response = [word["word"] for word in original_response]

    # Return the response from the Wordle API
    return jsonify({"answare": response}), 200


@app.route("/get_top_recent_searches/<int:amount_limit>", methods=["GET"])
def get_top_recent_searches(amount_limit):
    """
    Get the top recent searches
    """
    response = db.execute_query("SELECT * FROM wordle_search ORDER BY searched_time DESC LIMIT %s", (amount_limit,))
    return jsonify({"recent_searches": response}), 200


@app.route("/get_search/<int:wordle_search_id>", methods=["GET"])
def get_search(wordle_search_id):
    """
    Get the top recent searches
    """
    wordle_search = db.execute_query("SELECT * FROM wordle_search WHERE wordle_search_id = %s", (wordle_search_id,))

    if not wordle_search:
        return jsonify({"error": "No search found"}), 404
    
    word_provided_links = db.execute_query("SELECT * FROM word_provided_link WHERE word_search_id = %s", (wordle_search_id,))

    words_id_lst = [word["words_id"] for word in word_provided_links]

    print("Words id list:", words_id_lst, flush=True)

    if not words_id_lst:
        return jsonify({"error": "No words found for the given search"}), 404

    placeholders = ', '.join(['%s'] * len(words_id_lst))
    query = f"SELECT * FROM words WHERE words_id IN ({placeholders})"
    words = db.execute_query(query, tuple(words_id_lst))

    response = {
        "wordle_search": wordle_search,
        "words": words
    }

    return jsonify({"search": response}), 200


# Convert the WSGI Flask app to ASGI
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
