<template>
	<div class="tw-relative tw-overflow-hidden background-gradient">
		<div class="tw-w-4/5 h-screen--20 tw-m-auto tw-flex tw-items-center tw-justify-center">
			<div
				class="tw-relative tw-flex tw-flex-col tw-justify-center tw-items-center tw-z-10 tw-w-full"
			>
				<div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-items-start">
					<div
						class="
							tw-bg-white tw-rounded-full
							md:tw-w-80 md:tw-h-80
							tw-w-40 tw-h-40 tw-flex tw-justify-center tw-transform
							md:tw-translate-x-14 md:tw--translate-y-16
						"
					>
						<img
							class="md:tw-w-40 tw-w-20"
							src="../assets/images/sad-face.svg"
							alt="sad-face-icon"
						/>
					</div>
					<div class="tw-relative tw-z-30">
						<h1 class="tw-z-20 h2-bold tw-text-black">
							<p>404</p>
							Oops! Page not be found!
						</h1>
						<p class="tw-relative tw-z-10 p-base tw-max-w-md tw-my-5 tw-text-left">
							Sorry but the page you are looking for does not exist, name changed, temporary
							unavailable or have been removed.
						</p>
						<Button
							label="Back to Home"
							class="tw-relative tw-z-30 btn-primary btn-primary-gradient tw-w-auto"
							@click="router.replace({ name: 'Home' })"
						/>
					</div>
				</div>
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
import '../style/common.scss';
import { useRouter } from 'vue-router';
export default {
	name: 'PageNotFound',
	setup() {
		const router = useRouter();
		return {
			router,
		};
	},
};
</script>
