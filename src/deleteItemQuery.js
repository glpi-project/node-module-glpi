module.exports = class deleteItemQuery {
    constructor () {
        this._QueryObject = {
            id: null,
            force_purge: null,
            history: null
        }
    }

    get id () {
        return this._QueryObject.id
    }
    get force_purge () {
        return this._QueryObject.force_purge
    }
    get history () {
        return this._QueryObject.history
    }

    set id (id) {
        this._QueryObject.id = id
    }
    set force_purge (force_purge) {
        this._QueryObject.force_purge = force_purge
    }
    set history (history) {
        this._QueryObject.history = history
    }

    createQueryObject () {
        let queryObject = {}
        for (let obj in this._QueryObject) {
            if (this._QueryObject[obj]) {
                queryObject = { ...queryObject, [obj]: this._QueryObject[obj] }
            }
        }
        return queryObject
    }
}
