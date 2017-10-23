/* --------------------------------------------------------------------
*
*  LICENSE
*
*  This file is part of the GLPI API Client Library for Node.js,
*  a subproject of GLPI. GLPI is a free IT Asset Management.
*
*  GLPI is free software: you can redistribute it and/or
*  modify it under the terms of the GNU General Public License
*  as published by the Free Software Foundation; either version 3
*  of the License, or (at your option) any later version.
*
*  GLPI is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*  --------------------------------------------------------------------
*  @author    Gianfranco Manganiello - <gmanganiello@teclib.com>
*  @copyright (C) 2017 Teclib' and contributors.
*  @license   GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
*  @link      https://github.com/glpi-project/node-module-glpi
*  @link      http://www.glpi-project.org/
*  -------------------------------------------------------------------- */

const HTTPS = require('https')
const URL = require('url').URL
const ITEMTYPE = require('./itemtype')
const querystring = require('querystring')

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

		let bodyString = ''

		if (options) {
			if (options.headers) headers = {...headers, ...options.headers}
			if (options.input) {
				bodyString = JSON.stringify(options)
				headers = {...headers, "Content-Length": bodyString.length}
			}
		}

		const requestData = {
			"hostname": requestOptions.hostname,
			"port": 443,
			"path": requestOptions.pathname,
			"method": method,
			"headers": headers
		}
		
		const req = HTTPS.request(requestData, (resp) => {
			let data = ''
		  
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk
			})
		  
			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				responseHandler(resp, data)
			})
		  
		})

		req.on("error", (err) => {})
		req.write(bodyString)

		return req
	}

	_requestException (status, data) {
		return ({
			status,
			data: {
				...data
			}
		})
	}

	_assessStatus (status, data) {
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

	_isNumber (o) {
		return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						this.sessionToken = JSON.parse(data).session_token
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						this.sessionToken = JSON.parse(data).session_token
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

	killSession() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				this._prepareRequest('GET', 'killSession', null, (response, data) => {
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						this.sessionToken = ''
						resolve({
							status: response.statusCode,
							data: {
								message: 'User logout successfully'
							}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						resolve({
							status: response.statusCode,
							data: JSON.parse(data)[0]
						})
					}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						resolve({
							status: response.statusCode,
							data: JSON.parse(data).active_profile
						})
					}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						resolve({
							status: response.statusCode,
							data: JSON.parse(data)[0]
						})
					}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						resolve({
							status: response.statusCode,
							data: JSON.parse(data)[0]
						})
					}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						resolve({
							status: response.statusCode,
							data: JSON.parse(data)[0]
						})
					}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
					} else {
						resolve({
							status: response.statusCode,
							data: JSON.parse(data)[0]
						})
					}
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
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
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

	getAnItem(itemtype, id) {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				if (!itemtype) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				if (itemtype != ITEMTYPE[itemtype.name]) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				if (!this._isNumber(id)) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid id'})
				if (id < 0 ) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid id'})
				const endpoint = `${itemtype.name}/${id}`
				this._prepareRequest('GET', endpoint, null, (response, data) => {
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
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

	getSubItems(itemtype, id, subItemtype) {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				if (!itemtype) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				if (itemtype != ITEMTYPE[itemtype.name]) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				if (!subItemtype) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid sub itemtype'})
				if (subItemtype != ITEMTYPE[subItemtype.name]) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid sub itemtype'})
				if (!this._isNumber(id)) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid id'})
				if (id < 0 ) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid id'})
				const endpoint = `${itemtype.name}/${id}/${subItemtype.name}`
				this._prepareRequest('GET', endpoint, null, (response, data) => {
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
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

	addItem(itemtype, input) {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				if (!itemtype) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				if (itemtype != ITEMTYPE[itemtype.name]) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				const options = { input }
				const endpoint = itemtype.name
				this._prepareRequest('POST', endpoint, options, (response, data) => {
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
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

	deleteItem (itemtype, id, input) {
		return new Promise((resolve, reject) => {
			try {
				if (!this.sessionToken) throw this._requestException(401, {errorCode: '', errorMessage: 'Uninitialized session'})
				if (!itemtype) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				if (itemtype != ITEMTYPE[itemtype.name]) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid itemtype'})
				let options = ''
				let endpoint = itemtype.name
				if (!id) {
					if (!input) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid input'})
					options = { input }
				} else {
					if (!this._isNumber(id)) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid id'})
					if (id < 0 ) throw this._requestException(400, {errorCode: '', errorMessage: 'Invalid id'})
					endpoint += `/${id}`
				}
				this._prepareRequest('DELETE', endpoint, options, (response, data) => {
					const error = this._assessStatus(response.statusCode, data)
					if (error) {
						reject (error)
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
}

module.exports = GlpiRestClient
