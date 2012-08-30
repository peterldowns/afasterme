module.exports = function(app, express){
  var db_data = require('./db').GetDBData(),
      MongoStore = require('connect-mongo')(express),
      approot = __dirname + '/';

  app.configure(function(){
    app.set('views', approot + '../views');
    app.set('view engine', 'jade');
    app.use(express.logger({format: ':method :url'}));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static(approot + '../public'));
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
};
