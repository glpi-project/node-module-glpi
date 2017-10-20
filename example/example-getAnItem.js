const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')
const itemtype = require('../lib/itemtype')

const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
	.then((res) => {
		client.getAnItem(itemtype.User, 2)
			.then((res2) => {
				console.log(res2)
			})
			.catch((err2) => {
				console.log(err2)
			})
	})
	.catch((err) => {
		console.log(err)
	})