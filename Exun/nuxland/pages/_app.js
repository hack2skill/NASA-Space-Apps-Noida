import '../styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import { createTheme } from "@nextui-org/react"
const theme = createTheme({
	type: "dark", // it could be "light" or "dark"
	theme: {
		colors: {
			// brand colors
			background: '#000',
			text: '#fff',
			// you can also create your own color
			myDarkColor: '#006FEE',
			primary:"#006FEE"
			// ...  more colors
		  },
		  space: {},
		  fonts: {}
	}
  })

function App({ Component, pageProps: { ...pageProps } }) {
  return (
	<NextUIProvider theme={theme}>
	  	<Component {...pageProps} />
	</NextUIProvider>
  );
}

export default App;
