import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swap',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} m-0 p-0`}>
        <ToastContainer autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
