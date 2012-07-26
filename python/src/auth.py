# coding: utf-8
import requests
from bottle import (redirect, abort, request)
from pystache import (template)

from src import app # circular as fuck
from db import (dbc)
from util import (session)
from conf import (fb_perms, fb_app_id)

ROOT_URL = '/'

@app.get('/fblogin')
@app.get('/fblogin/')
@template('static/templates/fblogin.html')
def fblogin():
    return {}, {}

@app.post('/fblogin')
@app.post('/fblogin/')
def fblogin_handler():
    s = session()
    fburl = (
        'https://www.facebook.com/dialog/oauth?client_id={0}'.format(fb_app_id)+
        '&redirect_uri={0}'.format('http://localhost:8080/fbredirect')+
        '&scope={0}'.format(','.join(fb_perms))+
        '&state={0}'.format(s['_csrf'])
    )
    print "Redirect URL =", fburl
    redirect(fburl)

@app.get('/fbredirect')
@app.get('/fbredirect/')
def fblogin_redirect():
    url = (
        'https://graph.facebook.com/oauth/access_token?client_id={0}'.format(fb_app_id)+
        '&redirect_uri={0}'.format('http://localhost:8080/fbredirect')+
        '&client_secret={0}'.format(fb_app_secret)+
        '&code={0}'.format(request.query.code)
    )
    resp = requests.post(url)
    print resp.status_code
    if resp.status_code == 200:
        print resp.content
    else:
        redirect('/')


































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

