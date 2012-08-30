// Dependencies
var express = require('express'),
    app = module.exports = express.createServer();

require('./init')(app, express);
require('./routes/api')(app);
require('./routes/public')(app);
require('./routes/user')(app);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",
              app.address().port, app.settings.env);
});
