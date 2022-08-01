import router from '@/router';
export function historyGoBack() {
	router.go(-1);
}
export function goHome() {
	router.push({ name: 'Home' });
}
export function goDataSets() {
	router.push({ name: 'DataSetList' });
}
export function goNetworkError() {
	router.push({ name: 'NetworkError' });
}
export function go404Resource(resource = 'Page') {
	router.push({ name: '404Resource', params: { resource: resource } });
}
export function goTo(pageName) {
	router.push({ name: pageName });
}
