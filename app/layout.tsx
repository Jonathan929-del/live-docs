// Imports
import './globals.css';
import React from 'react';
import {Metadata} from 'next';
import {cn} from '@/lib/utils';
import Provider from './Provider';
import {dark} from '@clerk/themes';
import {ClerkProvider} from '@clerk/nextjs';
import {Inter as FontSans} from 'next/font/google';





// Font
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});





// Meta data
export const metadata:Metadata = {
  title:'Live Docs',
  description:'Live docs app'
};





// Main function
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme:dark,
        variables:{
          colorPrimary:'#3371ff',
          fontSize:'16px'
        }
      }}
    >
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen font-sans antialiased',
            fontSans.variable
          )}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
};