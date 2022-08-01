<template>
	<ul class="p-submenu-list" role="tree">
		<template v-for="(item, i) of model" :key="item.label + i.toString()">
			<li
				role="none"
				:class="getItemClass(item)"
				:style="item.style"
				v-if="visible(item) && !item.separator"
			>
				<template v-if="!template">
					<router-link
						v-if="item.to && !item.disabled"
						:to="item.to"
						custom
						v-slot="{ navigate, href }"
					>
						<a
							:href="href"
							:class="getLinkClass(item)"
							@click="onItemClick($event, item, navigate)"
							role="treeitem"
							:aria-expanded="isActive(item)"
						>
							<span :class="['p-menuitem-icon', item.icon]"></span>
							<span class="p-menuitem-text">{{ item.label }}</span>
						</a>
					</router-link>
					<a
						v-else
						@mousemove="mouseOver(item)"
						@mouseleave="mouseLeave"
						:href="item.url"
						:class="getLinkClass(item)"
						:target="item.target"
						@click="onItemClick($event, item)"
						role="treeitem"
						:aria-expanded="isActive(item)"
						:tabindex="item.disabled ? null : '0'"
						class=""
					>
						<span :class="getSubmenuIcon(item)" v-if="item.items"></span>
						<span :class="['p-menuitem-icon', item.icon]"></span>
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
					</a>
				</template>
				<component v-else :is="template" :item="item"></component>
				<transition name="p-toggleable-content">
					<div class="p-toggleable-content" v-show="isActive(item)">
						<PanelMenuSub
							:model="item.items"
							v-if="visible(item) && item.items"
							:key="item.label + '_sub_'"
							:template="template"
							:expandedKeys="expandedKeys"
							@item-toggle="$emit('item-toggle', $event)"
						/>
					</div>
				</transition>
			</li>
			<li
				:class="['p-menu-separator', item.class]"
				:style="item.style"
				v-if="visible(item) && item.separator"
				:key="'separator' + i.toString()"
			></li>
		</template>
	</ul>
</template>

<script>
import { ref } from 'vue';
export default {
	name: 'PanelMenuSub',
	emits: ['item-toggle'],
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
			type: null,
			default: null,
		},
		template: {
			type: Object,
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
		function mouseOver(item) {
			mouseIsOver.value = item.label;
		}
		function mouseLeave() {
			mouseIsOver.value = null;
		}

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

			this.$emit('item-toggle', { item: item, expanded: this.activeItem != null });

			if (item.to && navigate) {
				navigate(event);
			}
		},
		getItemClass(item) {
			return ['p-menuitem', item.className];
		},
		getLinkClass(item) {
			return [
				'p-menuitem-link',
				{ 'p-disabled': item.disabled },
				{ 'hover-white': this.getMenuItemRegardingRoute() === item.label },
			];
		},
		isActive(item) {
			return this.expandedKeys ? this.expandedKeys[item.key] : item === this.activeItem;
		},
		getSubmenuIcon(item) {
			const active = this.isActive(item);
			return ['p-panelmenu-icon pi pi-fw', { 'pi-angle-right': !active, 'pi-angle-down': active }];
		},
		visible(item) {
			return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/style/config';

.p-menuitem-text,
.p-menuitem-icon {
	color: $white !important;
}
.hover-white {
	.p-menuitem-text,
	.p-menuitem-icon {
		color: $primaryColor !important;
		svg {
			path {
				fill: $primaryColor !important;
			}
		}
	}
	background: $white !important;
}
</style>
