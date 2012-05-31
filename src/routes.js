/*
 * Module Dependencies
 */

// Initialize MongoDB Connection
var db_wrapper = require('./db_wrapper'),
    DBConn = db_wrapper.DBConn,
    DB_DATA = db_wrapper.GetDBData(),
    DBC = new DBConn(DB_DATA.host, DB_DATA.port, DB_DATA.user, DB_DATA.password);

// Running tools
var running = require('./running.js'),
    m = running.m,
    mtm = running.mtm,
    makeSchedule = running.makeSchedule;

/*
 * Public Views — things that non-logged in users can see.
 */

// GET the landing page
exports.GET_landing = function(req, res) {
  if (req.session.loggedIn){
    res.redirect('/dashboard');
  }
  else {
    res.render('landing', {
      title: 'Welcome to AFaster.Me',
      session: req.session
    });
  }
};

// GET the sign up page
exports.GET_signup = function(req, res) {
  if (req.session.loggedIn){
    res.redirect('/dashboard');
  }
  else {
    res.render('signup', {
      title: 'AFaster.Me — Sign Up',
      session: req.session,
      email: req.query.email ? req.query.email : null,
      error: req.query.error ? req.query.error : false
    });
  }
};

// GET the login page
exports.GET_login = function(req, res) {
  if (req.session.loggedIn){
    res.redirect('/dashboard');
  }
  else{
    res.render('login', {
      title: 'AFaster.Me — Log In',
      email: req.query.email ? req.query.email : null,
      newuser: req.query.newuser ? true : false,
      error: req.query.error ? true : false,
      session: req.session
    });
  }
};

/*
 * User Views — different pages that a logged-in user can access
 * and interact with. This is the heart of the application. All
 * of these different pages should be linked to in the siebar.
 */

// GET the user's main dashboard
exports.GET_dashboard = function(req, res) {
  if (req.session.loggedIn){
    console.log('rendering dashboard');
    res.render('dashboard', {
      title: 'AFaster.Me — Dashboard',
      session: req.session,
      today: req.session.user.calendar[running.makeKey(new Date())],
      dayKey: running.makeKey(new Date()),
      email : req.query.email ? req.query.email : null
    });
  }
  else {
    res.redirect('/');
  }
};

// GET the user's log view
exports.GET_log = function(req, res) {
  if (!req.session.loggedIn){
    res.redirect('/dashboard');
  }
  res.render('log', {
    title: 'AFaster.Me — Log',
    session: req.session
  });
};

// GET the user's calendar view
exports.GET_calendar = function(req, res) {
  if (!req.session.loggedIn){
    res.redirect('/dashboard');
  }
  res.render('calendar', {
    title: 'AFaster.Me — Calendar',
    session: req.session
  });
};

// GET the user's statistics view
exports.GET_statistics = function(req, res) {
  if (!req.session.loggedIn){
    res.redirect('/dashboard');
  }
  res.render('statistics', {
    title: 'AFaster.Me — Statistics',
    session: req.session
  });
};

// GET the user's preferences
exports.GET_preferences = function(req, res) {
  if (!req.session.loggedIn){
    res.redirect('/dashboard');
  }
  res.render('preferences', {
    title: 'AFaster.Me — Preferences',
    session: req.session
  });
};

// Log a user out
exports.GET_logout = function(req, res) {
  if (req.session.loggedIn){
    delete req.session.loggedIn;
    delete req.session.user;
  }
  console.log("User has been logged out.");
  res.redirect('/');
}


/*
 * API endpoints — these are different routes that don't render any HTML,
 * but will be interacted with via REST requests.
 */

var api = {};

// Log a user in
// input:
//    `username` = username as a string
//    `password` = password as a string
// response (JSON dict):
//    `username` = username as a string
//    ( all other user information )
//    `createdAt` : timezone stamp TODO: format?
//    `updatedAt` : timezome stamp ^
//    `_id` : user id (integer?)
//    `sessionToken` : string
api.POST_login = function(req, res) {
  var email = req.param('email', null);
  var password = req.param('password', null);
  console.log("POST /login:\n\temail: %s\n\tpassword: %s", email, password);
  if (email && password) {
    DBC.db('Running', function(DBC){
      console.log("Into Running");
      DBC.collection('users', function(DBC){
        console.log("... into users");
        DBC.findOne({email: email, password: password}, function(result){
          if(result){
            req.session.loggedIn = true;
            req.session.user = result;
            res.json(result, 200);
            console.log("\t... Logged in");
          }
          else{
            res.json('User not found', 401);
            console.log("\t... No such user");
          }
        });
      });
    });
  }
  else {
    res.json('Must supply username and password', 400);
  }
}


var makeCalendar = function(ud) {
  var miletime = m(ud.mileMinutes, ud.mileSeconds),
      experience = ud.priorExperience,
      type = ud.scheduleType;
  return makeSchedule(type, miletime, experience);
}

var parseUD = function(ud){
  delete ud._csrf;
  // things that should be numbers
  ud.scheduleType = Number(ud.scheduleType);
  ud.age = Number(ud.age);
  ud.priorExperience = Number(ud.priorExperience);
  ud.weight = Number(ud.weight);
  ud.mileMinutes = Number(ud.mileMinutes);
  ud.mileSeconds = Number(ud.mileSeconds);
  // make sure we have a dateCreated
  ud.dateCreated = ud.dateCreated ? ud.dateCreated : new Date;
  ud.calendar = ud.calendar ? ud.calendar : makeCalendar(ud);
  return ud;
}

var validateUD = function(ud){
  var necessary = [
    "name",
    "username",
    "email",
    "password",
    "age",
    "priorExperience",
    "weight",
    "dateCreated",
    "scheduleType",
    "mileMinutes",
    "mileSeconds",
  ];
  console.log("Testing new user data:");
  console.log(ud);
  return necessary.every(function(key){
    console.log("\t%s : %s", key, !(!ud[key]));
    return !(!ud[key]) || (typeof ud[key] === 'number');
  });
}

api.POST_user = function(req, res) {
  console.log("Route params:\n", req.params);
  console.log("Query params:\n", req.query);
  console.log("URL params: \n", req.body);

  var userData = req.body;
  userData = parseUD(userData);
  userData.calendar = userData.calendar ? userData.calendar : makeCalendar(ud);

  if (validateUD(userData)){
    DBC.db('Running', function(DBC){
      DBC.collection('users', function(DBC){
        DBC.findOne({username: userData.username}, function(result){
          if (result){
            res.json('username already exists', 403);
          }
          else {
            DBC.findOne({email: userData.email}, function(result_){
              if(result_){
                res.json('email already exists', 403);
              }
              else {
                DBC.insert(userData);
                res.json('success', 200);
              }
            });
          }
        });
      });
    });
  }
  else {
    res.json('incorrect form values', 401);
  }
};

// Get user information
api.GET_user = function(req, res) {
  if (req.session.loggedIn){
    res.json(req.session.user, 200);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
}

// Update user information
api.PUT_user = function(req, res) {
  if (req.session.loggedIn){
    res.json({
      status: 'Not yet implemented',
      redirect: '/'
    }, 501);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
};

// Get calendar information
api.GET_calendar = function(req, res) {
  if (req.session.loggedIn){
    res.json(req.session.user.calendar, 200);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
};

// Get calendar information for a specific day
api.GET_day = function(req, res) {
  if (req.session.loggedIn){
    res.json({
      status: 'Not yet implemented',
      redirect: '/'
    }, 501);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
};

// Get a day's training plan
api.GET_plan = function(req, res) {
  if (req.session.loggedIn){
    res.json({
      status: 'Not yet implemented',
      redirect: '/'
    }, 501);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
};

// Get user log / response for a day (if it exists)
api.GET_log = function(req, res) {
  if (req.session.loggedIn){
    res.json({
      status: 'Not yet implemented',
      redirect: '/'
    }, 501);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
};

// Update/Create user log for a day
api.PUT_log = function(req, res) {
  if (req.session.loggedIn){
    res.json({
      status: 'Not yet implemented',
      redirect: '/'
    }, 501);
  }
  else {
    res.json({
      status: "Not logged in.",
      redirect: "/login",
    }, 401);
  }
};

exports.api = api;
