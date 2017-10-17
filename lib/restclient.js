'use strict'

const HTTPS = require('https')
const URL = require('url').URL
const item = require('./item')

class GlpiRestClient {

	/**
	 * @param {https}   https -
	 * @param {string} url  - The rest API url of a GLPI instance
	 */
	constructor(url) {
		this._url = url
		this._sessionToken = ''
	}

	/**
	 * @param {string} method HTTPS method
	 * @param {string} endpoint endpoint of the request 
	 * @param {object} headers options for the request object
	 * @param {function} responseHandler handler of the response 
	 */
	_prepareRequest(method, endpoint, options, responseHandler) {
		// Prepare options of the request
		let requestOptions = new URL(this._url)
		requestOptions.pathname	+= `/${endpoint}`
		
		// Build the request
		// return HTTPS.request(requestOptions, response => {
		// 	var body = ''

		// 	// Buffer the body of the response
		// 	response.on('data', chunk => {
		// 		body = body + chunk
		// 	})

		// 	// Parse the response
		// 	response.on('end', () => {
		// 		responseHandler(response, body)
		// 	})
		// })
		
		const options2 = {
			hostname: requestOptions.hostname,
			port: 443,
			path: requestOptions.pathname,
			method: method,
			...options  
		}
		
		return HTTPS.get(options2, (resp) => {
			let data = ''
		  
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk
			})
		  
			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				responseHandler(resp, data)
			})
		  
		}).on("error", (err) => {})
	}

	/**
	 * @param {string} user     - login
	 * @param {string} password - password
	 * @param {string} appToken - application token (optional)
	 */
	initSessionByCredentials(user, password, appToken) {
		return new Promise((resolve, reject) => {
			const options = {
				"headers": {
					"Authorization": 'Basic ' + new Buffer(user + ':' + password).toString('base64')
				}
			}

			var request = this._prepareRequest('GET', 'initSession', options, (response, data) => {
				// switch (true) {
				// 	case (response.statusCode >= 400 && response.statusCode < 500):
				// 		reject(JSON.parse(body))
				// 	break

				// 	case (response.statusCode != 200):
				// 		reject(.ERROR_INTERNAL_SERVER', 'Internal server error)
				// 	break
				// }
				// try {
				// 	var parsed = JSON.parse(body)
				// 	this._sessionToken = parsed.session_token
				// 	resolve()
				// } catch (e) {
				// 	reject()
				// }
				reject(JSON.parse(data))
			})
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
