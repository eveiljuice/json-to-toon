import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#fefce8',
      100: '#fef3c0', // Logo background
      200: '#fde047',
      300: '#facc15',
      400: '#eab308',
      500: '#ca8a04',
      600: '#a16207', // Button color approx
      700: '#854d0e',
      800: '#6b3d0c',
      900: '#422006',
    },
    dark: {
      bg: '#1b1b1f', // Logo dark color
    }
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.900',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'full',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          color: props.colorScheme === 'brand' ? 'white' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
          },
        }),
        pill: {
          borderRadius: 'full',
          bg: 'gray.100',
          color: 'gray.700',
          fontSize: 'sm',
          h: '8',
          px: 4,
          _hover: {
            bg: 'gray.200',
          },
          _dark: {
            bg: 'whiteAlpha.200',
            color: 'whiteAlpha.900',
            _hover: {
              bg: 'whiteAlpha.300',
            },
          }
        }
      },
    },
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: 6,
      },
    },
  },
})

export default theme
