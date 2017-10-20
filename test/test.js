const assert = require("chai").assert
const expect  = require("chai").expect

const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')
const itemtype = require('../lib/itemtype')

// var client = new GlpiRestClient('http://localhost/~dethegeek/glpi-flyvemdm-92/apirest.php')

describe('initSessionByCredentials()', function() {
  this.timeout(15000)
  it('successful login', async () => {
    const client = new GlpiRestClient(config.apirest)
    const result = await client.initSessionByCredentials(config.user.name, config.user.password)
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('initSessionByUserToken()', function() {
  this.timeout(15000)
  it('successful login', async () => {
    const client = new GlpiRestClient(config.apirest)
    const result = await client.initSessionByUserToken(config.user.userToken)
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('killSession()', function() {
  this.timeout(15000)
  it('log out successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.killSession()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getMyProfiles()', function() {
  this.timeout(15000)
  it('get my profiles successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getMyProfiles()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getActiveProfile()', function() {
  this.timeout(15000)
  it('get active profile successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getActiveProfile()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getMyEntities()', function() {
  this.timeout(15000)
  it('get my entities successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getMyEntities()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getActiveEntities()', function() {
  this.timeout(15000)
  it('get active entities successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getActiveEntities()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getFullSession()', function() {
  this.timeout(15000)
  it('get full session successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getFullSession()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getGlpiConfig()', function() {
  this.timeout(15000)
  it('get gpli configuration successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getGlpiConfig()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getAllItems()', function() {
  this.timeout(15000)
  it('get all items of a type successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getAllItems(itemtype.User)
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})

describe('getAnItem()', function() {
  this.timeout(15000)
  it('get an item of a type successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByCredentials(config.user.name, config.user.password)
      .then(function() {
        client.getAnItem(itemtype.User, 2)
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})