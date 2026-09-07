/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Space Grotesk"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                background: '#09090b', // Zinc 950 (Deep Dark)
                surface: '#18181b',    // Zinc 900
                border: '#27272a',     // Zinc 800
                muted: '#a1a1aa',      // Zinc 400
                accent: '#2dd4bf',     // Teal 400 (Clinical/Clean)
            },
        },
    },
    plugins: [],
}
