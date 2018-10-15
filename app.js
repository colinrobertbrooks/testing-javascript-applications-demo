/* eslint-disable global-require */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const flash = require('connect-flash');
const passport = require('passport');

const models = require('./app/models');
const { version } = require('./package.json');

/*
  configs
*/
const env = process.env.NODE_ENV || 'development';

module.exports = async () => {
  /*
    models
  */
  // initialize
  await models.sequelize.sync();

  /*
    app
  */
  // create a new express app
  const app = express();

  // set local variables
  app.locals.version = version;

  // set views directory and view engine
  app.set('views', path.join(__dirname, 'app/views'));
  app.set('view engine', 'ejs');

  /*
    middleware (order is important)
  */
  app.use(morgan('tiny'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // enable gzipping (before static files so those requests are also compressed)
  app.use(compression());

  // configure static file directory (before passport to prevent sessions for these requests)
  app.use(express.static(path.join(__dirname, 'public')));

  // configure sqlite store for sessions
  app.use(
    session({
      cookie: { maxAge: 604800000 },
      resave: true,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new SQLiteStore({
        table: 'sessions',
        db: `database_${env}.db`,
        dir: '.'
      })
    })
  );

  // configure connect-flash (depends on sessions)
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.message = req.flash();
    next();
  });

  // configure passport local strategy for authentication
  require('./app/middleware/passportLocalStrategy');

  // initialize passport authentication / sessions
  app.use(passport.initialize());
  app.use(passport.session());

  // configure webpack hot module replacement in dev
  if (env === 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config/client.dev.js');
    const webpackCompiler = webpack(webpackConfig);

    // serve files from memory via webpack
    app.use(
      require('webpack-dev-middleware')(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
      })
    );

    // enable hot reloading of files via webpack
    app.use(require('webpack-hot-middleware')(webpackCompiler));
  }

  /*
    router
  */
  app.use('/', require('./app/router'));

  /*
    error handling
  */
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;
    next(err);
  });

  // error handler (will print stacktrace in dev)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      error: {
        message: err.message,
        status: err.status,
        stack: env === 'development' ? err.stack : null
      }
    });
  });

  return app;
};
