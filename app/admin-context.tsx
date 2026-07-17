'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  STATS_METRICS, 
  ANALYTICS_PROPERTIES, 
  DEFAULT_LOGO_WALL, 
  TIMELINE, 
  CLIENTS_PORTFOLIO, 
  TESTIMONIALS, 
  FAQS,
  SERVICES
} from './portfolio-data';

const AdminContext = createContext<any>(null);

export const DEFAULT_THEME_CONFIG = {
  // Theme Modes
  themeMode: 'dark', // 'light' | 'dark' | 'auto'

  // Colors
  customPrimary: '#06b6d4',
  customSecondary: '#10b981',
  accentColor: '#3b82f6',
  backgroundColor: '#000000',
  surfaceColor: '#0a0f1d',
  cardColor: '#0c1222',
  sidebarColor: '#090d16',
  navbarColor: '#0c1222',
  headerColor: '#0c1222',
  footerColor: '#05080f',
  buttonColor: '#06b6d4',
  buttonHoverColor: '#0891b2',
  buttonActiveColor: '#0e7490',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  textColor: '#f8fafc',
  textMutedColor: '#94a3b8',
  iconColor: '#06b6d4',
  linkColor: '#06b6d4',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
  infoColor: '#3b82f6',
  chartColor1: '#06b6d4',
  chartColor2: '#10b981',
  tableHeaderBg: '#0f172a',
  tableRowBg: '#0c1222',

  // Typography Settings
  fontFamily: 'Inter',
  fontSizeBase: '14px',
  fontWeightBase: '400',
  headingStyle: 'normal', // 'normal' | 'uppercase' | 'tracking-wide'
  paragraphStyle: 'normal',
  letterSpacing: 'normal', // 'tight' | 'normal' | 'wide'
  lineHeight: '1.5',

  // Layout Customization
  borderRadius: '12px', // '0px' | '4px' | '8px' | '12px' | '16px' | '24px' | '9999px'
  cardStyle: 'bordered', // 'flat' | 'bordered' | 'glass' | 'shadowed'
  shadowIntensity: 'medium', // 'none' | 'low' | 'medium' | 'high'
  buttonStyle: 'rounded', // 'square' | 'rounded' | 'pill'
  sidebarWidth: '260px',
  headerHeight: '70px',
  navigationStyle: 'sticky', // 'sticky' | 'fixed' | 'normal'
  gridSpacing: '24px',
  containerWidth: '1280px',
  widgetSpacing: '16px',

  // Component Styling
  badgeRadius: '9999px',
  inputBg: '#111927',
  inputBorderColor: 'rgba(255, 255, 255, 0.08)',
  modalBg: '#0c1222',
  progressBg: '#1e293b',
  tooltipBg: '#0f172a',
  accordionStyle: 'minimal', // 'bordered' | 'minimal'
  tabStyle: 'pills', // 'pills' | 'underline'

  // Scheduling
  schedulerEnabled: false,
  schedulerLightStart: '07:00',
  schedulerLightEnd: '19:00',
  
  // Accessibility
  highContrast: false,
  colorBlindMode: 'none', // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  textScale: '100%', // '100%' | '110%' | '120%' | '130%'
};

export const DEFAULT_TEMPLATES = [
  {
    id: 'default',
    name: 'Cyber Dark (Default)',
    isSystem: true,
    config: { ...DEFAULT_THEME_CONFIG }
  },
  {
    id: 'swiss-light',
    name: 'Swiss Light',
    isSystem: true,
    config: {
      ...DEFAULT_THEME_CONFIG,
      themeMode: 'light',
      customPrimary: '#0f172a',
      customSecondary: '#0284c7',
      accentColor: '#3b82f6',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      cardColor: '#ffffff',
      sidebarColor: '#f1f5f9',
      navbarColor: '#ffffff',
      headerColor: '#ffffff',
      footerColor: '#e2e8f0',
      buttonColor: '#0f172a',
      buttonHoverColor: '#334155',
      buttonActiveColor: '#1e293b',
      borderColor: 'rgba(15, 23, 42, 0.08)',
      textColor: '#0f172a',
      textMutedColor: '#475569',
      iconColor: '#0f172a',
      linkColor: '#0284c7',
      inputBg: '#ffffff',
      inputBorderColor: 'rgba(15, 23, 42, 0.12)',
      modalBg: '#ffffff',
      progressBg: '#e2e8f0',
      tooltipBg: '#1e293b',
      shadowIntensity: 'low'
    }
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen (Warm Sand)',
    isSystem: true,
    config: {
      ...DEFAULT_THEME_CONFIG,
      themeMode: 'light',
      customPrimary: '#854d0e',
      customSecondary: '#166534',
      accentColor: '#b45309',
      backgroundColor: '#fafaf9',
      surfaceColor: '#f5f5f4',
      cardColor: '#ffffff',
      sidebarColor: '#f5f5f4',
      navbarColor: '#ffffff',
      headerColor: '#ffffff',
      footerColor: '#e7e5e4',
      buttonColor: '#854d0e',
      buttonHoverColor: '#a16207',
      buttonActiveColor: '#713f12',
      borderColor: 'rgba(120, 113, 108, 0.15)',
      textColor: '#1c1917',
      textMutedColor: '#57534e',
      iconColor: '#854d0e',
      linkColor: '#854d0e',
      fontFamily: 'Outfit',
      borderRadius: '8px',
      cardStyle: 'flat',
      inputBg: '#ffffff',
      inputBorderColor: 'rgba(120, 113, 108, 0.2)',
      modalBg: '#ffffff',
      shadowIntensity: 'none'
    }
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism Pro',
    isSystem: true,
    config: {
      ...DEFAULT_THEME_CONFIG,
      themeMode: 'dark',
      customPrimary: '#a855f7',
      customSecondary: '#06b6d4',
      accentColor: '#ec4899',
      backgroundColor: '#030712',
      surfaceColor: 'rgba(17, 24, 39, 0.7)',
      cardColor: 'rgba(31, 41, 55, 0.4)',
      sidebarColor: 'rgba(17, 24, 39, 0.8)',
      navbarColor: 'rgba(17, 24, 39, 0.6)',
      headerColor: 'rgba(17, 24, 39, 0.6)',
      footerColor: '#030712',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      textColor: '#f9fafb',
      textMutedColor: '#d1d5db',
      iconColor: '#a855f7',
      linkColor: '#a855f7',
      cardStyle: 'glass',
      borderRadius: '16px',
      shadowIntensity: 'high',
      inputBg: 'rgba(31, 41, 55, 0.3)',
      inputBorderColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Navy',
    isSystem: true,
    config: {
      ...DEFAULT_THEME_CONFIG,
      themeMode: 'dark',
      customPrimary: '#2563eb',
      customSecondary: '#4f46e5',
      accentColor: '#3b82f6',
      backgroundColor: '#0a0f1d',
      surfaceColor: '#0e172c',
      cardColor: '#111e3b',
      sidebarColor: '#0a0f1d',
      navbarColor: '#0e172c',
      headerColor: '#0e172c',
      footerColor: '#060a14',
      buttonColor: '#2563eb',
      buttonHoverColor: '#1d4ed8',
      buttonActiveColor: '#1e40af',
      borderColor: 'rgba(37, 99, 235, 0.15)',
      textColor: '#f1f5f9',
      textMutedColor: '#94a3b8',
      iconColor: '#2563eb',
      linkColor: '#2563eb',
      fontFamily: 'Inter',
      borderRadius: '6px',
      cardStyle: 'bordered',
      shadowIntensity: 'medium'
    }
  },
  {
    id: 'elegant-emerald',
    name: 'Elegant Emerald',
    isSystem: true,
    config: {
      ...DEFAULT_THEME_CONFIG,
      themeMode: 'dark',
      customPrimary: '#10b981',
      customSecondary: '#047857',
      accentColor: '#34d399',
      backgroundColor: '#022c22',
      surfaceColor: '#064e3b',
      cardColor: '#065f46',
      sidebarColor: '#022c22',
      navbarColor: '#064e3b',
      headerColor: '#064e3b',
      footerColor: '#021e17',
      buttonColor: '#10b981',
      buttonHoverColor: '#059669',
      buttonActiveColor: '#047857',
      borderColor: 'rgba(52, 211, 153, 0.15)',
      textColor: '#f0fdf4',
      textMutedColor: '#a7f3d0',
      iconColor: '#10b981',
      linkColor: '#10b981',
      borderRadius: '16px',
      cardStyle: 'bordered',
      shadowIntensity: 'medium'
    }
  },
  {
    id: 'mono-brutalist',
    name: 'Monochrome Brutalist',
    isSystem: true,
    config: {
      ...DEFAULT_THEME_CONFIG,
      themeMode: 'light',
      customPrimary: '#000000',
      customSecondary: '#000000',
      accentColor: '#000000',
      backgroundColor: '#ffffff',
      surfaceColor: '#ffffff',
      cardColor: '#ffffff',
      sidebarColor: '#ffffff',
      navbarColor: '#ffffff',
      headerColor: '#ffffff',
      footerColor: '#ffffff',
      buttonColor: '#000000',
      buttonHoverColor: '#333333',
      buttonActiveColor: '#111111',
      borderColor: '#000000',
      textColor: '#000000',
      textMutedColor: '#444444',
      iconColor: '#000000',
      linkColor: '#000000',
      borderRadius: '0px',
      cardStyle: 'bordered',
      buttonStyle: 'square',
      fontFamily: 'Fira Code',
      shadowIntensity: 'high',
      inputBg: '#ffffff',
      inputBorderColor: '#000000'
    }
  }
];

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

const DEFAULT_BLOGS = [
  {
    id: 'blog-1',
    title: 'How to Optimize Shopify Page Speed Under 1.5 Seconds',
    slug: 'shopify-speed-optimization',
    content: `## The Need for Speed in E-commerce

When selling online, every millisecond counts. Industry data shows that a **1-second delay in mobile load times can decrease conversion rates by up to 20%**. In this comprehensive guide, we'll dive deep into optimizing Shopify themes using clean Liquid code, rather than stacking heavy page builder applications.

### 1. Ditch the Bloated Page Builders
Applications like Elementor, PageFly, or Shogun generate immense DOM node clutter and render-blocking resources. Instead:
- Hand-code bespoke sections using native **Shopify Liquid & Tailwind CSS**.
- Leverage modular schemas for customizable homepage drag-and-drop structures.

### 2. Streamline App Integration Loops
Every Shopify app you install adds external script tags to your theme layout. Review your active applications:
- Strip out tracking codes of uninstalled apps.
- Lazily load client reviews or non-critical integrations.

### Conclusion
By streamlining DOM structures and removing bulky modules, we achieved a stable mobile speed audit score of 98% with load speeds well under 1.5 seconds.`,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    date: 'July 10, 2026',
    author: 'Rizwan Saeed',
    seoTitle: 'Optimizing Shopify Theme Speed Under 1.5s | Rizwan Saeed',
    seoDescription: 'Learn how to speed up your Shopify storefront without code bloat. Step-by-step native Liquid optimization guide by Rizwan Saeed.',
    seoKeywords: 'Shopify speed, page speed optimization, liquid theme development, e-commerce CRO'
  },
  {
    id: 'blog-2',
    title: 'Meta Conversions API (CAPI) vs. Browser Pixel tracking',
    slug: 'meta-conversions-api-guide',
    content: `## The Modern Attribution Crisis

With Apple's iOS App Tracking Transparency (ATT) framework and the gradual phase-out of third-party cookies, standard browser-side pixel tracking has lost up to 40% of its accuracy. 

### What is the Meta Conversions API?
The **Meta Conversions API (CAPI)** allows advertisers to send web events directly from their server to Meta, bypassing browser-side blockers, ad network shields, and cookie limitations.

### Dual-Tagging Architecture
For the best results, implement a dual-tagging layout:
1. **Browser Pixel**: To track quick client-side interactions and capture immediate device context.
2. **Server-Side API**: To secure stable conversion events directly from checkout webhooks.

This guarantees complete attribution transparency and helps Meta's AI optimize ad delivery with reduced CPAs.`,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    date: 'June 28, 2026',
    author: 'Rizwan Saeed',
    seoTitle: 'Meta Conversions API vs Browser Pixel: Dynamic Tracking | Rizwan Saeed',
    seoDescription: 'Solve iOS tracking loss. Discover how configuring server-side GTM with Meta Conversions API halves acquisition cost.',
    seoKeywords: 'Meta CAPI, conversions API, server-side tracking, GTM GA4'
  }
];

const DEFAULT_INBOX = [
  {
    id: 'INBOX-827104',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    name: 'Sarah Jenkins',
    email: 'sarah@luxoretails.com',
    company: 'Luxo Retails Dubai',
    projectType: 'shopify-development',
    budget: '15k-30k',
    requirements: 'Need a custom headless Shopify store with ultra-low mobile load speed and direct checkout conversions API setup. Currently using a heavy PageFly layout.',
    read: false
  },
  {
    id: 'INBOX-194820',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    name: 'Ahmed Al-Mansoori',
    email: 'ahmed@mideastventures.ae',
    company: 'Mideast Organic Care',
    projectType: 'google-meta-ads',
    budget: '5k-15k',
    requirements: 'Looking for Google and Meta Ads manager to scale our monthly revenue. We are based in Dubai Marina and need setup of correct server-side CAPI tracking.',
    read: true
  }
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [activeMainPage, setActiveMainPage] = useState<'home' | 'blog'>('home');
  const [isAuthorized, setIsAuthorizedState] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPasskey, setAdminPasskey] = useState('admin123');

  // Live Compiled states
  const [liveStatsMetrics, setLiveStatsMetrics] = useState(STATS_METRICS);
  const [liveAnalyticsProperties, setLiveAnalyticsProperties] = useState(ANALYTICS_PROPERTIES);
  const [liveLogoWall, setLiveLogoWall] = useState(DEFAULT_LOGO_WALL);
  const [liveTimeline, setLiveTimeline] = useState(TIMELINE);
  const [liveClientsPortfolio, setLiveClientsPortfolio] = useState(CLIENTS_PORTFOLIO);
  const [liveTestimonials, setLiveTestimonials] = useState(TESTIMONIALS);
  const [liveFaqs, setLiveFaqs] = useState(FAQS);
  const [liveHero, setLiveHero] = useState({
    headline: 'Scale Your Business With',
    headlineAccent: 'Proven Growth Strategies',
    subheadline: 'Results-driven Digital Marketing Manager and Shopify Developer with proven experience generating over AED 1.2 Million revenue through Google Ads, Meta Ads, SEO, Shopify Development, and Conversion Optimization.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop'
  });
  const [liveRoiSettings, setLiveRoiSettings] = useState({
    b2cDefaultCPC: 1.25,
    b2cSpeedBoost: 1.5,
    b2bDefaultCPL: 45,
    b2bServerSideBoost: 48
  });
  const [liveBrandInfo, setLiveBrandInfo] = useState({
    logoInitials: 'RS',
    logoText: 'Rizwan Saeed',
    logoTagline: 'Shopify & Growth PPC',
    logoImageUrl: '',
    footerDesc: 'High-performance Shopify Liquid theme development & digital marketing strategies designed for high-scale hospitality and retail brands.',
    footerLocation: 'DUBAI, UAE (GST)',
    contactEmail: 'RIZWANSAEED610@gmail.com',
    contactPhone: '+971 50 000 0000',
    whatsappNumber: '+971 50 000 0000',
    linkedinUrl: 'https://linkedin.com/in/rizwansaeed',
    twitterUrl: 'https://twitter.com/rizwansaeed',
    facebookUrl: 'https://facebook.com/rizwansaeed',
    instagramUrl: 'https://instagram.com/rizwansaeed',
    githubUrl: 'https://github.com/rizwansaeed',
    systemExpertise: [
      'Shopify Plus & Custom Liquid',
      'Conversion Rate Optimization (CRO)',
      'Multi-Channel Acquisition (Meta, Google)',
      'Technical SEO Architecture'
    ]
  });
  const [liveServices, setLiveServices] = useState(SERVICES);
  const [liveBlogPosts, setLiveBlogPosts] = useState(DEFAULT_BLOGS);
  const [liveWhatsappConfig, setLiveWhatsappConfig] = useState({
    enabled: true,
    number: '+971500000000',
    message: 'Hello Rizwan, I visited your portfolio and want to discuss a project with you!',
    agentName: 'Rizwan Saeed',
    agentStatus: 'Online (Typically replies in 5 mins)',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    supportEmail: 'RIZWANSAEED610@gmail.com',
    supportPhone: '+971 50 000 0000',
    supportHours: '9:00 AM - 6:00 PM (GST)',
    supportDays: 'Monday - Saturday'
  });
  const [liveMapConfig, setLiveMapConfig] = useState({
    address: 'Dubai Marina, Dubai, United Arab Emirates',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57762.59344425883!2d55.11585802521971!3d25.076326168019313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f13472ed83b0f%3A0x33dd37df7e79df3f!2sDubai%20Marina%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae',
    latitude: '25.0763',
    longitude: '55.1311'
  });
  const [liveThemeConfig, setLiveThemeConfig] = useState<any>({ ...DEFAULT_THEME_CONFIG });

  const [templates, setTemplates] = useState<any[]>(DEFAULT_TEMPLATES);
  const [liveInboxSubmissions, setLiveInboxSubmissions] = useState<any[]>(DEFAULT_INBOX);

  const [systemThemeMode, setSystemThemeMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) return 'dark';
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const determineSystemTheme = () => {
      // 1. Check OS preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const osTheme = mediaQuery.matches ? 'dark' : 'light';

      // 2. Fallback to system time (Daytime is 6 AM to 6 PM)
      const hour = new Date().getHours();
      const timeTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';

      // Prefer OS scheme if media query matches dark, else system time
      return mediaQuery.matches ? 'dark' : timeTheme;
    };

    // Listen to OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      setSystemThemeMode(determineSystemTheme());
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // Set up timer to check every 1 minute for time-of-day changes
    const interval = setInterval(() => {
      setSystemThemeMode(determineSystemTheme());
    }, 60000);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      clearInterval(interval);
    };
  }, []);

  const effectiveThemeMode = useMemo(() => {
    if (liveThemeConfig?.schedulerEnabled) {
      try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeVal = currentHour * 60 + currentMinute;

        const parseTime = (tStr: string) => {
          const [h, m] = (tStr || '07:00').split(':').map(Number);
          return h * 60 + (m || 0);
        };

        const startVal = parseTime(liveThemeConfig.schedulerLightStart || '07:00');
        const endVal = parseTime(liveThemeConfig.schedulerLightEnd || '19:00');

        let isLight = false;
        if (startVal < endVal) {
          isLight = currentTimeVal >= startVal && currentTimeVal < endVal;
        } else {
          isLight = currentTimeVal >= startVal || currentTimeVal < endVal;
        }
        return isLight ? 'light' : 'dark';
      } catch (err) {
        console.error("Error in theme scheduler calculation:", err);
      }
    }

    const mode = liveThemeConfig?.themeMode || 'dark';
    if (mode === 'auto') {
      return systemThemeMode;
    }
    return mode as 'light' | 'dark';
  }, [liveThemeConfig, systemThemeMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (effectiveThemeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [effectiveThemeMode]);
  
  const [liveMediaItems, setLiveMediaItems] = useState<any[]>([
    { id: 'hero-avatar', name: 'Rizwan Bio Avatar', url: 'https://picsum.photos/seed/rizwan/400/400', size: '142 KB', dimensions: '600x600', type: 'PNG' },
    { id: 'dubai-hotel-banner', name: 'Dubai Hotels Campaign Cover', url: 'https://picsum.photos/seed/dubai/1200/600', size: '382 KB', dimensions: '1200x600', type: 'JPEG' },
    { id: 'attrex-logo', name: 'Aetrex Partnership Icon', url: 'https://picsum.photos/seed/footwear/200/200', size: '18 KB', dimensions: '200x200', type: 'PNG' },
    { id: 'gsc-chart-export', name: 'SEO Core Web Vitals Report', url: 'https://picsum.photos/seed/gsc/800/400', size: '115 KB', dimensions: '800x400', type: 'PNG' }
  ]);

  // Draft states (working space inside admin panel)
  const [statsMetrics, setStatsMetrics] = useState(STATS_METRICS);
  const [analyticsProperties, setAnalyticsProperties] = useState(ANALYTICS_PROPERTIES);
  const [logoWall, setLogoWall] = useState(DEFAULT_LOGO_WALL);
  const [timeline, setTimeline] = useState(TIMELINE);
  const [clientsPortfolio, setClientsPortfolio] = useState(CLIENTS_PORTFOLIO);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [faqs, setFaqs] = useState(FAQS);
  const [hero, setHero] = useState({
    headline: 'Scale Your Business With',
    headlineAccent: 'Proven Growth Strategies',
    subheadline: 'Results-driven Digital Marketing Manager and Shopify Developer with proven experience generating over AED 1.2 Million revenue through Google Ads, Meta Ads, SEO, Shopify Development, and Conversion Optimization.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop'
  });
  const [roiSettings, setRoiSettings] = useState({
    b2cDefaultCPC: 1.25,
    b2cSpeedBoost: 1.5,
    b2bDefaultCPL: 45,
    b2bServerSideBoost: 48
  });
  const [brandInfo, setBrandInfo] = useState({
    logoInitials: 'RS',
    logoText: 'Rizwan Saeed',
    logoTagline: 'Shopify & Growth PPC',
    logoImageUrl: '',
    footerDesc: 'High-performance Shopify Liquid theme development & digital marketing strategies designed for high-scale hospitality and retail brands.',
    footerLocation: 'DUBAI, UAE (GST)',
    contactEmail: 'RIZWANSAEED610@gmail.com',
    contactPhone: '+971 50 000 0000',
    whatsappNumber: '+971 50 000 0000',
    linkedinUrl: 'https://linkedin.com/in/rizwansaeed',
    twitterUrl: 'https://twitter.com/rizwansaeed',
    facebookUrl: 'https://facebook.com/rizwansaeed',
    instagramUrl: 'https://instagram.com/rizwansaeed',
    githubUrl: 'https://github.com/rizwansaeed',
    systemExpertise: [
      'Shopify Plus & Custom Liquid',
      'Conversion Rate Optimization (CRO)',
      'Multi-Channel Acquisition (Meta, Google)',
      'Technical SEO Architecture'
    ]
  });
  const [services, setServices] = useState(SERVICES);
  const [blogPosts, setBlogPosts] = useState(DEFAULT_BLOGS);
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: true,
    number: '+971500000000',
    message: 'Hello Rizwan, I visited your portfolio and want to discuss a project with you!',
    agentName: 'Rizwan Saeed',
    agentStatus: 'Online (Typically replies in 5 mins)',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    supportEmail: 'RIZWANSAEED610@gmail.com',
    supportPhone: '+971 50 000 0000',
    supportHours: '9:00 AM - 6:00 PM (GST)',
    supportDays: 'Monday - Saturday'
  });
  const [mapConfig, setMapConfig] = useState({
    address: 'Dubai Marina, Dubai, United Arab Emirates',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57762.59344425883!2d55.11585802521971!3d25.076326168019313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f13472ed83b0f%3A0x33dd37df7e79df3f!2sDubai%20Marina%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae',
    latitude: '25.0763',
    longitude: '55.1311'
  });
  const [themeConfig, setThemeConfig] = useState<any>({ ...DEFAULT_THEME_CONFIG });
  const [inboxSubmissions, setInboxSubmissions] = useState<any[]>(DEFAULT_INBOX);
  const [mediaItems, setMediaItems] = useState<any[]>([
    { id: 'hero-avatar', name: 'Rizwan Bio Avatar', url: 'https://picsum.photos/seed/rizwan/400/400', size: '142 KB', dimensions: '600x600', type: 'PNG' },
    { id: 'dubai-hotel-banner', name: 'Dubai Hotels Campaign Cover', url: 'https://picsum.photos/seed/dubai/1200/600', size: '382 KB', dimensions: '1200x600', type: 'JPEG' },
    { id: 'attrex-logo', name: 'Aetrex Partnership Icon', url: 'https://picsum.photos/seed/footwear/200/200', size: '18 KB', dimensions: '200x200', type: 'PNG' },
    { id: 'gsc-chart-export', name: 'SEO Core Web Vitals Report', url: 'https://picsum.photos/seed/gsc/800/400', size: '115 KB', dimensions: '800x400', type: 'PNG' }
  ]);

  // Custom Integration Scripts / Pixels (GTM, Meta Pixel, custom tag scripts)
  const [liveCustomScripts, setLiveCustomScripts] = useState<Array<{ id: string; name: string; code: string; placement: 'head' | 'body' | 'footer'; active: boolean }>>([
    {
      id: 'gtm',
      name: 'Google Tag Manager',
      code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K5BZ29R');</script>
<!-- End Google Tag Manager -->`,
      placement: 'head',
      active: true
    },
    {
      id: 'fb-pixel',
      name: 'Facebook Pixel',
      code: `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '984729184572910');
fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->`,
      placement: 'head',
      active: false
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      code: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8L92J8519B"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8L92J8519B');
</script>`,
      placement: 'head',
      active: true
    }
  ]);

  const [customScripts, setCustomScripts] = useState<Array<{ id: string; name: string; code: string; placement: 'head' | 'body' | 'footer'; active: boolean }>>([
    {
      id: 'gtm',
      name: 'Google Tag Manager',
      code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K5BZ29R');</script>
<!-- End Google Tag Manager -->`,
      placement: 'head',
      active: true
    },
    {
      id: 'fb-pixel',
      name: 'Facebook Pixel',
      code: `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '984729184572910');
fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->`,
      placement: 'head',
      active: false
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      code: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8L92J8519B"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8L92J8519B');
</script>`,
      placement: 'head',
      active: true
    }
  ]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Global Contact Modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Admin System activity logs with pure, static initial values
  const [logs, setLogs] = useState<Array<{ id: string; type: 'login' | 'save' | 'system'; message: string; time: string; timestamp: number; read: boolean }>>([
    {
      id: 'system-init',
      type: 'system',
      message: 'Secure system workspace initialized and ready.',
      time: '09:00:00 AM',
      timestamp: 1783660800000,
      read: true
    }
  ]);

  const addLog = (type: 'login' | 'save' | 'system', message: string) => {
    const timestamp = Date.now();
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    const newLog = {
      id: `${type}-${timestamp}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      message,
      time,
      timestamp,
      read: false
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const setIsAuthorized = (val: boolean) => {
    setIsAuthorizedState(val);
    if (val) {
      addLog('login', 'Administrative session authorized via secure credentials gate.');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load local storage values and fetch inbox on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadServerConfig = async () => {
        try {
          const res = await fetch('/api/config');
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.config) {
              const cfg = data.config;
              if (cfg.statsMetrics) { setStatsMetrics(cfg.statsMetrics); setLiveStatsMetrics(cfg.statsMetrics); }
              if (cfg.analyticsProperties) { setAnalyticsProperties(cfg.analyticsProperties); setLiveAnalyticsProperties(cfg.analyticsProperties); }
              if (cfg.logoWall) { setLogoWall(cfg.logoWall); setLiveLogoWall(cfg.logoWall); }
              if (cfg.timeline) { setTimeline(cfg.timeline); setLiveTimeline(cfg.timeline); }
              if (cfg.clientsPortfolio) { setClientsPortfolio(cfg.clientsPortfolio); setLiveClientsPortfolio(cfg.clientsPortfolio); }
              if (cfg.testimonials) { setTestimonials(cfg.testimonials); setLiveTestimonials(cfg.testimonials); }
              if (cfg.faqs) { setFaqs(cfg.faqs); setLiveFaqs(cfg.faqs); }
              if (cfg.hero) { setHero(cfg.hero); setLiveHero(cfg.hero); }
              if (cfg.roiSettings) { setRoiSettings(cfg.roiSettings); setLiveRoiSettings(cfg.roiSettings); }
              if (cfg.brandInfo) { setBrandInfo(cfg.brandInfo); setLiveBrandInfo(cfg.brandInfo); }
              if (cfg.services) { setServices(cfg.services); setLiveServices(cfg.services); }
              if (cfg.blogPosts) { setBlogPosts(cfg.blogPosts); setLiveBlogPosts(cfg.blogPosts); }
              if (cfg.whatsappConfig) { setWhatsappConfig(cfg.whatsappConfig); setLiveWhatsappConfig(cfg.whatsappConfig); }
              if (cfg.mapConfig) { setMapConfig(cfg.mapConfig); setLiveMapConfig(cfg.mapConfig); }
              if (cfg.themeConfig) { setThemeConfig(cfg.themeConfig); setLiveThemeConfig(cfg.themeConfig); }
              if (cfg.mediaItems) { setMediaItems(cfg.mediaItems); setLiveMediaItems(cfg.mediaItems); }
              if (cfg.customScripts) { setCustomScripts(cfg.customScripts); setLiveCustomScripts(cfg.customScripts); }
              if (cfg.adminUsername) setAdminUsername(cfg.adminUsername);
              if (cfg.adminPasskey) setAdminPasskey(cfg.adminPasskey);
              return true;
            }
          }
        } catch (err) {
          console.warn("Failed to load server-side configuration:", err);
        }
        return false;
      };

      const loadLocalStorageFallback = () => {
        // Safe Load Theme Config and Templates from localStorage
        try {
          const storedTheme = localStorage.getItem('saas_live_theme_config');
          if (storedTheme) {
            try {
              const parsed = JSON.parse(storedTheme);
              const merged = { ...DEFAULT_THEME_CONFIG, ...parsed };
              setTimeout(() => {
                setLiveThemeConfig(merged);
                setThemeConfig(merged);
              }, 0);
            } catch (e) {
              console.error("Failed to parse saas_live_theme_config inside mount effect:", e);
            }
          }

          const storedTemplates = localStorage.getItem('saas_theme_templates');
          if (storedTemplates) {
            try {
              const parsedTemplates = JSON.parse(storedTemplates);
              if (Array.isArray(parsedTemplates)) {
                setTimeout(() => {
                  setTemplates(parsedTemplates);
                }, 0);
              }
            } catch (e) {
              console.error("Failed to parse saas_theme_templates inside mount effect:", e);
            }
          }
        } catch (e) {
          console.warn("localStorage is blocked or unavailable:", e);
        }

        // Safe Load Media Items from localStorage
        try {
          const storedMedia = localStorage.getItem('saas_live_media_items');
          if (storedMedia) {
            try {
              const parsed = JSON.parse(storedMedia);
              setTimeout(() => {
                setLiveMediaItems(parsed);
                setMediaItems(parsed);
              }, 0);
            } catch (e) {
              console.error("Failed to parse saas_live_media_items:", e);
            }
          }
        } catch (e) {
          console.warn("localStorage media items blocked or unavailable:", e);
        }

        // Safe Load other configuration states from localStorage
        const loadConfigItem = (key: string, setDraft: Function, setLive: Function) => {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              setTimeout(() => {
                setDraft(parsed);
                setLive(parsed);
              }, 0);
            }
          } catch (e) {
            console.warn(`Failed to load ${key} from localStorage:`, e);
          }
        };

        loadConfigItem('saas_live_stats_metrics', setStatsMetrics, setLiveStatsMetrics);
        loadConfigItem('saas_live_analytics_properties', setAnalyticsProperties, setLiveAnalyticsProperties);
        loadConfigItem('saas_live_logo_wall', setLogoWall, setLiveLogoWall);
        loadConfigItem('saas_live_timeline', setTimeline, setLiveTimeline);
        loadConfigItem('saas_live_clients_portfolio', setClientsPortfolio, setLiveClientsPortfolio);
        loadConfigItem('saas_live_testimonials', setTestimonials, setLiveTestimonials);
        loadConfigItem('saas_live_faqs', setFaqs, setLiveFaqs);
        loadConfigItem('saas_live_hero', setHero, setLiveHero);
        loadConfigItem('saas_live_roi_settings', setRoiSettings, setLiveRoiSettings);
        loadConfigItem('saas_live_brand_info', setBrandInfo, setLiveBrandInfo);
        loadConfigItem('saas_live_services', setServices, setLiveServices);
        loadConfigItem('saas_live_blog_posts', setBlogPosts, setLiveBlogPosts);
        loadConfigItem('saas_live_whatsapp_config', setWhatsappConfig, setLiveWhatsappConfig);
        loadConfigItem('saas_live_map_config', setMapConfig, setLiveMapConfig);
        loadConfigItem('saas_live_custom_scripts', setCustomScripts, setLiveCustomScripts);

        try {
          const storedAdminUsername = localStorage.getItem('saas_live_admin_username');
          const storedAdminPasskey = localStorage.getItem('saas_live_admin_passkey');
          if (storedAdminUsername) setAdminUsername(storedAdminUsername);
          if (storedAdminPasskey) setAdminPasskey(storedAdminPasskey);
        } catch (e) {
          console.warn("Failed to load admin credentials from localStorage fallback:", e);
        }
      };

      // Main initialization orchestrator
      const initConfigStore = async () => {
        const loadedFromServer = await loadServerConfig();
        if (!loadedFromServer) {
          loadLocalStorageFallback();
        }
      };

      initConfigStore();

      // 2. Load Inbox from Server API with fallback to localStorage
      const loadInbox = async () => {
        try {
          const res = await fetch('/api/inbox');
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.submissions)) {
              setTimeout(() => {
                setLiveInboxSubmissions(data.submissions);
                setInboxSubmissions(data.submissions);
              }, 0);
              try {
                localStorage.setItem('saas_inbox_submissions', JSON.stringify(data.submissions));
              } catch (e) {}
              return; // Successfully loaded from server, skip local storage fallback
            }
          }
        } catch (err) {
          console.warn("Failed to fetch inbox from server, falling back to local storage:", err);
        }

        // Fallback: Safe Load Inbox from localStorage
        try {
          const storedInbox = localStorage.getItem('saas_inbox_submissions');
          if (storedInbox) {
            try {
              const parsed = JSON.parse(storedInbox);
              setTimeout(() => {
                setLiveInboxSubmissions(parsed);
                setInboxSubmissions(parsed);
              }, 0);
            } catch (e) {
              console.error("Failed to parse saas_inbox_submissions:", e);
            }
          }
        } catch (e) {
          console.warn("localStorage is blocked or unavailable:", e);
        }
      };

      loadInbox();
    }
  }, []);

  // Check if there are unsaved workspace drafts compared to live compiled states
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(statsMetrics) !== JSON.stringify(liveStatsMetrics) ||
           JSON.stringify(analyticsProperties) !== JSON.stringify(liveAnalyticsProperties) ||
           JSON.stringify(logoWall) !== JSON.stringify(liveLogoWall) ||
           JSON.stringify(timeline) !== JSON.stringify(liveTimeline) ||
           JSON.stringify(clientsPortfolio) !== JSON.stringify(liveClientsPortfolio) ||
           JSON.stringify(testimonials) !== JSON.stringify(liveTestimonials) ||
           JSON.stringify(faqs) !== JSON.stringify(liveFaqs) ||
           JSON.stringify(hero) !== JSON.stringify(liveHero) ||
           JSON.stringify(roiSettings) !== JSON.stringify(liveRoiSettings) ||
           JSON.stringify(brandInfo) !== JSON.stringify(liveBrandInfo) ||
           JSON.stringify(services) !== JSON.stringify(liveServices) ||
           JSON.stringify(blogPosts) !== JSON.stringify(liveBlogPosts) ||
           JSON.stringify(whatsappConfig) !== JSON.stringify(liveWhatsappConfig) ||
           JSON.stringify(mapConfig) !== JSON.stringify(liveMapConfig) ||
           JSON.stringify(themeConfig) !== JSON.stringify(liveThemeConfig) ||
           JSON.stringify(mediaItems) !== JSON.stringify(liveMediaItems) ||
           JSON.stringify(customScripts) !== JSON.stringify(liveCustomScripts);
  }, [
    statsMetrics, liveStatsMetrics,
    analyticsProperties, liveAnalyticsProperties,
    logoWall, liveLogoWall,
    timeline, liveTimeline,
    clientsPortfolio, liveClientsPortfolio,
    testimonials, liveTestimonials,
    faqs, liveFaqs,
    hero, liveHero,
    roiSettings, liveRoiSettings,
    brandInfo, liveBrandInfo,
    services, liveServices,
    blogPosts, liveBlogPosts,
    whatsappConfig, liveWhatsappConfig,
    mapConfig, liveMapConfig,
    themeConfig, liveThemeConfig,
    mediaItems, liveMediaItems,
    customScripts, liveCustomScripts
  ]);

  const saveChanges = () => {
    const changes: string[] = [];
    if (JSON.stringify(statsMetrics) !== JSON.stringify(liveStatsMetrics)) changes.push("Stats");
    if (JSON.stringify(analyticsProperties) !== JSON.stringify(liveAnalyticsProperties)) changes.push("Domains");
    if (JSON.stringify(logoWall) !== JSON.stringify(liveLogoWall)) changes.push("Logo Wall");
    if (JSON.stringify(timeline) !== JSON.stringify(liveTimeline)) changes.push("Timeline");
    if (JSON.stringify(clientsPortfolio) !== JSON.stringify(liveClientsPortfolio)) changes.push("Showcase");
    if (JSON.stringify(testimonials) !== JSON.stringify(liveTestimonials)) changes.push("Reviews");
    if (JSON.stringify(faqs) !== JSON.stringify(liveFaqs)) changes.push("FAQs");
    if (JSON.stringify(hero) !== JSON.stringify(liveHero)) changes.push("Hero Title");
    if (JSON.stringify(roiSettings) !== JSON.stringify(liveRoiSettings)) changes.push("ROI Settings");
    if (JSON.stringify(brandInfo) !== JSON.stringify(liveBrandInfo)) changes.push("Brand Details");
    if (JSON.stringify(services) !== JSON.stringify(liveServices)) changes.push("Services");
    if (JSON.stringify(blogPosts) !== JSON.stringify(liveBlogPosts)) changes.push("Blog Posts");
    if (JSON.stringify(whatsappConfig) !== JSON.stringify(liveWhatsappConfig)) changes.push("WhatsApp Settings");
    if (JSON.stringify(mapConfig) !== JSON.stringify(liveMapConfig)) changes.push("Google Map Settings");
    if (JSON.stringify(themeConfig) !== JSON.stringify(liveThemeConfig)) changes.push("Theme Customization");
    if (JSON.stringify(mediaItems) !== JSON.stringify(liveMediaItems)) changes.push("Media Library");
    if (JSON.stringify(customScripts) !== JSON.stringify(liveCustomScripts)) changes.push("Custom Scripts & Pixels");

    const changesText = changes.length > 0 ? changes.join(", ") : "no modifications";

    setLiveStatsMetrics(statsMetrics);
    setLiveAnalyticsProperties(analyticsProperties);
    setLiveLogoWall(logoWall);
    setLiveTimeline(timeline);
    setLiveClientsPortfolio(clientsPortfolio);
    setLiveTestimonials(testimonials);
    setLiveFaqs(faqs);
    setLiveHero(hero);
    setLiveRoiSettings(roiSettings);
    setLiveBrandInfo(brandInfo);
    setLiveServices(services);
    setLiveBlogPosts(blogPosts);
    setLiveWhatsappConfig(whatsappConfig);
    setLiveMapConfig(mapConfig);
    setLiveThemeConfig(themeConfig);
    setLiveMediaItems(mediaItems);
    setLiveCustomScripts(customScripts);

    // Save configuration to Server API dynamically for absolute persistence across visitors
    const configData = {
      statsMetrics,
      analyticsProperties,
      logoWall,
      timeline,
      clientsPortfolio,
      testimonials,
      faqs,
      hero,
      roiSettings,
      brandInfo,
      services,
      blogPosts,
      whatsappConfig,
      mapConfig,
      themeConfig,
      mediaItems,
      customScripts,
      adminUsername,
      adminPasskey
    };

    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    }).catch(err => console.warn("Failed to sync configuration to server API:", err));

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saas_live_theme_config', JSON.stringify(themeConfig));
        localStorage.setItem('saas_live_media_items', JSON.stringify(mediaItems));
        localStorage.setItem('saas_live_stats_metrics', JSON.stringify(statsMetrics));
        localStorage.setItem('saas_live_analytics_properties', JSON.stringify(analyticsProperties));
        localStorage.setItem('saas_live_logo_wall', JSON.stringify(logoWall));
        localStorage.setItem('saas_live_timeline', JSON.stringify(timeline));
        localStorage.setItem('saas_live_clients_portfolio', JSON.stringify(clientsPortfolio));
        localStorage.setItem('saas_live_testimonials', JSON.stringify(testimonials));
        localStorage.setItem('saas_live_faqs', JSON.stringify(faqs));
        localStorage.setItem('saas_live_hero', JSON.stringify(hero));
        localStorage.setItem('saas_live_roi_settings', JSON.stringify(roiSettings));
        localStorage.setItem('saas_live_brand_info', JSON.stringify(brandInfo));
        localStorage.setItem('saas_live_services', JSON.stringify(services));
        localStorage.setItem('saas_live_blog_posts', JSON.stringify(blogPosts));
        localStorage.setItem('saas_live_whatsapp_config', JSON.stringify(whatsappConfig));
        localStorage.setItem('saas_live_map_config', JSON.stringify(mapConfig));
        localStorage.setItem('saas_live_custom_scripts', JSON.stringify(customScripts));
        localStorage.setItem('saas_live_admin_username', adminUsername);
        localStorage.setItem('saas_live_admin_passkey', adminPasskey);
      }
    } catch (e) {
      console.warn("localStorage write blocked (configs):", e);
    }

    addLog('save', `Workspace changes compiled & saved successfully (${changesText}).`);
    showToast("Changes compiled and saved successfully! Dynamic properties are live.", "success");
  };

  const discardChanges = () => {
    setStatsMetrics(liveStatsMetrics);
    setAnalyticsProperties(liveAnalyticsProperties);
    setLogoWall(liveLogoWall);
    setTimeline(liveTimeline);
    setClientsPortfolio(liveClientsPortfolio);
    setTestimonials(liveTestimonials);
    setFaqs(liveFaqs);
    setHero(liveHero);
    setRoiSettings(liveRoiSettings);
    setBrandInfo(liveBrandInfo);
    setServices(liveServices);
    setBlogPosts(liveBlogPosts);
    setWhatsappConfig(liveWhatsappConfig);
    setMapConfig(liveMapConfig);
    setThemeConfig(liveThemeConfig);
    setMediaItems(liveMediaItems);
    setCustomScripts(liveCustomScripts);
    showToast("Draft workspace changes discarded.", "info");
  };

  const addInboxSubmission = (submission: any) => {
    const updatedLive = [submission, ...liveInboxSubmissions];
    setLiveInboxSubmissions(updatedLive);
    setInboxSubmissions(updatedLive);
    
    // Sync to Server API
    fetch('/api/inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    }).catch(err => console.warn("Failed to sync submission to server API:", err));

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saas_inbox_submissions', JSON.stringify(updatedLive));
      }
    } catch (e) {
      console.warn("localStorage write blocked (inbox):", e);
    }
    addLog('system', `New secure protocol contact data received from ${submission.name}. Saved in system inbox.`);
  };

  const markInboxRead = (id: string, read: boolean = true) => {
    const updated = liveInboxSubmissions.map(item => item.id === id ? { ...item, read } : item);
    setLiveInboxSubmissions(updated);
    setInboxSubmissions(updated);

    // Sync to Server API
    fetch('/api/inbox', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_read', id, read })
    }).catch(err => console.warn("Failed to sync read status to server API:", err));

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saas_inbox_submissions', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("localStorage write blocked (inbox):", e);
    }
  };

  const deleteInboxItem = (id: string) => {
    const updated = liveInboxSubmissions.filter(item => item.id !== id);
    setLiveInboxSubmissions(updated);
    setInboxSubmissions(updated);

    // Sync to Server API
    fetch('/api/inbox', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    }).catch(err => console.warn("Failed to sync deletion to server API:", err));

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saas_inbox_submissions', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("localStorage write blocked (inbox):", e);
    }
    addLog('system', `Inbox message ${id} deleted.`);
  };

  return (
    <AdminContext.Provider value={{
      viewMode, setViewMode,
      activeMainPage, setActiveMainPage,
      isAuthorized, setIsAuthorized,
      adminUsername, setAdminUsername,
      adminPasskey, setAdminPasskey,
      effectiveThemeMode,
      
      // Live variables
      liveStatsMetrics,
      liveAnalyticsProperties,
      liveLogoWall,
      liveTimeline,
      liveClientsPortfolio,
      liveTestimonials,
      liveFaqs,
      liveHero,
      liveRoiSettings,
      liveBrandInfo,
      liveServices,
      liveBlogPosts,
      liveWhatsappConfig,
      liveMapConfig,
      liveThemeConfig, setLiveThemeConfig,
      liveInboxSubmissions,
      liveCustomScripts,
 
      // Draft variables
      statsMetrics, setStatsMetrics,
      analyticsProperties, setAnalyticsProperties,
      logoWall, setLogoWall,
      timeline, setTimeline,
      clientsPortfolio, setClientsPortfolio,
      testimonials, setTestimonials,
      faqs, setFaqs,
      hero, setHero,
      roiSettings, setRoiSettings,
      brandInfo, setBrandInfo,
      services, setServices,
      blogPosts, setBlogPosts,
      whatsappConfig, setWhatsappConfig,
      mapConfig, setMapConfig,
      themeConfig, setThemeConfig,
      templates, setTemplates,
      inboxSubmissions, setInboxSubmissions,
      customScripts, setCustomScripts,
      
      // Media Library
      liveMediaItems, setLiveMediaItems,
      mediaItems, setMediaItems,
 
      hasUnsavedChanges,
      saveChanges, discardChanges,
      showToast,
      isContactModalOpen, setIsContactModalOpen,
 
      // Inbox functions
      addInboxSubmission, markInboxRead, deleteInboxItem,
 
      // Activity logs
      logs, setLogs, addLog
    }}>
      {children}
      
      {/* Dynamic Security Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50">
          <div className={cn(
            "px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 font-mono text-xs max-w-sm backdrop-blur-md animate-fadeIn",
            toast.type === 'success' && "bg-[#062c1b]/90 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10",
            toast.type === 'error' && "bg-[#2d1115]/90 border-red-500/50 text-red-400 shadow-red-500/10",
            toast.type === 'info' && "bg-[#0c223c]/90 border-cyan-500/50 text-cyan-400 shadow-cyan-500/10"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              toast.type === 'success' && "bg-emerald-400 animate-pulse",
              toast.type === 'error' && "bg-red-400 animate-pulse",
              toast.type === 'info' && "bg-cyan-400 animate-pulse"
            )} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}
