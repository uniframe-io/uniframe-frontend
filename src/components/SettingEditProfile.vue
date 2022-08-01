<template>
	<div class="tw-flex tw-flex-col tw-items-center tw-mx-auto tw-justify-around">
		<div class="tw-flex tw-flex-col tw-gap-5">
			<div class="tw-rounded-md tw-flex tw-p-4 tw-text-lg">
				<span class="tw-font-bold">Full name:&nbsp; </span> <span>{{ userData.fullName }}</span>
			</div>
			<div class="tw-rounded-md tw-flex tw-p-4 tw-text-lg">
				<span class="tw-font-bold"> Email:&nbsp; </span><span> {{ userData.email }}</span>
			</div>
			<div class="tw-rounded-md tw-flex tw-p-4 tw-text-lg">
				<span class="tw-font-bold">Created at:&nbsp; </span>
				<span>{{ userData.createData.slice(0, 10) }}</span>
			</div>
			<Button
				class="btn-primary btn-primary-hollow tw-w-auto"
				icon="pi pi-trash"
				label="Deactivate Account!"
				@click="openModal"
				disabled
			/>
		</div>
		<Dialog
			header="Are you sure you want to deactivate you account?"
			v-model:visible="showModal"
			:style="{ width: '50vw' }"
		>
			<h1>Please make sure to read this before deactivating your account!</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
				voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
				cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</p>

			<p>
				"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
				laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
				architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
				aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
				voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
				consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
				dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
				exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
				consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
				molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
			</p>

			<p>
				At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
				voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
				cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id
				est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam
				libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
				maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
				Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut
				et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
				sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
				doloribus asperiores repellat.
			</p>
			<template #footer>
				<div class="p-field-checkbox tw-mt-4">
					<Checkbox id="binary" v-model="checked" :binary="true" />
					<label for="binary">YES, I still want to deactivate my account</label>
				</div>
				<Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text" autofocus />
				<Button
					:disabled="!checked"
					label="Yes"
					class="p-button-danger"
					icon="pi pi-check"
					@click="deactivateAccount"
					autofocus
				/>
			</template>
		</Dialog>
	</div>
</template>

<script>
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';

import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
	name: 'SettingEditProfile',
	components: { Dialog, Checkbox },
	setup() {
		const store = useStore();
		const router = useRouter();
		const showModal = ref(false);
		const checked = ref(false);
		const userData = store.state.currentUserData;
		function openModal() {
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function deactivateAccount() {
			//TODO: add confirmation for delete request
			closeModal();
			await store.dispatch('deactivateAccount');
			await store.dispatch('logOut');
			await router.push({ name: 'Home' });
			router.go(router.currentRoute);
		}

		return {
			checked,
			closeModal,
			openModal,
			deactivateAccount,
			userData,
			showModal,
		};
	},
};
</script>

<style lang="scss" scoped></style>
