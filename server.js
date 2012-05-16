
/**
 * Module dependencies.
 */


try {
  var fs = require('fs'),
      env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
  console.log('ENV:', env);
}
catch(e) {
  console.log('ENV ERROR:', e);
}

var uuid = require('node-uuid'),
    _test_id = uuid.v4();
console.log('New UUID (v4):', _test_id);

var mongo = require('mongodb');
    Server = mongo.Server,
    Db = mongo.Db;


var express = require('express'),
    routes = require('./routes'),
    app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.GET_index);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
