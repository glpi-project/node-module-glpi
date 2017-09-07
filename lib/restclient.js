'use strict'

const http = require('http')

class glpiRestClient {

	/**
	 * @param {http}   http -
	 * @param {string} url  - The rest API url of a GLPI instance
	 */
	constructor(http, url) {
		this.http = http
		this.url = url
		this.sessionToken = ''
		this.body = ''
	}

	getBody() {
		response.on('data', chunk => body.push(chunk))
		response.on('end', parseBody)
	}

	readSessionToken() {
		try {
			parsed = JSON.parse(body)
			sessionToken = parsed['session_tokern']
		} catch (e) {
			console.error(e.message)
		}
		return false
	}

	/**
	 * @param {string} user     - login
	 * @param {string} password - password
	 * @param {string} appToken - application token (optional)
	 */
	initSessionByCredentials(user, password, appToken = '') {
		var headers = {
			'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
		};
		response = this.doHttpRequest('get', 'initSession', headers)
		response.on('data', getBody)
		response.on('end', readSessionToken)
	}

	/**
	 * @param {string} verb
	 * @param {string} relative_uri
	 * @param {object} headers
	 */
	doHttpRequest(verb, relativeUri, headers) {
		headers['Content-Type'] = 'application/json';
		return this.http.request({
			'method': verb,
			'host': this.url,
			'headers': headers
		});
	}
}

exports.glpiRestClient = glpiRestClient
