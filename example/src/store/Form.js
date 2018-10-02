// import {Store} from '@leonardpauli/lp-vue-lib'
import Store from '@leonardpauli/lp-vue-store'
const {action: a, computed: c} = Store

const Form = Store.createModel({
	$name: 'Form',
	value: Number,
	title: String,
	description: Store.computed(form=> form.title+': '+form.value),
	short: c(({title, value})=> `${title}: ${value}`),
	double: a(s=> s.value*=2),
	add: a(s=> increment=> s.value += increment),
	remove: a(s=> Form.remove(s)),
	id: c(s=> s.title+s.value),
}, {
	// static
	list: [],
	add: a(s=> props=> new Promise((res, rej)=> setTimeout(()=> {
		const propsFixed = {...props}
		propsFixed.value = parseFloat(propsFixed.value)

		const err = isNaN(propsFixed.value)? 'value has to be number': null
		if (err) return rej(err)
		
		s.list.push(Form.$with(propsFixed))

		return res()
	}, 500))),
	remove: a(s=> x=> {
		const idx = s.list.indexOf(x)
		if (idx==-1) return false
		s.list.splice(idx, 1)
		return true
	}),
})

export default Form
