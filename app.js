const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ldap = require("ldapjs");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const app = express();

// ldap client
const serverUrl = `${process.env.LDAP_SERVER_BASE_URL}:${process.env.LDAP_SERVER_PORT}`;
const username = 'uid=admin,ou=system';
const password = process.env.LDAP_PW;
const ldapOptions = {
  url: serverUrl,
  connectTimeout: process.env.LDAP_SERVER_CONNECTION_TIMEOUT,
  reconnect: true
};

const client = ldap.createClient(ldapOptions);

client.bind(username, password, (error) => {
  if (error) {
    console.error('LDAP connection failed:', error);
  } else {
    console.log(`LDAP server connected. URL: ${serverUrl}`);
  }
});

// handle connection error
client.on('connectError', (err) => {
  console.log('[LDAP] Error occured: ', err)
  client.unbind(() => {
    console.log("Closed LDAP server connection.");
  })
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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


function cleanup () {
  client.unbind(() => {
    console.log("Closed LDAP server connection.");
    process.exit();
  })

  setTimeout( function () {
    console.error("Could not close connections in time, forcing shut down");
    process.exit(1);
  }, 30*1000);

}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = app;
