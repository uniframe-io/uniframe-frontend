<template>
	<div v-if="batchTaskDetail.ext_info" class="tw-relative main-container">
		<Accordion>
			<AccordionTab>
				<template #header>
					<CardHeader
						title="Compute options"
						class="tw-w-full"
						showHelp
						helpReference="computation_setup"
					/>
				</template>
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-5 tw-font-medium tw-p-0">
					<div class="detail-search-option-items">
						<p>Computation resource</p>
						<p class="tw-text-sm tw-w-auto tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.computation_resource.computation_config
									.resource_tshirt_size
							}}
							(
							{{
								store.state.nmTask.cpuConfig[
									batchTaskDetail.ext_info.computation_resource.computation_config
										.resource_tshirt_size
								]?.nr_cpu
							}}
							CPU and
							{{
								store.state.nmTask.cpuConfig[
									batchTaskDetail.ext_info.computation_resource.computation_config
										.resource_tshirt_size
								]?.mem_size
							}}
							MB memory)
						</p>
					</div>
					<div
						class="
							tw-flex tw-flex-col tw-items-start tw-font-medium tw-gap-5 tw-w-full tw-font-medium
						"
					>
						<div class="detail-search-option-items">
							<p>Task maximum running time</p>
							<p class="tw-text-sm tw-font-medium tw-w-5/12">
								{{
									batchTaskDetail.ext_info.running_parameter.TTL_enable
										? moment.duration(batchTaskDetail.ext_info.running_parameter.TTL).humanize()
										: 'TTL is disabled'
								}}
							</p>
						</div>
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { useStore } from 'vuex';
import { computed } from 'vue';
import moment from 'moment';

export default {
	name: 'DetailComputeOptions',
	components: {
		Accordion,
		AccordionTab,
	},
	setup() {
		const store = useStore();

		return {
			moment,
			store,
			batchTaskDetail: computed(() => store.state.nmTask.batchTaskDetail),
		};
	},
};
</script>

<style lang="scss" scoped></style>
