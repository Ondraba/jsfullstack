var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var httpProxy = require('http-proxy');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

const apiProxy = httpProxy.createProxyServer({
  target:'http://localhost:3001'
});

app.use('/api',function(req, res){
  apiProxy.web(req, res);
})

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));


app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname,'public','index.html'));
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
