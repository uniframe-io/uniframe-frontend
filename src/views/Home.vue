<template>
	<div class="back-ground">
		<div class="tw-mx-auto">
			<div
				class="
					tw-mx-auto tw-max-w-6xl tw-flex tw-flex-col
					md:tw-flex-row md:tw-gap-16
					tw-h-full tw-items-start tw-overflow-x-hidden tw-p-5
				"
			>
				<div
					class="tw-flex tw-flex-col tw-items-start tw-justify-center md:tw-w-2/4 tw-w-full tw-py-2"
				>
					<div
						class="
							tw-flex tw-flex-col tw-w-full tw-gap-y-10
							md:tw-items-start
							tw-items-center tw-justify-center
						"
					>
						<h1 class="md:tw-text-4xl tw-text-2xl tw-font-semibold">
							Link entities with string matching
						</h1>
						<p class="p-base">
							String matching is a technique of linking entities by string similarity. It is very
							useful in many scenarios, such as data enrichment, cyber security, knowledge
							discovery, data de-duplication and grouping. UniFrame provides a
							String-matching-as-a-Service solution to individuals and enterprises.
							<br/><br/>
							Try realtime string matching yourself to a dataset with 1M company information by login our demo account with email <strong>info+demo@uniframe.io</strong> and password <strong>123456</strong>.
						</p>
						<Button
							label="Get Started"
							@click="getStartedBtn"
							class="
								md:tw-w-32
								tw-w-44
								tw-h-9
								tw-rounded-full
								tw-bg-gradient-to-tr
								tw-from-primaryColor
								tw-to-secondaryColor
								tw-shadow-md
							"
						/>
					</div>
				</div>
				<div
					class="
						tw-flex tw-justify-center tw-items-center
						md:tw-w-2/4
						tw-w-full
						md:tw-my-0
						tw-my-4 tw-mx-auto
					"
				>
					<img src="../assets/images/home-animation-310-width.svg" alt="string-matching-diagram" />
				</div>
			</div>

			<!-- Sub hero section -->
			<div
				class="
					sub-hero
					tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-alternatingColor
					md:tw-my-5
					tw-my-0
					md:tw-py-8
					tw-py-4
				"
			>
				<h1
					class="
						tw-h-20
						md:tw-h-14 md:tw-text-4xl
						tw-overflow-x-hidden tw-text-center tw-text-2xl tw-font-semibold tw-z-10 tw-w-5/6
					"
				>
					UniFrame makes data integration simple
				</h1>
				<div
					class="
						tw-max-w-6xl
						tw-h-full
						tw-grid
						tw-grid-cols-3
						tw-items-center
						tw-justify-items-center
						tw-py-12
						tw-gap-y-14
						tw-mx-auto
					"
				>
					<div
						v-for="(item, i) in subHeroItems"
						:key="i"
						class="
							tw-h-32
							md:tw-h-32
							tw-w-4/5
							md:tw-w-full md:tw-gap-5
							tw-gap-2 tw-flex tw-flex-col tw-items-center
							md:tw-justify-center
							tw-justify-start
						"
					>
						<img
							:src="require(`../assets/images/icons/${item.imageName}`)"
							:alt="item.alt"
							class="tw-w-12 md:tw-w-16"
						/>
						<p class="tw-w-full md:tw-w-2/3 md:tw-text-base tw-text-sm tw-text-center">
							{{ item.text }}
						</p>
					</div>
				</div>
			</div>

			<div
				class="
					video-cards-section
					tw-max-w-6xl tw-mx-auto tw-flex tw-flex-col tw-items-center tw-justify-start
					md:tw-mt-10
					tw-mt-6 tw-gap-2
					md:tw-gap-5
					tw-min-h-screen
				"
			>
				<h1 class="tw-text-2xl md:tw-text-4xl tw-font-semibold tw-text-center">
					How UniFrame works
				</h1>
				<div class="tw-flex tw-flex-wrap tw-w-full tw-my-11 tw-flex-col tw-items-center tw-gap-20">
					<VideoCardsGeneral
						title="1. Create a dataset"
						:description="cardDescCreateDataset"
						position="left"
						videoSourceName="step1-create-dataset.mp4"
					/>
					<VideoCardsGeneral
						title="2. Create a string matching to match two large datasets"
						:description="cardDescBatchTask"
						position="left"
						videoSourceName="step2-batch-task.mp4"
					/>

					<VideoCardsGeneral
						title="3. Match a small number of strings and get the result in realtime"
						:description="cardDescRealtimeTask"
						position="left"
						videoSourceName="step3-realtime-task.mp4"
					/>
					<VideoCardsGeneral
						title="4. Use UniFrame by Python, Excel or other plugins"
						:description="cardDescProgram"
						position="left"
						videoSourceName="step4-programmatical-way.mp4"
					/>					
				</div>
			</div>

			<div
				class="
					tw-bg-alternatingColor
					tw-flex
					tw-flex-col
					tw-items-center
					tw-justify-center
					tw-w-full
					tw-py-8
				"
			>
				<!-- <h1 class="tw-text-4xl tw-font-semibold tw-text-center">Pricing</h1>

				<div class="tw-max-w-6xl tw-mx-auto tw-py-6">
					<div
						class="
							tw-w-full tw-flex tw-flex-col tw-items-center
							md:tw-items-stretch md:tw-flex-row
							tw-gap-5 tw-justify-around
						"
					>
						<PriceCardsGeneral
							type="Free"
							:btnText="getBtnText"
							:btnFunction="getStartedBtn"
							:main="priceFreeCardMain"
							:intro="priceFreeCardIntro"
							:description="priceFreeCardDescription"
							:btnDisabled="false"
						/>
						<PriceCardsGeneral
							type="Enterprise"
							btnText="Get a demo"
							:btnFunction="mailTo"
							:main="priceEnterpriseCardMain"
							:intro="priceEnterpriseCardIntro"
							:description="priceEnterpriseCardDescription"
							:btnDisabled="false"
						/>
					</div>
				</div> -->
			</div>
		</div>
	</div>
	<Footer />
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import VideoCardsGeneral from '@/components/VideoCardsGeneral.vue';
import PriceCardsGeneral from '@/components/PriceCardsGeneral.vue';
import Footer from '@/components/Footer.vue';
export default {
	name: 'Home',
	components: {
		VideoCardsGeneral,
		Footer,
		// PriceCardsGeneral,
	},

	setup() {
		const store = useStore();
		const router = useRouter();
		const cardDescCreateDataset = ref('');
		const email = process.env.VUE_APP_CONTACT_EMAIL;

		const subHeroItems = [
			{
				imageName: 'img-1-black-hand-setting.svg',
				text: 'Ready-to-go solution for business and developer',
				alt: '',
			},
			{
				imageName: 'img-2-black-target.svg',
				text: 'Accurate results on varied dataset',
				alt: '',
			},
			{
				imageName: 'img-3-black-running.svg',
				text: 'Optimized algorithm to achieve efficient computation',
				alt: '',
			},
			{
				imageName: 'img-4-black-control-switch.svg',
				text: 'Highly customized string matching task',
				alt: '',
			},
			{
				imageName: 'img-5-black-guarding.svg',
				text: 'Data secured in all-round',
				alt: '',
			},
			{
				imageName: 'img-6-black-racket.svg',
				text: 'Hosted on your cloud infrastructure',
				alt: '',
			},
		];
		function mailTo() {
			window.open(`mailto:${email}`, '_blank');
		}

		function goToSignIn() {
			router.push({ name: 'Signin' });
		}

		function goToDashboard() {
			router.push({ name: 'Dashboard' });
		}

		function getStartedBtn() {
			store.state.authenticated ? goToDashboard() : goToSignIn();
		}
		cardDescCreateDataset.value =
			'A dataset is a 2-dimensional plain text table. It is the basic data element used for string matching task. You can create dataset by uploading a CSV file, after you login the application dashboard. Then you can use the dataset in string matching tasks.';
		const cardDescBatchTask = ref('');
		cardDescBatchTask.value =
			'A string matching task is a computation job which does the string matching on the selected dataset. UniFrame offers you a ready-to-go, accurate, fast, configurable and secure string matching task.<br><strong>Batch string matching task</strong> can match two large datasets. First select the datasets you want to match and configure the task options based on the characteristics of datasets. Then a batch matching task is created and starts immediately. The matching results can be downloaded after the task finishes.';
		// We support two kinds of tasks: batch string matching task and real-time string matching task. You can create your string matching task after login the application dashboard
		const cardDescRealtimeTask = ref('');
		cardDescRealtimeTask.value =
			'Sometimes you want to match a small number of strings and get the matching results immediately. In this situation, a <strong>realtime string matching task</strong> is what you want. You can select the groundtruth dataset and configure the task options, and create a realtime task. When the task is in <strong>"Ready"</strong> status, you can enjoy the realtime matching.';
		const cardDescProgram = ref('');
		cardDescProgram.value =
			'UniFrame supports RESTful API. You can use any programming language to interact with UniFrame, or write plugins for your domain software easily. Please visit <a href="https://github.com/Sun-Analytics/uniframe-developer-example" target="_blank">https://github.com/Sun-Analytics/uniframe-developer-example</a> to get some Python examples.';			
		//  Free cad section
		const priceFreeCardIntro = `Not just a trial, spin up your dedicated string matching task now`;
		const priceFreeCardMain = `Yes, free`;
		const priceFreeCardDescription = [
			`Your dedicated computed resource up to 0.25CPU amd 64MB memory`,
			`Run 1 batch or 1 realtime task simultaneously`,
			`100 task per month`,
			`Maximal runtime of a batch task of 15 minutes, or a realtime task of 60 minutes`,
			`Secure data transmission and storage`,
		];

		//  Enterprise cad section

		const priceEnterpriseCardIntro = `Tailor string matching to your enterprise requirements and boost your business`;
		const priceEnterpriseCardMain = `Contact us`;
		const priceEnterpriseCardDescription = [
			`Deploy UniFrame on your cloud infrastructure including computation and storage`,
			`Run string matching task without computation resource limitation`,
			`Unlimited tasks`,
			`Enterprise single sign-on`,
			`Secure data transmission and storage; support user encryption key`,
			`Dedicated support`,
		];
		return {
			store,
			getBtnText: computed(() =>
				store.state.authenticated ? 'Get started' : 'Create free account'
			),
			subHeroItems,
			priceEnterpriseCardMain,
			priceEnterpriseCardIntro,
			priceEnterpriseCardDescription,
			priceFreeCardIntro,
			priceFreeCardMain,
			priceFreeCardDescription,
			getStartedBtn,
			email,
			mailTo,
			name: computed(() => store.state.currentUserData.fullName.split(' ', 1)[0]),
			cardDescCreateDataset,
			cardDescBatchTask,
			cardDescRealtimeTask,
			cardDescProgram,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
.sub-hero {
	height: auto;

	h1 {
		margin: 2px;
	}
}
.shadow-element-top {
	width: 100%;
	height: 50px;
	background: $alternatingColor;
	background: linear-gradient(0deg, $alternatingColor 30%, darken($alternatingColor, 10) 100%);
}
.shadow-element-bottom {
	width: 100%;
	height: 50px;
	background: $alternatingColor;
	background: linear-gradient(180deg, $alternatingColor 30%, darken($alternatingColor, 10) 100%);
}
</style>
