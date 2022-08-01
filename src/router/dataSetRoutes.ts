export default {
	path: 'datasets',
	name: 'DataSetLayout',
	component: () =>
		import(/* webpackChunkName: "datasets" */ '../views/dashboard/dataSet/Layout.vue'),
	children: [
		{
			path: '',
			name: 'DataSetList',
			component: () => import(/* webpackChunkName: "List" */ '@/views/dashboard/dataSet/List.vue'),
		},
		{
			path: 'create',
			name: 'CreateDataSet',
			component: () =>
				import(/* webpackChunkName: "create" */ '@/views/dashboard/dataSet/Create.vue'),
		},
		{
			path: ':id/edit',
			name: 'EditDataSet',
			props: true,
			component: () => import(/* webpackChunkName: "Edit" */ '@/views/dashboard/dataSet/Edit.vue'),
		},
		{
			path: ':id',
			name: 'GetDetailDataSet',
			props: true,
			component: () =>
				import(/* webpackChunkName: "detail" */ '@/views/dashboard/dataSet/GetDetail.vue'),
		},
	],
};
