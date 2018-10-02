<template lang="pug">
.root
	div(v-if="!$store.Form.list.length") No items
	FormCard(v-for="item in $store.Form.list", :item="item", :key="item.id")
	form(style="{background: 'hsla(140,50%,50%,0.1)'}", @submit="submit")
		input(v-model="draft.title", placeholder="title")
		input(v-model="draft.value", placeholder="value")
		button Add
		span(:style="{opacity: 0.5}", v-if="isLoading") Loading...
		span(:style="{color: 'red'}", v-if="error") {{error}}
</template>
<script>
import FormCard from './FormCard'

export default {
	components: {FormCard},
	data: ()=> ({draft: {}, isLoading: false, error: null}),
	methods: {
		async add () {
			this.isLoading = true
			this.error = null
			await this.$store.Form.add(this.draft)
				.then(()=> {
					this.draft = {}
				})
				.catch(err=> this.error = err)
			this.isLoading = false
		},
		submit (e) {
			e.preventDefault()
			this.add()
		},
	},
}
</script>
