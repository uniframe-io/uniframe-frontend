<template>
	<div class="blue-layout tw-flex tw-items-end">
		<a
			class="tw-text-xs tw-text-blue-400"
			href="https://www.freepik.com/vectors/business"
			target="_blank">Business vector created by fullvector -
			www.freepik.com
		</a>
	</div>
</template>
<script>
export default {};
</script>
<style lang="scss" scope>
@import '../style/config';
.blue-layout {
	overflow: hidden;
	object-fit: contain;
	background: $primaryColor url('../assets/images/signin-main.svg') no-repeat center;
	background-size: 200%;
	min-height: calc(100vh - 5rem);
}
</style>
