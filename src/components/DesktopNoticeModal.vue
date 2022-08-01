<template>
	<div>
		<Dialog
			:modal="true"
			position="center"
			:closeOnEscape="false"
			:closable="false"
			:draggable="false"
			header="We only support desktop in this section"
			v-model:visible="displayResponsive"
			:style="{ width: '60vw', maxHight: '5rem' }"
			:breakpoints="{ '960px': '75vw' }"
			class="tw-fixed tw-top-20vh md:tw-top-50vh tw-max-h-96"
		>
			<p>
				Currently we are not supporting the application for small devices please use desktop for
				best experience.
			</p>
			<template #footer>
				<div class="tw-w-full tw-flex tw-justify-center">
					<Button label="Ok" icon="pi pi-check" @click="closeResponsive" autofocus />
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
	name: 'DesktopNotice',
	props: {
		show: {
			type: Boolean,
			required: true,
		},
	},
	setup(props) {
		const store = useStore();
		const router = useRouter();
		const displayResponsive = ref(false);

		const openResponsive = () => {
			document.documentElement.style.overflow = 'hidden';
			store.commit('SET_BLOCKUI_VALUE', true);
			displayResponsive.value = true;
		};
		const closeResponsive = () => {
			displayResponsive.value = false;
			store.commit('SET_BLOCKUI_VALUE', false);
			document.documentElement.style.overflow = 'auto';
		};
		watch(
			() => props.show,
			() => {
				if (props.show) openResponsive();
			},
			{ immediate: true }
		);

		return {
			openResponsive,
			closeResponsive,
			displayResponsive,
			router,
		};
	},
};
</script>

<style lang="scss" scoped></style>
