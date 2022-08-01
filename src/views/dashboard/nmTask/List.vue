<template>
	<div class="tw-w-full tw-p-4 tw-flex tw-flex-col">
		<div>
			<div class="tw-h-auto">
				<CardHeader
					:title="
						store.state.nmTask.taskState.isBatchTask ? 'Batch tasks List' : 'Realtime tasks List'
					"
					showHelp
					showTaskButtons
					:helpReference="
						store.state.nmTask.taskState.isBatchTask
							? 'batch_matching_task_list'
							: 'rt_matching_task_list'
					"
					@updateTaskList="updateTaskList"
				/>
			</div>
			<Notification :loc="'getAllTasks' || 'deleteTask'" />
			<TaskTable ref="taskTable" class="tw-shadow-lg tw-border tw-border-gray tw-w-full" />
		</div>
	</div>
</template>

<script>
import TaskTable from '@/components/nmTask/TaskTable.vue';
import { useStore } from 'vuex';
import { ref } from 'vue';
// import _ from 'lodash';
export default {
	name: 'BatchTaskList',
	components: {
		TaskTable,
	},
	setup() {
		const store = useStore();
		const taskTable = ref();
		async function updateTaskList() {
			await taskTable.value.getTasks();
		}
		return {
			store,
			taskTable,
			updateTaskList,
		};
	},
};
</script>
