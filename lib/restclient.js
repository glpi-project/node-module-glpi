'use strict'

const http = require('http')
const url = require('url')
const item = require('./item')

class glpiRestClient {

	/**
	 * @param {http}   http -
	 * @param {string} url  - The rest API url of a GLPI instance
	 */
	constructor(http, url) {
		this.http = http
		this.url = url
		this.sessionToken = ''
	}

	/**
	 * Gets and saves the session token from a HTTP response
	 */
	readSessionToken(response) {
		var body = ''
		var that = this
		response.on('data', chunk => {
			body = body + chunk
		})
		response.on('end', () => {
			try {
				var parsed = JSON.parse(body)
				that.sessionToken = parsed['session_token']
			} catch (e) {
				console.error(e.message)
			}
		})
	}

	/**
	 * @param {string} user     - login
	 * @param {string} password - password
	 * @param {string} appToken - application token (optional)
	 */
	initSessionByCredentials(user, password, appToken) {
		var headers = {
			'Authorization': 'Basic ' + new Buffer(user + ':' + password).toString('base64')
		};
		if (typeof appToken == 'string') {
			headers['App-Token'] = appToken
		}
		this.prepareHttpRequest('get', 'initSession', headers, this.readSessionToken)
	}

	/**
	 * Gets an item given its itemtype and its ID
	 * @param {string} itemtype of the requested item
	 * @param {number} ID of the requested item
	 */
	getAnItem(itemtype, id) {
		this.prepareHttpRequest('get', itemtype + '/' + id, function(response) {
			response.on('data', chunk => body.push(chunk))
		})
	}

	/**
	 * Gets one or more items given their itemtype and their ID
	 * @param {array} Array of objects {"itemtype": "...", "id": 1}
	 */
	getMultipleItems(items) {

	}

	/**
	 * @param {string} verb
	 * @param {string} relative_uri
	 * @param {object} headers
	 * @param {function} callback which processes the response
	 */
	prepareHttpRequest(verb, relativeUri, headers, callback) {
		if (arguments.length == 3) {
			callback = arguments[2];
			headers = []
		}

		headers['Content-Type'] = 'application/json';
		var requestOptions = url.parse(this.url);
		requestOptions['method'] = verb
		requestOptions['headers'] = headers
		requestOptions['path'] += '/' + relativeUri
		var request = this.http.request(requestOptions, callback);
		request.end()
	}
}

module.exports = glpiRestClient
