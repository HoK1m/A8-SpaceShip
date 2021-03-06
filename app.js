
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
// var expressSession = require('express-session');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

/**
 * route controllers
 */
var index = require('./routes/index');
var calculator = require('./routes/calculator');
var rates = require('./routes/rates');
var mypackages = require('./routes/mypackages');


var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// terminal logger currently disabled
// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(cookieParser('IxD secret key'));
app.use(express.static(path.join(__dirname, 'public')));

// express session deprecated 
// app.use(expressSession());

// router deprecated in express 4
// app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

/**
 * express routes
 */
// page render routes
app.get('/', index.view);
app.get('/calculator', calculator.view);
app.get('/rates', rates.view);
app.get('/mypackages', mypackages.view);
// get data routes
app.get('/data', rates.data);
// post data routes
app.post('/calculate', calculator.calculate);
app.post('/rateById', calculator.rateById);
app.post('/addpackages', mypackages.fill);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
