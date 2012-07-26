# coding: utf-8
import bottle
from uuid import (uuid4)

session = lambda: bottle.request.environ.get('beaker.session')

def gen_csrf_token():
    s = session()
    s.setdefault('_csrf', str(uuid4()))
    return s['_csrf']
