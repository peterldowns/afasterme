# coding: utf-8
import conf
import util
from bottle import (Bottle, run, debug, static_file)
from beaker.middleware import (SessionMiddleware)
from pystache import (template_globals, template)

from api import (app as api_app)
from fb import (app as fb_app)

# Create the bottle app
bottle_app = Bottle()
app = SessionMiddleware(bottle_app, {
    'session.type' : 'file',
    'session.cookie_expires' : 300,
    'session.data_dir' : '.session',
    'session.auto' : True,
})
for attr in dir(bottle_app): # fucking black magic up in this bitch
    if not '__' in attr:
        #print "Setting {}.{} = {}.{} = {}".format(app, attr, bottle_app, attr, getattr(bottle_app, attr))
        setattr(app, attr, getattr(bottle_app, attr))

app.run = run
debug(conf.debug)

# Import circular-dependency subapps
import auth

# Add subapps
subapps = {
    '/api'  : api_app,
    '/fb'   : fb_app, # TODO: make the url the ROOT_URL of the application
}
for route, subapp in subapps.iteritems():
    app.mount(subapp, route)

# Set variables available to every template
template_globals.update({
    'csrf_token' : lambda: util.gen_csrf_token(),
    'name' : 'World',
})

# Homepage
@app.get('/')
@template('static/templates/index.html')
def index():
    user = util.session().get('user', {})
    if user:
        return {'name': user['email']}, {}
    else:
        return {}, {}

# Static files
@app.get('/static/<filepath:path>')
@app.get('/static/<filepath:path>')
def static(filepath):
    return static_file(filepath, root='static')

@app.get('/download/<filepath:path>')
def download(filepath):
    return static_file(filename, root='static', download=True)

# 404
@app.error(404)
def err_404(error):
    return "CAN'T LET YOU DO THAT STARFOX."

