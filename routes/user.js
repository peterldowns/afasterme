var run = require('../util/run'),
    m = run.m,
    mtm = run.mtm,
    makeSchedule = run.makeSchedule;

module.exports = function(app){
  app.get('/dashboard', function(req, res) {
    if (req.session.loggedIn){
      console.log('rendering dashboard');
      var dayKey = run.makeKey(new Date());
      console.log("Made new key:", dayKey);
      res.render('dashboard', {
        title: 'A Faster Me — Dashboard',
        session: req.session,
        today: req.session.user.calendar[dayKey],
        dayKey: dayKey,
        email : req.query.email ? req.query.email : null
      });
    }
    else {
      res.redirect('/');
    }
  });

  // GET the user's log view
  app.get('/log', function(req, res) {
    if (!req.session.loggedIn){
      res.redirect('/dashboard');
    }
    res.render('log', {
      title: 'A Faster Me — Log',
      session: req.session
    });
  });

  // GET the user's calendar view
  app.get('/calendar', function(req, res) {
    if (!req.session.loggedIn){
      res.redirect('/dashboard');
    }
    res.render('calendar', {
      title: 'A Faster Me — Calendar',
      session: req.session
    });
  });

  // GET the user's statistics view
  app.get('/statistics', function(req, res) {
    if (!req.session.loggedIn){
      res.redirect('/dashboard');
    }
    res.render('statistics', {
      title: 'A Faster Me — Statistics',
      session: req.session
    });
  });

  // GET the user's preferences
  app.get('/preferences', function(req, res) {
    if (!req.session.loggedIn){
      res.redirect('/dashboard');
    }
    res.render('preferences', {
      title: 'A Faster Me — Preferences',
      session: req.session
    });
  });

  // Log a user out
  app.get('/logout', function(req, res) {
    if (req.session.loggedIn){
      delete req.session.loggedIn;
      delete req.session.user;
    }
    console.log("User has been logged out.");
    res.redirect('/');
  });
};
