# coding: utf-8
import json
from uuid import (uuid4)
from flask import (make_response)

def gen_csrf_token(session):
    if '_csrf' not in session:
        session['_csrf'] = str(uuid4())
    return session['_csrf']

def json_response(data, http_code=200):
    def data_handler(obj):
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
    jdata = json.dumps(data, default=data_handler)
    print jdata
    return make_response(jdata, http_code)

