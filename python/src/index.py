# coding: utf-8
from flask import (redirect, make_response)
from pystache import (template)
from src import (app)

@app.route('/', methods=['GET'])
@template('static/templates/index.html')
def index():
	return ({'name':'Peter'},{})

@app.route('/<path:path>/', methods=['GET', 'PUT', 'POST', 'DELETE', 'HEAD'])
def error_handler(path):
	return make_response("Page not found", 404)
