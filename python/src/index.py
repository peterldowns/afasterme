# coding: utf-8
from flask import (redirect, make_response)
from templates import (Render)
from src import (app)

class Index(object):
	pass

@app.route('/', methods=['GET'])
def index():
	return Render('index', name='World')

@app.route('/<path:path>/', methods=['GET', 'PUT', 'POST', 'DELETE', 'HEAD'])
def error_handler(path):
	return make_response("Page not found", 404)
