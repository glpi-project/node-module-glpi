---
layout: post
wiki: true
published: true
title: Code Examples with Promises
permalink: wiki/examples-promises
description: Code Examples using Promises
---
## Usage

Here we present you the code examples of the library per API Method, we created these examples using functions with promises as it is easier to detect where occurred an error in the execution of your code.

* [initSession()](#iS)
* [killSession()](#kS)
* [getMyProfiles()](#gMP)
* [getActiveProfile()](#gAP)
* [changeActiveProfile()](#cAP)
* [getMyEntities()](#gME)
* [getActiveEntities()](#gAE)
* [changeActiveEntities()](#cAE)
* [getFullSession()](#gFS)
* [getGlpiConfig()](#gGC)
* [getItem()](#gI)
* [getAllItems()](#gAI)
* [getSubItems()](#gSI)
* [addItems()](#aI)
* [updateItems()](#uI)
* [deleteItems()](#dI)
* [recoveryPassword()](#ryP)
* [resetPassword()](#rP)

### Examples

* <a name="iS"></a> initSession(): there are two ways to init session using the Node API CLient

    * initSessionByCredentials: this way you require the user and password to access GLPI, the appToken is optional

    ```javascript
    const client = new GlpiRestClient(config.apirest)

    client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
        .then((res) => {
            console.log(res)
            client.killSession()
                .catch((err2) => {
                    console.log(err2)
                })
        })
        .catch((err) => {
            console.log(err)
        })
    ```

    * initSessionbyUserToken: in this case you only require the user token, once again the app Token is optional

    ```javascript
    const client = new GlpiRestClient(config.apirest)

    client.initSessionByUserToken(config.user.userToken, config.appToken)
        .then((res) => {
            console.log(res)
            client.killSession()
                .catch((err2) => {
                    console.log(err2)
                })
        })
        .catch((err) => {
            console.log(err)
        })
    ```

* <a name="kS"></a> killSession(): close the user session

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.killSession()
            .then((res2) => {
                console.log(res2)
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```
* <a name="gMP"></a> getMyProfiles(): return the profiles associated to the user

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getMyProfiles()
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="gAP"></a> getActiveProfile(): return the current active profile 

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getActiveProfile()
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="cAP"></a> changeActiveProfile(): change active profile to one of the profiles obtained with 'getMyProfiles()'

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getMyProfiles()
            .then((res2) => {
                client.changeActiveProfile(res2.data[0].id)
                    .then((res3) => {
                        console.log(res3)
                        client.killSession()
                            .catch((err4) => {
                                console.log(err4)
                            })
                    })
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="gME"></a> getMyEntities(): return all the possible entities of the current logged user

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getMyEntities()
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="gAE"></a> getActiveEntities(): return active entities of current logged user

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getActiveEntities()
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="cAE"></a> changeActiveEntities(): change active entity to one of the entities obtained with 'getMyEntities'

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        console.log(res)
        client.changeActiveEntities(null, true)
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="gFS"></a> getFullSession(): return the current php $_SESSION

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getFullSession()
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })

```

* <a name="gGC"></a> getGlpiConfig(): return the current $CFG_GLPI

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getGlpiConfig()
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="gI"></a> getItem(): return the instance fields of itemtype identified by id

```javascript
const client = new GlpiRestClient(config.apirest)

let query = new GetItemQuery()
query.with_networkports = true
query.with_infocoms = true
query.with_contracts = true
query.with_documents = true

client.initSessionByCredentials(config.user.name, config.user.password)
    .then((res) => {
        client.getItem(itemtype.User, 40, query.createQueryObject())
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="gAI"></a> getAllItems(): return a collection of rows of the itemtype

```javascript
onst client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getAllItems(itemtype.UserEmail)
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })

```

* <a name="gSI"></a> getSubItems(): return a collection of rows of the sub_itemtype for the identified item

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.getSubItems(itemtype.User, 37, itemtype.UserEmail)
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="aI"></a> addItems(): add an object (or multiple objects) into GLPI

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.addItem(itemtype.UserEmail, {users_id: 37, email: 'example@email.com'})
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="uI"></a> updateItems(): update an object (or multiple objects) existing in GLPI

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.addItem(itemtype.UserEmail, {users_id: 37, email: 'example@email.com'})
            .then((res2) => {
                console.log(res2)
                client.updateItem(itemtype.UserEmail, null, {id: res2.data.id, users_id: 37, email: 'example2@email.com'})
                    .then((res3) => {
                        console.log(res3)
                        client.killSession()
                            .catch((err4) => {
                                console.log(err4)
                            })
                    })
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="dI"></a> deleteItems(): delete an object existing in GLPI

```javascript
const client = new GlpiRestClient(config.apirest)

client.initSessionByCredentials(config.user.name, config.user.password, config.appToken)
    .then((res) => {
        client.deleteItem(itemtype.UserEmail, null, {id: 162, users_id: 37, email: 'example@email.com'})
            .then((res2) => {
                console.log(res2)
                client.killSession()
                    .catch((err3) => {
                        console.log(err3)
                    })
            })
            .catch((err2) => {
                console.log(err2)
            })
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="ryP"></a> recoveryPassword(): sends a notification to the user to reset his password through email

```javascript
const client = new GlpiRestClient(config.apirest)

client.recoveryPassword(config.user.email)
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
```

* <a name="rP"></a> resetPassword(): sends a notification to the user to reset his password

```javascript
const client = new GlpiRestClient(config.apirest)

client.resetPassword(config.user.email, 'e446c1ff23d7ba097cc7104edaee5139ddf610be', 12345678)
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
```

For more information about the functions check our [Code Documentation](https://glpi-project.github.io/node-module-glpi/docs/) section
