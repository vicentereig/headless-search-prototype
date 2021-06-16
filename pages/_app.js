import 'tailwindcss/tailwind.css'
import PlausibleProvider from 'next-plausible'

const MyApp = ({ Component, pageProps }) => (
  <PlausibleProvider domain="headless-search-prototype.vercel.app">
    <Component {...pageProps} />
  </PlausibleProvider>
);

export default MyApp
