<template>
	<div class="tw-flex tw-flex-col tw-gap-5 tw-w-full tw-max-w-5xl">
		<div class="privacy tw-flex tw-flex-col tw-gap-8 tw-w-full">
			<div class="tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">
						Task maximum running time <small class="tw-font-normal">(between 0-60 day )</small>
					</p>
					<HelpGuide icon />
				</div>
				<InputNumber v-model="runningTtl" mode="decimal" :min="0" :max="60" />
			</div>
			<div class="tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">
						Log retention time <small class="tw-font-normal">(between 10-120 day )</small>
					</p>
					<HelpGuide icon />
				</div>
				<InputNumber class="w" v-model="logTtl" mode="decimal" :min="10" :max="120" />
			</div>
		</div>
	</div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import InputNumber from 'primevue/inputnumber';
import moment from 'moment';

export default {
	name: 'SetupAdvancePrivacy',
	components: { InputNumber },
	setup() {
		const store = useStore();
		const runningTtl = computed({
			get: () =>
				moment
					.duration(store.state.nmTask.createdBatchTaskData.ext_info.running_parameter.TTL)
					.as('days'),
			set: (value) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						running_parameter: {
							TTL_enable: !!value,
							TTL: moment.duration(value, 'd').toISOString(),
						},
					},
				});
			},
		});
		const logTtl = computed({
			get: () =>
				moment
					.duration(
						store.state.nmTask.createdBatchTaskData.ext_info.abcxyz_privacy.log_retention_time
					)
					.as('days'),
			set: (value) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						abcxyz_privacy: {
							...store.state.nmTask.createdBatchTaskData.ext_info.abcxyz_privacy,
							log_retention_time: moment.duration(value, 'd').toISOString(),
						},
					},
				});
			},
		});

		return {
			runningTtl,
			logTtl,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
.privacy .p-inputnumber .p-inputtext {
	max-width: 5rem;
	color: $primaryColor;
}
</style>
