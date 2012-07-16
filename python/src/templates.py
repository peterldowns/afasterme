# coding: utf-8
from pystache import Renderer
from os.path import (extsep, join, abspath, exists)

DEFAULT_EXTENSION = 'html'
DEFAULT_DIRECTORY = 'static/templates'

RNDR = Renderer()

class TemplateNotFound(Exception):
	""" An exception raised when a template is not found. """
	pass

def read(path):
	"""
	Return the contents of a text file as a byte string.
	"""
	with open(path, 'rb') as f:
		return f.read()

def make_unicode(s, encoding='utf-8', errors='strict'): # TODO: move encoding, errors to config
	"""
	Returns a unicode version of an input string, whether or not the input
	is already unicode.
	"""
	if isinstance(s, unicode):
		return unicode(s)
	else:
		return unicode(s, encoding, errors)

def read_template(template_name, directory=DEFAULT_DIRECTORY, extension='html'):
	""" Load a template as a unicode string. """
	filename = extsep.join((template_name, extension))
	path = join(directory, filename)
	absolute = abspath(path)
	
	if exists(absolute):
		contents = read(absolute)
		return make_unicode(contents)
	else:
		raise TemplateNotFound(absolute)

def Render(template_name, *context, **kwargs):
	""" Use Pystache to render a template. """
	file_contents = read_template(template_name)
	return RNDR.render(file_contents, *context, **kwargs)
