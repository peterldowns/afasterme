/*
 * Module Dependencies
 */

var uuid = require('node-uuid'),
    _test_id = uuid.v4();
console.log('New UUID (v4):', _test_id);

var mongo = require('mongodb');
    Server = mongo.Server,
    Db = mongo.Db;

/*
 * Public Views — things that non-logged in users can see.
 */

// GET the home page (login, sign up, about)
exports.GET_index = function(req, res){
  res.render('index', {
    title: 'Express'
  });
};

/*
 * User Views — different pages that a logged-in user can access
 * and interact with. This is the heart of the application. All
 * of these different pages should be linked to in the siebar.
 */

// GET the user's main dashboard
exports.GET_dashboard = function(req, res){
  res.render('dashboard', {
  });
};

// GET the user's log view
exports.GET_log = function(req, res){
  res.render('log', {
  });
};

// GET the user's calendar view
exports.GET_calendar = function(req, res){
  res.render('calendar', {
  });
};

// GET the user's statistics view
exports.GET_statistics = function(req, res){
  res.render('statistics', {
  });
};

// GET the user's preferences
exports.GET_preferences = function(req, res){
  res.render('preferences', {
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
api.GET_login = function(req, res){
  res.json('"Login" not yet implemented', 501);
}

// Create a user
// TODO: document
api.POST_user = function(req, res){
  res.json('"User" not yet implemented', 501);
};

// Get user information
api.GET_user = function(req, res){
  res.json('"User" not yet implemented', 501);
};

// Update user information
api.PUT_user = function(req, res){
  res.json('"User" not yet implemented', 501);
};

// Get calendar information
api.GET_calendar = function(req, res){
  res.json('"Calendar" not yet implemented', 501);
};

// Get calendar information for a specific day
api.GET_day = function(req, res){
  res.json('"Day" not yet implemented', 501);
};

// Get a day's training plan
api.GET_plan = function(req, res){
  res.json('"Plans" not yet implemented', 501);
};

// Get user feedback / response for a day (if it exists)
api.GET_feedback = function(req, res){
  res.json('"Feedback" not yet implemented', 501);
};

// Update/Create user feedback for a day
api.PUT_feedback = function(req, res){
  res.json('"Feedback" not yet implemented', 501);
};






exports.api = api;
