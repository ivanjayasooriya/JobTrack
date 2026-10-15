import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from '@/components/providers/Providers.tsx';

export const metadata: Metadata = {
  title: 'JobTrack - Internship & Job Application Tracker',
  description: 'Production-grade internship and job application tracker with kanban pipelines, interview logs, timeline history, and career analytics.',
  openGraph: {
    title: 'JobTrack - Internship & Job Application Tracker',
    description: 'Production-grade internship and job application tracker with kanban pipelines, interview logs, timeline history, and career analytics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobTrack - Internship & Job Application Tracker',
    description: 'Production-grade internship and job application tracker with kanban pipelines, interview logs, timeline history, and career analytics.',
  },
};


export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
