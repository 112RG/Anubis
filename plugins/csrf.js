'use strict'
const fastifyPlugin = require('fastify-plugin')
const CSRF = require('csrf')
const { Forbidden } = require('http-errors')

const defaultOptions = {
  cookieKey: '_csrf',
  cookieOpts: { path: '/', sameSite: true },
  sessionKey: '_csrf',
  getToken: getTokenDefault,
  sessionPlugin: 'fastify-cookie'
}

async function csrfPlugin(fastify) {
  const tokens = new CSRF()

  const {
    cookieKey,
    cookieOpts,
    getToken
  } = Object.assign({}, defaultOptions)

  const isCookieSigned = cookieOpts && cookieOpts.signed

  fastify.decorateReply('generateCsrf', generateCsrfCookie)

  fastify.decorate('csrfProtection', csrfProtection)

  async function generateCsrfCookie (opts) {
    let secret = isCookieSigned
      ? this.unsignCookie(this.request.cookies[cookieKey] || '')
      : this.request.cookies[cookieKey]
    if (!secret) {
      secret = await tokens.secret()
      this.setCookie(cookieKey, secret, Object.assign({}, cookieOpts, opts))
    }
    return tokens.create(secret)
  }
  function csrfProtection(req, reply, next) {
    const secret = getSecret(req, reply)
    if (!secret) {
      req.log.warn('Missing csrf secret')
      return reply.send(new Forbidden('Missing csrf secret'))
    }
    if (!tokens.verify(secret, getToken(req))) {
      req.log.warn('Invalid csrf token')
      return reply.send(new Forbidden('Invalid csrf token'))
    }
    next()
  }

  function getSecret (req, reply) {
    return isCookieSigned
      ? reply.unsignCookie(req.cookies[cookieKey] || '')
      : req.cookies[cookieKey]
  }
}

function getTokenDefault(req) {
  return (req.body && req.body._csrf)
}

module.exports = fastifyPlugin(csrfPlugin)
