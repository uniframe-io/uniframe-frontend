const colors = require('tailwindcss/colors');
module.exports = {
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './public/**/*.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			inset: {
				'1/5': '20%',
				'2/5': '40%',
				'3/5': '60%',
				'4/5': '80%',
				'-16': '-4rem',
				'50vh': '50vh',
				'20vh': '20vh',
			},
			maxWidth: {
				'screen-3xl': '1920px',
			},
			minHeight: {
				24: '96px',
			},
			minWidth: {
				24: '96px',
			},
			colors: {
				lightblue: colors.lightBlue,
				trueGray: colors.trueGray,
				primaryColorVariant: '#0F548B',
				primaryColor: '#1C80CF',
				secondaryColor: '#4BAAF5',
				backgroundBlueColor: '#C2E3FD',
				backgroundBlueColorOpacity: '#C2E3FDE0',
				successColor: '#4CAF50',
				warningColor: '#FBC02D',
				dangerColor: '#D32F2F',
				black: '#000000',
				titleBlack: '#3C3C3C',
				darkGray: '#424242',
				gray: '#707070',
				grayVariant: '#757575',
				lightGray: '#DBDBDB',
				white: '#FFFFFF',
				tableTitle: '#E3E3E3',
				alternatingColor: '#F7F7F7',
			},
			height: (theme) => ({
				'screen+40': 'calc(100vh + 160px)',
				'screen-40': 'calc(100vh - 160px)',
			}),

			//
		},
		fontFamily: {
			body: ['"Open Sans"'],
			html: ['"Open Sans"'],
		},
	},
	variants: {
		extend: {
			//
			display: ['responsive', 'hover', 'focus'],
			fontWeight: ['hover', 'focus'],
			borderOpacity: ['hover'],
			opacity: ['disabled'],
			backgroundColor: ['responsive', 'hover', 'focus', 'active'],
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		//
	],
	prefix: 'tw-',
};
