var mongo = require('mongodb'),
    Db = mongo.Db,
    Connection = mongo.Connection,
    Server = mongo.Server,
    BSON = mongo.BSON,
    ObjectID = mongo.ObjectID;


var UserDB = function(host, port, user, pwd, func){
  _UserDB = this;
  console.log(user, pwd);
  this.host = host;
  this.port = port;
  this.user = user;
  this.pwd = pwd;

  this.errcb = function(err){
    console.log("UserDB CB err:\n", err);
  }

  // Auth code. TODO: make separate function; decouple this.
  this.db = new Db('Running', new Server(host, port, {auto_reconnect: true}));
  this.client = null;
  this.users = null;
  this.db.open(function(err, client){
    if (err) {
      _UserDB.errcb(err);
    }
    else {
      _UserDB.client = client;
      console.log(_UserDB.user, _UserDB.pwd);
      client.authenticate(_UserDB.user, _UserDB.pwd, function(err, data){
        if (data) {
          console.log("Opened and authenticated database Running");
          client.collection('users', function(err, collection){
            if (err) {
              console.log("Couldn't grab collection Users");
              _UserDB.errcb(err);
            }
            else {
              _UserDB.users = collection;
              func();
            }
          });
        }
        else {
          console.log("Unable to authenticate database Running");
          _UserDB.errcb(err);
        }
      });
    }
  });
}

UserDB.prototype.find = function(query, callback){
  _UserDB = this;
  this.users.find(function(err, cursor){
    if (err) {
      _UserDB.errcb(err);
    }
    else {
      cursor.toArray(function(err, items){
        if (err) {
          _UserDB.errcb(err);
        }
        else {
          callback(items);
        }
      });
    }
  });
}

UserDB.prototype.findOne = function(query, callback){
  _UserDB = this;
  this.users.findOne(query, function(err, result){
    if (err){
      UserDB.errcb(err);
    }
    else {
      callback(result);
    }
  });
}

UserDB.prototype.insert = function(item, options, callback){
  _UserDB = this;
  this.users.insert(item, options, function(err, docs){
    if (err){
      _UserDB.errcb(err);
    }
    else if (callback){
      callback(docs);
    }
  });
}

UserDB.prototype.update = function(query, objNew, options, err_callback){
  _UserDB = this;
  this.users.update(query, objNew, options, function(err){
    if (callback) {
      err_callback(err);
    }
    else {
      _UserDB.errcb(err);
    }
  });
}

exports.UserDB = UserDB;
