import './globals.css'
import '../lib/scss/style.scss';
import { Inter } from 'next/font/google'
import AppSidebar from '@/lib/components/AppSidebar';
import AppHeader from '@/lib/components/AppHeader';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from './provider';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
        <html lang="en">
          <body className={inter.className}>
          <ReduxProvider>
            <div>
              <AppSidebar />
              <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeader title={"Dashboard"} />
                <Toaster />
                <div className="body flex-grow-1 px-3">
                  {children}
                </div>
              </div>
            </div>
            </ReduxProvider>
          </body>
        </html>
  );
}
