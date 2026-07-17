import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { CLIENTS_PORTFOLIO } from './portfolio-data';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;
  const caseStudyId = typeof params.caseStudy === 'string' ? params.caseStudy : undefined;

  const defaultTitle = 'Rizwan Saeed — Premium Portfolio & Marketing Dashboard';
  const defaultDesc = 'Digital Marketing Manager & Shopify Developer. Certified Google Ads & Meta Business Partner, managing over AED 350K+ ad spend and generating AED 1.2M+ revenue.';
  const defaultOgImage = 'https://picsum.photos/seed/rizwan/1200/630';

  if (caseStudyId) {
    const found = CLIENTS_PORTFOLIO.find(c => 
      c.id === caseStudyId || 
      c.name.toLowerCase() === caseStudyId.toLowerCase()
    );

    if (found) {
      const cleanName = found.name;
      const ogImage = `https://picsum.photos/seed/${cleanName.replace(/[^a-zA-Z0-9]/g, '')}/1200/630`;

      return {
        title: `${cleanName} Case Study — ${found.metrics} | Rizwan Saeed Portfolio`,
        description: `Case study for ${cleanName}: ${found.challenge} Strategy: ${found.strategy} Outcomes: ${found.outcomes} | Managed by Rizwan Saeed.`,
        keywords: [
          cleanName,
          found.tag,
          'Rizwan Saeed',
          'Shopify Developer',
          'Digital Marketing Manager',
          'Dubai Marketing Specialist',
          'Google Ads Expert UAE',
          'Meta Ads Specialist',
          'SEO Consultant Dubai',
          'Case Study',
          'ROAS Optimization'
        ],
        alternates: {
          canonical: `https://rizwansaeed.ae/?caseStudy=${found.id}`,
        },
        openGraph: {
          title: `${cleanName} Case Study — ${found.metrics}`,
          description: `Verified portfolio outcome for ${cleanName} by Rizwan Saeed. Tag: ${found.tag}.`,
          url: `https://rizwansaeed.ae/?caseStudy=${found.id}`,
          siteName: 'Rizwan Saeed Portfolio',
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: `${cleanName} marketing performance case study`,
            }
          ],
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${cleanName} Case Study — Rizwan Saeed`,
          description: found.outcomes,
          images: [ogImage],
          creator: '@RizwanSaeed',
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
      };
    }
  }

  return {
    title: defaultTitle,
    description: defaultDesc,
    keywords: [
      'Rizwan Saeed',
      'Digital Marketing Manager',
      'Shopify Developer',
      'Google Ads Partner',
      'Meta Business Partner',
      'Dubai Marketing Consultant',
      'Shopify Theme Customization',
      'Hospitality Marketing Dubai',
      'PPC Campaign Manager',
      'Conversion Rate Optimization',
      'GA4 Google Tag Manager'
    ],
    alternates: {
      canonical: 'https://rizwansaeed.ae/',
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: 'https://rizwansaeed.ae/',
      siteName: 'Rizwan Saeed Portfolio',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: 'Rizwan Saeed digital marketing portfolio overview'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [defaultOgImage],
      creator: '@RizwanSaeed',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const caseStudyId = typeof params.caseStudy === 'string' ? params.caseStudy : null;

  return <PortfolioClient initialCaseStudyId={caseStudyId} />;
}
