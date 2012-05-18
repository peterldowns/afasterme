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

  this.errcb = function(error){
    console.log("UserDB CB Error:\n", error);
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
  this.users.findOne(query, function(error, result){
    if (error){
      this.errcb(error);
    }
    else {
      callback(result);
    }
  });
}

UserDB.prototype.insert = function(item, options, callback){
  this.users.insert(item, options, function(err, docs){
    if (error){
      this.errcb(error);
    }
    else if (callback){
      callback(docs);
    }
  });
}

UserDB.prototype.update = function(query, objNew, options, callback){
  this.users.update(query, objNew, options, function(err){
    if (callback) {
      callback(err);
    }
    else {
      this.errcb(err);
    }
  });
}

exports.UserDB = UserDB;
