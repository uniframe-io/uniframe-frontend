<template>
	<div class="p-panelmenu p-component tw-bg-primaryColor">
		<template v-for="(item, index) of model" :key="item.label + '_' + index">
			<div v-if="visible(item)" :class="getPanelClass(item)" :style="item.style">
				<div class="tw-bg-primaryColor" :class="getHeaderClass(item)" :style="item.style">
					<template v-if="!$slots.item">
						<router-link
							v-if="item.to && !item.disabled"
							:to="item.to"
							custom
							v-slot="{ navigate, href }"
						>
							<a
								:href="href"
								class="p-panelmenu-header-link"
								@click="onItemClick($event, item, navigate)"
								role="treeitem"
							>
								<span v-if="item.icon" :class="getPanelIcon(item)"></span>
								<span class="p-menuitem-text">{{ item.label }}</span>
								<span v-if="item.secondIcon" :class="getSecondPanelIcon(item)"></span>
							</a>
						</router-link>
						<a
							@mousemove="mouseOver(item)"
							@mouseleave="mouseLeave(item)"
							v-else
							:href="item.url"
							class="p-panelmenu-header-link"
							:class="{ 'hover-white': getMenuItemRegardingRoute() === item.label }"
							@click="onItemClick($event, item)"
							:tabindex="item.disabled ? null : '0'"
							:aria-expanded="isActive(item)"
							:id="ariaId + '_header'"
							:aria-controls="ariaId + '_content'"
							target="_blank"
						>
							<span v-if="item.icon" :class="getPanelIcon(item)"></span>
							<span v-if="item.iconImg" class="p-menuitem-icon tw-w-6 tw-h-6 tw-text-xs">
								<img
									v-if="getIconColor(item) === 'blueIcons'"
									class="tw-w-6 tw-h-6"
									:src="require(`@/assets/images/icons/blueIcons/${item.iconImg}`)"
								/>
								<img
									v-else
									class="tw-w-6 tw-h-6"
									:src="require(`@/assets/images/icons/whiteIcons/${item.iconImg}`)"
								/>
							</span>
							<span class="p-menuitem-text">{{ item.label }}</span>
							<span v-if="item.secondIcon" :class="getSecondPanelIcon(item)"></span>
							<span v-if="item.items" class="tw-ml-6" :class="getPanelToggleIcon(item)"></span>
						</a>
					</template>
					<component v-else :is="$slots.item" :item="item"></component>
				</div>
				<transition name="p-toggleable-content">
					<div
						class="p-toggleable-content"
						v-show="isActive(item)"
						role="region"
						:id="ariaId + '_content'"
						:aria-labelledby="ariaId + '_header'"
					>
						<div class="p-panelmenu-content" v-if="item.items">
							<PanelMenuSub
								:routeName="routeName"
								:routePath="routePath"
								:model="item.items"
								class="p-panelmenu-root-submenu"
								:template="$slots.item"
								:expandedKeys="expandedKeys"
								@item-toggle="updateExpandedKeys"
							/>
						</div>
					</div>
				</transition>
			</div>
		</template>
	</div>
</template>

<script>
import PanelMenuSub from './PanelMenuSub.vue';
import { onMounted, ref } from 'vue';
import { UniqueComponentId } from 'primevue/utils';
import { useRoute } from 'vue-router';
export default {
	name: 'PanelMenu',
	emits: ['update:expandedKeys'],
	props: {
		routeName: {
			type: String,
			required: true,
		},
		routePath: {
			type: String,
			required: true,
		},
		model: {
			type: Array,
			default: null,
		},
		expandedKeys: {
			type: null,
			default: null,
		},
	},
	data() {
		return {
			activeItem: null,
		};
	},

	setup(props) {
		const menuItem = ref();
		const mouseIsOver = ref(null);
		const route = useRoute();
		function mouseOver(item) {
			mouseIsOver.value = item.label;
		}
		function mouseLeave() {
			mouseIsOver.value = null;
		}
		onMounted(() => {
			// This will open "String Matching" menu when routes are correct
			if (route.path.includes('nm-batch-task') || route.path.includes('nm-real-time-task')) {
				Array.from(document.getElementsByTagName('a')).forEach((e) => {
					if (e.innerHTML.includes('String Matching')) e.click();
				});
			}
		});
		function getMenuItemRegardingRoute() {
			if (props.routeName === 'Dashboard') return 'Dashboard';
			if (props.routePath.includes('datasets')) return 'Datasets';
			if (props.routePath.includes('nm-batch-task')) return 'Batch tasks';
			if (props.routePath.includes('nm-real-time-task')) return 'Realtime tasks';
			if (props.routeName === 'Setting') return 'Setting';
		}
		function getIconColor(item) {
			if (mouseIsOver.value === item.label || getMenuItemRegardingRoute() === item.label)
				return 'blueIcons';

			return 'whiteIcons';
		}
		return {
			mouseLeave,
			mouseOver,
			getMenuItemRegardingRoute,
			getIconColor,
			menuItem,
		};
	},
	methods: {
		getIconImage() {
			return '@/assets/images/icons/dashboard_white_24dp.svg';
		},

		onItemClick(event, item, navigate) {
			if (item.disabled) {
				event.preventDefault();
				return;
			}

			if (item.command) {
				item.command({
					originalEvent: event,
					item: item,
				});
			}

			if (this.activeItem && this.activeItem === item) this.activeItem = null;
			else this.activeItem = item;

			this.updateExpandedKeys({ item: item, expanded: this.activeItem != null });

			if (item.to && navigate) {
				navigate(event);
			}
		},
		updateExpandedKeys(event) {
			if (this.expandedKeys) {
				let item = event.item;
				let _keys = { ...this.expandedKeys };

				if (event.expanded) _keys[item.key] = true;
				else delete _keys[item.key];

				this.$emit('update:expandedKeys', _keys);
			}
		},
		getPanelClass(item) {
			return ['p-panelmenu-panel', item.class];
		},
		getPanelToggleIcon(item) {
			const active = item === this.activeItem;
			return ['p-panelmenu-icon pi', { 'pi-chevron-right': !active, ' pi-chevron-down': active }];
		},
		getPanelIcon(item) {
			return ['p-menuitem-icon', item.icon];
		},
		getSecondPanelIcon(item) {
			return ['p-menuitem-icon tw-pl-2 tw-text-xs', item.secondIcon];
		},

		isActive(item) {
			return this.expandedKeys ? this.expandedKeys[item.key] : item === this.activeItem;
		},
		getHeaderClass(item) {
			return [
				'p-component p-panelmenu-header',
				{ 'p-highlight': this.isActive(item), 'p-disabled': item.disabled },
			];
		},
		visible(item) {
			return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
		},
	},
	components: {
		PanelMenuSub: PanelMenuSub,
	},
	computed: {
		ariaId() {
			return UniqueComponentId();
		},
	},
};
</script>

<style lang="scss">
@import '@/style/config';

.p-panelmenu {
	.p-panelmenu-panel {
		.p-panelmenu-header {
			.p-panelmenu-header-link {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				user-select: none;
				cursor: pointer;
				position: relative;
				text-decoration: none;
				background: $primaryColor !important;
				color: $alternatingColor !important;
				border: none !important;
				box-shadow: none !important;
				font-weight: normal !important;
				font-size: 1.05rem;
				&.hover-white {
					background: $white !important;
					color: $primaryColor !important;
				}
				&:hover {
					background: $white !important;
					color: $primaryColor !important;
				}
				&:focus {
					z-index: 1;
					border: none !important;
					outline: none !important;
				}
				.p-menuitem-text {
					padding: 0;
				}
			}
		}
		.p-toggleable-content {
			.p-panelmenu-content {
				border: none !important;
				padding: 0 !important;
				.p-submenu-list {
					margin: 0;
					padding: 0;
					list-style: none;
					background: $primaryColor;
					.p-menuitem {
						&:hover {
							.p-menuitem-link {
								span {
									color: $primaryColor !important;
								}
							}
						}
					}
					.p-menuitem {
						.p-menuitem-link {
							span {
								&:nth-of-type(1) {
									padding-left: 1rem;
								}
							}
							display: flex;
							align-items: center;
							user-select: none;
							cursor: pointer;
							text-decoration: none;
							box-shadow: none !important;
							&:hover {
								background: $white;
							}
						}
					}
				}
			}
		}
	}
}
</style>
