export default {
	path: 'nm-real-time-task',
	name: 'RealTimeTaskLayout',
	component: () =>
		import(/* webpackChunkName: "datasets" */ '../views/dashboard/nmTask/Layout.vue'),
	children: [
		{
			path: '',
			name: 'RealTimeTaskList',
			component: () => import(/* webpackChunkName: "List" */ '@/views/dashboard/nmTask/List.vue'),
		},
		{
			path: 'create',
			name: 'RealTimeTaskCreate',
			component: () => import(/* webpackChunkName: "List" */ '@/views/dashboard/nmTask/Create.vue'),
		},
		{
			path: ':id',
			name: 'GetDetailRealTime',
			props: true,
			component: () =>
				import(/* webpackChunkName: "create" */ '@/views/dashboard/nmTask/GetDetail.vue'),
		},
		{
			path: ':id/edit',
			name: 'RealTimeTaskEdit',
			props: true,
			component: () => import(/* webpackChunkName: "create" */ '@/views/dashboard/nmTask/Edit.vue'),
		},
	],
};
