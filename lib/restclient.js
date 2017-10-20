const HTTPS = require('https')
const URL = require('url').URL
const ITEMTYPE = require('./itemtype')

class GlpiRestClient {

	constructor(url) {
		this._url = url
		this._sessionToken = ''
	}

	get url() {
		return this._url
	}

	set url(url) {
		this._url = url
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

		let headers = {
			"Content-Type": "application/json",
			"Session-Token": this.sessionToken
		}
		if (options) {
			if (options.headers) headers = {...headers, ...options.headers}
		}

		const requestData = {
			"hostname": requestOptions.hostname,
			"port": 443,
			"path": requestOptions.pathname,
			"method": method,
			"headers": headers
		}
		
		return HTTPS.request(requestData, (resp) => {
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

	_requestException (status, data) {
		return ({
			status,
			data: {
				...data
			}
		})
	}

	_assessstatus (status, data) {
		if (status >= 400 && status < 600) {
			if (status >= 400 && status < 500) {
				return this._requestException(status, {
					codeError: JSON.parse(data)[0],
					messageError: JSON.parse(data)[1]
				})
			}
			return this._requestException(status, JSON.parse(data))
		}
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
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'killSession', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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
							data: JSON.parse(data)
						})
					}
				}).end()
			}
			catch (err) {
				reject(err)
			}
		})
	}

	getMyProfiles() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'getMyProfiles', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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

	getActiveProfile() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'getActiveProfile', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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
	
	getMyEntities() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'getMyEntities', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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

	getActiveEntities() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'getActiveEntities', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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

	getFullSession() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'getFullSession', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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
	
	getGlpiConfig() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'getGlpiConfig', null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
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

	getAllItems(itemtype) {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				if (!itemtype) throw this._requestException(400, 'Invalid itemtype')
				if (itemtype != ITEMTYPE[itemtype.name]) throw this._requestException(400, 'Invalid itemtype')
				this._prepareRequest('GET', itemtype.name, null, (response, data) => {
					const error = this._assessstatus(response.statusCode, data)
					if (error) reject (error)
					
					resolve({
						status: response.statusCode,
						data: JSON.parse(data)[0]
					})
				}).end()
			}
			catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = GlpiRestClient
