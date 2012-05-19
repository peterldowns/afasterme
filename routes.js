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

// GET the home page (login, sign up, about)
exports.GET_landing = function(req, res) {
  res.render('landing', {
    title: 'Welcome to Running',
    session: null
  });
};

// GET the sign up page
exports.GET_signup = function(req, res) {
  res.render('signup', {
    title: 'Running — Sign Up / Log In',
    session: null
  });
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
    session: null
  });
};

// GET the user's log view
exports.GET_log = function(req, res) {
  res.render('log', {
    title: 'Running — Log',
    session: null
  });
};

// GET the user's calendar view
exports.GET_calendar = function(req, res) {
  res.render('calendar', {
    title: 'Running — Calendar',
    session: null
  });
};

// GET the user's statistics view
exports.GET_statistics = function(req, res) {
  res.render('statistics', {
    title: 'Running — Statistics',
    session: null
  });
};

// GET the user's preferences
exports.GET_preferences = function(req, res) {
  res.render('preferences', {
    title: 'Running — Preferences',
    session: null
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
  console.log("Body:\n", req.body);
  var email = req.param('email', null);
  var pwd = req.param('password', null);
  console.log(email, pwd);
  if (email && pwd) {
    DBC.db('Running', function(DBC){
      DBC.collection('users', function(DBC){
        DBC.findOne({email: email, password: pwd}, function(result){
          if(result){
            res.json(result, 200);
            console.log("Logged in %s", result.email);
          }
          else{
            res.json('User not found', 401);
            console.log("No user with email %s and password %s", email, pwd);
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
api.POST_logout = function(req, res) {
  res.json('"Logout" not yet implemented', 501);
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
