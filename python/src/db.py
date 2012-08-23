# coding: utf-8
import json # for loading the env file
from pymongo import Connection # for accessing the database

def db_creds(env_path='/home/dotcloud/environment.json'):
    """ Get DB connection information. """
    creds, env = {}, {}
    
    try:
        with open(env_path, 'rb') as f:
            env = json.load(f)
    except IOError:
        pass
    
    if env.get('DOTCLOUD', False):
        creds['host'] = env['DOTCLOUD_DB_MONGODB_HOST']
        creds['port'] = env['DOTCLOUD_DB_MONGODB_PORT']
        creds['user'] = env['DOTCLOUD_DB_MONGODB_LOGIN']
        creds['pwd'] = env['DOTCLOUD_DB_MONGODB_PASSWORD']
    else:
        creds['host'] = 'localhost'
        creds['port'] = 27017
        creds['user'] = 'peterldowns'
        creds['pwd'] = 'localpass'
    
    creds['port'] = int(creds['port'])
    return creds

class DBC(object):
    def __init__(self, host, port, user=None, pwd=None):
        self._conn = None
        self._db = None
        self._coll = None

        self.host = str(host)
        self.port = int(port)
        self.user = str(user)
        self.pwd = str(pwd)
    
    def __repr__(self):
        if self._db:
            return repr(self._db)
        return '<DBC {}:{} (not connected)>'.format(self.host, self.port)

    def __str__(self):
        if self._db:
            return str(self._db)
        return '<DBC {}:{} (not connected)>'.format(self.host, self.port)

    def __unicode__(self):
        if self._db:
            return unicode(self._db)
        return u'<DBC {}:{} (not connected)>'.format(self.host, self.port)

    def __call__(self, *args):
        return self.db(*args)

    def use(self, *args):
        return self.db(*args)

    def db(self, db_name):
        if not self._conn:
            self._conn = Connection(self.host, self.port)
        self._db = self._conn[db_name]
        return self
    
    def auth(self, user=None, pwd=None):
        self.user = str(user) or self.user
        self.pwd = str(pwd) or self.pwd
        if not self._db:
            raise Exception("Unable to Authenticate: not connected to a database.")
        if not self._db.authenticate(self.user, self.pwd):
            raise Exception("Unable to Authenticate: invalid credentials.")
        return self
   
    def coll(self, *args):
        return self.collection(*args)

    def collection(self, c_name):
        if not self._db:
            raise Exception("Unable to use collection {}: not connected to a database.".format(repr(c_name)))
        self._coll = self._db[c_name]
        return self

    def __getattr__(self, key):
        try:
            return getattr(self._coll, key)
        except AttributeError:
            raise AttributeError('DB Connection has no attribute {}'.format(repr(key)))

dbc = DBC(**db_creds())
