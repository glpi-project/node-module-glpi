const assert = require('chai').assert
const expect  = require("chai").expect
const chaiAsPromised = require("chai-as-promised")
const chai = require("chai")
 
chai.use(chaiAsPromised)

const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')

// var client = new GlpiRestClient('http://localhost/~dethegeek/glpi-flyvemdm-92/apirest.php')

describe('initSessionByCredentials()', function() {
  it('successful login', function() {
    const client = new GlpiRestClient(config.apirest)
    // return client.initSessionByCredentials(config.user.name, config.user.password).include("session_token", 'array contains value')
    return assert.eventually.include(Promise.resolve(client.initSessionByCredentials(config.user.name, config.user.password)), "session_token", "This had better be true, eventually");
  })
  
})

