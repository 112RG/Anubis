'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const fs = require('fs')
const { DataTypes } = require('sequelize')
const config = require('./config.json')
module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(
    require('sequelize-fastify'),
    {
      instance: 'db',
      sequelizeOptions: {
        database: 'db',
        dialect: 'sqlite',
        storage: 'db.sqlite'
      }
    }
  )
    .ready(async () => {
      try {
      // first connection as test
        await fastify.db.authenticate()
        fs
          .readdirSync('./models')
          .filter((file) => {
            const returnFile = (file.indexOf('.') !== 0) &&
            (file.slice(-3) === '.js')
            return returnFile
          })
          .forEach((file) => {
            const model = require(path.join(__dirname, '/models', file))(fastify.db, DataTypes)
            console.log(`Loaded model ${model.name}`)
            fastify.db[model.name] = model
          })
        fastify.db.User.sync()
        // log
        console.log(
          'Database connection is successfully established.'
        )
      } catch (err) {
      // log the error
        console.log(
          `Connection could not established: ${err}`
        )
      }
    })
  fastify.register(require('point-of-view'), {
    engine: {
      pug: require('pug')

    },
    root: path.join(__dirname, 'views'),
    viewExt: 'pug'
  })
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'static'),
    maxAge: '365d',
    immutable: true,
    cacheControl: true,
    prefix: '/login/'
  })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: config
  })
  fastify.register(require('fastify-cookie'))
  fastify.register(require('fastify-formbody'))
  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
