<template>
	<div class="ttl tw-flex tw-justify-between tw-gap-2 tw-items-center">
		<div class="tw-flex tw-items-center tw-gap-1">
			<InputNumber
				@input="updateInputDay"
				name="day"
				v-model="ttlValue.day"
				mode="decimal"
				:min="0"
				:max="60"
				:disabled="disabled"
			/>
			<label class="tw-text-primaryColor tw-text-lg" for="day">Days</label>
		</div>

		<div class="tw-flex tw-items-center tw-gap-1">
			<InputNumber
				@input="updateInputHour"
				name="hour"
				v-model="ttlValue.hour"
				mode="decimal"
				:min="0"
				:max="23"
				:disabled="disabled"
			/>
			<label class="tw-text-primaryColor tw-text-lg" for="hour">Hours</label>
		</div>

		<div class="tw-flex tw-items-center tw-gap-1">
			<InputNumber
				@input="updateInputMinute"
				name="minutes"
				v-model="ttlValue.minute"
				mode="decimal"
				:min="0"
				:max="59"
				:disabled="disabled"
			/>
			<label class="tw-text-primaryColor tw-text-lg" for="minute">Minutes</label>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue';

import InputNumber from 'primevue/inputnumber';

export default {
	name: 'ThreeInputs',
	components: { InputNumber },
	emits: ['updateInput'],
	props: {
		ttl: {
			type: Object,
		},
		disabled: {
			type: Boolean,
		},
	},
	setup(props, { emit }) {
		const ttlValue = ref({
			day: props.ttl.day,
			hour: props.ttl.hour,
			minute: props.ttl.minute,
		});

		function updateInputDay(event) {
			ttlValue.value.day = event.value;
			emit('updateInput', ttlValue.value);
		}
		function updateInputHour(event) {
			ttlValue.value.hour = event.value;
			emit('updateInput', ttlValue.value);
		}
		function updateInputMinute(event) {
			ttlValue.value.minute = event.value;
			emit('updateInput', ttlValue.value);
		}
		return {
			updateInputHour,
			updateInputMinute,
			updateInputDay,
			ttlValue,
		};
	},
};
</script>
<style lang="scss">
@import '../../style/config';
.ttl .p-inputnumber .p-inputtext {
	max-width: 3rem !important;
	color: $primaryColor;
}
</style>
