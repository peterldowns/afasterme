# coding: utf-8
from bottle import (Bottle, abort, redirect)

app = Bottle()
ROOT_URL = '/api'

@app.get('/')
def api_overview():
    return {
        '/api' : 'A list of all available apis',
        '/api/user' : {
            'POST' : 'Create a new user',
        },
        '/api/user/<username>' : {
            'GET' : 'Retrieve information about a user',
            'PUT' : 'Update a user\'s information',
            'DELETE' : 'Delete the user\'s account',
        },
        '/api/log' : {
            'POST' : 'Log information about a run',
        },
        '/api/log/<year>/<month>/<day>' : {
            'PUT' : 'Update logged information for a specific day',
            'GET' : 'Get logged information for a specific day',
            'DELETE' : 'Clear all logged information on a specific day',
        },
        '/api/key' : {
            'POST' : 'Creates a new key',

        },
        '/api/key/<key>' : {
            'GET' : 'Return information on a specific API key',
            'DELETE' : 'Delete this API key',
        },
    }

@app.post('/user')
@app.post('/user/')
def create_user():
    return abort(501, {'error': 'Not Implemented'})

@app.get('/user/<username>')
@app.get('/user/<username>/')
def get_user(username):
    print username, type(username)
    return abort(501, {'error': 'Not Implemented'})

@app.put('/user/<username>')
@app.put('/user/<username>/')
def update_user(username):
    print username, type(username)
    return abort(501, {'error': 'Not Implemented'})

@app.delete('/user/<username>')
@app.delete('/user/<username>/')
def delete_user(username):
    print username, type(username)
    return abort(501, {'error': 'Not Implemented'})

@app.post('/log')
@app.post('/log/')
def create_log():
    return abort(501, {'error': 'Not Implemented'})

@app.get('/log/<year>/<month>/<day>')
@app.get('/log/<year>/<month>/<day>/')
def get_log(year, month, day):
    print year, month, day

@app.put('/log/<year>/<month>/<day>')
@app.put('/log/<year>/<month>/<day>/')
def update_log(year, month, day):
    print year, month, day
    print "Got a put!"
    return abort(501, {'error': 'Not Implemented'})

@app.delete('/log/<year>/<month>/<day>')
@app.delete('/log/<year>/<month>/<day>/')
def delete_log(year, month, day):
    print year, month, day
    return abort(501, {'error': 'Not Implemented'})

@app.post('/key')
@app.post('/key/')
def create_api_key():
    return abort(501, {'error': 'Not Implemented'})

@app.get('/key/<key>')
@app.get('/key/<key>/')
def get_key_info(key):
    return abort(501, {'error': 'Not Implemented'})

@app.delete('/key/<key>')
@app.delete('/key/<key>/')
def delete_api_key(key):
    return abort(501, {'error' : 'Not Implemented'})

@app.route('/<path:path>', method=['GET', 'DELETE', 'PUT', 'HEAD', 'POST'])
def api_bad_path(path):
    print path
    print "Could not find {0}".format(path)
    return redirect(ROOT_URL)

