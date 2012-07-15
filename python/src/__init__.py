# coding: utf-8
from bottle import (route, request, view, static_file, default_app, debug)

import api
import index
import static

debug(True)

app = index.app
app.mount(api.app, '/api')
app.mount(static.app, '/static')

if __name__=="__main__":
	from bottle import run
	run(app=app, server='wsgiref', host='127.0.0.1', port='8080', reloader=True)
