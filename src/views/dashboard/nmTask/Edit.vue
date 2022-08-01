<template>
	<div class="tw-w-full tw-p-3 tw-flex tw-flex-col">
		<div v-show="!isNotification" class="tw-border-2 tw-border-gray-400 tw-rounded">
			<div class="tw-relative tw-h-auto">
				<CardHeader title="Edit Task" />
			</div>
			<div class="tw-w-full tw-min-h-screen tw-p-10 main-container">
				<BatchTaskBasicInfo :nameValue="name" :descriptionValue="description" />
			</div>
		</div>
		<Notification loc="editDataSet" goTo="DataSetList" @isNotification="notificationStatus" />
	</div>
</template>

<script>
import BatchTaskBasicInfo from '@/components/nmTask/BasicInfo.vue';
import Notification from '@/components/Notification.vue';
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';
//

export default {
	name: 'CreateDataSet',
	props: ['id'],
	components: {
		Notification,
		BatchTaskBasicInfo,
	},

	setup(props) {
		const store = useStore();
		const isNotification = ref(false);
		const name = computed({
			get: () => store.state.nmTask.batchTaskDetail.name,
			set: (value) => store.commit('nmTask/SET_TASK_DETAIL', { name: value }),
		});
		const description = computed({
			get: () => store.state.nmTask.batchTaskDetail.description,
			set: (value) => store.commit('nmTask/SET_TASK_DETAIL', { description: value }),
		});
		// I am creating this function to call for edit data if they are not present
		onMounted(async () => {
			if (props.id && !store.state.nmTask.taskSelected.name) {
				await store.dispatch('nmTask/getTask', props.id);
			}
		});
		function notificationStatus([status]) {
			isNotification.value = status;
		}
		return {
			notificationStatus,
			isNotification,
			name,
			description,
		};
	},
};
</script>
