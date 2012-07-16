#TODO: fix context loading (of objects or dicts or whatever) and retrieval of values from the context stack.
# https://github.com/defunkt/pystache/blob/master/pystache/context.py

class Context(object):
	""" Holds values that are used to render a template. """
	def __init__(self, context=None, **kwargs):
		context = context or {}
		context.update(**kwargs)
		self.stack = [context]
	def get_or_attr(self, key, default=None):
		if not self.stack:
			return default
		for ctx in reversed(self.stack):
			try:
				return ctx[key]
				break
			except KeyError:
				pass
			except Exception as e:
				try:
					return getattr(ctx, key)
					break
				except AttributeError:
					pass
		return default
	def push(self, key):
		self.stack.append(key)
	def pop(self, index=None):
		if index:
			return self.stack.pop(index)
		else:
			return self.stack.pop()
	def get(self, attr, default=None):
		default = getattr(self, attr, default)
		attr = self.get_or_attr(attr, default)
		return attr
		#if hasattr(attr, '__call__'):
			#return attr()
		#else:
			#return attr
	def __get_context(self):
		context = {}
		for item in reversed(self.stack):
			if hasattr(item, 'keys') and hasattr(item, '__getitem__'):
				context.update(item)
		return context
	def __contains__(self, needle):
		return needle in self.__get_context() or hasattr(self, needle)
	def __getitem__(self, attr):
		val = self.get(attr, None)
		if val is None:
			raise KeyError("Key %s does not exist in Context" % repr(attr))
		else:
			return val
	def __str__(self):
		return str(self.stack)
	def __unicode__(self):
		return unicode(self.stack)
