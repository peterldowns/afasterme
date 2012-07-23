# coding: utf-8
from flask import (session, request, redirect)
from src import (app)

from pystache import (template)
from util import (json_response)
from db import (dbc)

@app.route('/login/', methods=['GET'])
@template('static/templates/login.html')
def login_page():
    return {}, {}

@app.route('/login/', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    if email and password:
        dbc.db('Running').collection('users')
        user = dbc.find_one({'email' : email, 'password' : password})
        if user:
            session['user'] = user
            session['logged_in'] = True
            print user
            return json_response({
                'user' : user,
                'error' : None,
            }, 200)
        return json_response({
            'user' : None,
            'error' : 'Authentication failure',
        }, 400)
    return json_response({
        'user' : None, 
        'error': 'Must supply username and password',
    }, 400)


@app.route('/logout/', methods=['GET', 'POST'])
def logout_page():
    del session['user']
    session['logged_in'] = False
    return redirect('/login/')
