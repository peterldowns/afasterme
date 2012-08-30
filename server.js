// Dependencies
var express = require('express'),
    routes = require('./routes'),
    app = module.exports = express.createServer();

require('./init')(app, express);
require('./routes/api')(app);
require('./routes/public')(app);
require('./routes/user')(app);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",
              app.address().port, app.settings.env);
});
/*
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
app.get('/user/calendar/day/log', routes.api.GET_log); // get user log for a day, if given
app.put('/user/calendar/day/log', routes.api.PUT_log); // update/create user log for a day

// Start the server
app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
*/

