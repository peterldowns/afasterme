module.exports = function(app){
  app.get('/', function(req, res) {
    if (req.session.loggedIn){
      res.redirect('/dashboard');
    }
    else {
      res.render('index.html', {
        title: 'Welcome to A Faster Me',
        session: req.session
      });
    }
  });

  // GET the sign up page
  app.get('/signup', function(req, res) {
    if (req.session.loggedIn){
      res.redirect('/dashboard');
    }
    else {
      res.render('signup', {
        title: 'A Faster Me — Sign Up',
        session: req.session,
        email: req.query.email ? req.query.email : null,
        error: req.query.error ? req.query.error : false
      });
    }
  });

  // GET the login page
  app.get('/login', function(req, res) {
    if (req.session.loggedIn){
      res.redirect('/dashboard');
    }
    else{
      res.render('login', {
        title: 'A Faster Me — Log In',
        email: req.query.email ? req.query.email : null,
        newuser: req.query.newuser ? true : false,
        error: req.query.error ? true : false,
        session: req.session
      });
    }
  });
};
