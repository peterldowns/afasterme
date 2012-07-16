#!/usr/bin/env python
# encoding: utf-8

import re
import cgi
from copy import copy
from os.path import split

from loading import (Load, LoadFile, TemplateNotFound, get_path)
from context import Context

EOL_CHARS = ['\r', '\n']

def ParseMatch(template, match, state):
	info = match.groupdict()
	
	# Put special delimiter cases in terms of normal ones
	if info['change']:
		info.update(tag_type='=', tag_key=info['delims'])
	elif info['raw']:
		info.update(tag_type='&', tag_key=info['raw_key'])

	# Rename the important match variables for convenience
	tag_start = match.start()
	tag_end = match.end()
	tag_type = info['tag_type']
	tag_key = info['tag_key']
	lead_wsp = info['lead_wsp']
	end_wsp = info['end_wsp']

	begs_line = (tag_start == 0) or (template[tag_start-1] in EOL_CHARS)
	ends_line = (tag_end == len(template)) or (template[tag_end] in EOL_CHARS)
	interpolating = (tag_type in ['', '&'])
	standalone = (not interpolating) and begs_line and ends_line
	
	if end_wsp:
		tag_end -= len(end_wsp)
	if standalone:
		if tag_end < len(template) and template[tag_end] == '\r':
			tag_end += 1
		if tag_end < len(template) and template[tag_end] == '\n':
			tag_end += 1
	elif lead_wsp:
		tag_start += len(lead_wsp)
		lead_wsp = ''
	
	info.update(tag_start=tag_start, tag_end=tag_end, tag_type=tag_type, tag_key=tag_key,
			lead_wsp=lead_wsp, end_wsp=end_wsp, begs_line=begs_line, ends_line=ends_line,
			interpolating=interpolating, standalone=standalone)
	return info

def GetContextFromTagKey(name, state):
	new_contexts = 0
	name = name
	ctm = None
	while True:
		try:
			ctx_key, name = name.split('.', 1)
			ctm = state['context'].get(ctx_key, None)
		except ValueError:
			break
		if not ctm:
			break
		else:
			state['context'].stack.append(ctm)
			new_contexts += 1
	
	ctm = state['context'].get(name, None)
	return new_contexts, ctm

def FindEndOfSection(template, tag_key, state, index):
	state['section_stack'].append(tag_key)
	match = None
	matchinfo = None
	#search_index = 0
	search_index = index
	while state['section_stack']:
		match = state['tag_re'].search(template, search_index)
		if not match:
			raise Exception("Open section %s never closed!" % tag_key)
		matchinfo = ParseMatch(template, match, state)
		
		# If we find a new section tag, add it to the stack and keep going
		if matchinfo['tag_type'] in ('#', '^'):
			state['section_stack'].append(matchinfo['tag_key'])
		# If we find a closing tag for the current section, 'close' it by popping the stack
		elif matchinfo['tag_type'] == '/':
			if matchinfo['tag_key'] == state['section_stack'][-1]:
				state['section_stack'].pop()
			else:
				raise Exception('Unexpected section end: received %s, expected {{/%s}}' % (repr(match.group(0)), current_section_name))
		search_index = matchinfo['tag_end']
	return matchinfo

def Unicode(s, encoding='utf-8', err='strict'):
	""" Ensure that a given string is unicode. """
	if not isinstance(s, unicode):
		if not isinstance(s, basestring):
			return unicode(str(s), encoding, err)
		return unicode(s, encoding, err)
	return s

def HtmlEscape(s, encoding='utf-8', enc_error='strict'):
	""" Given an input, return an HTML-escaped version. """
	return cgi.escape(Unicode(s, encoding, enc_error), quote=True)

def CompileRegex(state):
	""" A helper function for compiling tag regex. """
	state['tag_re'] = re.compile(state['raw_tag_re'] % state['tags'], state['re_flags'])

def NewDefaultState():
	""" Create and return a sane default state/options dictionary. """
	def_st = {
		# Encoding options
		'encoding' : 'utf-8',
		'encoding_error' : 'xmlcharrefreplace',
		# Partial options
		'partial_dir' : 'static/templates',
		'extension' : 'html',
		# State
		'partials' : [{}],
		'section_stack' : [],
		'context' : Context(),
		'escape' : True,
		# Regex / Parsing
		'tags' : {
			'otag' : re.escape('{{'), # tag opening
			'ctag' : re.escape('}}'), # tag closing
			'types' : '|'.join(('#', '/', '^', '&', '!', '>')) # other tag modifiers
		},
		'raw_tag_re' : r"""
			(?P<lead_wsp>[\ \t]*) # leading whitespace
			%(otag)s \s*
			(?:
				(?P<change>=) \s* (?P<delims>.+?)   \s* = | 			# change delimiters OR 
				(?P<raw>{)    \s* (?P<raw_key>.+?) \s* } |				# raw format (no escaping) OR
				(?P<tag_type>[%(types)s]?)  \s* (?P<tag_key>[\s\S]+?)	# other tag types
			)
			\s* %(ctag)s (?P<end_wsp>[\ \t]*)""",
		're_flags' : re.MULTILINE|re.VERBOSE|re.DOTALL|re.UNICODE,
		'tag_re' : None,
	}
	CompileRegex(def_st)
	def_st['default_tags'] = copy(def_st['tags'])
	return def_st

def Render(template, context, partials={}, state=None):
	""" Renders a given mustache template, with sane defaults. """
	if not state:
		state = NewDefaultState()

	# Add context to the state dict
	if not isinstance(context, Context):
		context = Context(context) # boy, that was weird to type
	state['context'] = context
	
	# Add any partials to the state dict
	if partials:
		state['partials'].append(partials)
	
	# Render the template (as Unicode)
	return __render(Unicode(template), state)

def RenderFile(filename, context, partials={}, state=None):
	if not state:
		state = NewDefaultState()
	tpl = Load(filename, directory=state['partial_dir'], encoding=state['encoding'], errors=state['encoding_error'])
	return Render(tpl, context, partials, state)

def __render(template, state, index=0):
	# Find a Match
	match = state['tag_re'].search(template, index)
	if not match:
		#return template
		return template[index:]

	info = ParseMatch(template, match, state)
	_pre = template[index : info['tag_start']]
	_tag = template[info['tag_start'] : info['tag_end']]
	_continue = info['tag_end']

	# Handle Tag
	if info['tag_type'] == '!':
		# Comments are removed from output
		repl = ""
	# Delimiter change
	elif info['tag_type'] == '=':
		# Delimiters are changed; the tag is rendered as ""
		delimiters = re.split(r'\s*', info['tag_key'])
		state['tags']['otag'], state['tags']['ctag'] = map(re.escape, delimiters)
		CompileRegex(state)
		repl = ""
	# Plain tag
	elif info['tag_type'] == '':
		repl = __render_tag(info, state)
	# Raw tag (should not be escaped)
	elif info['tag_type'] == '&':
		# Save escape state and switch to unescape
		old_esc = state['escape'] 
		state['escape'] = False

		# Render the tag without escaping
		repl = __render_tag(info, state)

		# Restore initial escape state
		state['escape'] = old_esc
	# Partial
	elif info['tag_type'] == '>':
		partial_name = info['tag_key']
		repl = ''
		lead_wsp = re.compile(r'^(.)', re.M)
		try:
			# Grab the cached partial
			partial_template = state['partials'][-1][partial_name]
			
			# Preserve indentation
			if info['standalone']:
				partial_template = lead_wsp.sub(info['lead_wsp']+r'\1', partial_template)

			# Preserve tag regex
			_tag_state = copy(state['tags'])
			
			# Update partial state and tag regex
			state['partials'].append(state['partials'][-1])
			state['tags'] = copy(state['default_tags'])
			CompileRegex(state)
			
			# Render the partial
			repl = __render(partial_template, state)

			# Restore state
			state['partials'].pop()
			state['tags'] = _tag_state
			CompileRegex(state)
		except (KeyError, IndexError):
			# Load the partial from a file (if it exists)
			try:
				# Save partial directory state
				_partial_dir = copy(state['partial_dir'])
	
				# Load the new partial template
				partial_path = get_path(partial_name, state['partial_dir'], state['extension'])
				state['partial_dir'], filename = split(partial_path) # update partial dir path
				partial_template = LoadFile(partial_path, encoding=state['encoding'], errors=state['encoding_error'])
				
				# Preserve indentation
				if info['standalone']:
					partial_template = lead_wsp.sub(info['lead_wsp']+r'\1', partial_template)
			
				# Render the partial template
				old_tag_state = copy(state['tags'])
				state['tags'] = copy(state['default_tags'])
				__render(template=partial_template, state=state)
				state['tags'] = old_tag_state
				CompileRegex(state)
				# Restore directory state
				state['partial_dir'] = old_dir
			except (IOError, TemplateNotFound): pass
	elif info['tag_type'] in ('#', '^'):
		# Section
		otag_info = info
		ctag_info = FindEndOfSection(template, info['tag_key'], state, _continue)
		

		# Don't want to parse beyond the end of the inner section, but
		# must include information on prior contents so that whitespace
		# is preserved correclty and inner tags are not marked as standalone.
		inner_start = otag_info['tag_end']
		inner_end = ctag_info['tag_start']
		template_with_inner = template[:inner_end]

		_continue = ctag_info['tag_end']
		
		new_contexts, ctm = GetContextFromTagKey(otag_info['tag_key'], state)
		truthy = otag_info['tag_type'] == '#'
		
		tag_is_lambda = False
		#if ctm is not None:
		if ctm:
			# If there's a match and it's callable, feed it the inner template
			if callable(ctm):
				tag_is_lambda = True
				template_to_inner = template[:inner_start]
				inner = template[inner_start:inner_end]
				template_with_inner = template_to_inner + Unicode(ctm(inner))
				
			# Make the context list an iterable from the ctm
			if not hasattr(ctm, '__iter__') or isinstance(ctm, dict):
				ctx_list = [ctm]
			else:
				ctx_list = ctm
		# If there's no match, there are no new contexts
		else:
			ctx_list = [False]
		
		# If there are new contexts and the section is truthy, or if
		# there are no new contexts and the section is falsy, render
		# the contents
		repl_stack = []
		for ctx in ctx_list:
			if (truthy and ctx) or not truthy and not ctx:
				state['context'].push(ctx)
				
				#repl_stack.append(__render(repl, state))
				repl_stack.append(__render(template_with_inner, state, inner_start))

			else:
				break
		
		repl = ''.join(repl_stack)
		for i in xrange(new_contexts): state['context'].stack.pop()
	else:
		raise Exception("found unpaired end of section tag!")

	return _pre + Unicode(repl) + __render(template, state, _continue)

def __render_tag(info, state):
	""" Render an individual tag by making the appropriate replacement
		within the current context (if any). """
	new_contexts, ctm = GetContextFromTagKey(info['tag_key'], state)
	repl = ''

	if ctm or ctm is 0:
		repl = ctm
	elif Unicode(info['tag_key'], state['encoding']) == Unicode('.', state['encoding']):
		repl = state['context'].stack[-1]
	else:
		repl = ''
	
	# Call all callables / methods / lambdas / functions
	if repl and callable(repl):
		repl = Unicode(repl())
		
		old_tag_state = copy(state['tags'])
		state['tags'] = copy(state['default_tags'])
		CompileRegex(state)
		
		repl = __render(template=repl, state=state)

		state['tags'] = old_tag_state
		CompileRegex(state)

	# Deconstruct the new context layers
	for added_context in xrange(new_contexts):
		state['context'].stack.pop()
	
	if state['escape']:
		repl = HtmlEscape(repl)
	
	return repl
