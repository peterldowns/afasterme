/*
 * Module Dependencies
 */

// Initialize MongoDB Connection
var db_wrapper = require('./db_wrapper'),
    DBConn = db_wrapper.DBConn,
    DB_DATA = db_wrapper.GetDBData(),
    DBC = new DBConn(DB_DATA.host, DB_DATA.port, DB_DATA.user, DB_DATA.pwd);

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
      title: 'Welcome to Running',
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
      title: 'Running — Sign Up',
      session: req.session
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
      title: 'Running — Log In',
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
  res.render('dashboard', {
    title: 'Running — Dashboard',
    session: req.session
  });
};

// GET the user's log view
exports.GET_log = function(req, res) {
  res.render('log', {
    title: 'Running — Log',
    session: req.session
  });
};

// GET the user's calendar view
exports.GET_calendar = function(req, res) {
  res.render('calendar', {
    title: 'Running — Calendar',
    session: req.session
  });
};

// GET the user's statistics view
exports.GET_statistics = function(req, res) {
  res.render('statistics', {
    title: 'Running — Statistics',
    session: req.session
  });
};

// GET the user's preferences
exports.GET_preferences = function(req, res) {
  res.render('preferences', {
    title: 'Running — Preferences',
    session: req.session
  });
};

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
  var pwd = req.param('password', null);
  console.log("POST /login:\n\temail: %s\n\tpwd: %s", email, pwd);
  if (email && pwd) {
    DBC.db('Running', function(DBC){
      DBC.collection('users', function(DBC){
        DBC.findOne({email: email, password: pwd}, function(result){
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

// Log a user out
// TODO: make this work with POST for better REST compliance
api.GET_logout = function(req, res) {
  if (req.session.loggedIn){
    delete req.session.loggedIn;
    delete req.session.user;
  }
  res.json("User has been logged out.", 202);
}

// Create a user
// TODO: document
api.POST_user = function(req, res) {
  res.json('"User" not yet implemented', 501);
};

// Get user information
api.GET_user = function(req, res) {
  res.json('"User" not yet implemented', 501);
};

// Update user information
api.PUT_user = function(req, res) {
  res.json('"User" not yet implemented', 501);
};

// Get calendar information
api.GET_calendar = function(req, res) {
  res.json('"Calendar" not yet implemented', 501);
};

// Get calendar information for a specific day
api.GET_day = function(req, res) {
  res.json('"Day" not yet implemented', 501);
};

// Get a day's training plan
api.GET_plan = function(req, res) {
  res.json('"Plans" not yet implemented', 501);
};

// Get user feedback / response for a day (if it exists)
api.GET_feedback = function(req, res) {
  res.json('"Feedback" not yet implemented', 501);
};

// Update/Create user feedback for a day
api.PUT_feedback = function(req, res) {
  res.json('"Feedback" not yet implemented', 501);
};

exports.api = api;
