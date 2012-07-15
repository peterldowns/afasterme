# coding: utf-8
from bottle import (Bottle, request)

app = Bottle()

@app.get('/')
def index():
	return "Hello, world!"
