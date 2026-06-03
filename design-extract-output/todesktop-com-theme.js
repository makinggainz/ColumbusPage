// React Theme — extracted from https://www.todesktop.com/
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
    mono: string;
 *   };
 *   fontSizes: {
    '10': string;
    '11': string;
    '12': string;
    '13': string;
    '14': string;
    '16': string;
    '18': string;
    '24': string;
    '36': string;
    '48': string;
    '64': string;
    '74': string;
 *   };
 *   space: {
    '1': string;
    '31': string;
    '48': string;
    '56': string;
    '60': string;
    '64': string;
    '67': string;
    '72': string;
    '76': string;
    '80': string;
    '90': string;
    '96': string;
    '109': string;
    '116': string;
    '120': string;
    '125': string;
 *   };
 *   radii: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
    xs: string;
    md: string;
    lg: string;
    xl: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#e1ecff",
    "secondary": "#148fff",
    "accent": "#f79942",
    "background": "#05061c",
    "foreground": "#000000",
    "neutral50": "#e5e7eb",
    "neutral100": "#000000",
    "neutral200": "#ffffff",
    "neutral300": "#707070",
    "neutral400": "#161616",
    "neutral500": "#384642",
    "neutral600": "#656565",
    "neutral700": "#474747",
    "neutral800": "#f1f1f1",
    "neutral900": "#999999"
  },
  "fonts": {
    "body": "'Aeonik Pro', sans-serif",
    "mono": "'Geist Mono', monospace"
  },
  "fontSizes": {
    "10": "10px",
    "11": "11px",
    "12": "12px",
    "13": "13px",
    "14": "14px",
    "16": "16px",
    "18": "18px",
    "24": "24px",
    "36": "36px",
    "48": "48px",
    "64": "64px",
    "74": "74px"
  },
  "space": {
    "1": "1px",
    "31": "31px",
    "48": "48px",
    "56": "56px",
    "60": "60px",
    "64": "64px",
    "67": "67px",
    "72": "72px",
    "76": "76px",
    "80": "80px",
    "90": "90px",
    "96": "96px",
    "109": "109px",
    "116": "116px",
    "120": "120px",
    "125": "125px"
  },
  "radii": {
    "xs": "1px",
    "sm": "4px",
    "md": "8px",
    "lg": "14px",
    "xl": "24px",
    "full": "999px"
  },
  "shadows": {
    "sm": "rgba(4, 8, 34, 0.06) 0px 2.824px 3.765px -1.412px, rgba(3, 8, 35, 0.12) 0px 1.882px 2.824px -0.941px, rgba(3, 8, 35, 0.12) 0px 0.941px 1.412px -0.471px, rgba(3, 8, 35, 0.12) 0px 0.471px 0.941px -0.235px, rgba(3, 8, 35, 0.12) 0px 0.235px 0.471px -0.118px, rgba(0, 0, 0, 0.12) 0px 0.118px 0.235px 0px",
    "xs": "rgba(255, 255, 255, 0.36) 0px 1px 2px -0.5px inset, rgba(255, 255, 255, 0.18) 0px 0.5px 0.5px 0px inset, rgba(255, 255, 255, 0.25) 0px 8px 24px -4px inset, rgba(0, 0, 0, 0.1) 0px 8px 8px -3px, rgba(0, 0, 0, 0.1) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 0.5px 0.5px 0px",
    "md": "rgba(9, 1, 20, 0.06) 0px 8px 8px -3px, rgba(8, 1, 20, 0.06) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.04) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px, rgba(255, 255, 255, 0.08) 0px -4px 12px -4px inset, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset",
    "lg": "rgba(0, 0, 0, 0.04) 0px 12px 12px -3px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px",
    "xl": "rgba(1, 1, 32, 0.08) 0px 262px 105px -72px, rgba(1, 1, 32, 0.16) 0px 147px 88px -40px, rgba(1, 1, 32, 0.2) 0px 64px 80px -32px, rgba(1, 1, 32, 0.24) 0px 16px 36px -12px, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#e1ecff",
      "light": "hsl(218, 100%, 95%)",
      "dark": "hsl(218, 100%, 79%)"
    },
    "secondary": {
      "main": "#148fff",
      "light": "hsl(209, 100%, 69%)",
      "dark": "hsl(209, 100%, 39%)"
    },
    "background": {
      "default": "#05061c",
      "paper": "#05061b"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#ffffff"
    }
  },
  "typography": {
    "fontFamily": "'Geist Mono', sans-serif",
    "h1": {
      "fontSize": "36px",
      "fontWeight": "400",
      "lineHeight": "44px"
    },
    "h2": {
      "fontSize": "24px",
      "fontWeight": "500",
      "lineHeight": "32px"
    },
    "body1": {
      "fontSize": "18px",
      "fontWeight": "500",
      "lineHeight": "32px"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.04) 0px 8px 8px -3px, rgba(255, 255, 255, 0.04) 0px 3px 3px -1.5px, rgba(255, 255, 255, 0.03) 0px 2px 2px -1px, rgba(255, 255, 255, 0.03) 0px 1px 1px -0.5px, rgba(255, 255, 255, 0.04) 0px 0px 0px 1px",
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px, rgba(0, 0, 0, 0.08) 0px 16px 56px 0px",
    "rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset, rgba(5, 6, 27, 0.88) 0px 16px 56px 0px, rgba(5, 6, 27, 0.16) 0px 2px 4px 0px, rgba(5, 6, 27, 0.12) 0px 1px 2px 0px, rgba(5, 6, 27, 0.88) 0px 0px 0px 1px",
    "rgba(255, 255, 255, 0.7) 0px 0px 1px 0.1px inset, rgba(255, 255, 255, 0.32) 0px 0px 8px 0px"
  ]
};

export default theme;
