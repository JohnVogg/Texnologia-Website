tailwind.config = {
  theme: {
    extend: {
      colors: {
        blue: '#0B5CAB',
        'blue-dark': '#094A89',
        'blue-bg': '#E9F1FB',
        ink: '#0C1826',
        'ink-2': '#3A4A5C',
        muted: '#697A8C',
        line: '#E4E9F0',
        paper: '#F8FAFC',
        red: '#C4302B',
        'red-bg': '#FDECEB',
        green: '#1E8E5A',
        'green-bg': '#E8F7EF',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,24,38,0.04), 0 4px 16px rgba(12,24,38,0.06)',
        'card-hover': '0 16px 36px rgba(12,24,38,0.16)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
};
