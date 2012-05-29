/*
 * Module Dependencies
 */

// Initialize MongoDB Connection
var db_wrapper = require('./db_wrapper'),
    DBConn = db_wrapper.DBConn,
    DB_DATA = db_wrapper.GetDBData(),
    DBC = new DBConn(DB_DATA.host, DB_DATA.port, DB_DATA.user, DB_DATA.password);

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

// Create a user
// TODO: document
//

var makeKey = function(date){
  return date.getFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDay();
}

var makeDateRange = function(startDate, numDays){
  // Include today as an off day
  var daterange = [startDate];
  for(i=0;daterange.length < numDays;i++){
    var d = new Date();
    d.setDate(d.getDate()+i);
    daterange.push(d);
  }
  return daterange;
}

// Based on Tom Fangrow's VDOT calculator
// (http://www.tomfangrow.com/jsvdot.html)
var calculateVDOT = function(miles, minutes, seconds){
  var d = (miles*1.609344)*1000, // Distance (meters)
      t = minutes + seconds/60, // Time (minutes)
      c = -4.6 + .182258*(d/t) + .000104*(d*d)/(t*t), // Oxygen cost c(t)
      i = .8 + .1894393*Math.exp(-.012778*t) +
          .2989558*Math.exp(-.1932605*t), // V02 Max i(t)
      vdot = Math.round(1000*(c/i))/1000;
  return vdot;
}

var guessVDOT = function(day, miles, minutes, seconds){
  return calculateVDOT(miles, minutes, seconds);
}

calculatePace = function(vdot, miles){
  // Not done yet.
  return 7.5;
}
var guessPace = function(vdot, distance_val, distance_unit){
  return calculatePace(vdot, distance_val); // distance_unit is always miles
}

var newCalendar = function(ud){
  console.log("Making new calendar for %s", ud.email);
  var weeks = ud.scheduleType;
  var exp = ud.priorExperience;
  
  // Create the date range
  var startDate = new Date();
  var daterange = makeDateRange(startDate, weeks*7);

  // Make the calendar
  var cal = {};
  for (i in daterange) {
    var date = daterange[i];
    var key = makeKey(date);
    var VDOT = guessVDOT(i, 1, ud.mileMinutes, ud.mileSeconds);
    var distance = {
      value: 5.0,
      unit: 'miles'
    };
    var pace = guessPace(VDOT, distance.value, distance.unit); // {value, units}
    var time = pace * distance.value; // all times internally will be float minutes
    cal[key] = {
      date: date,
      vdot: VDOT,
      phase: 0,
      week: Math.floor(i/7)+1,
      plan: {
        distance: {
          value: 5.0,
          unit: 'miles'
        },
        pace : pace,
        time : {
          minutes: Math.floor(time),
          seconds: Math.round((time-Math.floor(time))*60)
        },
        type: "easy",
        info: "<p> You should never be running so easily that you can look around and enjoy nature, but you shouldn't be tired and your heart should never beat too fast.</p><p>Don't kill yourself — take it *easy*, and relax.</p><p>If you're running with a partner, you should be able to easily carry a conversation.</p><p> This is the most enjoyable run you'll do, so ENJOY IT.</p>"
      },
      log : {
        // Show to everyone
        distance: {
          value: null,
          unit: 'miles'
        },
        time: {
          minutes: null,
          seconds: null
        },
        pace : null,
        comments: null,
        intensity: null,
        feeling: null,
        
        // Optional
        heartrate: {
          upper: null,
          lower: null,
        },
        temperature: null,
        wind: null,
        hydration: null,
        sleep: null
      }
    };
  }
  return cal;
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
  ud.calendar = ud.calendar ? ud.calendar : newCalendar(ud);
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
  userData.calendar = userData.calendar ? userData.calendar : newCalendar(ud);

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

// Get user feedback / response for a day (if it exists)
api.GET_feedback = function(req, res) {
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

// Update/Create user feedback for a day
api.PUT_feedback = function(req, res) {
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