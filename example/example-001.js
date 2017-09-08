'use strict'

const GlpiRestClient = require('../lib/restclient')

var client = new GlpiRestClient('http://localhost/~dethegeek/glpi-flyvemdm-92/apirest.php')

client.initSessionByCredentials('glpi', 'glpi').then(() => {
	console.log('Logged in !')
	//var computer = client.getAnItem('computer', 1)
})

/*
var computer = client.getAnItem('computer', 1)
var computers = client.getMultipleItems([
	{"itemtype": "computer", "id": 1},
	{"itemtype": "computer", "id": 3},
	{"itemtype": "computer", "id": 4}
])
*/
