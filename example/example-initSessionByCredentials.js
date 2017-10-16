'use strict'

const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')

const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password)
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
		console.log(err)
	})

/*
var computer = client.getAnItem('computer', 1)
var computers = client.getMultipleItems([
	{"itemtype": "computer", "id": 1},
	{"itemtype": "computer", "id": 3},
	{"itemtype": "computer", "id": 4}
])
*/
