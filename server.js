'use strict'

/**
 * requiring modules
 */
const http = require('http'),
      fs = require('fs'),
      path = require('path'),
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      colors = require('colors/safe'),
      stylus = require('stylus'),
      nib = require('nib'),
      moment = require('moment'),
      mime = require('mime'),
      
      /**
       * local requiring modules
       */
      config = require('./config/app'),
      middlewares = require('./apps/middlewares/router'),
      helpers = require('./apps/helpers'),
      routes = require('./apps/routes')

/**
 * app.locals: passing variables to views
 */
app.locals = {
  'config': config
}

/**
 * app.disable: disable something
 */
app.disable('x-powered-by')

app.set('view engine', 'ejs')
app.set('views', 'apps/views')

/**
 * app.set: set config for using express.js
 */
app.set('views', './apps/views')
app.set('view engine', '.hbs')
app.set('trust proxy', true)
app.set('port', process.env.PORT ? process.env.PORT : config.host.port)

/**
 * app.use: set modules to using in express.js
 */
let compile = function(str, path) {
  console.log('stylus compiled')
  return stylus(str)
         .set('filename', path)
         .use(nib())
}


mime.define({'riot/tag' : ['tag']})

app.use(
  stylus.middleware({
    src: './apps/resources/css',
    dest: './css',
    compile: compile,
  }),
  // express.static('./public'),
  express.static('.'),
  bodyParser.json({ 'type': 'application/json' }),
  bodyParser.urlencoded({ 'extended': true }),
  middlewares,
  routes
)

require('config/mongo')

http.createServer(app).listen(app.get('port'), function(){
  console.log(colors.green(`application is started: ${config.host.self}`))
})

module.exports = app