# coding: utf-8
from src import app # circular as fuck
from bottle import (redirect, abort, request)
from pystache import (template)
from db import (dbc)
from util import (session)

ROOT_URL = '/'

@app.get('/login')
@app.get('/login/')
@template('static/templates/login.html')
def login_page():
    return {}, {}

@app.post('/login')
@app.post('/login/')
def login():
    email = request.forms['email']
    password = request.forms['password']
    if email and password:
        dbc.db('Running').collection('users')
        user = dbc.find_one({'email' : email, 'password' : password})
        if user:
            s = session()
            s['user'] = user
            s['logged_in'] = True
            s.save()
            return {
                'user' : user['email'],
                'error' : None,
            }
        return abort(400, {
            'user' : None,
            'error' : 'Authentication failure',
        })
    return abort(400, {
        'user' : None, 
        'error': 'Must supply username and password',
    })

@app.route('/logout', method=['GET', 'POST'])
@app.route('/logout/', method=['GET', 'POST'])
def logout():
    s = session()
    try:
        s['logged_in'] = False
        del s['user']
    except KeyError: pass
    s.save()
    return redirect(ROOT_URL)

