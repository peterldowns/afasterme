# coding: utf-8
from flask import (redirect, make_response)
from pystache import (template)
from src import (app)

@app.route('/', methods=['GET'])
@app.route('static/templates/index.html')
def index():
	return Template('index', {'name':'World'})

@app.route('/<path:path>/', methods=['GET', 'PUT', 'POST', 'DELETE', 'HEAD'])
def error_handler(path):
	return make_response("Page not found", 404)
