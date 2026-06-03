/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(218, 100%, 97%)',
            '100': 'hsl(218, 100%, 94%)',
            '200': 'hsl(218, 100%, 86%)',
            '300': 'hsl(218, 100%, 76%)',
            '400': 'hsl(218, 100%, 64%)',
            '500': 'hsl(218, 100%, 50%)',
            '600': 'hsl(218, 100%, 40%)',
            '700': 'hsl(218, 100%, 32%)',
            '800': 'hsl(218, 100%, 24%)',
            '900': 'hsl(218, 100%, 16%)',
            '950': 'hsl(218, 100%, 10%)',
            DEFAULT: '#e1ecff'
        },
        secondary: {
            '50': 'hsl(209, 100%, 97%)',
            '100': 'hsl(209, 100%, 94%)',
            '200': 'hsl(209, 100%, 86%)',
            '300': 'hsl(209, 100%, 76%)',
            '400': 'hsl(209, 100%, 64%)',
            '500': 'hsl(209, 100%, 50%)',
            '600': 'hsl(209, 100%, 40%)',
            '700': 'hsl(209, 100%, 32%)',
            '800': 'hsl(209, 100%, 24%)',
            '900': 'hsl(209, 100%, 16%)',
            '950': 'hsl(209, 100%, 10%)',
            DEFAULT: '#148fff'
        },
        accent: {
            '50': 'hsl(29, 92%, 97%)',
            '100': 'hsl(29, 92%, 94%)',
            '200': 'hsl(29, 92%, 86%)',
            '300': 'hsl(29, 92%, 76%)',
            '400': 'hsl(29, 92%, 64%)',
            '500': 'hsl(29, 92%, 50%)',
            '600': 'hsl(29, 92%, 40%)',
            '700': 'hsl(29, 92%, 32%)',
            '800': 'hsl(29, 92%, 24%)',
            '900': 'hsl(29, 92%, 16%)',
            '950': 'hsl(29, 92%, 10%)',
            DEFAULT: '#f79942'
        },
        'neutral-50': '#e5e7eb',
        'neutral-100': '#000000',
        'neutral-200': '#ffffff',
        'neutral-300': '#707070',
        'neutral-400': '#161616',
        'neutral-500': '#384642',
        'neutral-600': '#656565',
        'neutral-700': '#474747',
        'neutral-800': '#f1f1f1',
        'neutral-900': '#999999',
        background: '#05061c',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ],
        body: [
            'Geist Mono',
            'sans-serif'
        ],
        font2: [
            'Aeonik Pro',
            'sans-serif'
        ]
    },
    fontSize: {
        '9': [
            '9px',
            {
                lineHeight: '16px'
            }
        ],
        '10': [
            '10px',
            {
                lineHeight: '24px',
                letterSpacing: '-0.1px'
            }
        ],
        '11': [
            '11px',
            {
                lineHeight: '16px',
                letterSpacing: '0.33px'
            }
        ],
        '12': [
            '12px',
            {
                lineHeight: '18px'
            }
        ],
        '13': [
            '13px',
            {
                lineHeight: '20px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '15px',
                letterSpacing: '-0.14px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: '24px'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '32px',
                letterSpacing: '-0.18px'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: '32px',
                letterSpacing: '-0.24px'
            }
        ],
        '36': [
            '36px',
            {
                lineHeight: '44px',
                letterSpacing: '-1%'
            }
        ],
        '48': [
            '48px',
            {
                lineHeight: '52px',
                letterSpacing: '-0.72px'
            }
        ],
        '64': [
            '64px',
            {
                lineHeight: '72px',
                letterSpacing: '-0.96px'
            }
        ],
        '74': [
            '74px',
            {
                lineHeight: '84px',
                letterSpacing: '-1.11px'
            }
        ]
    },
    spacing: {
        '24': '48px',
        '28': '56px',
        '30': '60px',
        '32': '64px',
        '36': '72px',
        '38': '76px',
        '40': '80px',
        '45': '90px',
        '48': '96px',
        '58': '116px',
        '60': '120px',
        '70': '140px',
        '80': '160px',
        '82': '164px',
        '86': '172px',
        '93': '186px',
        '120': '240px',
        '124': '248px',
        '142': '284px',
        '149': '298px',
        '159': '318px',
        '162': '324px',
        '165': '330px',
        '1px': '1px',
        '31px': '31px',
        '67px': '67px',
        '109px': '109px',
        '125px': '125px',
        '197px': '197px',
        '273px': '273px',
        '431px': '431px'
    },
    borderRadius: {
        xs: '1px',
        sm: '4px',
        md: '8px',
        lg: '14px',
        xl: '24px',
        full: '999px'
    },
    boxShadow: {
        sm: 'rgba(4, 8, 34, 0.06) 0px 2.824px 3.765px -1.412px, rgba(3, 8, 35, 0.12) 0px 1.882px 2.824px -0.941px, rgba(3, 8, 35, 0.12) 0px 0.941px 1.412px -0.471px, rgba(3, 8, 35, 0.12) 0px 0.471px 0.941px -0.235px, rgba(3, 8, 35, 0.12) 0px 0.235px 0.471px -0.118px, rgba(0, 0, 0, 0.12) 0px 0.118px 0.235px 0px',
        xs: 'rgba(255, 255, 255, 0.36) 0px 1px 2px -0.5px inset, rgba(255, 255, 255, 0.18) 0px 0.5px 0.5px 0px inset, rgba(255, 255, 255, 0.25) 0px 8px 24px -4px inset, rgba(0, 0, 0, 0.1) 0px 8px 8px -3px, rgba(0, 0, 0, 0.1) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 0.5px 0.5px 0px',
        md: 'rgba(9, 1, 20, 0.06) 0px 8px 8px -3px, rgba(8, 1, 20, 0.06) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.04) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px, rgba(255, 255, 255, 0.08) 0px -4px 12px -4px inset, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset',
        lg: 'rgba(0, 0, 0, 0.04) 0px 12px 12px -3px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px',
        xl: 'rgba(1, 1, 32, 0.08) 0px 262px 105px -72px, rgba(1, 1, 32, 0.16) 0px 147px 88px -40px, rgba(1, 1, 32, 0.2) 0px 64px 80px -32px, rgba(1, 1, 32, 0.24) 0px 16px 36px -12px, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset'
    },
    screens: {
        '400px': '400px',
        sm: '576px',
        md: '768px',
        '957px': '957px',
        lg: '1040px',
        '1200px': '1200px',
        '2xl': '1536px'
    },
    transitionDuration: {
        '50': '0.05s',
        '200': '0.2s',
        '250': '0.25s',
        '300': '0.3s',
        '400': '0.4s',
        '450': '0.45s',
        '600': '0.6s',
        '1000': '1s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    container: {
        center: true,
        padding: '16px'
    },
    maxWidth: {
        container: '1128px'
    }
},
  },
};
