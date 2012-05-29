// Dependencies
var express = require('express'),
    routes = require('./routes'),
    MongoStore = require('connect-mongo')(express),
    db_data = require('./db_wrapper').GetDBData(),
    app = module.exports = express.createServer();

var db_conf = {
  db: 'Running',
  host: db_data.host,
  port: db_data.port,
  username: db_data.user,
  password: db_data.password,
  collection: 'sessions'
}
console.log(db_conf);


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger({format: ':method :url'}));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.methodOverride());
  app.use(express.session({
    secret: 'super_secret, right?',
    maxAge: new Date(Date.now()+3600000),
    store: new MongoStore(db_conf)
  }));
  app.use(express.csrf());
  app.use(app.router);

  app.debug = true;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Public Routes
app.get('/', routes.GET_landing);
app.get('/signup', routes.GET_signup);
app.get('/login', routes.GET_login);

// User Routes
app.get('/dashboard', routes.GET_dashboard);
app.get('/log', routes.GET_log);
app.get('/calendar', routes.GET_calendar);
app.get('/statistics', routes.GET_statistics);
app.get('/preferences', routes.GET_preferences);
app.get('/logout', routes.GET_logout); // logout (redirects to '/')

// API Routes

app.post('/login', routes.api.POST_login); // login

app.post('/user', routes.api.POST_user); // create a new user
app.get('/user', routes.api.GET_user); // get user information
app.put('/user', routes.api.PUT_user); // update user information

app.get('/user/calendar', routes.api.GET_calendar); // get calendar information
app.get('/user/calendar/day', routes.api.GET_day); // get calendar information for a specific day
app.get('/user/calendar/day/plan', routes.api.GET_plan); // get a day's training plan
app.get('/user/calendar/day/feedback', routes.api.GET_feedback); // get user feedback for a day, if given
app.put('/user/calendar/day/feedback', routes.api.PUT_feedback); // update/create user feedback for a day

// Start the server
app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
