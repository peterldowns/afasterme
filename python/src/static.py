# coding: utf-8
from bottle import (Bottle, static_file)
app = Bottle()

static_path = 'static'

@app.get('/<filename:path>')
def static_file(filename):
	""" Return a static file. """
	return static_file(filename, root=static_path)

@app.get('/download/<filename:path>')
def download_file(filename):
	""" Return a static file, but force it to be downloaded. """
	return tatic_file(filename, root=static_path, download=True)

	

