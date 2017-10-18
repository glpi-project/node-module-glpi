const HTTPS = require('https')
const URL = require('url').URL
const item = require('./item')

class GlpiRestClient {

	constructor(url) {
		this._url = url
		this._sessionToken = ''
	}

	get url() {
		return this._url
	}

	get sessionToken() {
        return this._sessionToken
    }
  
    set sessionToken(sessionToken) {
		if (sessionToken) this._sessionToken = sessionToken
    }

	_prepareRequest(method, endpoint, options, responseHandler) {
		// Prepare options of the request
		let requestOptions = new URL(this._url)
		requestOptions.pathname	+= `/${endpoint}`
		
		const options2 = {
			"hostname": requestOptions.hostname,
			"port": 443,
			"path": requestOptions.pathname,
			"method": method,
			"Content-Type": "application/json",
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
			let options = {
				"headers": {
					"Authorization": 'Basic ' + new Buffer(user + ':' + password).toString('base64')
				}
			}
			if (appToken) options.headers = {
				...options.headers,
				"App-Token": appToken
			}
			try {
				this._prepareRequest('GET', 'initSession', options, (response, data) => {
					this.sessionToken = JSON.parse(data).session_token
					resolve({
						status: response.statusCode,
						data: JSON.parse(data)
					})
				}).end()
			}
			catch (err) {
				reject(err)
			}
		})
	}

	initSessionByUserToken(userToken, appToken) {
		return new Promise((resolve, reject) => {
			let options = {
				"headers": {
					"Authorization": `user_token ${userToken}`
				}
			}
			if (appToken) options.headers = {
				...options.headers,
				"App-Token": appToken
			}
			try {
				this._prepareRequest('GET', 'initSession', options, (response, data) => {
					this.sessionToken = JSON.parse(data).session_token
					resolve({
						status: response.statusCode,
						data: JSON.parse(data)
					})
				}).end()
			}
			catch (err) {
				reject(err)
			}
		})

	}

	killSession() {
		return new Promise((resolve, reject) => {
			let options = {
				"headers": {
					"Session-Token": this.sessionToken
				}
			}
			try {
				if (!this.sessionToken) return 'No initialized session exists'

				this._prepareRequest('GET', 'killSession', options, (response, data) => {
					if (response.statusCode == 200) {
						this.sessionToken = ''
						resolve({
							status: response.statusCode,
							data: {
								message: 'User logout successfully'
							}
						})
					} else {
						resolve({
							status: response.statusCode,
							data: data
						})
					}
				}).end()
			}
			catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = GlpiRestClient
