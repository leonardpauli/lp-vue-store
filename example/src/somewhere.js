import store from './store'
const item = store.Form.$with({value: 5, title: 'age'})
store.Form.list.push(item)
