# coding: utf-8
import json
from flask import (redirect, make_response)
from src import (app)

def json_response(data, http_code=200):
	jdata = json.dumps(data)
	return make_response(jdata, http_code)

@app.route('/api/', methods=['GET'])
def api_overview():
	return json_response({
		'/api' : 'A list of all available apis',
		'/api/user' : {
			'POST' : 'Create a new user',
		},
		'/api/user/:username' : {
			'GET' : 'Retrieve information about a user',
			'PUT' : 'Update a user\'s information',
			'DELETE' : 'Delete the user\'s account',
		},
		'/api/log' : {
			'POST' : 'Log information about a run',
		},
		'/api/log/:year/:month/:day' : {
			'PUT' : 'Update logged information for a specific day',
			'GET' : 'Get logged information for a specific day',
			'DELETE' : 'Clear all logged information on a specific day',
		},
	})

@app.route('/api/user/', methods=['POST'])
def create_user():
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/user/<username>/', methods=['GET'])
def get_user(username):
	print username, type(username)
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/user/<username>/', methods=['PUT'])
def update_user(username):
	print username, type(username)
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/user/<username>/', methods=['DELETE'])
def delete_user(username):
	print username, type(username)
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/log/', methods=['POST'])
def create_log():
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/log/<year>/<month>/<day>/', methods=['GET'])
def get_log(year, month, day):
	print year, month, day
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/log/<year>/<month>/<day>/', methods=['PUT'])
def update_log(year, month, day):
	print year, month, day
	print "Got a put!"
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/log/<year>/<month>/<day>/', methods=['DELETE'])
def delete_log(year, month, day):
	print year, month, day
	return json_response({'error': 'Not Implemented'}, 501)

@app.route('/api/<path:path>/', methods=['GET', 'DELETE', 'PUT', 'HEAD', 'POST'])
def error_handler(path):
	return redirect('/api/')
