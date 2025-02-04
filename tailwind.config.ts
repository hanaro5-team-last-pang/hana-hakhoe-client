import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        /* bg컬러 */
        bgColor: '#F5F9F8',
        hanaNavy: '#3A4058',
        hanaColor1: '#E0FBF5',
        hanaColor2: '#00CC9C',
        ManualColor1: '#71D381',
        ManualColor2: '#77CBA2',
        ManualColor3: '#77D3CD',

        /* hanaGreen */
        hanaGreen: '#008485',
        hanaGreen80: '#63aeae',
        hanaGreen60: '#a3dcd3',
        hanaGreen40: '#D9E9E6',
        hanaGreen20: '#F5F9F8',

        ourWhite: '#F4F4F4',
        ourGreen: '#0B9B97',
        ourLightGreen: '#C1EBE9',
        ourOrange: '#FF782D',
        ourLightBlue: '#E6F0FC',

        /* hanaRed */
        hanaRed: '#CB1136',
        hanaRed80: '#D3514F',
        hanaRed60: '#DB8174',
        hanaRed40: '#E7ACA0',
        hanaRed20: '#F3D8D1',

        /* hanaGold */
        hanaGold: '#8B6F47',
        hanaGold80: '#B49F85',
        hanaGold60: '#D4CBBA',
        hanaGold40: '#ECE8DF',
        hanaGold20: '#FAF9F7',

        /* hanaSilver */
        hanaSilver: '#8D8C88',
        hanaSilver80: '#979797',
        hanaSilver60: '#D5D5D3',
        hanaSilver40: '#EEEEEC',
        hanaSilver20: '#FAFAFA',

        /* hanaBlack */
        hanaBlack: '#000000',
        hanaBlack80: '#5A5657',
        hanaBlack60: '#898989',
        hanaBlack40: '#B5B6B6',
        hanaBlack20: '#F7F7F7',

        badgePurple: '#AF52DE',
        badgeGreen: '#34C759',

        cardGreen: '#C8F5CF',
        cardGray: '#EFEFEF',
        cardBlue: '#EAF1FA',
        cardRed: '#FFE5E5',
        cardOrange: '#FFF2E4',
        cardPurple: '#F6EDFF',
      },
      screens: {
        xs: '420px',
      },
      width: {
        420: '420px',
      },
      spacing: {
        '1/5': '20%',
      },
      fontSize: {
        '2xs': ['0.625rem', '0.75rem'],
      },
      fontFamily: {
        fontBold: ['FontBold', 'sans-serif'],
        fontCm: ['FontCM', 'sans-serif'],
        fontHeavy: ['FontHeavy', 'sans-serif'],
        fontLight: ['FontLight', 'sans-serif'],
        fontMedium: ['FontMedium', 'sans-serif'],
        fontRegular: ['FontRegular', 'sans-serif'],
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        fadeInRight: 'fadeInRight 0.5s ease-out forwards',
        slideInRight: 'slideInRight 0.5s ease-out forwards',
        glow: 'glow 1.5s infinite',
        fadeInRight2: 'fadeInRight2 0.5s ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInRight2: {
          '0%': { opacity: '0', transform: 'none' },
          '100%': { opacity: '5', transform: 'none' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [tailwindScrollbarHide, tailwindScrollbar],
};
