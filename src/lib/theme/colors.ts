// Brand colors from logo
export const BRAND = {
  green: '#2ECC71',
  blue: '#2E86C1',
} as const;

// Extended color palette
export const COLORS = {
  primary: {
    50: '#E8F8F5',
    100: '#D1F2E8',
    200: '#A3E4D7',
    300: '#76D7C4',
    400: '#48C9B0',
    500: BRAND.green,
    600: '#28B463',
    700: '#239B56',
    800: '#1E8449',
    900: '#196F3D',
  },
  secondary: {
    50: '#EBF5FB',
    100: '#D6EAF8',
    200: '#AED6F1',
    300: '#85C1E9',
    400: '#5DADE2',
    500: BRAND.blue,
    600: '#2874A6',
    700: '#21618C',
    800: '#1B4F72',
    900: '#154360',
  },
} as const;