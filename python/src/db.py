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

class DBConn(object):
    def __init__(self, host, port, user, pwd):
        self._conn = None
        self.host = host
        self.port = int(port)
        self.user = user
        self.pwd = pwd
        self.authenticate()
    
    def authenticate(self):
        self._conn = Connection(self.host, self.port)
        self._db = self._conn['admin']
        if not self._db.authenticate(self.user, self.pwd):
            raise Exception("Unable to authenticate")
        return self
    
    def db(self, db_name):
        self._db = self._conn[db_name]
        return self
    
    def collection(self, coll_name):
        self._coll = self._db[coll_name]
        return self

    def find(self, params={}, sort_params={}):
        if params:
            resp = self._coll.find(params)
        else:
            resp = self._coll.find()

        if sort_params:
            return resp.sort(sort_params)
        else:
            return resp

    def find_one(self, params={}):
        if params:
            return self._coll.find_one(params)
        else:
            return self._coll.find_one()

dbc = DBConn(**db_creds())
