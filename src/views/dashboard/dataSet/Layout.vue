<template>
	<router-view :key="route.path"></router-view>
</template>

<script>
import { useRoute } from 'vue-router';
export default {
	name: 'DataSetLayout',
	setup() {
		const route = useRoute();

		return {
			route,
		};
	},
};
</script>
