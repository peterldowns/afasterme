# coding: utf-8
from src import app

@app.route('/', methods=['GET'])
def index():
	return "Hello, world!"
