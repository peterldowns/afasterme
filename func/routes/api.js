var db = require('../db'),
    DBConn = db.DBConn,
    DB_DATA = db.GetDBData(),
    DBC = new DBConn(DB_DATA.host, DB_DATA.port, DB_DATA.user, DB_DATA.password),
   
    running = require('../running'),
    m = running.m,
    mtm = running.mtm,
    makeSchedule = running.makeSchedule;

module.exports = function(app){
  app.post('/login', function(req, res) {
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
  });


  var makeCalendar = function(ud) {
    var miletime = m(ud.mileMinutes, ud.mileSeconds),
        experience = ud.priorExperience,
        type = ud.scheduleType;
    console.log("makeCalendar type:", type, typeof type);
    console.log("makeCalendar miletime:", miletime, typeof miletime);
    console.log("makeCalendar experience:", experience, typeof experience);
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

  app.post('/user', function(req, res) {
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
  });

  // Get user information
  app.get('/user', function(req, res) {
    if (req.session.loggedIn){
      res.json(req.session.user, 200);
    }
    else {
      res.json({
        status: "Not logged in.",
        redirect: "/login",
      }, 401);
    }
  });

  // Update user information
  app.put('/user', function(req, res) {
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
  });

  // Get calendar information
  app.get('/calendar', function(req, res) {
    if (req.session.loggedIn){
      res.json(req.session.user.calendar, 200);
    }
    else {
      res.json({
        status: "Not logged in.",
        redirect: "/login",
      }, 401);
    }
  });

  // Get calendar information for a specific day
  app.get('/user/calendar/day', function(req, res) {
    var key = req.query.logDayKey;
    if (req.session.loggedIn){
      res.json(req.session.user.calendar[key], 200);
    }
    else {
      res.json({
        status: "Not logged in.",
        redirect: "/login",
      }, 401);
    }
  });

  // Get a day's training plan
  app.get('/user/calendar/day/plan', function(req, res) {
    var key = req.query.logDayKey;
    if (req.session.loggedIn){
      res.json(req.session.user.calendar[key].plan, 200);
    }
    else {
      res.json({
        status: "Not logged in.",
        redirect: "/login",
      }, 401);
    }
  });

  // Get user log / response for a day (if it exists)
   app.get('/user/calendar/day/log', function(req, res) {
    var key = req.query.logDayKey;
    if (req.session.loggedIn){
      console.log(req.session.user);
      res.json(req.session.user.calendar[key].log, 200);
    }
    else {
      res.json({
        status: "Not logged in.",
        redirect: "/login",
      }, 401);
    }
  });

  // Update/Create user log for a day
  app.put('/user/calendar/day/log', function(req, res) {
    console.log(req.body);
    if (req.session.loggedIn){
      var time_regex = new RegExp('^\\d+:\\d{2}$'),
          time,

          daykey = String(req.body.logDayKey),
          distance = {
            value: Number(req.body.logDistanceVal),
            unit: String(req.body.logDistanceUnit),
          },
          intensity = Number(req.body.logIntensity),
          feeling = Number(req.body.logFeeling),
          comments = String(req.body.logComments),
          pace;
      
      if (time_regex.test(req.body.logTime)){
        console.log("valid time.");
        var time_array = req.body.logTime.split(':'),
            mins = Number(time_array[0]),
            secs = Number(time_array[1]);
        time = m(mins, secs);
        pace = time/distance.value;
      }
      console.log("time type:", typeof time);
      req.session.user.calendar[daykey].log = {
        distance: distance,
        time: time,
        pace: pace,
        comments: comments,
        intensity: intensity,
        feeling: feeling,
      };
      
      console.log("Updated log data:");
      console.log(req.session.user.calendar[daykey].log);
      DBC.db('Running', function(DBC){
        console.log("Into Running");
        DBC.collection('users', function(DBC){
          console.log("... into users");
          DBC.update({ email: req.session.user.email}, {$set: {calendar: req.session.user.calendar}}, {safe:true}, function(err){
            console.log("Error?", err);
            if (err) {
              res.json({
                status: "Could not save data.",
              }, 500);
            }
            else {
              console.log("Done update.");
              res.json(req.session.user.calendar[daykey].log, 200);
            }
          });
        });
      });
    }
    else {
      res.json({
        status: "Not logged in.",
        redirect: "/login",
      }, 401);
    }
  });
};
