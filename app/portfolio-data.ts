// Source of truth data constants for Rizwan Saeed Portfolio

export const STATS_METRICS = [
  { id: 'stat-1', label: 'Revenue Generated', value: 'AED 1.2M+', desc: 'For e-commerce & hospitality brands', highlight: true },
  { id: 'stat-2', label: 'Ad Spend Managed', value: 'AED 350K+', desc: 'Google, Meta & TikTok Ads budgets', highlight: false },
  { id: 'stat-3', label: 'Projects Completed', value: '100+', desc: 'Shopify, SEO, & PPC campaigns', highlight: false },
  { id: 'stat-4', label: 'Countries Served', value: '4+', desc: 'USA, UK, UAE, & Pakistan markets', highlight: false },
  { id: 'stat-5', label: 'Client Satisfaction', value: '98%', desc: 'Long-term retainers & verified outcomes', highlight: true },
];

export const TIMELINE = [
  {
    id: 'exp-1',
    period: '2024 – Present',
    role: 'Digital Marketing Manager',
    company: 'Marina Byblos Hotel',
    location: 'Dubai Marina, UAE',
    description: 'Directing hospitality direct booking campaigns. Significantly reduced dependency on OTA (booking.com) commissions through integrated Google & Meta search/social ads and performance tracking.',
    achievements: ['Increased direct booking share by 22%', 'Managed direct PPC spend with a 4.2x ROAS', 'Configured comprehensive hospitality custom conversions']
  },
  {
    id: 'exp-2',
    period: '2023 – 2024',
    role: 'Digital Marketing Manager',
    company: 'Green Crystal UAE',
    location: 'Dubai, UAE',
    description: 'Spearheaded full-funnel B2B lead generation campaigns. Overhauled domain SEO structures and coordinated targeted search marketing efforts to land highly qualified regional commercial accounts.',
    achievements: ['Secured #1 ranking for commercial ventilation terms', 'Boosted high-value B2B inquiries by 140%', 'Streamlined CRM customer tracking loops']
  },
  {
    id: 'exp-3',
    period: '2016 – 2023',
    role: 'Shopify Developer',
    company: 'Mamiora',
    location: 'Remote',
    description: 'Coded high-performance Shopify storefronts utilizing Liquid. Specialized in speed optimization audits, app integrations, and conversion-centered product pages.',
    achievements: ['Achieved mobile load speeds under 1.5 seconds', 'Integrated deep Klaviyo marketing flows and custom upsell systems', 'Built custom theme layouts with native settings control']
  },
  {
    id: 'exp-4',
    period: '2020 – 2022',
    role: 'Social Media Manager',
    company: 'Ahmed Almazrouei Group',
    location: 'Abu Dhabi, UAE',
    description: 'Directed end-to-end digital branding, content strategy, and real estate lead campaigns for prominent construction and engineering services.',
    achievements: ['Maintained consistent high-class luxury branding aesthetics', 'Generated 10k+ warm leads via premium video ads', 'Managed local community engagements & press relations']
  }
];

export const CLIENTS_PORTFOLIO = [
  { 
    id: 'c-1', 
    name: 'floorcarpet.ae', 
    category: 'carpet', 
    tag: 'SEO & Ads', 
    metrics: '990 Clicks / 180K Imps', 
    highlight: true, 
    challenge: 'Highly competitive local market with massive ad costs and low search visibility.', 
    strategy: 'Implemented targeted Technical SEO, localized Google My Business schema, and optimized localized long-tail terms.', 
    outcomes: 'Ranked Page 1 for high-intent keywords; generated 990 organic clicks with a 180k search impressions footprint.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://floorcarpet.ae',
    websiteUrl: 'https://floorcarpet.ae',
    badge: 'VIP Case Study',
    metric1: { val: '990', label: 'Clicks' },
    metric2: { val: '180K', label: 'Impressions' },
    buttonText: 'View Full Analytics'
  },
  { 
    id: 'c-2', 
    name: 'luxurycurtain.ae', 
    category: 'curtain', 
    tag: 'Shopify & SEO', 
    metrics: 'Top Rank Dubai', 
    highlight: false, 
    challenge: 'Slow load speed and poor product page conversion, leading to cart abandonment.', 
    strategy: 'Rebuilt core templates, compressed static assets, and integrated clear trust factors with single-step checkout options.', 
    outcomes: 'Page speed score increased to 92/100; online transaction value boosted by 34%.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://luxurycurtain.ae',
    websiteUrl: 'https://luxurycurtain.ae',
    badge: 'UX Overhaul',
    metric1: { val: '92/100', label: 'Speed Score' },
    metric2: { val: '+34%', label: 'Sales Growth' },
    buttonText: 'View Case Study'
  },
  { 
    id: 'c-3', 
    name: 'carpetindubai.ae', 
    category: 'carpet', 
    tag: 'Google Ads & CRO', 
    metrics: '3.8x Average ROAS', 
    highlight: false, 
    challenge: 'Inefficient ad spend draining daily budgets without qualified leads.', 
    strategy: 'Refined negative keywords, configured precise conversion tracking triggers, and designed dynamic landing pages.', 
    outcomes: 'Reduced cost-per-conversion by 41%; scaled stable ROAS to 3.8x.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://carpetindubai.ae',
    websiteUrl: 'https://carpetindubai.ae',
    badge: 'Ad Scale',
    metric1: { val: '3.8x', label: 'Average ROAS' },
    metric2: { val: '-41%', label: 'CPA Reduction' },
    buttonText: 'View Campaign Data'
  },
  { 
    id: 'c-4', 
    name: 'blackoutcurtain.ae', 
    category: 'curtain', 
    tag: 'SEO & Google Ads', 
    metrics: '338 Clicks / 31K Imps', 
    highlight: false, 
    challenge: 'Fierce competition from legacy suppliers; lack of online catalog structure.', 
    strategy: 'Deployed clean visual collections, structured schema tags, and coordinated direct intent search marketing.', 
    outcomes: '338 high-intent clicks over 31k impressions; organic inquiries increased by 50%.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://blackoutcurtain.ae',
    websiteUrl: 'https://blackoutcurtain.ae',
    badge: 'SEO Growth',
    metric1: { val: '338', label: 'Clicks' },
    metric2: { val: '31K', label: 'Impressions' },
    buttonText: 'View Case Study'
  },
  { 
    id: 'c-5', 
    name: 'epoxyflooring.ae', 
    category: 'carpet', 
    tag: 'SEO & Meta Ads', 
    metrics: '120% Lead Growth', 
    highlight: false, 
    challenge: 'B2B commercial clients were hard to reach via traditional channels.', 
    strategy: 'Set up high-authority SEO landing pages and matched them with B2B-targeted Meta Lookalike audiences.', 
    outcomes: 'Generated continuous stream of custom contract inquiries; 120% year-over-year lead increase.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://epoxyflooring.ae',
    websiteUrl: 'https://epoxyflooring.ae',
    badge: 'B2B Lead Gen',
    metric1: { val: '120%', label: 'Lead Growth' },
    metric2: { val: 'Page 1', label: 'SEO Rank' },
    buttonText: 'View B2B Flow'
  },
  { 
    id: 'c-6', 
    name: 'dubaigrasscarpet.ae', 
    category: 'carpet', 
    tag: 'Conversion Tracking', 
    metrics: '2.2% CTR / 269 Clicks', 
    highlight: false, 
    challenge: 'Inaccurate conversion attribution; GA4 wasn’t capturing offline WhatsApp bookings.', 
    strategy: 'Configured customized GTM tags and custom JavaScript listener events on booking interactions.', 
    outcomes: 'Attained complete visibility on campaign ROI; tracked 269 target conversions accurately.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://dubaigrasscarpet.com',
    websiteUrl: 'https://dubaigrasscarpet.com',
    badge: 'GTM Audit',
    metric1: { val: '2.2%', label: 'Ad CTR' },
    metric2: { val: '269', label: 'Attributed Clicks' },
    buttonText: 'View Audit'
  },
  { 
    id: 'c-7', 
    name: 'Alphalete Athletics', 
    category: 'Shopify', 
    tag: 'Shopify & Speed', 
    metrics: '45% Speed Boost', 
    highlight: true, 
    challenge: 'High-traffic launch spikes causing server latency and cart lag.', 
    strategy: 'Minified heavy CSS, stripped inactive app integrations, and restructured lazy-loaded modules.', 
    outcomes: 'Reduced mobile load times by 2.1 seconds; increased conversion rates during launch windows.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://alphaleteathletics.com',
    websiteUrl: 'https://alphaleteathletics.com',
    badge: 'Performance Boost',
    metric1: { val: '+45%', label: 'Speed Gain' },
    metric2: { val: '< 1.2s', label: 'Mobile Load' },
    buttonText: 'View Case Study'
  },
  { 
    id: 'c-15', 
    name: 'Marano Spa', 
    category: 'Shopify', 
    tag: 'CRO & Organic', 
    metrics: '120% Lead Growth', 
    highlight: true, 
    challenge: 'Outdated booking flow and low organic discovery for high-end massage treatments.', 
    strategy: 'Optimized mobile user journey, built localized spa schema tags, and added direct conversion trigger loops.', 
    outcomes: 'Captured 45% increase in organic guests and boosted overall service leads by 120%.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://www.marinabybloshotel.com/facilities/marano-spa/',
    websiteUrl: 'https://www.marinabybloshotel.com/facilities/marano-spa/',
    badge: 'CRO & Organic',
    metric1: { val: '+45%', label: 'Organic Guests' },
    metric2: { val: '120%', label: 'Lead Growth' },
    buttonText: 'View Lead Data'
  },
  { 
    id: 'c-8', 
    name: 'Vivobarefoot ME', 
    category: 'Shopify', 
    tag: 'PPC & Meta Ads', 
    metrics: '4.5x Campaign ROAS', 
    highlight: false, 
    challenge: 'Relatively low brand awareness for minimalist footwear in the Middle East.', 
    strategy: 'Developed a rich educational video campaign on Meta & Google combined with highly structured retargeting steps.', 
    outcomes: 'Achieved outstanding 4.5x ROAS; scaled monthly revenue for UAE market.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://vivobarefoot.com',
    websiteUrl: 'https://vivobarefoot.com',
    badge: 'PPC Scaler',
    metric1: { val: '4.5x', label: 'Campaign ROAS' },
    metric2: { val: 'AED 15K', label: 'Monthly Scaled' },
    buttonText: 'View PPC Metrics'
  },
  { 
    id: 'c-9', 
    name: 'Aetrex', 
    category: 'Shopify', 
    tag: 'CRO & Shopify', 
    metrics: '+28% Conversion', 
    highlight: false, 
    challenge: 'High visitor bounce rate on the diagnostic footwear pages.', 
    strategy: 'Redesigned the interactive sizing guide layout; optimized mobile checkout UI elements.', 
    outcomes: 'Slashed bounce rates by 18%; boosted diagnostic-to-purchase conversions by 28%.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://aetrex.com',
    websiteUrl: 'https://aetrex.com',
    badge: 'CRO Overhaul',
    metric1: { val: '+28%', label: 'Conversion' },
    metric2: { val: '-18%', label: 'Bounce Rate' },
    buttonText: 'View Funnel Flow'
  },
  { 
    id: 'c-10', 
    name: 'Farada', 
    category: 'Shopify', 
    tag: 'Premium Ads', 
    metrics: '350+ Conversions', 
    highlight: false, 
    challenge: 'Selling high-value Arabian footwear required elite-tier audience targeting.', 
    strategy: 'Targeted luxury affinity cohorts in the GCC, excluding lower-intent demographics; implemented premium video ads.', 
    outcomes: 'Successfully generated high-value transactions with clean, custom digital branding.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://farada.ae',
    websiteUrl: 'https://farada.ae',
    badge: 'Luxury Targeting',
    metric1: { val: '350+', label: 'Conversions' },
    metric2: { val: '4.1x', label: 'Elite ROAS' },
    buttonText: 'View Video Ads'
  },
  { 
    id: 'c-11', 
    name: 'Sole Therapy', 
    category: 'Shopify', 
    tag: 'Shopify Dev', 
    metrics: 'Modern Replatform', 
    highlight: false, 
    challenge: 'Outdated legacy framework unable to support modern shipping extensions.', 
    strategy: 'Re-platformed with customized theme architecture, integrating seamless localized delivery systems.', 
    outcomes: 'Streamlined shipment tracking automation, reducing customer service tickets by 55%.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://soletherapy.com.au',
    websiteUrl: 'https://soletherapy.com.au',
    badge: 'Replatform',
    metric1: { val: 'Liquid V2', label: 'Theme Base' },
    metric2: { val: '-55%', label: 'Support Tickets' },
    buttonText: 'View Dev Logs'
  },
  { 
    id: 'c-12', 
    name: 'Seventy7', 
    category: 'Shopify', 
    tag: 'Ads & SEO', 
    metrics: 'Scale across GCC', 
    highlight: false, 
    challenge: 'Low search foot traffic for specialized street wear collections.', 
    strategy: 'Blended organic search landing pages with highly interactive social shopping catalogs.', 
    outcomes: 'Organic presence boosted 85%; successfully entered Saudi and Kuwaiti retail spaces.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://seventy7group.com',
    websiteUrl: 'https://seventy7group.com',
    badge: 'Omni-Channel',
    metric1: { val: '+85%', label: 'Organic Traffic' },
    metric2: { val: '3 Countries', label: 'Active Markets' },
    buttonText: 'View Store Metrics'
  },
  { 
    id: 'c-13', 
    name: 'Mahsi', 
    category: 'Shopify', 
    tag: 'Shopify Dev', 
    metrics: 'Liquid Overhaul', 
    highlight: false, 
    challenge: 'Rigid layout options limited creative promotional content campaigns.', 
    strategy: 'Built flexible, reusable custom sections with drag-and-drop support in the theme customizer.', 
    outcomes: 'Marketing team became fully self-sufficient; increased weekly promotion deployments.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://mahsi.com',
    websiteUrl: 'https://mahsi.com',
    badge: 'Custom Sections',
    metric1: { val: 'Drag & Drop', label: 'Custom Customizer' },
    metric2: { val: '100%', label: 'Self-Sufficient' },
    buttonText: 'View Theme Details'
  },
  { 
    id: 'c-14', 
    name: 'Us Prime Innovations', 
    category: 'Shopify', 
    tag: 'Lead Gen & CRO', 
    metrics: 'Top Funnel Flow', 
    highlight: false, 
    challenge: 'B2B distributors needed instant customized pricing matrix access.', 
    strategy: 'Created a password-protected custom pricing calculator portal inside Shopify.', 
    outcomes: 'Boosted distributor applications by 75%; eliminated manual quotation bottlenecks.',
    imageUrl: 'https://image.thum.io/get/width/600/crop/800/https://usprimeinnovations.com',
    websiteUrl: 'https://usprimeinnovations.com',
    badge: 'B2B Portal',
    metric1: { val: '+75%', label: 'Distributor Leads' },
    metric2: { val: 'Instant', label: 'Quotes Delivery' },
    buttonText: 'View B2B Setup'
  }
];

export const ANALYTICS_PROPERTIES: Record<string, {
  name: string;
  clicks: string;
  impressions: string;
  ctr: string;
  position: string;
  activeUsers?: number;
  eventCount?: string;
  keyEvents?: number;
  sessions?: number;
  chartData: { week: string; clicks: number; impressions: number }[];
}> = {
  'floorcarpet.ae': {
    name: 'floorcarpet.ae',
    clicks: '990',
    impressions: '180K',
    ctr: '0.6%',
    position: '57.2',
    activeUsers: 124,
    eventCount: '1.2K',
    keyEvents: 45,
    sessions: 412,
    chartData: [
      { week: 'W1', clicks: 12, impressions: 2200 },
      { week: 'W2', clicks: 18, impressions: 3100 },
      { week: 'W3', clicks: 15, impressions: 4500 },
      { week: 'W4', clicks: 28, impressions: 5800 },
      { week: 'W5', clicks: 35, impressions: 7200 },
      { week: 'W6', clicks: 42, impressions: 9100 },
      { week: 'W7', clicks: 58, impressions: 11000 },
      { week: 'W8', clicks: 75, impressions: 14000 },
      { week: 'W9', clicks: 92, impressions: 16500 },
      { week: 'W10', clicks: 110, impressions: 19000 },
      { week: 'W11', clicks: 145, impressions: 23000 },
      { week: 'W12', clicks: 168, impressions: 27000 },
      { week: 'W13', clicks: 192, impressions: 29500 },
      { week: 'W14', clicks: 100, impressions: 38000 }
    ]
  },
  'Dubai Carpet Shop': {
    name: 'Dubai Carpet Shop',
    clicks: '537',
    impressions: '38K',
    ctr: '1.4%',
    position: '25.3',
    activeUsers: 84,
    eventCount: '810',
    keyEvents: 28,
    sessions: 245,
    chartData: [
      { week: 'W1', clicks: 8, impressions: 600 },
      { week: 'W2', clicks: 14, impressions: 900 },
      { week: 'W3', clicks: 19, impressions: 1200 },
      { week: 'W4', clicks: 25, impressions: 1800 },
      { week: 'W5', clicks: 31, impressions: 2200 },
      { week: 'W6', clicks: 38, impressions: 2700 },
      { week: 'W7', clicks: 44, impressions: 3100 },
      { week: 'W8', clicks: 52, impressions: 3600 },
      { week: 'W9', clicks: 61, impressions: 4100 },
      { week: 'W10', clicks: 70, impressions: 4800 },
      { week: 'W11', clicks: 82, impressions: 5400 },
      { week: 'W12', clicks: 93, impressions: 6200 }
    ]
  },
  'carpetindubai.ae': {
    name: 'carpetindubai.ae',
    clicks: '312',
    impressions: '24K',
    ctr: '1.3%',
    position: '29.1',
    activeUsers: 62,
    eventCount: '490',
    keyEvents: 18,
    sessions: 168,
    chartData: [
      { week: 'W1', clicks: 5, impressions: 400 },
      { week: 'W2', clicks: 9, impressions: 700 },
      { week: 'W3', clicks: 12, impressions: 1000 },
      { week: 'W4', clicks: 15, impressions: 1300 },
      { week: 'W5', clicks: 19, impressions: 1600 },
      { week: 'W6', clicks: 24, impressions: 2000 },
      { week: 'W7', clicks: 28, impressions: 2300 },
      { week: 'W8', clicks: 33, impressions: 2700 },
      { week: 'W9', clicks: 39, impressions: 3200 },
      { week: 'W10', clicks: 45, impressions: 3700 },
      { week: 'W11', clicks: 52, impressions: 4200 },
      { week: 'W12', clicks: 60, impressions: 4800 }
    ]
  },
  'luxurycurtain.ae': {
    name: 'luxurycurtain.ae',
    clicks: '489',
    impressions: '42K',
    ctr: '1.16%',
    position: '22.4',
    activeUsers: 98,
    eventCount: '780',
    keyEvents: 31,
    sessions: 290,
    chartData: [
      { week: 'W1', clicks: 6, impressions: 500 },
      { week: 'W2', clicks: 11, impressions: 800 },
      { week: 'W3', clicks: 16, impressions: 1100 },
      { week: 'W4', clicks: 21, impressions: 1500 },
      { week: 'W5', clicks: 27, impressions: 1900 },
      { week: 'W6', clicks: 32, impressions: 2300 },
      { week: 'W7', clicks: 39, impressions: 2800 },
      { week: 'W8', clicks: 46, impressions: 3300 },
      { week: 'W9', clicks: 53, impressions: 3900 },
      { week: 'W10', clicks: 62, impressions: 4500 },
      { week: 'W11', clicks: 71, impressions: 5200 },
      { week: 'W12', clicks: 80, impressions: 6000 }
    ]
  },
  'Couch Upholstery': {
    name: 'Couch Upholstery',
    clicks: '165',
    impressions: '27.1K',
    ctr: '0.6%',
    position: '31',
    activeUsers: 45,
    eventCount: '290',
    keyEvents: 9,
    sessions: 115,
    chartData: [
      { week: 'W1', clicks: 2, impressions: 300 },
      { week: 'W2', clicks: 4, impressions: 550 },
      { week: 'W3', clicks: 8, impressions: 900 },
      { week: 'W4', clicks: 11, impressions: 1200 },
      { week: 'W5', clicks: 14, impressions: 1600 },
      { week: 'W6', clicks: 17, impressions: 1900 },
      { week: 'W7', clicks: 20, impressions: 2300 },
      { week: 'W8', clicks: 24, impressions: 2700 },
      { week: 'W9', clicks: 28, impressions: 3100 },
      { week: 'W10', clicks: 32, impressions: 3600 },
      { week: 'W11', clicks: 38, impressions: 4200 },
      { week: 'W12', clicks: 45, impressions: 4900 }
    ]
  }
};

export const DEFAULT_LOGO_WALL = [
  {
    id: 'logo-1',
    label: 'NELL GWYNNE',
    subLabel: 'Hospitality Dubai',
    desc: 'PPC Scaling & Conversion',
    badge: '4.2x Avg ROAS',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=marinabybloshotel.com',
    href: 'https://www.marinabybloshotel.com/dining/nell-gwynne/',
    color: 'amber',
    visible: true
  },
  {
    id: 'logo-2',
    label: 'MARINA BYBLOS',
    subLabel: 'Luxury Hotel',
    desc: 'Hotel PPC Booking Funnel',
    badge: '+22% Booking Share',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=marinabybloshotel.com',
    href: 'https://www.marinabybloshotel.com/',
    color: 'cyan',
    visible: true
  },
  {
    id: 'logo-3',
    label: 'GREEN CRYSTAL',
    subLabel: 'B2B Air Filters',
    desc: 'SEO & Page 1 Search Authority',
    badge: '+140% Qualified Leads',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=greencrystal.ae',
    href: 'https://greencrystal.ae/',
    color: 'emerald',
    visible: true
  },
  {
    id: 'logo-4',
    label: 'GSBM GULF',
    subLabel: 'Building Care',
    desc: 'Technical GMB Positioning',
    badge: 'Enterprise Scale',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=gulf-maintenance.ae',
    href: 'https://gulf-maintenance.ae/',
    color: 'sky',
    visible: true
  },
  {
    id: 'logo-5',
    label: 'SUKHUMVIT 11',
    subLabel: 'Elite Thai Venue',
    desc: 'Local Maps Authority',
    badge: 'Top-Tier Bookings',
    img: 'https://img.icons8.com/color/128/lotus.png',
    href: 'https://www.marinabybloshotel.com/dining/sukhumvit-11/',
    color: 'amber',
    visible: true
  },
  {
    id: 'logo-6',
    label: 'MARANO SPA',
    subLabel: 'Luxury Wellness',
    desc: 'Conversion rate optimization',
    badge: '+45% Organic Guests',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=byblosmassage.com',
    href: 'https://www.marinabybloshotel.com/facilities/marano-spa/',
    color: 'yellow',
    visible: true
  },
  {
    id: 'logo-7',
    label: 'MADO CAFE',
    subLabel: 'Authentic Bistro',
    desc: 'Technical SEO crawling',
    badge: 'High-Visibility SEO',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=mado.ae',
    href: 'https://mado.ae/',
    color: 'rose',
    visible: true
  },
  {
    id: 'logo-8',
    label: 'onzee_on_web()',
    subLabel: 'IT Solutions',
    desc: 'Liquid Custom Storefront',
    badge: 'Under 1.5s Core Load',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=onzeeonweb.com',
    href: 'https://onzeeonweb.com/',
    color: 'indigo',
    visible: true
  },
  {
    id: 'logo-9',
    label: 'Google Partner',
    subLabel: 'Search & Shopping',
    desc: 'PPC Spend Certification',
    badge: 'Multicolor Certified',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=google.com',
    href: 'https://www.google.com/partners/',
    color: 'emerald',
    visible: true
  },
  {
    id: 'logo-10',
    label: 'Meta Partner',
    subLabel: 'Social Scaling',
    desc: 'Conversion API Integration',
    badge: '+4.5x Historical ROAS',
    img: 'https://www.google.com/s2/favicons?sz=128&domain=facebook.com',
    href: 'https://www.facebook.com/business/partners',
    color: 'blue',
    visible: true
  }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Sarah Jenkins',
    role: 'CEO',
    company: 'TechFlow',
    content: 'Rizwan completely transformed our Shopify funnel. Our page load speeds dropped to 1.2s and conversion rate increased by 48% in the first month. He combines raw developer skill with marketing logic perfectly.',
    rating: 5,
    tag: 'Shopify & Speed'
  },
  {
    id: 't-2',
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'Elevate E-com',
    content: 'Managing AED 350k is no joke. Rizwan proved his mettle by generating 4.5x ROAS consistently on our Meta and Google Ads campaigns. Truly data-driven and always optimizes proactively.',
    rating: 5,
    tag: 'Ad Spend & ROAS'
  },
  {
    id: 't-3',
    name: 'Emma Watson',
    role: 'Owner',
    company: 'StyleHub',
    content: 'Our technical SEO was a disaster. Rizwan solved our indexing problems and our organic clicks grew from 100 to 12k+ in 6 months. His understanding of technical SEO is absolute top-tier.',
    rating: 5,
    tag: 'Technical SEO'
  },
  {
    id: 't-4',
    name: 'Omar Farooq',
    role: 'General Manager',
    company: 'Hospitality Group',
    content: 'Direct booking campaigns developed by Rizwan for Marina Byblos decreased our reliance on booking.com by 22%, saving thousands in commissions. A vital asset for any modern hospitality marketing campaign.',
    rating: 5,
    tag: 'Direct Bookings'
  }
];

export const FAQS = [
  {
    question: 'How do you coordinate custom Shopify themes with speed audits?',
    answer: 'I write native Shopify Liquid code and style directly with minimalist, optimized CSS instead of stacking page builders (like Elementor or PageFly) which bloat script execution. Additionally, I enforce strict lazy-loading, optimize critical render paths, strip unused tag logs, and properly configure modern image formats to assure under-1.5s loads.'
  },
  {
    question: 'What is your strategy for managing Google & Meta ads to secure stable high ROAS?',
    answer: 'My strategy rests on deep technical tracking accuracy (Meta Conversion API & GTM GA4 Server-Side tags), micro-audience clustering, custom catalog feed formatting, and strong intent keyword matching. I avoid random ad set testing and rely instead on historical audience affinity cohorts.'
  },
  {
    question: 'Can you scale brand organic visibility inside high-competition UAE markets?',
    answer: 'Yes. I specialize in Local SEO clusters and Technical On-Page structures tailored for Dubai and the GCC regions. This involves high-intent commercial transactional landing pages, custom schema structures, and securing authoritative regional backlinks to rank above aggregators.'
  },
  {
    question: 'Do you manage conversion tracking, GA4, and server-side pixel integrations?',
    answer: 'Absolutely. I build custom Google Tag Manager (GTM) setups for Server-Side tracking to bypass modern ad-blocker limitations and Apple’s iOS ATT. This captures accurate conversion events and sends high-quality user match data back to Meta and Google, which reduces CPA (Cost Per Acquisition).'
  }
];

export const SIMULATED_TICKER_EVENTS = [
  'Booking completed on Marina Byblos Hotel (+4.2x ROAS optimized)',
  'Speed Audit Completed for Vivobarefoot ME: load speed dropped by 2.4s',
  'Conversion tracking fixed for Alphalete Athletics UAE GTM loop',
  'Keyword "carpet shop dubai" hit Position #1 for floorcarpet.ae',
  'Meta Ads campaign scaled to AED 15K/mo for LuxuryCurtain',
  'GA4 Event stream setup finished for Marano Spa Center',
  'Klaviyo retention loop deployed for Mamiora (+18% cart recovery)',
  'Technical SEO Audit completed for epoxyflooring.ae (98% Health)',
  'SEO Schema validated for Couch Upholstery Dubai',
];

export const SERVICES = [
  {
    id: 'performance-marketing',
    title: 'Performance Marketing',
    subtitle: 'Paid Advertising',
    desc: 'High-converting campaigns designed to maximize ROAS and scale client volume across multiple platforms.',
    items: ['Google Search & Display Ads', 'Meta (Facebook & Instagram) Retargeting', 'TikTok Direct Response Ads', 'Conversion API & Event Matching'],
    badge: 'ROI Focused',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'seo-optimization',
    title: 'Search Engine Optimization',
    subtitle: 'Organic Visibility',
    desc: 'A systematic approach to ranking keywords on Page 1, boosting organic traffic, and establishing domain authority.',
    items: ['Technical SEO & Core Web Vitals', 'Local GMB Optimization', 'On-Page Content Architecture', 'Off-Page Strategy & Backlinks'],
    badge: 'Page 1 Rankings',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'shopify-development',
    title: 'Shopify Development',
    subtitle: 'E-commerce Engineering',
    desc: 'Custom-built, ultra-fast storefronts tailored for conversion rate optimization (CRO) and modern brand scale.',
    items: ['Custom Theme Dev (Liquid / CSS)', 'Mobile-First Page Load Optimization', 'Klaviyo Email Flow Integrations', 'Seamless API & Checkout Optimizations'],
    badge: 'Liquid Expert',
    color: 'from-blue-500 to-indigo-600'
  }
];
