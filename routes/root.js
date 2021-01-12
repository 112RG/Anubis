'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/login', async function (request, reply) {
    return reply.view('login')
  })
  fastify.post('/login', async function (request, reply) {
    console.log(request.body)
    if (request.body.password === 'w') {
      request.session.set('data', request.body)
      return reply.status(200).send('Successfully registered')
    } else {
      return reply.status(401).send('Failed to login')
    }
  })
  fastify.get('/auth', async function (request, reply) {
    return reply.status(401).send('Successfully registered')
    // Return 401 when not logged in. Return 200 when JWT valid.
    // Should I use jwt? YESs
  })
  fastify.get('/test', async function (request, reply) {
    return reply.status(200).send('Successfully registered')
    // Return 401 when not logged in. Return 200 when JWT valid.
    // Should I use jwt? YESs
  })
}
