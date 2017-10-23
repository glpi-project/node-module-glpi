const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')

const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
	.then((res) => {
		client.getActiveProfile()
			.then((res2) => {
				console.log(res2)
				client.killSession()
					.then((res3) => {
						console.log(res3)
					})
					.catch((err3) => {
						console.log(err3)
					})
			})
			.catch((err2) => {
				console.log(err2)
			})
	})
	.catch((err) => {
		console.log(err)
	})