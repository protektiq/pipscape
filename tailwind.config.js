/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom pastel colors for regions
      colors: {
        pastel: {
          lavender: {
            bg: 'rgb(200, 181, 226)',
            border: 'rgb(167, 139, 201)',
            glow: 'rgba(200, 181, 226, 0.4)',
          },
          mint: {
            bg: 'rgb(166, 227, 233)',
            border: 'rgb(129, 201, 209)',
            glow: 'rgba(166, 227, 233, 0.4)',
          },
          peach: {
            bg: 'rgb(255, 218, 193)',
            border: 'rgb(255, 183, 145)',
            glow: 'rgba(255, 218, 193, 0.4)',
          },
          rose: {
            bg: 'rgb(255, 192, 203)',
            border: 'rgb(255, 160, 180)',
            glow: 'rgba(255, 192, 203, 0.4)',
          },
          sky: {
            bg: 'rgb(176, 224, 230)',
            border: 'rgb(135, 206, 235)',
            glow: 'rgba(176, 224, 230, 0.4)',
          },
          lemon: {
            bg: 'rgb(255, 250, 205)',
            border: 'rgb(255, 245, 180)',
            glow: 'rgba(255, 250, 205, 0.4)',
          },
          lilac: {
            bg: 'rgb(230, 200, 255)',
            border: 'rgb(200, 160, 255)',
            glow: 'rgba(230, 200, 255, 0.4)',
          },
          sage: {
            bg: 'rgb(188, 212, 188)',
            border: 'rgb(152, 186, 152)',
            glow: 'rgba(188, 212, 188, 0.4)',
          },
          coral: {
            bg: 'rgb(255, 204, 188)',
            border: 'rgb(255, 173, 153)',
            glow: 'rgba(255, 204, 188, 0.4)',
          },
          periwinkle: {
            bg: 'rgb(204, 204, 255)',
            border: 'rgb(170, 170, 255)',
            glow: 'rgba(204, 204, 255, 0.4)',
          },
        },
      },
      // Custom fonts
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      // Custom box shadows
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.07)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 12px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'inner-strong': 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}



