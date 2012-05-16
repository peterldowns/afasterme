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
  res.render('statistics', {
  });
};

/*
 * API endpoints — these are different routes that don't render any HTML,
 * but will be interacted with via REST requests.
 */

// Create a user
// TODO: document
exports.POST_user = function(req, res){
  res.json('Not yet implemented', 501);
};

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
exports.GET_login = function(req, res){
  res.json('Not yet implemented', 501);
};










