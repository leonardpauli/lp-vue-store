import Vue from 'vue'
import Store from '@leonardpauli/lp-vue-store'

import App from './Page'
import store from './store'

import './somewhere'

Vue.use(Store, {store}) // {store, key: '$store'}

/* global process */
const isProd = process && process.env.NODE_ENV === 'production'
if (!isProd) window.$ds = store // for debugging

new Vue({
	render: h=> h(App),
}).$mount('#app')
