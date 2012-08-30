// Dependencies
var express = require('express'),
    app = module.exports = express.createServer();

require('./func/init')(app, express);
require('./func/routes/api')(app);
require('./func/routes/public')(app);
require('./func/routes/user')(app);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",
              app.address().port, app.settings.env);
});
