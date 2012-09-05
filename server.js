// Dependencies
var express = require('express'),
    app = module.exports = express.createServer(),
    db_data = require('./util/db').GetDBData(),
    MongoStore = require('connect-mongo')(express),
    approot = __dirname + '/';

// Configuration
app.configure(function(){
  app.set('views', approot + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger({format: ':method :url'}));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.static(approot + '/static'));
  app.use(express.methodOverride());
  app.use(express.session({
    secret: 'super_secret, right?',
    maxAge: new Date(Date.now()+3600000),
    store: new MongoStore({
      db: 'Running',
      collection: 'sessions',
      host: db_data.host,
      port: db_data.port,
      username: db_data.user,
      password: db_data.password,
    }),
  }));
  app.use(express.csrf());
  app.use(app.router);

  app.debug = true;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

require('./routes/api')(app);
require('./routes/public')(app);
require('./routes/user')(app);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",
              app.address().port, app.settings.env);
});
