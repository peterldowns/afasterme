var mongo = require('mongodb'),
    Db = mongo.Db,
    Connection = mongo.Connection,
    Server = mongo.Server,
    BSON = mongo.BSON,
    ObjectID = mongo.ObjectID;

exports.GetDBData = function() {
  var DB_USER,
      DB_PWD,
      DB_HOST,
      DB_PORT;
  if (process.env.NODE_ENV === 'dev') {
    DB_USER = 'peterldowns';
    DB_PWD = 'localpass';
    DB_HOST = 'localhost';
    DB_PORT = 27017;
  }
  else {
    try {
      var fs = require('fs'),
          env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
      console.log('Fetched ENV successfully');
      DB_USER = env.DOTCLOUD_DATA_MONGODB_LOGIN;
      DB_PWD = env.DOTCLOUD_DATA_MONGODB_PASSWORD;
      DB_HOST = env.DOTCLOUD_DATA_MONGODB_HOST;
      DB_PORT = parseInt(env.DOTCLOUD_DATA_MONGODB_PORT);
    }
    catch (e) {
      console.log('Error reading ENV');
    }
  }
  console.log("DB_USER =", DB_USER);
  console.log("DB_PWD =", DB_PWD);
  console.log("DB_HOST =", DB_HOST);
  console.log("DB_PORT =", DB_PORT);
  return {
    user: DB_USER,
    password: DB_PWD,
    host: DB_HOST,
    port: DB_PORT
  };
}

var DBConn = function(host, port, user, pwd, func) {
  this.host = host;
  this.port = port;
  this.user = user;
  this.pwd = pwd;
  //this.Db = new Db('Running', new Server(host, port, {auto_reconnect: true}));
  this.errcb = function(err) {
    //console.log("DBConn CB err:\n", err);
    return this;
  }
}

DBConn.prototype.db = function(db_name, callback){
  // Connect to a specific DB
  this.close();
  this.Db = new Db(db_name, new Server(this.host, this.port, {auto_reconnect: true}));
  if (callback) {
    callback(this);
  }
}

DBConn.prototype.collection = function(col_name, callback){
  var conn = this;
  this.close();
  this.Db.open(function(err, client){
    if(!err){
      //console.log("Authenticating with %s : %s", conn.user, conn.pwd);
      client.authenticate(conn.user, conn.pwd, function(err, data){
        if(data){
          client.collection(col_name, function(err, collection){
            if(!err){
              //console.log("Connected to %s", col_name);
              conn.coll = collection;
              if (callback) {
                //console.log("calling callback");
                callback(conn);
              }
            }
            else {
              //console.log("Failed to connect to %s", col_name);
            }
          });
        }
        else {
          //console.log("Connection to %s failed (could not authenticate)", col_name);
        }
      });
    }
    else {
      //console.log("Connection to %s failed (could not open database)", col_name);
    }
  });
};

DBConn.prototype.close = function(){
  if (this.Db) {
    if (this.Db.openCalled){
      this.Db.close();
      delete this.coll;
    }
  }
}


DBConn.prototype.find = function(query, callback) {
  var conn = this;
  this.coll.find(function(err, cursor) {
    if (err) {
      conn.errcb(err);
    }
    else {
      cursor.toArray(function(err, items) {
        if (err) {
          conn.errcb(err);
        }
        else {
          callback(items);
        }
      });
    }
  });
}

DBConn.prototype.findOne = function(query, callback) {
  conn = this;
  this.coll.findOne(query, function(err, result) {
    if (err) {
      DBConn.errcb(err);
    }
    else {
      callback(result);
    }
  });
}

DBConn.prototype.insert = function(items, options, callback) {
  conn = this;
  this.coll.insert(items, options, function(err, docs) {
    if (err) {
      conn.errcb(err);
    }
    else if (callback) {
      callback(docs);
    }
  });
}

DBConn.prototype.update = function(query, objNew, options, err_callback) {
  conn = this;
  this.coll.update(query, objNew, options, function(err) {
    if (callback) {
      err_callback(err);
    }
    else {
      conn.errcb(err);
    }
  });
}

exports.DBConn = DBConn;

exports.getUser = function(DBC, email, password) {
  if (email && password) {
    DBC.db('Running', function(DBC) {
      DBC.collection('users', function(DBC) {
        DBC.findOne({
          email: email,
          password: password
        }, function(result) {
          console.log(result);
          return result;
        });
      });
    });
  }
  else {
    return false;
  }
}
