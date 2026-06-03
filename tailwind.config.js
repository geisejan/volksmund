/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				swiss: {
					red: '#DC0000',
					dark: '#0A0A0A',
					card: '#141414',
					border: '#2A2A2A',
					muted: '#666666',
					warm: '#F5F0EB'
				}
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fadeIn 0.4s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			}
		}
	},
	plugins: []
};
