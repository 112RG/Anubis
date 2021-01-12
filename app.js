'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

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
        dialect: 'sqlite'
      }
    }
  )
    .ready(async () => {
      try {
      // first connection as test
        const result = await fastify.db.authenticate()

        // log
        console.log(
          'Database connection is successfully established.'
        )

        // close the server
        fastify.close()
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
    options: Object.assign({}, opts)
  })
  fastify.register(require('fastify-formbody'))
  fastify.register(require('fastify-secure-session'), {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    cookie: {
      path: '/',
      httpOnly: true // Use httpOnly for all production purposes
      // options for setCookie, see https://github.com/fastify/fastify-cookie
    }
  })
  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
