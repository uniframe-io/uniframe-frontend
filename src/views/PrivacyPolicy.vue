<template>
	<div class="tw-w-4/5 tw-m-auto unset" v-html="PrivacyPolicy"></div>
</template>

<script>
import marked from 'marked';
import { computed } from 'vue';
import privacyPolicyMD from '@/assets/privacy-policy';
export default {
	name: 'PrivacyPolicy',

	setup() {
		const PrivacyPolicy = computed(() => marked(privacyPolicyMD.toString()));
		return {
			PrivacyPolicy,
		};
	},
};
</script>

<style lang="scss">
@import '../style/tailwind/unset';
</style>
