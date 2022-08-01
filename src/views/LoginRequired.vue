<template>
	<div class="tw-relative tw-overflow-hidden background-gradient">
		<div class="tw-w-4/5 h-screen--20 tw-m-auto tw-flex tw-items-center tw-justify-center">
			<div class="tw-relative tw-z-20 tw-flex tw-flex-col">
				<h1 class="tw-relative tw-text-center tw-z-20 h2-bold tw-text-black">Please login again</h1>

				<p class="tw-relative tw-z-10 tw-max-w-md tw-my-5 tw-text-center">
					It seems you’re not authenticated or your token is expired. Please login again.
				</p>
				<Button
					label="Login"
					class="tw-mx-auto tw-relative tw-z-30 btn-primary btn-primary-gradient tw-w-36"
					@click="router.push({ name: 'Signin' })"
				/>
			</div>
		</div>
		<div class="vertical-border card-border tw-absolute tw-top-5 tw-left-36"></div>
		<div
			class="
				horizontal-border
				card-border
				tw-absolute tw-transform tw-translate-x-10 tw-left-48 tw-bottom-10
			"
		></div>
	</div>
</template>
<script>
import { useRouter } from 'vue-router';
import '../style/common.scss';

export default {
	name: 'LoginRequired',
	setup() {
		const router = useRouter();
		return {
			router,
		};
	},
};
</script>
