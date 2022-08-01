<template>
	<div class="tw-w-4/5 tw-m-auto unset" v-html="termsAndConditionsMarkDown"></div>
</template>

<script>
import marked from 'marked';
import { computed } from 'vue';
import termsAndConditionsMD from '@/assets/terms_and_conditions';
export default {
	name: 'TermsAndConditions',
	setup() {
		const termsAndConditionsMarkDown = computed(() => marked(termsAndConditionsMD.toString()));
		return {
			termsAndConditionsMarkDown,
		};
	},
};
</script>

<style lang="scss">
@import '../style/tailwind/unset';
</style>
