import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CloserAI — AI Voice Sales Assistant',
    description: 'AI voice agents that don\'t just talk — they close deals for you.',
    keywords: 'AI sales, voice assistant, freelancer, sales automation, lead generation',
    openGraph: {
        title: 'CloserAI — Turn Conversations Into Clients',
        description: 'AI voice agents that don\'t just talk — they close deals for you.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
