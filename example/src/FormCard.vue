<template lang="pug">
div(@click="item.add(5)") #[b {{item.title}}:] {{item.value}}
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
