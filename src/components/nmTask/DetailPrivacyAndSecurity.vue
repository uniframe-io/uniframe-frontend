<template>
	<div v-if="batchTaskDetail.ext_info" class="tw-relative main-container">
		<Accordion>
			<AccordionTab>
				<template #header>
					<CardHeader title="Privacy and Security" class="tw-w-full" />
				</template>

				<div
					class="
						tw-flex tw-flex-col tw-items-start tw-font-medium tw-gap-5 tw-w-full tw-font-medium
					"
				>
					<div class="detail-search-option-items">
						<p>Task maximum running time</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								!moment.duration(batchTaskDetail.ext_info.running_parameter.TTL, 'seconds').days()
									? 'Disabled'
									: moment
											.duration(batchTaskDetail.ext_info.running_parameter.TTL, 'seconds')
											.days() + ' day(s)'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Log retention time</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								!moment
									.duration(batchTaskDetail.ext_info.abcxyz_privacy.log_retention_time, 'seconds')
									.days()
									? 'Disabled'
									: moment
											.duration(
												batchTaskDetail.ext_info.abcxyz_privacy.log_retention_time,
												'seconds'
											)
											.days() + ' day(s)'
							}}
						</p>
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import moment from 'moment';

import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
	name: 'DetailSearchOptions',
	components: {
		Accordion,
		AccordionTab,
	},
	setup() {
		const store = useStore();

		return {
			moment,
			batchTaskDetail: computed(() => store.state.nmTask.batchTaskDetail),
		};
	},
};
</script>

<style lang="scss" scoped></style>
