<template>
	<div class="tw-relative tw-overflow-hidden">
		<div
			class="
				tw-relative tw-z-50 tw-mx-auto tw-max-w-xl
				md:h-screen--20
				tw-h-96 tw-m-auto tw-flex tw-flex-col tw-gap-7 tw-items-center tw-justify-center
			"
		>
			<h1 class="h2-bold tw-text-center">Contact information</h1>
			<p class="p-base tw-w-auto tw-max-w-xl tw-text-center">
				Please contact us using links provided
			</p>
			<div class="tw-w-2/3 tw-flex flex-col tw-items-center tw-font-semibold tw-text-primaryColor">
				<div
					class="
						tw-flex
						md:tw-flex-row md:tw-gap-2
						tw-flex-col tw-gap-10 tw-justify-between
						md:tw-items-center
						tw-w-full
					"
				>
					<p class="tw-text-lg tw-flex tw-gap-3 tw-items-center tw-h-10">
						<i class="pi pi-envelope tw-text-xl tw-text-black"></i>
						<a :href="`mailto:${email}`" class="tw-underline tw-text-base" target="_blank"
							>Email us here</a
						>
					</p>
					<!-- <p class="tw-text-lg tw-flex tw-gap-3 tw-items-center tw-h-10">
						<img
							class="tw-inline-block tw-text-xl"
							src="../assets/images/icons/linkedin-black.svg"
							alt=""
						/>
						<a class="tw-underline tw-text-base" :href="linkedin" target="_blank"
							>Visit our Linkedin</a
						>
					</p> -->
				</div>
			</div>
		</div>
		<div class="vertical-border card-border tw-absolute tw-top-5 tw-left-36"></div>
		<div
			class="
				tw-z-0
				horizontal-border
				card-border
				tw-absolute tw-transform tw-translate-x-10 tw-left-48 tw-bottom-10
			"
		></div>
	</div>
</template>
<script>
export default {
	name: 'Contact',
	setup() {
		return {
			email: process.env.VUE_APP_CONTACT_EMAIL,
			// linkedin: process.env.VUE_APP_CONTACT_LINKEDIN,
		};
	},
};
</script>
