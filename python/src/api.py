# coding: utf-8
import json
from bottle import (Bottle, request)

app = Bottle()

@app.get('/')
def api_overview():
	return {
		'/' : 'A list of all available apis',
	}
