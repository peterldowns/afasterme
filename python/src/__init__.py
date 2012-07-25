# coding: utf-8
import conf
import util

from bottle import (Bottle, run, debug, static_file)
from pystache import (template_globals, template)

from api import (app as api_app)

# Create the bottle app
app = Bottle()
app.run = run
debug(conf.debug)

# Mount subapps
subapps = {
    '/api'  : api_app,
}
for route, subapp in subapps.iteritems():
    app.mount(subapp, route)

# Set variables available to every template
template_globals.update({
    'csrf_token' : lambda: util.gen_csrf_token(session),
    'name' : 'World',
})

@app.get('/')
@template('static/templates/index.html')
def index():
    return {}, {}

@app.get('/static/<filepath:path>')
@app.get('/static/<filepath:path>')
def static(filepath):
    return static_file(filepath, root='static')

@app.get('/download/<filepath:path>')
def download(filepath):
    return static_file(filename, root='static', download=True)

@app.error(404)
def err_404(error):
    return "CAN'T LET YOU DO THAT STARFOX."
