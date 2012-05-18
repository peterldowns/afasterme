// Dependencies
var express = require('express'),
    routes = require('./routes'),
    app = module.exports = express.createServer();

var UserDB = require('./UserDB.js');

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

// Public Routes
app.get('/', routes.GET_landing);
app.get('/signup', routes.GET_signup);

// User Routes
app.get('/dashboard', routes.GET_dashboard);
app.get('/log', routes.GET_log);
app.get('/calendar', routes.GET_calendar);
app.get('/statistics', routes.GET_statistics);
app.get('/preferences', routes.GET_preferences);

// API Routes
app.post('/login', routes.api.GET_login); // login

app.post('/user', routes.api.POST_user); // create a new user
app.get('/user', routes.api.GET_user); // get user information
app.put('/user', routes.api.PUT_user); // update user information

app.get('/user/calendar', routes.api.GET_calendar); // get calendar information
app.get('/user/calendar/day', routes.api.GET_day); // get calendar information for a specific day
app.get('/user/calendar/day/plan', routes.api.GET_plan); // get a day's training plan
app.get('/user/calendar/day/feedback', routes.api.GET_feedback); // get user feedback for a day, if given
app.put('/user/calendar/day/feedback', routes.api.PUT_feedback); // update/create user feedback for a day

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
