# coding: utf-8
from bottle import (Bottle, abort, redirect)
from urlparse import (parse_qs)
from util import (session)

app = Bottle()
ROOT_URL = '/fb'

@app.get('/<suburl:path>')
@app.get('/<suburl:path>/')
def get_fb_url(suburl):
    s = session()
    access_token = s.get('access_token', None)
    graph_url = 'https://graph.facebook.com'
    if access_token:
        url = ''.join((graph_url, suburl, '?access_token=', access_token))
        resp = requests.get(url)
        if resp.status_code == 200:
            data = parse_qs(resp.content)
            return data
        else:
            return {'error': resp.content, 'status_code' : resp.status_code}
    else:
        abort(400, {'error': 'Not authenticated.'})

