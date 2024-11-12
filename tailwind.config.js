/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				'slide-top': {
					'0%': { transform: 'translateY(100px)' },
					'100%': { transform: 'translateY(0px)' },
				},
			},
			animation: {
				'slide-top':
					'slide-top 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940)',
			},
			boxShadow: {
				dialog: 'rgba(0, 0, 0, 0.2) 0px 11px 15px -7px, rgba(0, 0, 0, 0.14) 0px 24px 38px 3px, rgba(0, 0, 0, 0.12) 0px 9px 46px 8px',
			},
		},
	},
	plugins: [],
}
