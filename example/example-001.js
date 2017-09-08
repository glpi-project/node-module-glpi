'use strict'

const http = require('http')
const glpiRestClient = require('../lib/restclient')

var client = new glpiRestClient(http, 'http://localhost/~dethegeek/glpi-flyvemdm-92/apirest.php')

client.initSessionByCredentials('glpi', 'glpi')

/*
var computer = client.getAnItem('computer', 1)
var computers = client.getMultipleItems([
	{"itemtype": "computer", "id": 1},
	{"itemtype": "computer", "id": 3},
	{"itemtype": "computer", "id": 4}
])
*/
