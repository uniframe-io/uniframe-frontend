<template>
	<div v-if="notifications.length !== 0">
		<transition-group name="p-message" tag="div">
			<Message
				v-for="notification in notifications"
				:severity="notification.type"
				:key="notification.id"
				@close="closeNotification(notification)"
			>
				{{ notification.message }}
			</Message>
		</transition-group>
	</div>
</template>

<script>
import Message from 'primevue/message';
import { useStore } from 'vuex';
import { ref, computed, watch, onUnmounted } from 'vue';
//
import { goTo } from '@/helpers/routerHelper';
export default {
	name: 'Notification',
	components: {
		Message,
	},
	emits: ['isNotification'],
	props: {
		loc: {
			type: String,
			required: true,
		},
		goTo: {
			type: String,
			default: null,
		},
	},
	//TODO: need document for this component
	setup(props, { emit }) {
		const store = useStore();
		const notifications = computed(() =>
			store.state.notification.notifications.filter(
				(notification) => notification.loc === props.loc
			)
		);
		const isNotification = ref(false);
		watch(
			() => notifications.value,
			() => {
				if (notifications.value.length !== 0) {
					isNotification.value = true;
				} else {
					isNotification.value = false;
				}
				emit('isNotification', [isNotification.value, notifications.value]);
			},
			{ immediate: true }
		);
		function closeNotification(notification) {
			store.dispatch('notification/remove', notification, { root: true });
			props.goTo && goTo(props.goTo);
		}
		function clearAllNotifications() {
			notifications.value.forEach((notification) =>
				store.dispatch('notification/remove', notification, { root: true })
			);
		}
		onUnmounted(() => {
			clearAllNotifications();
		});

		return {
			clearAllNotifications,
			notifications,
			closeNotification,
		};
	},
};
</script>
