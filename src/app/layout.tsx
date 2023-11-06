import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'Color game',
  description: 'Color game test task',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
