module.exports = class getAllItemsQuery {
    constructor () {
        this._QueryObject = {
            expand_dropdowns: null,
            get_hateoas: null,
            only_id: null,
            range: null,
            sort: null,
            order: null,
            searchText: null,
            is_deleted: null
        }
    }

    get expand_dropdowns () {
        return this._QueryObject.expand_dropdowns
    }
    get get_hateoas () {
        return this._QueryObject.get_hateoas
    }
    get only_id () {
        return this._QueryObject.only_id
    }
    get range () {
        return this._QueryObject.range
    }
    get sort () {
        return this._QueryObject.sort
    }
    get order () {
        return this._QueryObject.order
    }
    get searchText () {
        return this._QueryObject.searchText
    }
    get is_deleted () {
        return this._QueryObject.is_deleted
    }

    set expand_dropdowns (expand_dropdowns) {
        this._QueryObject.expand_dropdowns = expand_dropdowns
    }
    set get_hateoas (get_hateoas) {
        this._QueryObject.get_hateoas = get_hateoas
    }
    set only_id (only_id) {
        this._QueryObject.only_id = only_id
    }
    set range (range) {
        this._QueryObject.range = range
    }
    set sort (sort) {
        this._QueryObject.sort = sort
    }
    set order (order) {
        this._QueryObject.order = order
    }
    set searchText (searchText) {
        this._QueryObject.searchText = searchText
    }
    set is_deleted (is_deleted) {
        this._QueryObject.is_deleted = is_deleted
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
