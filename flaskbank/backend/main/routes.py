"""
Main routes, home page ++ test
"""
from pathlib import Path
from flask import render_template, Blueprint, request, make_response, \
    send_from_directory
from flaskbank.backend.model import clients
from flaskbank.backend import bcrypt
from flaskbank.backend.config import Config

main = Blueprint('main', __name__)


# user registration post route
@main.route('/main/register', methods=['POST'])
def register():
    data = request.get_json()
    if data:

        first = data["first_name"]
        last = data["last_name"]
        email = data["email"]
        username = data["username"]

        if not clients.find_one({"username": username}):
            clients.insert_one({
                'first_name': first,
                'last_name': last,
                'username': username,
                'email': email,
                'password': bcrypt.generate_password_hash(data[
                    "password"].encode('utf-8')),

                'accounts': {'checking': [{'account_num': 123456,
                                           'balance': 0.0,
                                           'alias': 'Checking'}],
                             'savings': [{'account_num': 234567,
                                          'balance': 0.0,
                                          'alias': 'Saving'}]}
            })
            return make_response(('Registered', 201))

    return make_response(('Username already exist', 409))


# Catch all
@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def catch_all(path):
    if path and Path.exists(Path(str(Config.TEMPLATE_PATH) + path)):
        return send_from_directory(Config.TEMPLATE_PATH, path)
    return render_template('index.html')