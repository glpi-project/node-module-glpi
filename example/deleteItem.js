const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')
const itemtype = require('../lib/itemtype')

const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
	.then((res) => {
		client.addItem(itemtype.UserEmail ,{users_id: 37, email: 'example@email.com'})
		.then((res2) => {
			console.log(res2)
			client.deleteItem(itemtype.UserEmail, res2.data.id, {users_id: 37, email: 'example@email.com'})
				.then((res2) => {
					console.log(res2)
				})
				.catch((err2) => {
					console.log(err2)
				})
		})
		.catch((err2) => {
			console.log(err2)
		})
	})
	.catch((err) => {
		console.log(err)
	})