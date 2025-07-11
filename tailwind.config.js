/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./App.jsx",
        "./components/**/*.{jsx,js}",
        "./utils/**/*.{js}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif']
            },
            colors: {
                slate: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                    600: '#475569'
                },
                fuchsia: {
                    300: '#f0abfc',
                    400: '#e879f9',
                    500: '#d946ef',
                    600: '#c026d3'
                },
                red: {
                    400: '#f87171'
                },
                green: {
                    400: '#4ade80'
                },
                amber: {
                    500: '#f59e0b'
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            }
        }
    },
    plugins: []
};