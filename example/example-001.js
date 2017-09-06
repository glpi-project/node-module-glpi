const http = require('http')
const glpiRestClient = require('glpiRestClient')

client = new glpiRestClient(new http, 'http://localhost/glpi/apirest.php')

client.initSessionByCredentials('glpi', 'glpi');

computer = client.getAnItem('computer', 1)
computers = client.getMultipleItems([
	{"itemtype": "computer", "id": 1},
	{"itemtype": "computer", "id": 3},
	{"itemtype": "computer", "id": 4}
])
