var routes = {
	'/api/key' : {
		// maybe have /api/key/<appname>, but hidden from user is the 'web' app?
		'POST' : "create a new API key. User must be logged in to do this.",
		'GET' : "return the user's API key",
		'DELETE' : "removes the user's API key.",
	},
	'/api/user' : {
		'POST' : "create a new user",
	},
	'/api/user/<username>' : {
		'GET' : "get information about a user",
		'PUT' : "update user information",
		'DELETE' : "delete user",
	},
	'/api/calendar/' : {
		'POST' : "log information about a run",
	},
	'/api/calendar/<year>/<month>/<day>' : {
		'PUT' : "update logged information",
			// doesn't require full information, just the fields to update
		'GET' : "get logged information for a specific day",
		'DELETE' : "delete all information on a specific day",
	},
}

url_base = '/api/v1'
app.post(url_base+'/key', function(req, res){
	var email = req.param('email', null),
			password = req.param('password', null);
	if (email && password) {
		user = db.get_user(email, password);
		if (user) {
			api_key = db.get_api_key(user) || db.make_api_key(user);
			res.json(api_key, 200);
		}
		else {
			res.json('Username must match password', 400);
		}
	}
	else {
		res.json('Must supply username and password', 400);
	}
