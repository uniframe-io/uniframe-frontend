import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
//  icon
import '@fortawesome/fontawesome-free/css/all.min.css';

//others
import CardHeader from '@/components/util/CardHeader.vue';
import HelpGuide from '@/components/HelpGuide.vue';
import Notification from '@/components/Notification.vue';

//  primeVue
// ..  components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Sidebar from 'primevue/sidebar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import SplitButton from '@/components/primevueComponents/SplitButton.vue';
import ConfirmationService from 'primevue/confirmationservice';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import Menu from 'primevue/menu';
import ConfirmDialog from '@/components/primevueComponents/ConfirmDialog.vue';
import Dialog from '@/components/primevueComponents/Dialog.vue';
import Tooltip from 'primevue/tooltip';
// .. modules
import PrimeVue from 'primevue/config'; //TODO: match screen size between tailwind and PrimVue
import 'primeflex/primeflex.css';
import 'primevue/resources/primevue.min.css'; //core css
import 'primevue/resources/themes/saga-blue/theme.css'; //theme
import 'primeicons/primeicons.css'; //icons
//animate css
import 'animate.css/animate.min.css';
// TailwindCss
import '@/style/tailwind/index.scss';

createApp(App)
	.directive('tooltip', Tooltip)
	.use(store)
	.use(router)
	.use(PrimeVue, { ripple: true })
	.use(ToastService)
	.use(ConfirmationService)
	.component('ConfirmDialog', ConfirmDialog)
	.component('Dialog', Dialog)
	.component('Menu', Menu)
	.component('ProgressSpinner', ProgressSpinner)
	.component('HelpGuide', HelpGuide)
	.component('Notification', Notification)
	.component('CardHeader', CardHeader)
	.component('InputText', InputText)
	.component('Sidebar', Sidebar)
	.component('Button', Button)
	.component('Textarea', Textarea)
	.component('Dropdown', Dropdown)
	.component('Column', Column)
	.component('DataTable', DataTable)
	.component('Toast', Toast)
	.component('SplitButton', SplitButton)
	.component('ProgressBar', ProgressBar)

	.mount('#app');
