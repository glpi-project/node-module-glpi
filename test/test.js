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

const assert = require("chai").assert
const expect  = require("chai").expect

const GlpiRestClient = require('../lib/restclient')
const config = require('../config.json')
const itemtype = require('../lib/itemtype')

// var client = new GlpiRestClient('http://localhost/~dethegeek/glpi-flyvemdm-92/apirest.php')

describe('initSessionByCredentials()', function () {
  this.timeout(15000)
  it('successful login', async () => {
    const client = new GlpiRestClient(config.apirest)
    const result = await client.initSessionByCredentials(config.user.name, config.user.password)
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('initSessionByUserToken()', function () {
  this.timeout(15000)
  it('successful login', async () => {
    const client = new GlpiRestClient(config.apirest)
    const result = await client.initSessionByUserToken(config.user.userToken)
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('killSession()', function () {
  this.timeout(15000)
  it('log out successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getMyProfiles()', function () {
  this.timeout(15000)
  it('get my profiles successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getMyProfiles()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getActiveProfile()', function () {
  this.timeout(15000)
  it('get active profile successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getActiveProfile()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getMyEntities()', function () {
  this.timeout(15000)
  it('get my entities successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getMyEntities()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getActiveEntities()', function () {
  this.timeout(15000)
  it('get active entities successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getActiveEntities()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getFullSession()', function () {
  this.timeout(15000)
  it('get full session successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getFullSession()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getGlpiConfig()', function () {
  this.timeout(15000)
  it('get gpli configuration successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getGlpiConfig()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getAllItems()', function () {
  this.timeout(15000)
  it('get all items of a type successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getAllItems(itemtype.User)
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('getAnItem()', function () {
  this.timeout(15000)
  it('get an item of a type successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getAnItem(itemtype.User, 2)
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})


describe('getSubItems()', function () {
  this.timeout(15000)
  it('get sub items successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.getSubItems(itemtype.User, 40, itemtype.UserEmail)
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

let idItem = null

describe('addItem()', function () {
  this.timeout(15000)
  it('add item successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.addItem(itemtype.UserEmail ,{users_id: 40, email: 'example@email.com'})
    idItem = result.data.id
    await client.killSession()
    assert.deepInclude(result, { "status": 201 })
  })
})

describe('updateItem()', function () {
  this.timeout(15000)
  it('update item successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.updateItem(itemtype.UserEmail, null, {id: idItem, users_id: 40, email: 'example2@email.com'})
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('deleteItem()', function () {
  this.timeout(15000)
  it('delete item successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.deleteItem(itemtype.UserEmail, null, {id: idItem, users_id: 40, email: 'example2@email.com'})
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('changeActiveProfile()', function () {
  this.timeout(15000)
  it('change active profile successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const MyProfiles = await client.getMyProfiles()
    const result = await client.changeActiveProfile(MyProfiles.data[0].id)
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('changeActiveEntities()', function () {
  this.timeout(15000)
  it('change active entities successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    await client.initSessionByCredentials(config.user.name, config.user.password)
    const result = await client.changeActiveEntities()
    await client.killSession()
    assert.deepInclude(result, { "status": 200 })
  })
})

describe('resetPasswordRequest()', function () {
  this.timeout(15000)
  it('reset password request successfully', async () => {
    const client = new GlpiRestClient(config.apirest)
    const result = await client.resetPasswordRequest(config.user.email)
    assert.deepInclude(result, { "status": 200 })
  })
})