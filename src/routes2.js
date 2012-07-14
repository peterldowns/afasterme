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
