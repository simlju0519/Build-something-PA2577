from flask import Flask, redirect, request, session, url_for, jsonify
from flask_cors import CORS

import requests
import os
from asgiref.wsgi import WsgiToAsgi  # For ASGI compatibility

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Use a secure method for this
# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000", "http://51.12.49.77", "http://localhost:5000"], supports_credentials=True)



@app.route("/")
def home():
    return jsonify({"message": "Hello World Login API!"}), 200

# Convert the WSGI Flask app to ASGI
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
