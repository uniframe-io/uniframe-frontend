<template>
	<div class="">
		<div class="tw-w-full tw-flex-col tw-flex tw-gap-10 tw-max-w-5xl">
			<div class="tw-w-full tw-justify-between tw-max-w-5xl tw-flex tw-gap-10 tw-items-center">
				<div>
					<p class="tw-font-medium">Select computation option</p>
					<HelpGuide helpReference="computation_setup_resource" icon />
				</div>
				<Dropdown
					v-model="selectedComputationConfig"
					:options="computationConfig"
					optionLabel="name"
					optionDisabled="optionDisabled"
					placeholder="Select One"
					class="computation-cpu tw-w-64 primary-drop-down"
					emptyMessage="Select One"
				/>
			</div>
			<div class="privacy tw-flex tw-flex-col tw-gap-8 tw-w-full">
				<div class="tw-flex tw-items-center tw-justify-between tw-gap-10">
					<div>
						<p class="tw-font-medium">
							Task maximum running time <small class="tw-font-normal">(between 0-60 day )</small>
						</p>
						<HelpGuide
							:helpReference="
								isBatchTask ? 'computation_setup_ttl_batch' : 'computation_setup_ttl_rt'
							"
							icon
						/>
					</div>
					<ThreeInputs
						:disabled="!uiPermission.change_task_ttl"
						@updateInput="updateInput"
						:ttl="ttl"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import InputNumber from 'primevue/inputnumber';
import ThreeInputs from './ComputationOptionsThreeInputs.vue';

export default {
	name: 'ComputationOptions',
	components: { ThreeInputs },
	setup() {
		const store = useStore();
		const cpuConfig = computed(() => store.state.nmTask.cpuConfig);
		const uiPermission = computed(() => store.state.nmTask.uiPermission);
		const isBatchTask = computed(() => store.state.nmTask.taskState.isBatchTask);
		//TODO this needs to be dynamic later
		const computationConfig = ref([
			{
				name: `Small (${cpuConfig.value.Small?.nr_cpu} CPU, ${cpuConfig.value.Small?.mem_size} MB memory)`,
				value: 'Small',
				optionDisabled: !uiPermission.value.compute_resource_permission.Small,
			},
			{
				name: `Medium (${cpuConfig.value.Medium?.nr_cpu} CPU, ${cpuConfig.value.Medium?.mem_size} MB memory)`,
				value: 'Medium',
				optionDisabled: !uiPermission.value.compute_resource_permission.Medium,
			},
			{
				name: `Large (${cpuConfig.value.Large?.nr_cpu} CPU, ${cpuConfig.value.Large?.mem_size} MB memory)`,
				value: 'Large',
				optionDisabled: !uiPermission.value.compute_resource_permission.Large,
			},
		]);

		//Here I am binding these values with store main object
		const computationType = ref([
			{ name: 'multi-thread' },
			{ name: 'single-tread', optionDisabled: true },
		]);
		const selectedComputationType = computed({
			//this logic is for adapting to primevue object in order to  show proper view
			get: () => {
				return {
					name: store.state.nmTask.createdBatchTaskData.ext_info.computation_resource
						.computation_type,
				};
			},

			set: (selectedType) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						computation_resource: {
							...store.state.nmTask.createdBatchTaskData.ext_info.computation_resource,
							computation_type: selectedType.name,
						},
					},
				});
			},
		});
		const selectedComputationConfig = computed({
			//this logic is for adapting to primevue object in order to
			// show proper view
			get: () =>
				computationConfig.value.filter(
					(item) =>
						item.value ===
							store.state.nmTask.createdBatchTaskData.ext_info.computation_resource
								.computation_config.resource_tshirt_size && item.optionDisabled !== true
				)[0],
			set: (selectedOption) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						computation_resource: {
							...store.state.nmTask.createdBatchTaskData.ext_info.computation_resource,
							computation_config: {
								resource_tshirt_size: selectedOption.value,
							},
						},
					},
				});
			},
		});

		const ttl = computed({
			//this logic is converting ISO duration to object
			get: () => {
				const storeTTL = store.state.nmTask.createdBatchTaskData.ext_info.running_parameter.TTL;
				const storeTTLArr = storeTTL.split('');
				const dayArr = storeTTLArr.slice(storeTTLArr.indexOf('P') + 1, storeTTLArr.indexOf('D'));
				const hourArr = storeTTLArr.slice(storeTTLArr.indexOf('T') + 1, storeTTLArr.indexOf('H'));
				const minuteArr = storeTTLArr.slice(storeTTLArr.indexOf('H') + 1, storeTTLArr.indexOf('M'));
				return {
					day: parseInt(dayArr.reduce((str, item) => str + item)),
					hour: parseInt(hourArr.reduce((str, item) => str + item)),
					minute: parseInt(minuteArr.reduce((str, item) => str + item)),
				};
			},
			// because only one value I could pass here I had to create a new component for three inputs
			set: (value) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						running_parameter: {
							TTL_enable: true, // need to discuss if we need this or not?
							TTL: `P${value.day}DT${value.hour}H${value.minute}M0S`, //  P0DT0H15M0S
						},
					},
				});
			},
		});

		function updateInput(newInputValue) {
			ttl.value = newInputValue;
		}

		return {
			isBatchTask,
			uiPermission,
			updateInput,
			ttl,
			InputNumber,
			selectedComputationType,
			computationConfig,
			computationType,
			selectedComputationConfig,
		};
	},
};
</script>
