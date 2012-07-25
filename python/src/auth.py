# coding: utf-8
from src import app # circular as fuck
from bottle import (redirect, abort)
from pystache import (template)
from db import (dbc)

ROOT_URL = '/'

@app.get('/login')
@app.get('/login/')
@template('static/templates/login.html')
def login_page():
    return {}, {}

@app.post('/login')
@app.post('/login/')
def login():
    email = request.form['email']
    password = request.form['password']
    if email and password:
        dbc.db('Running').collection('users')
        user = dbc.find_one({'email' : email, 'password' : password})
        if user:
            session['user'] = user
            session['logged_in'] = True
            return {
                'user' : user,
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
    del session['user']
    session['logged_in'] = False
    return redirect(ROOT_URL)

