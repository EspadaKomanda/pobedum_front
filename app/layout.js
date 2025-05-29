import './globals.css';
import { Caveat, IBM_Plex_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const ibmPlex = IBM_Plex_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex'
});

const caveat = Caveat({ 
  subsets: ['latin'],
  variable: '--font-caveat'
});

export const metadata = {
  title: 'Письма фронтовиков | Оживляем историю',
  description: 'Проект по оживлению писем фронтовиков с помощью искусственного интеллекта',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body className={`${ibmPlex.variable} ${caveat.variable} font-sans bg-background min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}