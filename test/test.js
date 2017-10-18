const assert = require("chai").assert
const expect  = require("chai").expect

const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')

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

describe('initSessionByUserToken()', function() {
  this.timeout(15000)
  it('log out successfully', () => {
    const client = new GlpiRestClient(config.apirest)

    return client.initSessionByUserToken(config.user.userToken)
      .then(function() {
        client.killSession()
          .then((result) => {
            assert.deepInclude(result, { "status": 200 })
          })
      })
  })
})