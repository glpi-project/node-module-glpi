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
const { URL } = require('url')
const ITEMTYPE = require('./itemtype')

class GlpiRestClient {
  constructor(url) {
    this.url = url
    this.sessionToken = ''
    this.appToken = ''
  }

  get sessionToken() {
    return this.sessionToken
  }

  set sessionToken(sessionToken) {
    if (sessionToken) this.sessionToken = sessionToken
  }

  set appToken(appToken) {
    if (appToken) this.appToken = appToken
  }

  prepareRequest(method, endpoint, options, responseHandler) {
    // Prepare options of the request
    const requestOptions = new URL(this.url)
    requestOptions.pathname += `/${endpoint}`

    let headers = {
      'Content-Type': 'application/json',
      'Session-Token': this.sessionToken,
      'App-Token': this.appToken,
    }

    let bodyString = ''

    if (options) {
      if (options.headers) headers = { ...headers, ...options.headers }
      if (options['App-Token']) this.appToken = options['App-Token']
      if (options.input) {
        bodyString = JSON.stringify(options)
        headers = { ...headers, 'Content-Length': bodyString.length }
      }
      if (options.profiles_id) {
        bodyString = JSON.stringify(options)
        headers = { ...headers, 'Content-Length': bodyString.length }
      }
      if (options.activeEntities) {
        bodyString = JSON.stringify(options.activeEntities)
        headers = { ...headers, 'Content-Length': bodyString.length }
      }
      if (options.lostPassword) {
        bodyString = JSON.stringify(options.lostPassword)
        headers = { ...headers, 'Content-Length': bodyString.length }
      }
      if (options.queryString) {
        for (const obj in options.queryString) {
          if (options.queryString[obj]) {
            requestOptions.searchParams.append(obj, options.queryString[obj])
          }
        }
      }
    }

    const requestData = {
      hostname: requestOptions.hostname,
      port: 443,
      path: requestOptions.pathname + requestOptions.search,
      method,
      headers,
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

    req.on('error', () => {})
    req.write(bodyString)

    return req
  }

  static requestException(status, data) {
    return ({
      status,
      data: {
        ...data,
      },
    })
  }

  static assessStatus(status, data) {
    if (status >= 400 && status < 600) {
      if (status < 500) {
        return GlpiRestClient.requestException(status, {
          codeError: JSON.parse(data)[0],
          messageError: JSON.parse(data)[1],
        })
      }
      return GlpiRestClient.requestException(status, JSON.parse(data))
    }

    return null
  }

  static isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== '' && o !== false
  }

  initSessionByCredentials(user, password, appToken) {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          headers: {
            Authorization: `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`,
          },
        }
        if (appToken) {
          options.headers = {
            ...options.headers,
            'App-Token': appToken,
          }
        }
        this.prepareRequest('GET', 'initSession', options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            this.sessionToken = JSON.parse(data).session_token
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  initSessionByUserToken(userToken, appToken) {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          headers: {
            Authorization: `user_token ${userToken}`,
          },
        }
        if (appToken) {
          options.headers = {
            ...options.headers,
            'App-Token': appToken,
          }
        }
        this.prepareRequest('GET', 'initSession', options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            this.sessionToken = JSON.parse(data).session_token
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  killSession() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'killSession', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            this.sessionToken = ''
            resolve({
              status: response.statusCode,
              data: {
                message: 'User logout successfully',
              },
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getMyProfiles() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'getMyProfiles', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data).myprofiles,
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getActiveProfile() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'getActiveProfile', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data).active_profile,
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getMyEntities() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'getMyEntities', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data).myentities,
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getActiveEntities() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'getActiveEntities', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getFullSession() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'getFullSession', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getGlpiConfig() {
    return new Promise((resolve, reject) => {
      try {
        this.prepareRequest('GET', 'getGlpiConfig', null, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getAllItems(itemtype, queryString) {
    return new Promise((resolve, reject) => {
      try {
        if (!itemtype) throw GlpiRestClient.requestException(400, 'Invalid itemtype')
        if (itemtype !== ITEMTYPE[itemtype.name]) throw GlpiRestClient.requestException(400, 'Invalid itemtype')
        let options = null
        if (queryString) options = { queryString }
        this.prepareRequest('GET', itemtype.name, options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getAnItem(itemtype, id, queryString) {
    return new Promise((resolve, reject) => {
      try {
        if (!itemtype) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (itemtype !== ITEMTYPE[itemtype.name]) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (!GlpiRestClient.isNumber(id)) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
        if (id < 0) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
        let options = null
        if (queryString) options = { queryString }
        const endpoint = `${itemtype.name}/${id}`
        this.prepareRequest('GET', endpoint, options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  getSubItems(itemtype, id, subItemtype, queryString) {
    return new Promise((resolve, reject) => {
      try {
        if (!itemtype) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (itemtype !== ITEMTYPE[itemtype.name]) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (!subItemtype) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid sub itemtype' })
        if (subItemtype !== ITEMTYPE[subItemtype.name]) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid sub itemtype' })
        if (!GlpiRestClient.isNumber(id)) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
        if (id < 0) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
        let options = null
        if (queryString) options = { queryString }
        const endpoint = `${itemtype.name}/${id}/${subItemtype.name}`
        this.prepareRequest('GET', endpoint, options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  addItem(itemtype, input) {
    return new Promise((resolve, reject) => {
      try {
        if (!itemtype) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (itemtype !== ITEMTYPE[itemtype.name]) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        const options = { input }
        const endpoint = itemtype.name
        this.prepareRequest('POST', endpoint, options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  deleteItem(itemtype, id, input, queryString) {
    return new Promise((resolve, reject) => {
      try {
        if (!itemtype) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (itemtype !== ITEMTYPE[itemtype.name]) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        let options = {}
        if (queryString) options = { queryString }
        let endpoint = itemtype.name
        if (!id) {
          if (!input) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid input' })
          options = { ...options, input }
        } else {
          if (!GlpiRestClient.isNumber(id)) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
          if (id < 0) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
          endpoint += `/${id}`
        }
        this.prepareRequest('DELETE', endpoint, options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  updateItem(itemtype, id, input) {
    return new Promise((resolve, reject) => {
      try {
        if (!itemtype) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        if (itemtype !== ITEMTYPE[itemtype.name]) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid itemtype' })
        let options = ''
        let endpoint = itemtype.name
        if (!id) {
          if (!input) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid input' })
          options = { input }
        } else {
          if (!GlpiRestClient.isNumber(id)) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
          if (id < 0) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
          endpoint += `/${id}`
        }
        this.prepareRequest('PUT', endpoint, options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data),
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  changeActiveProfile(id) {
    return new Promise((resolve, reject) => {
      try {
        if (!GlpiRestClient.isNumber(id)) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
        if (id < 0) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid id' })
        const options = { profiles_id: id }
        this.prepareRequest('POTS', 'changeActiveProfile', options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: { message: 'Active profile successfully changed' },
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  changeActiveEntities(entitiesId, isRecursive) {
    return new Promise((resolve, reject) => {
      try {
        let options = { activeEntities: {} }
        if (entitiesId) {
          if (!GlpiRestClient.isNumber(entitiesId)) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid entities_id' })
          if (entitiesId < 0) throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid entities_id' })
          options = { activeEntities: entitiesId }
        }
        if (isRecursive) {
          if (typeof (isRecursive) === 'boolean') {
            options = { activeEntities: { ...options.activeEntities, is_recursive: isRecursive } }
          } else {
            throw GlpiRestClient.requestException(400, { errorCode: '', errorMessage: 'Invalid is_recursive' })
          }
        }
        this.prepareRequest('POTS', 'changeActiveEntities', options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else if (data) {
            resolve({
              status: response.statusCode,
              data: { message: 'Active entities successfully changed' },
            })
          } else {
            resolve({
              status: response.statusCode,
              data: { message: 'Failed to change active entities' },
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  resetPasswordRequest(email) {
    return new Promise((resolve, reject) => {
      try {
        const options = { lostPassword: { email } }

        this.prepareRequest('PUT', 'lostPassword', options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data)[0],
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }

  passwordReset(email, passwordForgetToken, password) {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          lostPassword: {
            email,
            password_forget_token: passwordForgetToken,
            password,
          },
        }
        this.prepareRequest('PUT', 'lostPassword', options, (response, data) => {
          const error = GlpiRestClient.assessStatus(response.statusCode, data)
          if (error) {
            reject(error)
          } else {
            resolve({
              status: response.statusCode,
              data: JSON.parse(data)[0],
            })
          }
        }).end()
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = GlpiRestClient
