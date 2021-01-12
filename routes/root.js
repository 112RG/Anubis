'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/login', async function (request, reply) {
    console.log(request.headers)
    return reply.view('login', { token: await reply.generateCsrf() })
  })
  fastify.post('/login', {
    preValidation: fastify.csrfProtection,
    schema: {
      summary: 'User login',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['email', 'password']
      }
    }
  }, async function (request, reply) {
    const user = await fastify.db.User.findOne({ where: { username: request.body.email } })
    if (!user) {
      return reply.status(400).send('Invalid please try again')
    }
    /// tefefefest
    if (!await user.checkPassword(request.body.password)) {
      return reply.status(400).send('Invalid please try again')
    }
    const token = await fastify.generateToken({ id: user.id, username: user.username })
    reply.setCookie('token', token, {
      path: '/',
      secure: false, // send cookie over HTTPS only
      httpOnly: false,
      sameSite: true // alternative CSRF protection
    })
    return reply.status(200).send('Succesffully')
  })

  fastify.get('/test', async function (request, reply) {
    // console.log(await fastify.db.User.create({ username: 'test', password: 'tefefefest' }))
    const user = await fastify.db.User.findOne({ where: { username: 'test' } })
    if (!user) {
      return reply.status(400)
    }
  })
  fastify.route({
    method: 'GET',
    url: '/auth',
    preValidation: [fastify.retrieveToken],
    handler: function (request, reply) {
      reply.status(200).send('Allowed')
    }
  })
}
