'use strict'

const HTTPS = require('https')
const URL = require('url').URL
const item = require('./item')

class GlpiRestClient {

	constructor(url) {
		this._url = url
		this._sessionToken = ''
	}

	_prepareRequest(method, endpoint, options, responseHandler) {
		// Prepare options of the request
		let requestOptions = new URL(this._url)
		requestOptions.pathname	+= `/${endpoint}`
		
		const options2 = {
			hostname: requestOptions.hostname,
			port: 443,
			path: requestOptions.pathname,
			method: method,
			...options  
		}
		
		return HTTPS.request(options2, (resp) => {
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

	initSessionByCredentials(user, password, appToken) {
		return new Promise((resolve, reject) => {
			const options = {
				"headers": {
					"Authorization": 'Basic ' + new Buffer(user + ':' + password).toString('base64')
				}
			}

			const request = this._prepareRequest('GET', 'initSession', options, (response, data) => {
				reject({
					status: response.statusCode,
					data: JSON.parse(data)
				})
			}).end()
		})
	}

	getAnItem(itemtype, id) {
		this.prepareHttpRequest('get', itemtype + '/' + id, function(response) {
			response.on('data', chunk => body.push(chunk))
		})
	}

	getMultipleItems(items) {

	}
}

module.exports = GlpiRestClient
