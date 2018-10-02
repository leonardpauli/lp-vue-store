<template lang="pug">
div
	| #[b {{item.title}}:] {{item.value}} 
	span(:style="{opacity: 0.3}", @click="item.add(5)") + 
	span(:style="{opacity: 0.3}", @click="item.remove") x
// div(@click="item.double") {{item.short}}
</template>
<script>
import Form from './store/Form'
export default {
	props: {
		item: Form,
	},
}
</script>
