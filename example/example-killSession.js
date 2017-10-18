const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')

const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
.then((res) => {
	client.killSession()
})
.catch((err) => {
	console.log(err)
})