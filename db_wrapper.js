try {
  var fs = require('fs'),
      env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
  console.log('ENV:', env);
}
catch (e) {
  console.log('Error reading ENV');
}

var mongo = require('mongodb'),
    Db = mongo.Db,
    Connection = mongo.Connection,
    Server = mongo.Server,
    BSON = mongo.BSON,
    ObjectID = mongo.ObjectID;


var UserDB = function(host, port, err_callback){
  this.db = new Db('UserDB', new Server(host, port, {
    auto_reconnect: true}, {}));
  this.db.open(function(){});
  this.errcb = typeof err_callback !== 'undefined' ? err_callback : function(error){
    console.log("UserDB CB Error:\n", error);
  };
};

UserDB.prototype.getCollection = function(){
  this.db.collection('users', function(error, collection){
    if (error){
      this.errcb(error);
    }
    else {
      callback(null, collection);
    }
  });
}

UserDB.prototype.find = function(query, callback){
  this.getCollection(function(error, collection){
    if (error){
      this.errcb(error);
    }
    else {
      collection.find(query).toArray(function(error, results){
        if (error){
          this.errcb(error);
        }
        else {
          callback(null, results);
        }
      });
    }
  });
}

UserDB.prototype.findOne = function(query, callback){
  this.getCollection(function(error, collection){
    if (error){
      this.errcb(error);
    }
    else {
      collection.findOne(query, function(error, result){
        if (error){
          this.errcb(error);
        }
        else {
          callback(result);
        }
      });
    }
  });
}

UserDB.prototype.insert = function(item, options, callback){
  this.getCollection(function(error, collection){
    if (error){
      this.errcb(error);
    }
    else {
      collection.insert(item, options, function(err, docs){
        if (error){
          this.errcb(error);
        }
        else if (docs_cb){
          docs_cb(docs);
        }
      });
    }
  });
}

UserDB.prototype.update = function(query, objNew, options, callback){
  this.getCollection(function(error, collection){
    if(error){
      this.errcb(error);
    }
    else {
      collection.update(query, objNew, options, function(err){
        if (callback) {
          callback(err);
        }
        else {
          this.errcb(err);
        }
      });
    }
  });
}

exports.UserDB = UserDB;
