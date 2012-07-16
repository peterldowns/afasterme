from os.path import (extsep, join, abspath, exists)

DEFAULT_EXTENSION = 'html'
DEFAULT_DIRECTORY = 'static/templates'
DEFAULT_ENCODING = 'utf-8'
DEFAULT_ERRORS = 'xmlcharrefreplace'

class TemplateNotFound(Exception):
	""" An exception raised when a template file does not exist. """
	pass

def get_path(template_name, directory, extension):
	"""
	Given a relative or absolute filename / path / extension,
	return an absolute path to the file.
	"""
	filename = extsep.join((template_name, extension))
	rel_path = join(directory, filename)
	abs_path = abspath(rel_path)

	return abs_path

def read(path):
	"""
	Return the contents of a text file as a byte string.
	"""
	with open(path, 'rb') as f:
		return f.read()

def make_unicode(s, encoding, errors):
	"""
	Returns a unicode version of an input string, whether or not the input
	is already unicode.
	"""
	if isinstance(s, unicode):
		return unicode(s)
	else:
		return unicode(s, encoding, errors)

def Load(template_name, directory=DEFAULT_DIRECTORY, extension=DEFAULT_EXTENSION, encoding=DEFAULT_ENCODING, errors=DEFAULT_ERRORS):
	""" Load a template and return its contents as a unicode string. """
	abs_path = get_path(template_name, directory, extension)
	if exists(abs_path):
		contents = read(abs_path)
		return make_unicode(contents, encoding, errors)
	else:
		raise TemplateNotFound(abs_path)

def LoadFile(path, encoding=DEFAULT_ENCODING, errors=DEFAULT_ERRORS):
	""" Given an existing path, attempt to load it as a unicode string. """
	abs_path = abspath(path)
	if exists(abs_path):
		contents = read(abs_path)
		return make_unicode(contents, encoding, errors)
	else:
		raise TemplateNotFound(abs_path)
