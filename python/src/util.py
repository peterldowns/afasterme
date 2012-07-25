# coding: utf-8
from uuid import (uuid4)

def gen_csrf_token(session):
    if '_csrf' not in session:
        session['_csrf'] = str(uuid4())
    return session['_csrf']
