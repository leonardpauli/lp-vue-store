import Store from '@leonardpauli/lp-vue-store'
import Form from './Form'

const defaultData = {
	message: 'hello',
}

const store = Store.create({
	$name: 'store',
	message: String,
}, {
	Form,
}, defaultData)

export default store
