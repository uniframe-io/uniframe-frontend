<template>
	<div
		id="main"
		class="
			tw-flex tw-min-h-screen tw-flex-col
			md:tw-items-center
			tw-items-start tw-px-10 tw-bg-gray-100
			sm:tw-p-0
			tw-gap-5
		"
	>
		<h1 class="tw-text-5xl tw-mt-52">We are Sorry!</h1>
		<h3 class="tw-text-3xl tw-mt-5">
			It looks like you're experiencing some network issues, please take a breath then...
		</h3>
		<span class="">
			<a
				class="tw-text-4xl hover:tw-text-black tw-cursor-pointer tw-underline"
				@click="$router.go(-1)"
				>Go back
			</a>
		</span>
	</div>
</template>
<script>
export default {};
</script>
