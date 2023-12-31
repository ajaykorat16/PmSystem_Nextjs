'use client'
import './globals.css'
import '../lib/scss/style.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast';
import { usePathname } from "next/navigation";
import AppHeader from '@/lib/components/AppHeader';
import AppSidebar from '@/lib/components/AppSidebar';
import ReduxProvider from './provider';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const pathName = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/kr_logo.ico" />
        <title>Pm-System</title>
      </head>
      <body className={inter.className}>
        {
          pathName !== '/' ? (
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
          ) : (
            <ReduxProvider>
              <div>
                <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                  <Toaster />
                  <div className="body flex-grow-1 px-3">
                    {children}
                  </div>
                </div>
              </div>
            </ReduxProvider>
          )
        }
      </body>
    </html>
  );
}

