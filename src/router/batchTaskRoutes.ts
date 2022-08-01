export default {
	path: 'nm-batch-task',
	name: 'BatchTaskLayout',
	component: () =>
		import(/* webpackChunkName: "datasets" */ '../views/dashboard/nmTask/Layout.vue'),
	children: [
		{
			path: '',
			name: 'BatchTaskList',
			component: () => import(/* webpackChunkName: "List" */ '@/views/dashboard/nmTask/List.vue'),
		},
		{
			path: 'create',
			name: 'BatchTaskCreate',
			component: () => import(/* webpackChunkName: "List" */ '@/views/dashboard/nmTask/Create.vue'),
		},
		{
			path: ':id',
			name: 'GetDetailBatchTask',
			props: true,
			component: () =>
				import(/* webpackChunkName: "create" */ '@/views/dashboard/nmTask/GetDetail.vue'),
		},
		{
			path: ':id/edit',
			name: 'BatchTaskEdit',
			props: true,
			component: () => import(/* webpackChunkName: "create" */ '@/views/dashboard/nmTask/Edit.vue'),
		},
	],
};
