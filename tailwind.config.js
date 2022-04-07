module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
      fontFamily: {
          'sans': ['"PT Sans"', 'sans-serif'],
          'serif': ['"PT Serif"', 'serif']
      },
    screens: {
        'xs': '450px',
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }

        'card-breakpoint': '863px',
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }

        '3xl': '1800px'
    },
    extend: {},
  },
  plugins: [],
};
