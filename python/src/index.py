# coding: utf-8
from flask import (redirect, make_response)
from src import (app)

@app.route('/', methods=['GET'])
def index():
	return """
	<center>
	<h1>Hello, world!</h1>
	<img src='/static/celebration_dance_addams_family.gif' />
	</center>
	"""

@app.route('/<path:path>/', methods=['GET', 'PUT', 'POST', 'DELETE', 'HEAD'])
def error_handler(path):
	return make_response("Page not found", 404)
