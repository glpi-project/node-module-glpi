'use strict'

const http = require('http')
const url = require('url')
const item = require('./item')

class GlpiRestClient {

	/**
	 * @param {http}   http -
	 * @param {string} url  - The rest API url of a GLPI instance
	 */
	constructor(url) {
		this._url = url
		this._sessionToken = ''
	}

	/**
	 * @param {string} verb HTTP verb
	 * @param {string} endpoint endpoint of the request 
	 * @param {object} headers options for the request object
	 * @param {function} responseHandler handler of the response 
	 */
	_prepareRequest(verb, endpoint, options, responseHandler) {
		// Prepare options of the request
		var requestOptions = url.parse(this._url)
		requestOptions['path'] += '/' + endpoint
		requestOptions['method'] = verb
		if (typeof options['headers'] == 'object') {
			requestOptions['headers'] = Object.assign(
				{'Content-Type': 'application/json'},
				options['headers']
			)
			delete options['headers']
		}
		Object.assign(
			requestOptions,
			options
		)

		// Build the request
		return http.request(requestOptions, response => {
			var body = ''

			// Buffer the body of the response
			response.on('data', chunk => {
				body = body + chunk
			})

			// Parse the response
			response.on('end', () => {
				responseHandler(response, body)
			})
		})
	}

	/**
	 * @param {string} user     - login
	 * @param {string} password - password
	 * @param {string} appToken - application token (optional)
	 */
	initSessionByCredentials(user, password, appToken) {
		return new Promise((resolve, reject) => {
			var options = {'auth' : user + ':' + password}
			var request = this._prepareRequest('get', 'initSession', options, (response, body) => {
				switch (true) {
					case (response.statusCode >= 400 && response.statusCode < 500):
						reject(JSON.parse(body))
					break

					case (response.statusCode != 200):
						reject(['ERROR_INTERNAL_SERVER', 'Internal server error'])
					break
				}
				try {
					var parsed = JSON.parse(body)
					this._sessionToken = parsed['session_token']
					resolve()
				} catch (e) {
					reject()
				}
			})
			request.end()
		})
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
}

module.exports = GlpiRestClient
