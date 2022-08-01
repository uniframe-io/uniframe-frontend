<template>
	<div class="container">
		<TabView class="container tw-min-w-full tw-mt-1 tw-mx-auto">
			<TabPanel header="Profile">
				<SettingEditProfile />
			</TabPanel>
			<TabPanel header="Password">
				<SettingEditPassword />
			</TabPanel>
		</TabView>
	</div>
</template>
<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { ref } from 'vue';
import SettingEditProfile from '@/components/SettingEditProfile';
import SettingEditPassword from '@/components/SettingEditPassword.vue';
export default {
	name: 'Setting',
	components: {
		TabPanel,
		TabView,
		SettingEditProfile,
		SettingEditPassword,
	},
	setup() {
		const active = ref(0);

		return { active };
	},
};
</script>

<style lang="scss">
.p-tabview-nav {
	display: flex;
	justify-content: center;
}
</style>
