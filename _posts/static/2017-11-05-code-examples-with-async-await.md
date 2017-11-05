---
layout: post
wiki: true
published: true
title: Code Examples with Async - Await
permalink: wiki/examples-async
description: Code Examples using Async - Await functions
---
## Usage

Here we present you the code examples of the library per API Method, as we do our best to provide the most up to date technologies, we created the examples using Async - Await functions as it is the latest form to implement the asynchronous methods with Node, as it is you may not be able to use it properly unless your Node.js environment is up to date.

* [initSession()](#AAiS)
* [killSession()](#AAkS)
* [getMyProfiles()](#AAgMP)
* [getActiveProfile()](#AAgAP)
* [changeActiveProfile()](#AAcAP)
* [getMyEntities()](#AAgME)
* [getActiveEntities()](#AAgAE)
* [changeActiveEntities()](#AAcAE)
* [getFullSession()](#AAgFS)
* [getGlpiConfig()](#AAgGC)
* [getItem()](#AAgI)
* [getAllItems()](#AAgAI)
* [getSubItems()](#AAgSI)
* [addItems()](#AAaI)
* [updateItems()](#AAuI)
* [deleteItems()](#AAdI)
* [recoveryPassword()](#AAryP)
* [resetPassword()](#AArP)

### Examples

* <a name="AAiS"></a> initSession(): there are two ways to init session using the API CLient.

     * initSessionByCredentials: this way you require the user and password to access GLPI, the appToken is optional

    ```javascript
    (async () => {
        try {
            const client = new GlpiRestClient(config.apirest)
            const Session = await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
            console.log(Session)
            await client.killSession()
        } catch (err) {
            console.log(err)
        }
    })()
    ```

    * initSessionbyUserToken: in this case you only require the user token, once again the app Token is optional

    ```javascript
    (async () => {
        try {
            const client = new GlpiRestClient(config.apirest)
            const Session = await client.initSessionByUserToken(config.user.userToken, config.appToken)
            console.log(Session)
            await client.killSession()
        } catch (err) {
            console.log(err)
        }
    })()
    ```

* <a name="AAkS"></a> killSession(): close the user session

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        // await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken);
        const Session = await client.killSession()
        console.log(Session)
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgMP"></a> getMyProfiles(): return the profiles associated to the user

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const MyProfiles = await client.getMyProfiles()
        console.log(MyProfiles)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgAP"></a> getActiveProfile(): return the current active profile

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const ActiveProfile = await client.getActiveProfile()
        console.log(ActiveProfile)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAcAP"></a> changeActiveProfile(): change active profile to one of the profiles obtained with 'getMyProfiles()'

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const MyProfiles = await client.getMyProfiles()
        const ChangeActiveProfile = await client.changeActiveProfile(MyProfiles.data[0].id)
        console.log(ChangeActiveProfile)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgME"></a> getMyEntities(): return all the possible entities of the current logged user

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const MyEntities = await client.getMyEntities()
        console.log(MyEntities)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgAE"></a> getActiveEntities(): return active entities of current logged user

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const ActiveEntities = await client.getActiveEntities()
        console.log(ActiveEntities)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAcAE"></a> changeActiveEntities(): change active entity to one of the entities obtained with 'getMyEntities'

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const ChangeActiveEntities = await client.changeActiveEntities(null, true)
        console.log(ChangeActiveEntities)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgFS"></a> getFullSession(): return the current php $_SESSION

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const FullSession = await client.getFullSession()
        console.log(FullSession)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgGC"></a> getGlpiConfig(): return the current $CFG_GLPI

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const GlpiConfig = await client.getGlpiConfig()
        console.log(GlpiConfig)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgI"></a> getItem(): return the instance fields of itemtype identified by id

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        let query = new GetItemQuery()
        query.with_networkports = true
        query.with_infocoms = true
        query.with_contracts = true
        query.with_documents = true
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const Item = await client.getItem(itemtype.User, 40, query.createQueryObject())
        console.log(Item)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgAI"></a> getAllItems(): return a collection of rows of the itemtype

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const AllItems = await client.getAllItems(itemtype.UserEmail)
        console.log(AllItems)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAgSI"></a> getSubItems(): return a collection of rows of the sub_itemtype for the identified item

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const SubItems = await client.getSubItems(itemtype.User, 37, itemtype.UserEmail)
        console.log(SubItems)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAaI"></a> addItems(): add an object (or multiple objects) into GLPI

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const NewItem = await client.addItems(itemtype.UserEmail, [{users_id: 40, email: 'example@email.com'}, {users_id: 40, email: 'example2@email.com'}])
        console.log(NewItem)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAuI"></a> updateItems(): update an object (or multiple objects) existing in GLPI

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const Item = await client.updateItems(itemtype.UserEmail, null, [{id: 169, email: 'exam@email.com'}, {id: 170, email: 'exam2@email.com'}])
        console.log(Item)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAdI"></a> deleteItems(): delete an object existing in GLPI

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        await client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        const ItemDelete = await client.deleteItems(itemtype.UserEmail, null, [{id: 167}, {id: 168}])
        console.log(ItemDelete)
        await client.killSession()
    } catch (err) {
        console.log(err)
    }
})()
```

* <a name="AAryP"></a> recoveryPassword(): sends a notification to the user to reset his password through email

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        const recoveryPassword = await client.recoveryPassword(config.user.email)
        console.log(recoveryPassword)
    } catch (err) {
        console.log(err)
    }
})()
```
* <a name="AArP"></a> resetPassword(): sends a notification to the user to reset his password

```javascript
(async () => {
    try {
        const client = new GlpiRestClient(config.apirest)
        const resetPassword = await client.resetPassword(config.user.email, 'yourToken', 'yourNewPassword')
        console.log(resetPassword)
    } catch (err) {
        console.log(err)
    }
})()
```

For more information about the functions check our [Code Documentation](https://glpi-project.github.io/node-module-glpi/docs/) section
