# coding: utf-8
import json
from src import app

def make_json(func):
	""" Wrap output from a function and make it JSON. """
	def json_wrapper(*args, **kwargs):
		result = func(*args, **kwargs)
		return json.dumps(result)
	return json_wrapper

@app.route('/api/', methods=['GET'])
@make_json
def api_overview():
	data = {
		'/' : 'A list of all available apis',
	}
	return data
