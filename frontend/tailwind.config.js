module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f9fafb',
        'muted-foreground': '#6b7280'
      },
      borderRadius: {
        lg: '0.5rem'
      }
    }
  },
  plugins: []
};