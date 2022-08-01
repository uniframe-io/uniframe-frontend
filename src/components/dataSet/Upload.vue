<template>
	<div class="w-full tw-border tw-border-gray tw-shadow-md tw-pb-5 tw-relative">
		<div
			v-if="!store.state.dataSet.isFormValid"
			class="tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed"
		></div>
		<CardHeader
			title="Upload File"
			class="tw-px-5 tw-py-3 tw-h-auto tw-bg-tableTitle tw-border-b tw-border-gray"
		/>
		<div class="tw-container tw-mx-auto tw-flex tw-flex-col tw-p-5 tw-w-full">
			<Notification loc="fileUpload" />
			<div class="tw-flex tw-py-2 tw-justify-between tw-items-center tw-w-full">
				<div
					@dragover="fileDraggedIn"
					@dragleave="fileDraggedOut"
					@drop="fileDrop"
					@dragenter.prevent
					@dragover.prevent
					@click="store.state.dataSet.isFormValid && clickUploader()"
					v-if="uploadPercent === 0"
					ref="dropArea"
					:class="{
						'tw-border tw-border-none': selectedFile,
					}"
					class="
						tw-h-12
						tw-border-2
						tw-border-dashed
						tw-border-primaryColor
						tw-rounded-md
						tw-w-3/5
						tw-flex
						tw-items-center
						tw-justify-between
					"
				>
					<span v-if="selectedFile" class="tw-p-2"
						>{{ selectedFile.name }}
						<span class="tw-px-5 tw-text-sm">
							{{ uploadedFileSizeDisplay }}
						</span>
					</span>
					<span v-else class="tw-p-2 tw-text-gray tw-text-sm"
						>Drag your file here, maximum upload file size is {{ permissionUploadSize }}MB</span
					>
					<span v-if="store.state.dataSet.isFileUploaded" class="tw-text-successColor">
						File uploaded successfully!</span
					>
				</div>
				<div v-else class="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-w-full">
					<span class="tw-text-sm">{{ selectedFile.name }} </span>
					<span class="tw-text-sm">
						{{ uploadedFileSizeDisplay }}
					</span>
					<ProgressBar
						v-show="uploadPercent !== 0"
						:value="uploadPercent"
						:showValue="false"
						class="tw-my-3 tw-w-2/5 tw-h-2"
					/><span class="tw-block tw-w-11">{{ uploadPercent }}%</span>

					<Button
						icon="pi pi-times"
						@click="cancelUpload"
						class="p-button-rounded tw-rounded-full tw-h-10 tw-w-10"
					/>
				</div>
				<div>
					<FileUpload
						:disabled="!store.state.dataSet.isFormValid"
						v-if="!store.state.dataSet.isFileUploaded && uploadPercent === 0"
						:key="componentKey"
						:showCancelButton="true"
						:auto="true"
						mode="basic"
						chooseLabel="Choose File"
						uploadLabel="Upload"
						name="file"
						:maxFileSize="maxUploadFileSize"
						:invalidFileSizeMessage="invalidFileSizeMessage"
						class="w-full tw-h-auto"
						:fileLimit="1"
						:multiple="false"
						:customUpload="true"
						@uploader="uploader"
						@select="fileSelected"
						accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
						ref="uploadFile"
					>
					</FileUpload>
					<div v-if="store.state.dataSet.isFileUploaded" class="tw-flex tw-justify-center">
						<Button
							label="Select another file"
							@click="clearFile"
							class="tw-w-full btn-primary tw-text-sm tw-rounded-full"
						/>
					</div>
				</div>
			</div>
			<HelpGuide v-if="!store.state.dataSet.isFileUploaded" helpReference="dataset_create_upload" />
		</div>

		<div v-if="store.state.dataSet.isFileUploaded" class="tw-px-5">
			<PreviewData :tableData="previewData" class="tw-h-auto" showHelp />
		</div>
	</div>
</template>

<script>
import { reactive, ref, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import FileUpload from 'primevue/fileupload';
import DataSetUploadPreviewData from '@/components/dataSet/UploadPreviewData';
import Notification from '@/components/Notification';
export default {
	name: 'DataSetUpload',
	components: {
		PreviewData: DataSetUploadPreviewData,
		FileUpload,
		Notification,
	},
	setup() {
		const store = useStore();
		const selectedFile = ref(null);
		const uploadFile = ref();
		const isEditMode = ref(false);
		const isLoading = ref(false);
		const dropArea = ref();
		const permissionUploadSize = computed(
			() => store.state.nmTask.uiPermission.max_upload_dataset_size
		);
		const maxUploadFileSize = computed(() => parseFloat(permissionUploadSize.value * 1024 * 1024));
		const invalidFileSizeMessage = computed(
			() => `Maximum upload file size for free users is ${permissionUploadSize.value}MB`
		);
		const componentKey = ref(0); //this key is for re rendering upload component if upload canceled
		const previewData = reactive({});
		const errors = reactive({});
		const icon = ref('pi pi-angle-double-right');
		const uploadedFileSizeDisplay = computed(() => {
			if (Math.floor(selectedFile.value.size / 1048576) === 0)
				return `${parseFloat((selectedFile.value.size / 1024).toFixed(2))} kb`;
			return `${Math.ceil(selectedFile.value.size / 1048576)} MB`;
		});

		function setIcon() {
			isLoading.value
				? (icon.value = 'pi pi-spin pi-spinner')
				: (icon.value = 'pi pi-angle-double-right');
		}

		// TODO: clear unneeded functions

		function goBack() {
			store.commit('dataSet/SET_UPLOAD_PERCENT', 0);
			store.commit('dataSet/SET_IS_INFO_VIEW', true);
		}
		function fileSelected(event) {
			selectedFile.value = null;
			if (event) selectedFile.value = event.files[0];
		}
		async function handleUpload(file) {
			if (file.size <= maxUploadFileSize.value) {
				const formData = new FormData();
				if (!file.type) {
					selectedFile.value = new File([file], file.name, { type: 'text/csv' });
				}
				formData.append('file', selectedFile.value);
				await store.dispatch('dataSet/fileUpload', formData); // this line uploads file
				if (store.state.dataSet.isFileUploaded) {
					await store.dispatch('dataSet/dataPreview');
				}
			}
		}
		async function uploader(event) {
			selectedFile.value = event.files[0];
			await handleUpload(selectedFile.value);
		}

		function clickUploader() {
			uploadFile.value && uploadFile.value.choose();
		}
		watch(isLoading, setIcon);
		watch(
			() => store.getters['dataSet/previewData'],
			() => {
				previewData.header = store.getters['dataSet/previewData'].previewDataHeader;
				previewData.row = store.getters['dataSet/previewData'].previewDataRows;
			}
		);

		function fileDraggedIn() {
			dropArea.value.classList.remove('tw-border-dashed');
		}

		async function fileDrop(event) {
			const ext = event ? event.dataTransfer.files[0].name.split('.').pop() : null;
			const fileType = event.dataTransfer.files[0].type;
			if (
				(event && ext === 'csv') ||
				(event && fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			) {
				event.preventDefault();
				selectedFile.value = event.dataTransfer.files[0];
				uploadFile.value.onFileSelect(event);
				uploadFile.value.upload();
			} else {
				dropArea.value.classList.remove('tw-border-dashed');
				dropArea.value.classList.add('tw-border-dangerColor');
				if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('Unsupported file type');
				return;
			}
		}

		function fileDraggedOut() {
			dropArea.value.classList.remove('tw-border-dangerColor');
			dropArea.value.classList.add('tw-border-dashed');
		}

		onMounted(() => {
			store.commit('dataSet/SET_UPLOAD_PERCENT', 0);
			fileSelected();
			clearFile();
		});

		async function clearFile() {
			fileSelected();
			isLoading.value = false;
			componentKey.value++; //this is re-render component
			store.commit('dataSet/SET_FILE_UPLOAD_DATA', {});
			store.commit('dataSet/SET_PREVIEW_DATA', {});
			store.commit('dataSet/SET_IS_FILE_UPLOADED', false);
		}

		function cancelUpload() {
			store.commit('dataSet/SET_UPLOAD_PERCENT', 0);
			fileSelected();
			componentKey.value++; //this is re-render component
			store.dispatch('dataSet/cancelRequest');
			clearFile();
		}

		return {
			permissionUploadSize,
			invalidFileSizeMessage,
			maxUploadFileSize,
			uploadedFileSizeDisplay,
			fileDrop,
			fileDraggedOut,
			fileDraggedIn,
			dropArea,
			clickUploader,
			clearFile,
			uploadFile,
			componentKey,
			cancelUpload,
			previewData,
			selectedFile,
			fileSelected,
			uploader,
			store,
			goBack,
			isEditMode,
			errors,
			isLoading,
			icon,
			uploadPercent: computed(() => store.state.dataSet.uploadPercent),
		};
	},
};
</script>
<style lang="scss">
.p-fileupload-choose {
	min-width: 100%;
	border-radius: 50px;
	font-size: small;
	height: 2rem;
}
</style>
