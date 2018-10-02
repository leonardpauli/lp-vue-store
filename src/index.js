// index.js
// LeonardPauli/lp-vue-store
// Created by Leonard Pauli, 2 oct 2018
//
// simple global store using vue observables
// see ./example for usage

import Vue from 'vue'

const Store = {
	create: store=> new Vue(preparedStoreObj(store)),
	createModel: (store, staticStoreRaw)=> {

		const data = preparedStoreObj(store, {asModel: true})
		const VueModel = Vue.extend(data)
		VueModel.$with = propsData=> new VueModel({propsData})

		const staticStore = staticStoreRaw instanceof Vue
			? staticStoreRaw: Store.create(staticStoreRaw)
		VueModel.$static = staticStore
		Object.keys(staticStore).map(k=> k[0]=='$' || k[0]=='_' || VueModel[k]!==void 0 || !staticStore.hasOwnProperty(k)
			? null
			: VueModel[k] = staticStore[k])

		return VueModel
	},
	install: (Vue, options = {})=> {
		const {store, key = '$store'} = options
		const mstore = store instanceof Vue? store: Store.create(store)
		if (key) Vue.prototype[key] = mstore
		return mstore
	},
	computed: fn=> { fn.markedAsComputed = true; return fn },
	action: fn=> { fn.markedAsAction = true; return fn },
}


// export

export default Store


// helpers

const remakeArrowFns = obj=> Object.keys(obj).map(k=> ({
	[k] (...args) {
		const val = obj[k](this)
		return val instanceof Function? val(...args): val
	},
})).reduce((a, v)=> Object.assign(a, v), {})

const preparedStoreObj = (store = {}, {asModel = false} = {})=> {
	const rest = Object.assign({}, store)
	let name = null
	const computed = {}
	const methods = {}
	let data = asModel? ()=> ({}): rest
	Object.keys(rest).forEach(k=> {
		const v = rest[k]
		if (k=='$name') {
			name = v
			delete rest[k]
			return
		}
		if (k=='$data') {
			data = v
			delete rest[k]
			return
		}
		if (!v) return
		if (v.markedAsComputed) {
			computed[k] = v
			delete rest[k]
		} else if (v.markedAsAction) {
			methods[k] = v
			delete rest[k]
		}
	})
	return {
		name,
		data: data instanceof Function? data: ()=> data,
		props: asModel? rest: undefined,
		computed: remakeArrowFns(computed),
		methods: remakeArrowFns(methods),
	}
}
