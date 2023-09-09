// import '@/styles/globals.css'
// // import '../styles/globals.css'
// import { AuthProvider } from '../context/AuthProvider';


// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// pages/_app.js
import { AuthProvider } from '../context/AuthProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
