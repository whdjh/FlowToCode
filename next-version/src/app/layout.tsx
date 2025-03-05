import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: 'FlowToCode',
    template: '%s',
  },
  description: '파이썬 코드로 변환해보세요!',
  keywords: '흐름도를 그리면 코드로 변환',
  //metadataBase: new URL(''),
  /*
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  */
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
