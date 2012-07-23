# coding: utf-8
from flask import (Flask, abort, request, make_response, session)
from pystache import (template_globals, template)
import conf
import util

# Create the Flask app
app = Flask(__name__)

# Lets every template use csrf_token
template_globals.update({
    'csrf_token' : lambda: util.gen_csrf_token(session),
})


# Add the routes defined in other files
import src.index
import src.api
import src.auth

# Enable sessions
app.secret_key = conf.secret_key

# Debugging
app.debug = conf.debug

# CSRF Protection
@app.before_request
def csrf_protect():
    if request.method == "POST":
        token = session.pop('_csrf', None)
        if not token or token != request.form.get('_csrf'):
            abort(400)

# Generic error handler
@app.route('/<path:path>/', methods=['GET', 'PUT', 'POST', 'DELETE', 'HEAD'])
def error_handler(path):
    return make_response("Page not found", 404)
