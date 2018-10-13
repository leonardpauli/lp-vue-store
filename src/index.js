// index.js
// LeonardPauli/lp-vue-store
// Created by Leonard Pauli, 2 oct 2018
//
// simple global store using vue observables
// see ./example for usage

import Vue from 'vue'

const Store = {
	create: (instanceRaw, staticRaw = {}, data = null)=> {
		const hasData = data!==null
		const name = instanceRaw.$name || 'VueModel'

		const instanceExists = instanceRaw instanceof Vue
		const instanceOpt = instanceExists? null: preparedStoreObj(instanceRaw, {asModel: true})
		const VueModel = instanceExists? instanceRaw: Vue.extend(instanceOpt)

		const staticExists = staticRaw instanceof Vue
		const staticOpt = staticExists? null: preparedStoreObj(staticRaw)
		const staticOnInstance = hasData && !staticExists
		const staticStore = staticOnInstance? null: staticExists? staticRaw: new Vue(staticOpt)

		VueModel.$with = propsData=> new VueModel({
			...staticOnInstance? staticOpt: {}, propsData,
		})

		if (!staticOnInstance) {
			assignStaticFieldsToModel({staticStore, VueModel})
			VueModel.$static = staticStore
			VueModel.$static.$model = VueModel
			VueModel.$static.toString = ()=> name+'.Static'
		}

		VueModel.$model = VueModel
		VueModel.prototype.$model = VueModel
		VueModel.toString = ()=> name
		VueModel.prototype.toString = function toString () {
			return ((this.$options && this.$options.name) || 'VueModel') + '()'
		}

		return hasData? VueModel.$with(data): VueModel
	},
	install: (Vue, options = {})=> {
		const {store, key = '$store'} = options
		const mstore = store instanceof Vue? store: Store.create({}, store, {})
		if (key) Vue.prototype[key] = mstore
		return mstore
	},
	computed: (fn, setter=null)=> { fn.markedAsComputed = true; fn.setter = setter; return fn },
	action: fn=> { fn.markedAsAction = true; return fn },
}


// export

export default Store


// helpers

const assignStaticFieldsToModel = ({staticStore, VueModel})=> {
	Object.keys(staticStore).forEach(k=> {
		const isOwn = k[0]!='$' && k[0]!='_' && staticStore.hasOwnProperty(k)
		if (!isOwn || VueModel[k]!==void 0) return
		if (!(staticStore[k] instanceof Function)) {
			Object.defineProperty(VueModel, k, {
				get: ()=> staticStore[k],
				set: v=> staticStore[k] = v,
			})
			return
		}
		VueModel[k] = staticStore[k]
	})
}

const remakeArrowFnComputed = (k, fn)=> ({
	[k] () {
		const val = fn(this)
		return val
	},
})
const remakeArrowFn = (k, fn)=> ({
	[k] (...args) {
		const val = fn(this)
		return val instanceof Function? val(...args): val
	},
})
const remakeArrowFns = obj=> Object.keys(obj)
	.map(k=> remakeArrowFn(k, obj[k]))
	.reduce((a, v)=> Object.assign(a, v), {})

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
			computed[k] = {
				get: remakeArrowFnComputed('fn', v).fn,
				set: v.setter? remakeArrowFn('fn', v.setter).fn: void 0,
			}
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
		computed,
		methods: remakeArrowFns(methods),
	}
}
