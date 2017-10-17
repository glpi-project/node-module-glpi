const chaiAsPromised = require("chai-as-promised")
const chai = require("chai")
 
chai.use(chaiAsPromised)
const assert = chai.assert
const expect  = chai.expect

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

