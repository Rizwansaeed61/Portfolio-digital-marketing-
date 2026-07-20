'use client';

// Handle sandboxed iframe/browser environments where window.fetch is a read-only getter
// and tracking/analytics scripts (like GTM/GA4/Sentry) attempt to assign/hook window.fetch.
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    let currentFetch = originalFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(newFetch) {
        currentFetch = newFetch;
      },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    // Suppress if fetch is non-configurable or already custom-defined
  }
}

import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { 
  Search, Briefcase, TrendingUp, BarChart3, Target, 
  Layers, Globe, Users, User, CheckCircle2, ArrowUpRight, 
  ChevronDown, ChevronUp, Sliders, X, Menu, ExternalLink, Code, 
  Sparkles, Info, Activity, Award, HelpCircle, 
  DollarSign, Check, Phone, Mail, Calendar, MapPin, Clock, MessageCircle, Headphones,
  Lock, Unlock, Settings, Trash2, Plus, Save, RotateCcw,
  Eye, RefreshCw, SlidersHorizontal, AlertCircle, LogOut,
  Database, FolderOpen, FileText, CheckCircle, Home as HomeIcon,
  PlusCircle, EyeOff, ClipboardList, PenTool,
  Linkedin, Twitter, Github, Send, Loader2, Building2, Facebook, Instagram,
  ChevronLeft, ChevronRight, Quote, Play, Pause, Star,
  HeartPulse, Hotel, GraduationCap, Wind, Store, Theater, ShoppingBag, Utensils, Zap, Network, Brush, Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import AdminControlPanel from './AdminControlPanel';
import Header from './Header';
import ReactMarkdown from 'react-markdown';

// High-performance count-up utility for statistics
function CountUp({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const target = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const suffix = value.replace(/[0-9.]/g, ''); // e.g. "%", "M+", "K+"
  
  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) {
      return;
    }
    const totalMiliseconds = duration;
    const incrementTime = 30;
    const totalSteps = totalMiliseconds / incrementTime;
    const increment = end / totalSteps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCurrent(end);
      } else {
        setCurrent(Math.floor(start * 10) / 10);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{current.toLocaleString()}{suffix}</span>;
}

// Helper component for Brand/Partner Logos with Next.js optimization and lazy loading
function LogoImage({ src, alt, className, fallbackDomain }: { src: string; alt: string; className?: string; fallbackDomain?: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={32}
      height={32}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      unoptimized
      onError={() => {
        if (fallbackDomain) {
          setImgSrc(`https://www.google.com/s2/favicons?sz=128&domain=${fallbackDomain}`);
        } else {
          setImgSrc('https://www.google.com/s2/favicons?sz=128&domain=google.com');
        }
      }}
    />
  );
}

// Helper component for smaller Client Showcase Logos with Next.js optimization and lazy loading
function ClientLogoImage({ domain, name, className }: { domain: string; name: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(`https://www.google.com/s2/favicons?sz=64&domain=${domain}`);

  return (
    <Image
      src={imgSrc}
      alt={`${name} logo`}
      width={16}
      height={16}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      unoptimized
      onError={() => {
        setImgSrc('https://www.google.com/s2/favicons?sz=64&domain=google.com');
      }}
    />
  );
}

// Helper component for large Client Showcase Logos (modal view) with Next.js optimization
function LargeClientLogoImage({ domain, name, className }: { domain: string; name: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`);

  return (
    <Image
      src={imgSrc}
      alt={`${name} logo`}
      width={40}
      height={40}
      className={className}
      referrerPolicy="no-referrer"
      unoptimized
      onError={() => {
        setImgSrc('https://www.google.com/s2/favicons?sz=128&domain=google.com');
      }}
    />
  );
}

// Stateful client screenshot component with loading shimmers and premium Unsplash fallbacks
function ClientScreenshot({ client, className }: { client: any; className?: string }) {
  // Determine a highly beautiful and reliable fallback image from Unsplash
  const getFallbackImage = (name: string): string => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('floorcarpet') || (lowercase.includes('carpet') && lowercase.includes('floor'))) {
      return 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('luxurycurtain') || lowercase.includes('curtain')) {
      return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('carpetindubai') || lowercase.includes('carpet')) {
      return 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('epoxyflooring') || lowercase.includes('flooring') || lowercase.includes('floor')) {
      return 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('grass')) {
      return 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('athletics') || lowercase.includes('alphalete')) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('spa') || lowercase.includes('marano')) {
      return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=400&q=80';
    }
    if (lowercase.includes('vivobarefoot') || lowercase.includes('shoe') || lowercase.includes('aetrex') || lowercase.includes('sole') || lowercase.includes('farada')) {
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&h=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80';
  };

  const fallbackSrc = getFallbackImage(client.name);
  const screenshotSrc = client.imageUrl;

  const [screenshotLoaded, setScreenshotLoaded] = useState<boolean>(false);
  const [screenshotError, setScreenshotError] = useState<boolean>(false);
  const [fallbackLoaded, setFallbackLoaded] = useState<boolean>(false);

  // Time out the screenshot loading if it is too slow (e.g., 3.5 seconds)
  useEffect(() => {
    let timer: any;
    if (screenshotSrc && !screenshotLoaded && !screenshotError) {
      timer = setTimeout(() => {
        setScreenshotError(true);
      }, 3500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [screenshotSrc, screenshotLoaded, screenshotError]);

  return (
    <div className={cn("relative w-full h-full bg-zinc-950 overflow-hidden", className)}>
      {/* 1. Base layer: Shimmer loading state */}
      {(!fallbackLoaded && !screenshotLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/40 via-zinc-800/40 to-zinc-900/40 animate-pulse flex items-center justify-center z-10">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        </div>
      )}

      {/* 2. Premium Fallback Unsplash Image Layer */}
      <Image
        src={fallbackSrc}
        alt={`${client.name} fallback preview`}
        fill
        priority={client.highlight}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          "object-cover object-center transition-all duration-700",
          fallbackLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
          screenshotLoaded ? "opacity-20" : "opacity-90"
        )}
        onLoad={() => setFallbackLoaded(true)}
        referrerPolicy="no-referrer"
      />

      {/* 3. Live Screenshot Image Layer (fades in only when loaded) */}
      {screenshotSrc && !screenshotError && (
        <Image
          src={screenshotSrc}
          alt={`${client.name} live preview`}
          fill
          unoptimized={true}
          priority={client.highlight}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover object-top transition-all duration-700 absolute inset-0",
            screenshotLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          onLoad={() => setScreenshotLoaded(true)}
          onError={() => setScreenshotError(true)}
          referrerPolicy="no-referrer"
        />
      )}

      {/* 4. Elegant Branded Label Overlay */}
      {(!screenshotLoaded || screenshotError) && fallbackLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 pointer-events-none">
          <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase font-mono">
            {client.category?.toUpperCase() || 'E-COMMERCE'} SPECIALIST
          </span>
          <h4 className="text-sm font-semibold text-white tracking-tight mt-0.5">
            {client.name}
          </h4>
          <span className="text-[9px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            Verified Case Study
          </span>
        </div>
      )}
    </div>
  );
}

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
} as const;

// ==========================================
// SOURCE OF TRUTH DATA & SECTIONS
// ==========================================

import { useAdmin, AdminProvider } from './admin-context';
import { SERVICES, SIMULATED_TICKER_EVENTS } from './portfolio-data';

// 2. Skill Tags for Executive Biography
const BIOGRAPHY_TAGS = [
  { label: 'Shopify Development', type: 'tech' },
  { label: 'SEO', type: 'seo' },
  { label: 'Google Ads', type: 'ads', isGoogle: true },
  { label: 'Facebook Ads', type: 'ads', isMeta: true },
  { label: 'Ecommerce Growth', type: 'growth' },
  { label: 'Conversion Tracking', type: 'analytics' },
  { label: 'Lead Generation', type: 'growth' }
];

const BIOGRAPHY_TAG_DETAILS: Record<string, {
  description: string;
  metric: string;
  metricLabel: string;
  keyPoints: string[];
  colorClass: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
}> = {
  'Shopify Development': {
    description: 'Specializes in hand-coding bespoke Shopify stores with native Liquid, bypassing bloated page builders for maximum performance, clean DOM structures, and optimized checkout pathways.',
    metric: 'Under 1.5s',
    metricLabel: 'Mobile Speed Average',
    keyPoints: ['Custom Liquid Customizations', 'Critical CSS & Asset Deferral', 'App Integration Cleansing', 'Klaviyo Segment Loops'],
    colorClass: 'text-[#96bf48]',
    borderColor: 'border-[#96bf48]/30',
    bgColor: 'bg-[#96bf48]/10',
    glowColor: 'shadow-[0_0_15px_rgba(150,191,72,0.2)]'
  },
  'SEO': {
    description: 'Advanced technical crawling and indexation management. Leverages schema graphs, semantic siloing, and local search intent mapping to dominate competitive organic search markets.',
    metric: 'Page 1 GCC',
    metricLabel: 'Local Ranking Target',
    keyPoints: ['Technical crawling & crawl budgets', 'JSON-LD Schema Networks', 'Local Map Pack authority', 'Content silos & commercial terms'],
    colorClass: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-950/20',
    glowColor: 'shadow-[0_0_15px_rgba(52,211,153,0.2)]'
  },
  'Google Ads': {
    description: 'Data-driven paid search acquisition managing high-tier regional ad spend. Leverages advanced search match modeling, negative keyword sculpting, and automated bid strategies.',
    metric: '4.2x ROAS',
    metricLabel: 'Average Campaign Returns',
    keyPoints: ['Negative Keyword Sculpting', 'Smart Shopping & pMax Campaigns', 'Exact Match Clustering', 'Dynamic Search Ads'],
    colorClass: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-950/20',
    glowColor: 'shadow-[0_0_15px_rgba(250,204,21,0.2)]'
  },
  'Facebook Ads': {
    description: 'Full-funnel Meta ads scale combining creative intelligence and deep technical server-side attribution tracking. Custom lookalikes, custom dynamic product catalogs, and creative iteration.',
    metric: 'AED 350K+',
    metricLabel: 'Spend Portfolio Managed',
    keyPoints: ['Server-Side Conversions API', 'Creative A/B Multi-variant testing', 'GCC High-Value Lookalikes', 'Engagement Retargeting Loops'],
    colorClass: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-950/20',
    glowColor: 'shadow-[0_0_15px_rgba(56,189,248,0.2)]'
  },
  'Ecommerce Growth': {
    description: 'A comprehensive approach to raising lifetime value (LTV) and multiplying Average Order Value (AOV) through user experience research and customized friction-free checkouts.',
    metric: '+48% Conv.',
    metricLabel: 'Average Funnel Boost',
    keyPoints: ['Checkout friction analysis', 'One-click cross-sells', 'Dynamic bundle mechanics', 'Cart recovery retention'],
    colorClass: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-950/20',
    glowColor: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]'
  },
  'Conversion Tracking': {
    description: 'Enforces flawless marketing attribution by designing server-side tag containers, deduplicating events, and bypassing browser ad-blockers and Apple’s iOS App Tracking Transparency (ATT).',
    metric: '100% Match',
    metricLabel: 'Attribution Accuracy',
    keyPoints: ['GTM Server-Side Containers', 'Meta Conversions API (CAPI)', 'GA4 Event stream setup', 'Custom JS Form listeners'],
    colorClass: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-950/20',
    glowColor: 'shadow-[0_0_15px_rgba(129,140,248,0.2)]'
  },
  'Lead Generation': {
    description: 'Strategic B2B campaigns driving ultra-high-quality direct inquiries for specialized services, commercial contracts, and hospitality reservations.',
    metric: '+140% Leads',
    metricLabel: 'B2B Client Growth',
    keyPoints: ['CRM automated lead routing', 'High-intent landing pages', 'Lookalike audience clustering', 'Verification hook qualifiers'],
    colorClass: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-950/20',
    glowColor: 'shadow-[0_0_15px_rgba(251,113,133,0.2)]'
  }
};

// SERVICES is imported from portfolio-data

// TIMELINE is imported from portfolio-data

// CLIENTS_PORTFOLIO is imported from portfolio-data

// ANALYTICS_PROPERTIES is imported from portfolio-data

// TESTIMONIALS, FAQS, and SIMULATED_TICKER_EVENTS are imported from portfolio-data


const getTagLogo = (label: string) => {
  switch (label) {
    case 'Shopify Development':
      return (
        <svg className="w-3.5 h-3.5 text-[#96bf48]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.54 5.08c-.2-.3-.54-.48-.88-.48l-6.26.54L9.82 1.48c-.14-.36-.48-.68-.84-.68-.34 0-.66.22-1 .54L5.42 5.25l-2.08.18c-.46.04-.8.38-.88 1.25l2.25 14c.08.54.54.92 1.11.92a23 23 0 0 0 12.36 0c.57 0 1.03-.38 1.11-.92l2.25-14c.08-.54-.26-1.04-.88-1.24l-.12-.18zM8.78 2.2l1.62 3.12-3.12.27L8.78 2.2zM6.55 18.46c-.39 0-.71-.32-.71-.71s.32-.71.71-.71.71.32.71.71-.32.71-.71.71zm9.44-5.3c0 .78-.64 1.42-1.42 1.42H10.1c-.78 0-1.42-.64-1.42-1.42s.64-1.42 1.42-1.42h4.47c.78 0 1.42.64 1.42 1.42z" />
        </svg>
      );
    case 'SEO':
      return (
        <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="6" />
          <path d="M11 8v6M8 11h6M21 21l-4.3-4.3" />
        </svg>
      );
    case 'Google Ads':
      return (
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 48 48" fill="none">
          <path d="M33.6 4L11.2 43c-0.8 1.4 0.1 3 1.7 3h4.6c1 0 2-0.5 2.5-1.4l15.3-26.6" fill="#FBBC05" />
          <path d="M42.4 19.3L33.6 4.1c-0.8-1.4-2.6-1.9-4-1.1l-4 2.3c-1.4 0.8-1.9 2.6-1.1 4l8.8 15.2c0.8 1.4 2.6 1.9 4 1.1l4-2.3c1.4-0.8 1.9-2.6 1.1-4z" fill="#4285F4" />
        </svg>
      );
    case 'Facebook Ads':
      return (
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M16.4 6C14.7 6 13.2 6.8 12 8.1 10.8 6.8 9.3 6 7.6 6 4.5 6 2 8.5 2 11.6c0 3.2 2.6 5.9 5.8 5.9 1.7 0 3.2-.8 4.2-2.1 1 1.3 2.5 2.1 4.2 2.1 3.2 0 5.8-2.7 5.8-5.9C22 8.5 19.5 6 16.4 6zm-8.8 9.7c-2.2 0-3.9-1.8-3.9-4.1 0-2.3 1.7-4.1 3.9-4.1 1.2 0 2.3.6 3 1.5-.9 1.2-1.7 2.4-2.6 3.7l-.4.6c-.6 1.4-1.2 2.4-1.2 2.4zm8.8 0c-.5-.7-1.1-1.7-1.7-3.1l-.4-.6c-.9-1.3-1.7-2.5-2.6-3.7.7-.9 1.8-1.5 3-1.5 2.2 0 3.9 1.8 3.9 4.1 0 2.3-1.7 4.1-3.9 4.1z" fill="url(#meta-grad-tag)" />
          <defs>
            <linearGradient id="meta-grad-tag" x1="2" y1="11.6" x2="22" y2="11.6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0064E0" />
              <stop offset="100%" stopColor="#00F2FE" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'Ecommerce Growth':
      return (
        <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 7l-8.5 8.5-5-5L2 17" />
          <polyline points="17 7 22 7 22 12" />
        </svg>
      );
    case 'Conversion Tracking':
      return (
        <svg className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'Lead Generation':
      return (
        <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    default:
      return null;
  }
};


// Logo wall properties are managed via context

// Admin Context, Provider and Hook are now imported from standalone admin-context

// Script manager injector helper component to compile and inject dynamic pixel codes
function ScriptManagerInjector() {
  const { liveCustomScripts } = useAdmin();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // We tag custom elements with custom attribute to clean up and avoid duplicating
    const cleanupInjections = () => {
      const injected = document.querySelectorAll('[data-custom-injected="true"]');
      injected.forEach(el => el.remove());
    };

    cleanupInjections();

    // Skip injecting live analytics/tracking pixels inside sandboxed developer preview/iframes
    // to prevent errors like "Uncaught TypeError: Cannot set property fetch of #<Window> which has only a getter"
    // and to avoid polluting production metrics.
    const isDevPreview = window.location.hostname.includes('run.app') || 
                          window.location.hostname.includes('localhost') || 
                          window.self !== window.top;

    if (isDevPreview) {
      console.info("Tracking scripts injection skipped in developer preview/iframe environment to prevent analytical pollution & sandbox errors.");
      return;
    }

    if (!liveCustomScripts || liveCustomScripts.length === 0) return;

    liveCustomScripts.forEach((script: { id: string; name: string; code: string; placement: 'head' | 'body' | 'footer'; active: boolean }) => {
      if (!script.active || !script.code.trim()) return;

      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = script.code;
        
        const childNodes = Array.from(tempDiv.childNodes);
        
        childNodes.forEach(node => {
          if (node instanceof HTMLElement || node instanceof HTMLScriptElement || node instanceof HTMLStyleElement || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            
            // For script elements, browsers do not execute script content added via innerHTML directly.
            // We must manually construct a script tag, map active attributes, and append it to execute.
            if (node.nodeName === 'SCRIPT') {
              const scriptEl = document.createElement('script');
              
              // Copy attributes
              Array.from((node as HTMLScriptElement).attributes).forEach(attr => {
                scriptEl.setAttribute(attr.name, attr.value);
              });
              scriptEl.text = (node as HTMLScriptElement).text;
              scriptEl.setAttribute('data-custom-injected', 'true');
              scriptEl.setAttribute('data-script-id', script.id);

              if (script.placement === 'head') {
                document.head.appendChild(scriptEl);
              } else if (script.placement === 'body') {
                document.body.insertBefore(scriptEl, document.body.firstChild);
              } else {
                document.body.appendChild(scriptEl);
              }
            } else if (node.nodeName === 'STYLE') {
              const styleEl = document.createElement('style');
              styleEl.textContent = node.textContent;
              styleEl.setAttribute('data-custom-injected', 'true');
              styleEl.setAttribute('data-script-id', script.id);
              document.head.appendChild(styleEl);
            } else {
              // Standard nodes (like noscript tags or div containers)
              const clonedNode = node.cloneNode(true);
              if (clonedNode instanceof HTMLElement) {
                clonedNode.setAttribute('data-custom-injected', 'true');
                clonedNode.setAttribute('data-script-id', script.id);
              }
              if (script.placement === 'head') {
                document.head.appendChild(clonedNode);
              } else if (script.placement === 'body') {
                document.body.insertBefore(clonedNode, document.body.firstChild);
              } else {
                document.body.appendChild(clonedNode);
              }
            }
          }
        });
      } catch (err) {
        console.error(`Failed to inject custom script "${script.name}":`, err);
      }
    });

    return () => {
      cleanupInjections();
    };
  }, [liveCustomScripts]);

  return null;
}

// Dynamic theme styling and Google Font Loader component based on liveThemeConfig
function ThemeStyleInjector() {
  const { liveThemeConfig } = useAdmin();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const font = liveThemeConfig?.fontFamily || 'Inter';
    const formattedFont = font.replace(/ /g, '+');
    const linkId = 'dynamic-google-font';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700;800;900&display=swap`;
  }, [liveThemeConfig?.fontFamily]);

  if (!liveThemeConfig) return null;

  const cfg = liveThemeConfig;

  // Custom border radius values based on chosen token
  const radius = cfg.borderRadius || '12px';
  const shadowValue = cfg.shadowIntensity === 'none' ? 'none'
    : cfg.shadowIntensity === 'low' ? '0 2px 8px rgba(0,0,0,0.04)'
    : cfg.shadowIntensity === 'high' ? '0 12px 40px rgba(0,0,0,0.15)'
    : '0 4px 20px rgba(0,0,0,0.08)'; // medium

  const buttonRadius = cfg.buttonStyle === 'square' ? '0px'
    : cfg.buttonStyle === 'pill' ? '9999px'
    : radius;

  const headingTransform = cfg.headingStyle === 'uppercase' ? 'uppercase' : 'none';
  const headingSpacing = cfg.headingStyle === 'tracking-wide' ? '0.08em' : 'normal';

  const styles = `
    :root {
      --primary: ${cfg.customPrimary || '#5c253d'};
      --secondary: ${cfg.customSecondary || '#f27447'};
      --accent: ${cfg.accentColor || '#f27447'};
      --background: ${cfg.backgroundColor || '#f6f3f8'};
      --surface: ${cfg.surfaceColor || '#ffffff'};
      --card: ${cfg.cardColor || '#ffffff'};
      --sidebar: ${cfg.sidebarColor || '#f6f3f8'};
      --navbar: ${cfg.navbarColor || '#ffffff'};
      --header: ${cfg.headerColor || '#ffffff'};
      --footer: ${cfg.footerColor || '#dfd3eb'};
      --border: ${cfg.borderColor || 'rgba(92, 37, 61, 0.08)'};
      --text: ${cfg.textColor || '#5c253d'};
      --text-muted: ${cfg.textMutedColor || '#5c253d/80'};
      --icon: ${cfg.iconColor || '#5c253d'};
      --link: ${cfg.linkColor || '#f27447'};
      --success: ${cfg.successColor || '#f27447'};
      --warning: ${cfg.warningColor || '#f59e0b'};
      --error: ${cfg.errorColor || '#ef4444'};
      --info: ${cfg.infoColor || '#3b82f6'};
      --chart-1: ${cfg.chartColor1 || '#5c253d'};
      --chart-2: ${cfg.chartColor2 || '#f27447'};
      
      --font-sans: '${cfg.fontFamily || 'Inter'}', sans-serif;
      --font-display: '${cfg.fontFamily || 'Inter'}', sans-serif;
      
      --border-radius: ${radius};
      --btn-radius: ${buttonRadius};
      --card-shadow: ${shadowValue};
      --sidebar-width: ${cfg.sidebarWidth || '260px'};
      --header-height: ${cfg.headerHeight || '70px'};
      --widget-spacing: ${cfg.widgetSpacing || '16px'};
      --grid-spacing: ${cfg.gridSpacing || '24px'};
      
      font-size: ${cfg.textScale || '100%'};
    }

    .dark, html.dark {
      --primary: ${cfg.customPrimary || '#5c253d'};
      --secondary: ${cfg.customSecondary || '#f27447'};
      --accent: ${cfg.accentColor || '#f27447'};
      --background: ${cfg.backgroundColor || '#f6f3f8'};
      --surface: ${cfg.surfaceColor || '#ffffff'};
      --card: ${cfg.cardColor || '#ffffff'};
      --sidebar: ${cfg.sidebarColor || '#f6f3f8'};
      --navbar: ${cfg.navbarColor || '#ffffff'};
      --header: ${cfg.headerColor || '#ffffff'};
      --footer: ${cfg.footerColor || '#dfd3eb'};
      --border: ${cfg.borderColor || 'rgba(92, 37, 61, 0.08)'};
      --text: ${cfg.textColor || '#5c253d'};
      --text-muted: ${cfg.textMutedColor || '#5c253d/80'};
      --icon: ${cfg.iconColor || '#5c253d'};
      --link: ${cfg.linkColor || '#f27447'};
      --success: ${cfg.successColor || '#f27447'};
      --warning: ${cfg.warningColor || '#f59e0b'};
      --error: ${cfg.errorColor || '#ef4444'};
      --info: ${cfg.infoColor || '#3b82f6'};
      --chart-1: ${cfg.chartColor1 || '#5c253d'};
      --chart-2: ${cfg.chartColor2 || '#f27447'};
      
      --font-sans: '${cfg.fontFamily || 'Inter'}', sans-serif;
      --font-display: '${cfg.fontFamily || 'Inter'}', sans-serif;
      
      --border-radius: ${radius};
      --btn-radius: ${buttonRadius};
      --card-shadow: ${shadowValue};
      --sidebar-width: ${cfg.sidebarWidth || '260px'};
      --header-height: ${cfg.headerHeight || '70px'};
      --widget-spacing: ${cfg.widgetSpacing || '16px'};
      --grid-spacing: ${cfg.gridSpacing || '24px'};
      
      font-size: ${cfg.textScale || '100%'};
    }

    /* Retro Compatibility Mapper for legacy style overlays */
    .text-cyan-400, .text-cyan-500, .text-cyan-300 {
      color: var(--primary) !important;
    }
    .hover\\:text-cyan-400:hover, .hover\\:text-cyan-300:hover {
      color: var(--primary) !important;
    }
    .bg-cyan-500, .bg-cyan-600 {
      background-color: var(--primary) !important;
    }
    .hover\\:bg-cyan-600:hover, .hover\\:bg-cyan-500:hover {
      background-color: var(--primary) !important;
      filter: brightness(0.9);
    }
    .text-emerald-400, .text-emerald-300, .text-emerald-500 {
      color: var(--secondary) !important;
    }
    .bg-emerald-500, .bg-emerald-600 {
      background-color: var(--secondary) !important;
    }
    .hover\\:bg-emerald-600:hover, .hover\\:bg-emerald-500:hover {
      background-color: var(--secondary) !important;
      filter: brightness(0.9);
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6, .font-display, .font-sans-heading {
      font-family: var(--font-display) !important;
      text-transform: ${headingTransform} !important;
      letter-spacing: ${headingSpacing} !important;
    }

    /* Custom Radius classes */
    .rounded-3xl, .rounded-2xl, .rounded-xl, .rounded-lg {
      border-radius: var(--border-radius) !important;
    }
    button, .btn, .interactive-btn {
      border-radius: var(--btn-radius) !important;
    }

    /* Custom Shadow Overrides */
    .shadow-2xl, .shadow-xl, .shadow-lg {
      box-shadow: var(--card-shadow) !important;
    }

    /* Card customization overrides depending on cardStyle setting */
    ${cfg.cardStyle === 'flat' ? `
      .card-item, .bg-card, .portfolio-card {
        border-width: 0px !important;
        box-shadow: none !important;
      }
    ` : cfg.cardStyle === 'glass' ? `
      .card-item, .bg-card, .portfolio-card {
        background-color: rgba(255,255,255,0.03) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
      }
    ` : cfg.cardStyle === 'shadowed' ? `
      .card-item, .bg-card, .portfolio-card {
        border-width: 0px !important;
        box-shadow: var(--card-shadow) !important;
      }
    ` : `
      /* default bordered style */
      .card-item, .bg-card, .portfolio-card {
        border: 1px solid var(--border) !important;
        box-shadow: var(--card-shadow) !important;
      }
    `}

    /* Smooth transitions throughout */
    #portfolio-container, #portfolio-container *,
    .min-h-screen, .min-h-screen * {
      transition-property: background-color, border-color, color, stroke, fill, border-radius;
      transition-duration: 250ms;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: styles }} />
  );
}

export default function RizwanSaeedPortfolio({ initialCaseStudyId }: { initialCaseStudyId?: string | null }) {
  return (
    <AdminProvider>
      <ThemeStyleInjector />
      <MainLayout initialCaseStudyId={initialCaseStudyId} />
      <ScriptManagerInjector />
    </AdminProvider>
  );
}

function BlogPageView({ posts }: { posts: any[] }) {
  const { setActiveMainPage } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState<any | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Identify featured post (first post, or marked featured)
  const featuredPost = useMemo(() => {
    return posts.find(p => p.featured) || posts[0] || null;
  }, [posts]);

  // Rest of the posts that are not the featured post (for grid rendering)
  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    // If filtering, show all filtered posts in grid. If not filtering, exclude featured post.
    if (searchQuery || selectedCategory !== 'All') {
      return filteredPosts;
    }
    return filteredPosts.filter(p => p.id !== featuredPost.id);
  }, [filteredPosts, featuredPost, searchQuery, selectedCategory]);

  return (
    <div className="space-y-12 py-4 animate-fadeIn text-left">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1 rounded-full text-[10px] font-mono uppercase text-cyan-300 tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Growth Roadmap Dataset & Strategy Insights</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
          Operational Blog & Intel
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm font-sans max-w-2xl mx-auto">
          Deep-dives on server-side GTM, high-converting Shopify liquid structures, Meta Conversions API protocols, and search monetization architecture.
        </p>
      </div>

      {/* Featured Post Showcase (only shown when not filtering or searching) */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <div className="relative group rounded-3xl overflow-hidden border border-white/[0.06] bg-[#0c1222]/60 hover:border-cyan-500/20 transition-all duration-500 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Cover Image */}
            <div className="lg:col-span-7 h-64 sm:h-96 relative overflow-hidden">
              <img 
                src={featuredPost.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"} 
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#000000]/80" />
            </div>

            {/* Featured Post Text */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold uppercase">
                    {featuredPost.category || 'Featured'}
                  </span>
                  <span className="text-gray-500">{featuredPost.readTime || '5 min read'}</span>
                  <span className="text-gray-700">•</span>
                  <span className="text-gray-500">{featuredPost.date || 'Jul 2026'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white hover:text-cyan-400 transition-colors uppercase leading-tight tracking-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-gray-400 text-xs sm:text-sm font-sans leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                <div className="flex items-center space-x-3">
                  <img 
                    src={featuredPost.author?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop"} 
                    alt={featuredPost.author?.name || "Rizwan Saeed"} 
                    className="w-8 h-8 rounded-full border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{featuredPost.author?.name || "Rizwan Saeed"}</span>
                    <span className="text-[10px] font-mono text-gray-500">SYSTEM AUTHOR</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActivePost(featuredPost)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Access Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control / Search Panel */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0a0f1d]/50 border border-white/[0.04] p-4 rounded-2xl">
        {/* Category filtering pills */}
        <div className="flex flex-wrap items-center gap-1.5 order-2 md:order-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer border",
                selectedCategory === cat 
                  ? "bg-cyan-500 border-cyan-500 text-black font-bold" 
                  : "bg-black/30 border-white/[0.04] text-gray-400 hover:border-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative flex-grow max-w-md order-1 md:order-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search intel dossier database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/[0.08] focus:border-cyan-500/50 rounded-xl py-2 pl-9 pr-8 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="space-y-6">
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post, idx) => (
              <motion.article
                key={post.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group rounded-2xl border border-white/[0.04] bg-[#0c1222]/40 hover:bg-[#0c1222]/70 hover:border-cyan-500/15 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
              >
                {/* Cover Image wrapper */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.coverImage || "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=600&auto=format&fit=crop"} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded bg-black/80 backdrop-blur border border-white/10 text-[9px] font-mono uppercase font-bold text-cyan-400">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500">
                      <span>{post.date || 'Jul 2026'}</span>
                      <span>•</span>
                      <span>{post.readTime || '4 min read'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition-colors uppercase leading-snug tracking-tight group-hover:text-cyan-400">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-xs font-sans leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={post.author?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop"} 
                        alt={post.author?.name || "Rizwan Saeed"} 
                        className="w-6 h-6 rounded-full border border-white/5"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] font-sans font-medium text-gray-400">{post.author?.name || "Rizwan Saeed"}</span>
                    </div>

                    <button 
                      onClick={() => setActivePost(post)}
                      className="text-[11px] font-mono uppercase text-cyan-400 group-hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span>Read Intel</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#090f1d]/20 border border-white/[0.03] rounded-3xl space-y-3">
            <Info className="w-8 h-8 text-cyan-500/60 mx-auto" />
            <p className="text-sm font-mono text-gray-400 uppercase">No telemetry reports match search filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-mono uppercase text-white transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Distraction-free Article Reading Room Overlay */}
      <AnimatePresence>
        {activePost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto"
          >
            {/* Navigation / Progress header */}
            <div className="sticky top-0 z-50 bg-[#000000]/90 border-b border-white/[0.06] backdrop-blur-lg">
              <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] font-mono uppercase text-cyan-300 tracking-wider shrink-0">
                    {activePost.category}
                  </span>
                  <span className="text-xs font-mono text-gray-400 truncate hidden sm:block">
                    {activePost.title}
                  </span>
                </div>

                <button
                  onClick={() => setActivePost(null)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-pink-400" />
                  <span>Exit Reading Room</span>
                </button>
              </div>
            </div>

            {/* Reading Content */}
            <article className="max-w-3xl mx-auto px-4 py-12 space-y-8">
              {/* Back to Blog */}
              <button 
                onClick={() => setActivePost(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ← Back to dossiers
              </button>

              {/* Cover Image */}
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={activePost.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"} 
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Headline Meta */}
              <div className="space-y-4 border-b border-white/[0.06] pb-6">
                <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                  <span>Published on {activePost.date || 'Jul 2026'}</span>
                  <span>•</span>
                  <span>{activePost.readTime || '4 min read'}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  {activePost.title}
                </h1>

                {/* Author card */}
                <div className="flex items-center space-x-3 pt-2">
                  <img 
                    src={activePost.author?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop"} 
                    alt={activePost.author?.name || "Rizwan Saeed"} 
                    className="w-10 h-10 rounded-full border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block">{activePost.author?.name || "Rizwan Saeed"}</span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{activePost.author?.role || "Growth Specialist & Admin"}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Body Parsing */}
              <div className="markdown-body font-sans text-gray-300 text-sm sm:text-base leading-relaxed space-y-6 prose prose-invert max-w-none">
                <ReactMarkdown>{activePost.content || activePost.excerpt}</ReactMarkdown>
              </div>

              {/* Footer CTA */}
              <div className="border-t border-white/[0.06] pt-8 mt-12 text-center bg-cyan-950/20 border border-cyan-800/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-mono uppercase text-cyan-300 font-bold tracking-widest">Need customized strategic planning?</h3>
                <p className="text-xs text-gray-400 font-sans max-w-lg mx-auto">
                  Transmit a secure Handshake project dossier directly to Rizwan Saeed via the core command console to map conversions and liquid frameworks.
                </p>
                <button
                  onClick={() => {
                    setActivePost(null);
                    setActiveMainPage('home');
                    setTimeout(() => {
                      const contactElem = document.getElementById('contact-form');
                      if (contactElem) {
                        contactElem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 300);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-102 cursor-pointer"
                >
                  Initiate Secure Handshake Protocol
                </button>
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainLayout({ initialCaseStudyId }: { initialCaseStudyId?: string | null }) {
  const { viewMode } = useAdmin();
  if (viewMode === 'admin') {
    return <AdminControlPanel />;
  }
  return <PublicPortfolio initialCaseStudyId={initialCaseStudyId} />;
}

function PublicPortfolio({ initialCaseStudyId }: { initialCaseStudyId?: string | null }) {
  const {
    liveStatsMetrics: STATS_METRICS,
    liveAnalyticsProperties: ANALYTICS_PROPERTIES,
    liveLogoWall: logoWall,
    liveTimeline: TIMELINE,
    liveClientsPortfolio: CLIENTS_PORTFOLIO,
    liveTestimonials: TESTIMONIALS,
    liveFaqs: FAQS,
    liveHero: hero,
    liveRoiSettings: roiSettings,
    liveBrandInfo: brandInfo,
    liveServices: SERVICES,
    liveBlogPosts,
    liveWhatsappConfig,
    liveMapConfig,
    liveThemeConfig,
    effectiveThemeMode,
    addInboxSubmission,
    activeMainPage,
    setActiveMainPage,
    setViewMode,
    setIsAuthorized,
    isAuthorized,
    adminUsername,
    adminPasskey,
    showToast,
    isContactModalOpen,
    setIsContactModalOpen
  } = useAdmin();

  const getClientDomain = (name: string) => {
    if (!name) return 'google.com';
    const cleanName = name.trim().toLowerCase();
    if (cleanName.includes('.')) return cleanName;
    if (cleanName === 'alphalete athletics') return 'alphaleteathletics.com';
    if (cleanName === 'vivobarefoot me') return 'vivobarefoot.com';
    if (cleanName === 'aetrex') return 'aetrex.com';
    if (cleanName === 'farada') return 'farada-group.com';
    if (cleanName === 'sole therapy') return 'soletherapy.com.au';
    if (cleanName === 'seventy7') return 'seventy7.com';
    if (cleanName === 'mahsi') return 'mahsi.com';
    if (cleanName === 'us prime innovations') return 'usprimeinnovations.com';
    return cleanName.replace(/[^a-z0-9]/g, '') + '.com';
  };

  // --- States ---
  const [regionalFocus, setRegionalFocus] = useState<'uae' | 'usa' | 'uk' | 'canada' | 'australia' | 'global'>('uae');
  const [beforeAfterTab, setBeforeAfterTab] = useState<'speed' | 'seo'>('speed');
  const [sliderPercent, setSliderPercent] = useState<number>(55);
  const [activeServiceExplorerTab, setActiveServiceExplorerTab] = useState<string>('shopify-development');
  const [activeSequenceStep, setActiveSequenceStep] = useState<'problem' | 'solution' | 'process' | 'result' | 'book_call'>('problem');
  const [activePropertyTab, setActivePropertyTab] = useState<string>('floorcarpet.ae');
  const [activeBioTag, setActiveBioTag] = useState<string>('Shopify Development');
  const [chartMetricToggle, setChartMetricToggle] = useState<{clicks: boolean; impressions: boolean}>({ clicks: true, impressions: true });
  const [hoveredPoint, setHoveredPoint] = useState<{ week: string; clicks: number; impressions: number; x: number; y: number } | null>(null);
  
  // Showcase Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Simulated fetching & indexing query state for loading skeletons
  useEffect(() => {
    let active = true;
    
    // Defer the loading setter to avoid synchronous cascading renders
    const syncTimer = setTimeout(() => {
      if (active) setIsPortfolioLoading(true);
    }, 0);

    const delay = (searchQuery.trim() || selectedCategory !== 'all') ? 500 : 1100;
    const timer = setTimeout(() => {
      if (active) setIsPortfolioLoading(false);
    }, delay);

    return () => {
      active = false;
      clearTimeout(syncTimer);
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory]);
  
  // Client Detail Modal
  const [selectedClientModal, setSelectedClientModal] = useState<typeof CLIENTS_PORTFOLIO[0] | null>(() => {
    if (initialCaseStudyId) {
      return CLIENTS_PORTFOLIO.find((c: any) => 
        c.id === initialCaseStudyId || 
        c.name.toLowerCase() === initialCaseStudyId.toLowerCase()
      ) || null;
    }
    return null;
  });

  // Dynamically update document title and meta description tag for client-side SEO
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (selectedClientModal) {
        document.title = `${selectedClientModal.name} Case Study — ${selectedClientModal.metrics} | Rizwan Saeed Portfolio`;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Case study for ${selectedClientModal.name}: ${selectedClientModal.challenge} Strategy: ${selectedClientModal.strategy} Outcomes: ${selectedClientModal.outcomes} | Managed by Rizwan Saeed.`);

        // Update og:title if present
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${selectedClientModal.name} Case Study — ${selectedClientModal.metrics}`);
        }
      } else {
        document.title = 'Rizwan Saeed — Premium Portfolio & Marketing Dashboard';
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', 'Digital Marketing Manager & Shopify Developer. Certified Google Ads & Meta Business Partner, managing over AED 350K+ ad spend and generating AED 1.2M+ revenue.');
        }
      }
    }
  }, [selectedClientModal]);

  // Dynamic Ad Budget Estimator Slider (Monthly AED)
  const [estimateBudget, setEstimateBudget] = useState<number>(8500);

  // Dual-mode ROI Growth Calculator
  const [calculatorMode, setCalculatorMode] = useState<'b2c' | 'b2b'>('b2c');
  const [adSpend, setAdSpend] = useState<number>(5000);
  const [conversionRate, setConversionRate] = useState<number>(2.5); // %
  const [avgOrderValue, setAvgOrderValue] = useState<number>(350); // AED (AOV)
  const [leadCloseRate, setLeadCloseRate] = useState<number>(15); // % for B2B
  const [leadValue, setLeadValue] = useState<number>(1200); // AED for B2B

  // FAQ Active State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Professional Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactProjectType, setContactProjectType] = useState('shopify-development');
  const [contactBudget, setContactBudget] = useState('5k-15k');
  const [contactRequirements, setContactRequirements] = useState('');
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSuccessData, setContactSuccessData] = useState<any | null>(null);

  // Centered Contact Modal States
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalCompany, setModalCompany] = useState('');
  const [modalProjectType, setModalProjectType] = useState('shopify-development');
  const [modalBudget, setModalBudget] = useState('5k-15k');
  const [modalRequirements, setModalRequirements] = useState('');
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [modalSuccessData, setModalSuccessData] = useState<any | null>(null);

  // Multi-Channel Floating Support State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [activeSupportTab, setActiveSupportTab] = useState<'whatsapp' | 'email' | 'care' | 'ai'>('whatsapp');
  const [emailSubject, setEmailSubject] = useState('Project Inquiry / Collaboration');
  const [emailBody, setEmailBody] = useState('Hello Rizwan,\n\nI visited your portfolio and I would like to discuss a project with you.');
  const [userEditedMsg, setUserEditedMsg] = useState<string | null>(null);
  const customWAMsg = userEditedMsg !== null 
    ? userEditedMsg 
    : (liveWhatsappConfig?.message || 'Hello Rizwan Saeed, I just visited your portfolio website and would like to discuss a project with you!');

  // Premium Theme Presets
  const [themePreset, setThemePreset] = useState<'cyber' | 'emerald' | 'sunset' | 'ice'>('cyber');

  // App Initial Loading Screen Vibe
  const [appLoading, setAppLoading] = useState(false);

  // Command Palette (⌘K) States
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState('');

  // AI Chatbot State (Supports real-time conversational handshakes with Gemini)
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string; timestamp: Date }>>([
    { sender: 'bot', text: "Marhaba! 👋 I am Rizwan's enterprise AI Assistant.\n\nWant an **SEO Audit**? Need a **Google Ads projection**? Or want to know if I'm available for contracts? Ask me anything!", timestamp: new Date() }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatTyping, setIsAiChatTyping] = useState(false);

  // Deep AI SEO & CRO Website Auditor State
  const [auditUrl, setAuditUrl] = useState('');
  const [auditIndustry, setAuditIndustry] = useState('ecommerce');
  const [auditStep, setAuditStep] = useState<'idle' | 'scanning_dns' | 'measuring_speed' | 'analyzing_cro' | 'fetching_gemini' | 'complete'>('idle');
  const [auditScanLog, setAuditScanLog] = useState<string[]>([]);
  const [auditReport, setAuditReport] = useState<{
    seoScore: number;
    croScore: number;
    speedScore: number;
    accessibilityScore: number;
    generalComments: string;
    actionPoints: string[];
    estimatedRevenueLift: string;
  } | null>(null);

  // Trigger loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [customCursorEnabled, setCustomCursorEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target
      ) return;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Trigger Command Palette keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const validateModalContactForm = () => {
    const errors: Record<string, string> = {};
    if (!modalName.trim()) {
      errors.name = "Name is required.";
    }
    if (!modalEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!modalRequirements.trim()) {
      errors.requirements = "Please specify your project requirements.";
    } else if (modalRequirements.trim().length < 15) {
      errors.requirements = "Please enter at least 15 characters of requirements so I can analyze them properly.";
    }
    setModalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleModalContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateModalContactForm()) {
      showToast("Please correct the errors in the contact form.", "error");
      return;
    }

    setIsModalSubmitting(true);
    
    // Simulate secure network transmission
    setTimeout(() => {
      setIsModalSubmitting(false);
      const submissionPayload = {
        id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        name: modalName,
        email: modalEmail,
        company: modalCompany || "N/A",
        projectType: modalProjectType,
        budget: modalBudget,
        requirements: modalRequirements,
      };
      setModalSuccessData(submissionPayload);
      showToast("Security Handshake Completed. Project inquiry successfully transmitted!", "success");
      
      // Save submission to central admin inbox
      addInboxSubmission({
        id: submissionPayload.id,
        timestamp: submissionPayload.timestamp,
        name: submissionPayload.name,
        email: submissionPayload.email,
        company: submissionPayload.company,
        projectType: submissionPayload.projectType,
        budget: submissionPayload.budget,
        requirements: submissionPayload.requirements,
        read: false
      });
      
      // Auto-trigger WhatsApp dispatch of same details
      try {
        const waNumber = liveWhatsappConfig?.number?.replace(/[^0-9]/g, '') || '971500000000';
        const waMessage = `*New Project Protocol Received* 🚀\n\n` +
                          `*Name:* ${modalName}\n` +
                          `*Email:* ${modalEmail}\n` +
                          `*Company:* ${modalCompany || 'N/A'}\n` +
                          `*Focus:* ${modalProjectType}\n` +
                          `*Budget:* ${modalBudget}\n` +
                          `*Requirements:* ${modalRequirements}`;
        
        // Log WhatsApp dispatch event
        console.log(`WhatsApp payload formatted for delivery to ${waNumber}. Message: ${waMessage}`);
      } catch (err) {
        console.warn("WhatsApp background logging warning:", err);
      }
    }, 1500);
  };

  const validateContactForm = () => {
    const errors: Record<string, string> = {};
    if (!contactName.trim()) {
      errors.name = "Name is required.";
    }
    if (!contactEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!contactRequirements.trim()) {
      errors.requirements = "Please specify your project requirements.";
    } else if (contactRequirements.trim().length < 15) {
      errors.requirements = "Please enter at least 15 characters of requirements so I can analyze them properly.";
    }
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContactForm()) {
      showToast("Please correct the errors in the contact form.", "error");
      return;
    }

    setIsContactSubmitting(true);
    
    // Simulate secure network transmission
    setTimeout(() => {
      setIsContactSubmitting(false);
      const submissionPayload = {
        id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        name: contactName,
        email: contactEmail,
        company: contactCompany || "N/A",
        projectType: contactProjectType,
        budget: contactBudget,
        requirements: contactRequirements,
      };
      setContactSuccessData(submissionPayload);
      showToast("Security Handshake Completed. Project inquiry successfully transmitted!", "success");
      
      // Save submission to central admin inbox
      addInboxSubmission({
        id: submissionPayload.id,
        timestamp: submissionPayload.timestamp,
        name: submissionPayload.name,
        email: submissionPayload.email,
        company: submissionPayload.company,
        projectType: submissionPayload.projectType,
        budget: submissionPayload.budget,
        requirements: submissionPayload.requirements,
        read: false
      });
      
      // Auto-trigger WhatsApp dispatch of same details
      try {
        const waNumber = liveWhatsappConfig?.number?.replace(/[^0-9]/g, '') || '971500000000';
        const waMessage = `*New Project Protocol Received* 🚀\n\n` +
                          `*Name:* ${contactName}\n` +
                          `*Email:* ${contactEmail}\n` +
                          `*Company:* ${contactCompany || 'N/A'}\n` +
                          `*Project Focus:* ${contactProjectType.replace('-', ' ').toUpperCase()}\n` +
                          `*Monthly Budget:* ${contactBudget.replace('-', ' ').toUpperCase()}\n` +
                          `*Requirements:* ${contactRequirements}`;
        const encodedMsg = encodeURIComponent(waMessage);
        window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');
      } catch (err) {
        console.error("Failed to auto-open WhatsApp link:", err);
      }

      // Clear form
      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setContactProjectType('shopify-development');
      setContactBudget('5k-15k');
      setContactRequirements('');
      setContactErrors({});
    }, 2200);
  };

  // Admin Passkey Verification Modal States
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPasskey, setEnteredPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredUsername.trim()) {
      setPasskeyError("ACCESS DENIED: USERNAME IS REQUIRED");
      showToast("Verification failed. Username is required.", "error");
      return;
    }
    if (!enteredPasskey) {
      setPasskeyError("ACCESS DENIED: PASSKEY IS REQUIRED");
      showToast("Verification failed. Passkey is required.", "error");
      return;
    }
    if (enteredUsername.trim().toLowerCase() === adminUsername.toLowerCase() && enteredPasskey === adminPasskey) {
      setIsAuthorized(true);
      setShowPasskeyModal(false);
      setEnteredUsername('');
      setEnteredPasskey('');
      setPasskeyError('');
      showToast("Access Granted. Initializing Admin Control Panel...", "success");
      setViewMode('admin');
    } else {
      setPasskeyError("ACCESS DENIED: INVALID USERNAME OR PASSKEY");
      showToast("Verification failed. Incorrect credentials.", "error");
    }
  };

  // --- Effects ---

  // --- Computed Analytics for GA4 Mock Realtime values ---
  const ga4RealtimeState = useMemo(() => {
    return {
      activeUsers: 168,
      eventCount: '1.5k',
      keyEvents: 64,
      sessions: 282,
      history: [45, 65, 85, 120, 140, 168, 150, 130, 95, 110, 145, 168]
    };
  }, []);

  // Filter showcase grid based on query & category
  const filteredClients = useMemo(() => {
    return CLIENTS_PORTFOLIO.filter((client: any) => {
      const matchesCategory = selectedCategory === 'all' || client.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || 
        client.name.toLowerCase().includes(q) || 
        client.tag.toLowerCase().includes(q) ||
        client.category.toLowerCase().includes(q) ||
        client.challenge.toLowerCase().includes(q) ||
        client.strategy.toLowerCase().includes(q) ||
        client.outcomes.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, CLIENTS_PORTFOLIO]);

  // Dynamic services planning output based on budget slider
  const recommendedStrategy = useMemo(() => {
    const budget = estimateBudget;
    if (budget < 4000) {
      return {
        level: 'Starter Local Presence Catalyst',
        split: { seo: 50, ads: 30, cro: 20 },
        channels: ['Google My Business Optimizations', 'On-Page SEO tweaks', 'Niche Search Ads targeting keywords in Dubai'],
        roasMultiplier: '2.5x - 3.2x',
        speedImprovement: '+20% Speed Tuning',
        adFocus: 'Direct WhatsApp Call Ads Only'
      };
    } else if (budget >= 4000 && budget < 12000) {
      return {
        level: 'Mid-Market High-Growth Funnel',
        split: { seo: 30, ads: 50, cro: 20 },
        channels: ['Technical Core Web Vitals optimization', 'Meta retargeting funnel with catalog ads', 'Google Local Service campaigns', 'Advanced Google Tag Manager triggers'],
        roasMultiplier: '3.5x - 4.2x',
        speedImprovement: '+45% Speed Optimization',
        adFocus: 'Lead Form Conversion Ads & Catalog Checkout'
      };
    } else {
      return {
        level: 'Enterprise Omni-Channel Scaler',
        split: { seo: 20, ads: 60, cro: 20 },
        channels: ['Full technical site audit & fast-path custom Liquid templates', 'Google Search & Performance Max setups', 'Multi-layer Meta lookalike & retargeting pipelines', 'GA4 Server-side Conversions tracking API configuration'],
        roasMultiplier: '4.5x - 5.5x',
        speedImprovement: 'Under-1.5s Core Load Speed Guarantee',
        adFocus: 'CAPI tracking & Smart bidding PMax Ads'
      };
    }
  }, [estimateBudget]);

  // Calculate dynamic ROI estimates
  const calculatedROI = useMemo(() => {
    const spend = adSpend;
    const cr = conversionRate / 100;

    if (calculatorMode === 'b2c') {
      // B2C E-commerce math
      // Use the dynamic average CPC from roiSettings (default 1.25)
      const avgCPC = roiSettings.b2cDefaultCPC;
      const estimatedClicks = Math.floor(spend / avgCPC);
      const orders = Math.round(estimatedClicks * cr);
      const grossRevenue = orders * avgOrderValue;
      const netGain = grossRevenue - spend;
      const roas = spend > 0 ? (grossRevenue / spend).toFixed(2) : '0';
      
      return {
        clicks: estimatedClicks,
        conversions: orders,
        revenue: grossRevenue,
        netGain: netGain,
        metricLabel: 'Orders Generated',
        primaryMetric: `${orders} Orders`,
        secondaryMetric: `AED ${grossRevenue.toLocaleString()}`,
        efficiencyLabel: 'Calculated ROAS',
        efficiencyValue: `${roas}x ROAS`,
        speedBoostDesc: `Optimized speed scales CR by ${roiSettings.b2cSpeedBoost}x, matching historical results.`
      };
    } else {
      // B2B Lead Gen math
      // Use the dynamic average CPL from roiSettings (default 45)
      const avgCPL = roiSettings.b2bDefaultCPL;
      const leads = Math.floor(spend / avgCPL);
      const closedDeals = Math.round(leads * (leadCloseRate / 100));
      const grossRevenue = closedDeals * leadValue;
      const netGain = grossRevenue - spend;
      const cplValue = spend > 0 && leads > 0 ? (spend / leads).toFixed(1) : '0';

      return {
        clicks: leads * 6, // Estimate relative traffic
        conversions: leads,
        revenue: grossRevenue,
        netGain: netGain,
        metricLabel: 'Qualified Leads',
        primaryMetric: `${leads} Leads`,
        secondaryMetric: `AED ${grossRevenue.toLocaleString()}`,
        efficiencyLabel: 'Cost Per Lead (CPL)',
        efficiencyValue: `AED ${cplValue}`,
        speedBoostDesc: `Server-side pixels yield ${roiSettings.b2bServerSideBoost}% cleaner user attribution.`
      };
    }
  }, [calculatorMode, adSpend, conversionRate, avgOrderValue, leadCloseRate, leadValue, roiSettings]);


  // Draw responsive interactive line chart path
  const renderChartPath = React.useCallback((property: string, type: 'clicks' | 'impressions') => {
    const data = ANALYTICS_PROPERTIES[property]?.chartData || [];
    if (data.length === 0) return { path: '', points: [] };
    
    const width = 800;
    const height = 240;
    const padding = 20;

    // Find max values
    const maxClicks = Math.max(...data.map((d: any) => d.clicks)) || 1;
    const maxImps = Math.max(...data.map((d: any) => d.impressions)) || 1;

    const points = data.map((d: any, index: number) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const val = type === 'clicks' ? d.clicks : d.impressions;
      const max = type === 'clicks' ? maxClicks : maxImps;
      const y = height - padding - (val * (height - padding * 2)) / max;
      return { x, y, ...d };
    });

    return {
      path: points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
      points
    };
  }, [ANALYTICS_PROPERTIES]);

  const targetPropKey = activePropertyTab !== 'GA4' && ANALYTICS_PROPERTIES[activePropertyTab] ? activePropertyTab : Object.keys(ANALYTICS_PROPERTIES)[0];
  const propertyData = ANALYTICS_PROPERTIES[targetPropKey];
  const clicksChart = useMemo(() => renderChartPath(targetPropKey, 'clicks'), [targetPropKey, renderChartPath]);
  const impsChart = useMemo(() => renderChartPath(targetPropKey, 'impressions'), [targetPropKey, renderChartPath]);

  // Premium Theme presets mapping
  const presetColors = {
    cyber: {
      textAccent: "text-cyan-400",
      bgGradient: "from-cyan-400 via-teal-400 to-emerald-400",
      btnGradient: "from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400",
      borderAccent: "border-cyan-500/20 focus:border-cyan-400",
      glowBg: "bg-cyan-500/10",
      badgeBg: "bg-cyan-950/40 border-cyan-800/60 text-cyan-300",
      selection: "selection:bg-cyan-500",
      accentHex: "#22d3ee"
    },
    emerald: {
      textAccent: "text-emerald-400",
      bgGradient: "from-emerald-400 via-green-400 to-yellow-400",
      btnGradient: "from-emerald-500 to-yellow-500 hover:from-emerald-400 hover:to-yellow-400",
      borderAccent: "border-emerald-500/20 focus:border-emerald-400",
      glowBg: "bg-emerald-500/10",
      badgeBg: "bg-emerald-950/40 border-emerald-800/60 text-emerald-300",
      selection: "selection:bg-emerald-500",
      accentHex: "#34d399"
    },
    sunset: {
      textAccent: "text-pink-400",
      bgGradient: "from-fuchsia-500 via-pink-500 to-orange-400",
      btnGradient: "from-fuchsia-500 to-orange-500 hover:from-fuchsia-400 hover:to-orange-400",
      borderAccent: "border-pink-500/20 focus:border-pink-400",
      glowBg: "bg-pink-500/10",
      badgeBg: "bg-pink-950/40 border-pink-800/60 text-pink-300",
      selection: "selection:bg-pink-500",
      accentHex: "#f472b6"
    },
    ice: {
      textAccent: "text-blue-400",
      bgGradient: "from-blue-400 via-indigo-400 to-sky-400",
      btnGradient: "from-blue-500 to-sky-500 hover:from-blue-400 hover:to-sky-400",
      borderAccent: "border-blue-500/20 focus:border-blue-400",
      glowBg: "bg-blue-500/10",
      badgeBg: "bg-blue-950/40 border-blue-800/60 text-blue-300",
      selection: "selection:bg-blue-500",
      accentHex: "#60a5fa"
    }
  };
  const activePreset = presetColors[themePreset] || presetColors.cyber;

  return (
    <div 
      id="portfolio-container" 
      className="min-h-screen flex flex-col bg-[#f6f3f8] text-[#5c253d] font-sans selection:bg-[#f27447]/30 selection:text-[#5c253d]"
    >
      {/* CUSTOM CURSOR SYSTEM */}
      {customCursorEnabled && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-500/40 mix-blend-screen z-[9999] hidden lg:block"
          animate={{
            x: mousePos.x - 16,
            y: mousePos.y - 16,
            scale: cursorHovered ? 1.5 : 1,
            backgroundColor: cursorHovered ? "rgba(6, 182, 212, 0.15)" : "rgba(6, 182, 212, 0)"
          }}
          transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
        />
      )}
      {customCursorEnabled && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-cyan-400 z-[9999] hidden lg:block shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          animate={{
            x: mousePos.x - 5,
            y: mousePos.y - 5,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.1 }}
        />
      )}
      
      {/* Cyber Loading Screen Vibe */}
      <AnimatePresence>
        {appLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#000000] z-[999] flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-6 text-left relative">
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
              
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <div className="w-full h-full bg-[#070a13] rounded-[15px] flex items-center justify-center font-display font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-400 text-xl">
                    RS
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-black font-sans uppercase tracking-widest text-white">RIZWAN SAEED</h2>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mt-0.5">DUBAI GROWTH PLATFORM v4.0</p>
                </div>
              </div>

              <div className="p-4 bg-black/60 border border-white/[0.04] rounded-2xl space-y-3 font-mono text-[10px] text-gray-400 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2.5">
                  <span className="text-gray-500 uppercase">SYSTEM INITIATION PROTOCOLS</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    ONLINE
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-cyan-400/80">&gt; BOOTSTRAPPING AWWWARDS LAYOUTS... <span className="text-emerald-400">DONE</span></p>
                  <p className="text-cyan-400/80">&gt; COMPILING DEEP GOOGLE & META PPC ADAPTERS... <span className="text-emerald-400">DONE</span></p>
                  <p className="text-cyan-400/80">&gt; CALIBRATING SHOPIFY CRO FLOW ENGINES... <span className="text-emerald-400">DONE</span></p>
                  <p className="text-[#bfdbfe] animate-pulse">&gt; HANDSHAKING SECURE DUBAI LOCAL CLUSTERS...</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>LOADING PORTFOLIO DATABASE...</span>
                  <span className="text-cyan-400 font-bold">100% SECURE</span>
                </div>
                <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCmdPaletteOpen && (
          <div className="fixed inset-0 z-[99] flex items-start justify-center p-4 pt-[10vh]">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCmdPaletteOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Palette Body */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#0b0f19]/95 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans text-left"
            >
              {/* Top subtle indicator */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500" />
              
              {/* Input field */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.05]">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  autoFocus
                  value={cmdSearchQuery}
                  onChange={(e) => setCmdSearchQuery(e.target.value)}
                  placeholder="Search sections, services, or switch themes..."
                  className="w-full bg-transparent border-none text-xs text-white placeholder-gray-500 outline-none focus:ring-0 focus:outline-none"
                />
                <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-1.5 py-0.5 rounded uppercase">ESC</span>
              </div>

              {/* List of search matches / general links */}
              <div className="p-2 max-h-72 overflow-y-auto space-y-1">
                <span className="text-[9px] font-mono text-gray-500 px-3 uppercase tracking-wider block mb-1 font-bold">NAVIGATION SHORTCUTS</span>
                
                {[
                  { label: 'Hero Overview', icon: Sparkles, desc: 'Intro & Verified Metrics', action: () => { document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' }); setIsCmdPaletteOpen(false); } },
                  { label: 'Executive Biography', icon: User, desc: 'Full profile and business history', action: () => { document.getElementById('executive-biography')?.scrollIntoView({ behavior: 'smooth' }); setIsCmdPaletteOpen(false); } },
                  { label: 'ROI Growth Calculator', icon: TrendingUp, desc: 'Calculate leads and ROI instantly', action: () => { document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' }); setIsCmdPaletteOpen(false); } },
                  { label: 'Deep AI SEO/CRO Auditor', icon: Activity, desc: 'Analyze any URL using server-side Gemini', action: () => { document.getElementById('seo-cro-auditor')?.scrollIntoView({ behavior: 'smooth' }); setIsCmdPaletteOpen(false); } },
                  { label: 'Interactive Project Grid', icon: Briefcase, desc: 'Filter client portfolios', action: () => { document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' }); setIsCmdPaletteOpen(false); } },
                  { label: 'Live GA4 & SEO Dashboard', icon: BarChart3, desc: 'Real-time property indicators', action: () => { document.getElementById('analytics-dashboard')?.scrollIntoView({ behavior: 'smooth' }); setIsCmdPaletteOpen(false); } },
                  { label: 'Book Consultation Call', icon: Calendar, desc: 'Book direct strategy slot', action: () => { setIsContactModalOpen(true); setIsCmdPaletteOpen(false); } },
                ].filter(item => item.label.toLowerCase().includes(cmdSearchQuery.toLowerCase()) || item.desc.toLowerCase().includes(cmdSearchQuery.toLowerCase()))
                 .map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] flex items-center justify-between text-xs transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg text-gray-400 group-hover:text-cyan-400">
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-white font-semibold block">{item.label}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">{item.desc}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}

                <span className="text-[9px] font-mono text-gray-500 px-3 uppercase tracking-wider block mt-4 mb-1 font-bold">THEME PALETTE SWITCHER</span>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {[
                    { name: 'Midnight Cyber (Teal)', key: 'cyber', color: 'bg-cyan-500' },
                    { name: 'Classic Matrix (Emerald)', key: 'emerald', color: 'bg-emerald-500' },
                    { name: 'Neon Sunset (Pink)', key: 'sunset', color: 'bg-pink-500' },
                    { name: 'Glacial Minimal (Ice Blue)', key: 'ice', color: 'bg-blue-500' }
                  ].map((theme) => (
                    <button
                      key={theme.key}
                      onClick={() => {
                        setThemePreset(theme.key as any);
                        showToast(`Aesthetic shifted to ${theme.name}!`, "success");
                        setIsCmdPaletteOpen(prev => !prev);
                      }}
                      className={cn(
                        "flex items-center gap-2.5 p-2 rounded-xl text-[10px] font-mono uppercase text-left border cursor-pointer",
                        themePreset === theme.key
                          ? "bg-white/[0.04] border-white/20 text-white font-bold"
                          : "bg-[#070a13] border-white/[0.04] text-gray-400 hover:text-white hover:border-white/10"
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full", theme.color)} />
                      {theme.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-black/60 border-t border-white/[0.04] text-[9px] font-mono text-gray-500 flex items-center justify-between">
                <span>ENTERPRISE COMMAND PALETTE v1.0</span>
                <span className="text-cyan-400/80">⌘K or Ctrl+K ANYTIME</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* PREMIUM HANDCRAFTED DESIGN AGENCY GRIDS AND SOFT AMBIENT LIGHTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Designer Lavender Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e1d6e9_1px,transparent_1px),linear-gradient(to_bottom,#e1d6e9_1px,transparent_1px)] bg-[size:40px_40px] opacity-80" />
        {/* Soft elegant warm ambient glow spots */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#dfd3eb]/30 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] right-[15%] w-[600px] h-[600px] bg-[#f27447]/5 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[550px] h-[550px] bg-[#dfd3eb]/40 rounded-full filter blur-[110px] pointer-events-none" />
      </div>

      {/* TOP HEADER & NAVIGATION */}
      <Header setShowPasskeyModal={setShowPasskeyModal} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-24">
        {activeMainPage === 'blog' ? (
          <BlogPageView posts={liveBlogPosts} />
        ) : (
          <>
               {/* HERO SECTION */}
        <motion.section 
          id="hero-section" 
          className="relative pt-12 pb-4 rounded-3xl overflow-hidden group/hero text-[#5c253d]"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          {/* Headline Display */}
          <div className="space-y-4 text-center max-w-4xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-widest block font-bold text-[#f27447]">
              RIZWAN SAEED — GROWTH LEAD & SHOPIFY ARCHITECT
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-[#5c253d] font-display uppercase">
              Scale Your Brand&apos;s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5c253d] via-[#f27447] to-[#5c253d] font-display">
                Digital Footprint
              </span>
            </h1>
            <p className="text-[#5c253d]/80 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed">
              Award-winning certified Google Ads & Meta Business Partner, managing over <strong className="text-[#f27447]">AED 350K+</strong> ad spend and generating <strong className="text-[#f27447]">AED 1.2M+</strong> revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 mb-12">
            
            {/* Left Column: The Digital Edge Info Card */}
            <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 bg-white border-2 border-[#5c253d] rounded-2xl shadow-[4px_4px_0px_#5c253d] text-left">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-[#f27447] uppercase font-black block tracking-wider">THE DIGITAL EDGE</span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-[#5c253d] tracking-tight">Market Context</h3>
                
                {/* Region Selector */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { key: 'uae', label: 'UAE 🇦🇪' },
                    { key: 'usa', label: 'USA 🇺🇸' },
                    { key: 'uk', label: 'UK 🇬🇧' },
                    { key: 'global', label: 'Global 🌐' }
                  ].map((region) => (
                    <button
                      key={region.key}
                      onClick={() => {
                        setRegionalFocus(region.key as any);
                        showToast(`Hero metrics & positioning focused on ${region.key.toUpperCase()}!`, "success");
                      }}
                      className={cn(
                        "px-2 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer",
                        regionalFocus === region.key
                          ? "bg-[#5c253d] border-[#5c253d] text-white"
                          : "bg-transparent border-[#5c253d]/15 text-[#5c253d]/80 hover:bg-[#5c253d]/5"
                      )}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>

                <p className="text-[#5c253d]/80 text-xs sm:text-sm leading-relaxed min-h-[100px] pt-2">
                  {regionalFocus === 'uae' && "Helping UAE & Dubai Brands scale to millions with custom high-speed Shopify storefronts & hyper-targeted enterprise Google and Meta PPC campaigns."}
                  {regionalFocus === 'usa' && "Helping US Shopify e-commerce brands maximize Google Ads ROAS with technical CRO audits, high-performance Liquid templates, and custom APIs."}
                  {regionalFocus === 'uk' && "Powering UK digital businesses with secure Shopify setups, deep SEO audits, custom theme development, and high-converting marketing funnels."}
                  {regionalFocus === 'canada' && "Driving Canada pipeline scale using ROI-first digital marketing frameworks and analytics pipelines."}
                  {regionalFocus === 'australia' && "Scaling Australian brands through high-performance Shopify Liquid development, custom integrations, and expert conversion optimization."}
                  {regionalFocus === 'global' && "Architecting world-class, multi-currency Shopify storefronts, global headless systems, and scalable paid acquisition frameworks for international firms."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#5c253d]/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#5c253d]/60 font-bold uppercase">5.0 RATED EXPERTISE</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 text-[#f27447] fill-[#f27447]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Premium 3D-styled Framed Profile Image */}
            <div className="lg:col-span-4 relative flex items-center justify-center">
              <div className="relative w-full h-full min-h-[300px] lg:min-h-0 bg-white border-2 border-[#5c253d] rounded-2xl shadow-[4px_4px_0px_#5c253d] p-3 flex flex-col justify-between overflow-hidden">
                <div className="relative w-full h-48 sm:h-64 lg:h-52 rounded-xl overflow-hidden border border-[#5c253d]/15 bg-[#f6f3f8]">
                  <Image
                    src={hero.profileImage || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"}
                    alt="Rizwan Saeed - Senior Shopify Developer & Digital Marketing Manager"
                    fill
                    unoptimized
                    className="object-cover object-top grayscale-[15%] hover:scale-105 hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm border border-[#5c253d]/20 rounded text-[8px] font-mono text-[#5c253d] font-bold">
                    ONLINE • CONTRACTS ACTIVE
                  </div>
                </div>

                <div className="pt-3 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#5c253d] block leading-tight uppercase font-display">Rizwan Saeed</span>
                      <span className="text-[9px] font-mono text-[#5c253d]/70 uppercase font-semibold">Growth Lead & Shopify Engineer</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-[#dfd3eb]/50 px-2 py-1 rounded-lg border border-[#5c253d]/10">
                      <MapPin className="w-3 h-3 text-[#f27447]" />
                      <span className="text-[8px] font-mono text-[#5c253d] font-bold">DUBAI, UAE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Blocks / Highlight Action Cards */}
            <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
              {/* Coral Strategy Card */}
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="flex-1 flex flex-col justify-between p-6 bg-[#f27447] text-white border-2 border-[#5c253d] rounded-2xl shadow-[4px_4px_0px_#5c253d] text-left hover:bg-[#d65f33] transition-all cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="p-2 bg-white/20 rounded-xl w-max border border-white/20">
                    <Calendar className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight font-display mt-2">Book Free Growth Session</h4>
                  <p className="text-white/80 text-xs">Unlock a 1-on-1 strategy call. We audit your checkout, page speed, and active ads campaigns with no obligation.</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs uppercase font-bold pt-4">
                  <span>Secure slot now</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">↘</span>
                </div>
              </button>

              {/* Exploration White Card */}
              <a 
                href="#portfolio-grid"
                className="p-5 bg-white border-2 border-[#5c253d] rounded-2xl shadow-[4px_4px_0px_#5c253d] text-left hover:bg-[#5c253d]/5 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-[#5c253d] font-display">Explore Live Case Studies</h4>
                  <p className="text-[#5c253d]/70 text-[11px] mt-0.5">Real audits, 4.2x ROAS pipelines, Shopify clean codebases.</p>
                </div>
                <div className="p-2 bg-[#dfd3eb] rounded-xl text-[#5c253d] border border-[#5c253d]/10 transform group-hover:translate-x-1 transition-all">
                  <Briefcase className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* STATS BAR (Deep plum with clean columns) */}
          <div className="border-2 border-[#5c253d] bg-[#5c253d] rounded-2xl p-6 text-white grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {STATS_METRICS.slice(0, 4).map((stat: any, idx: number) => (
              <div 
                key={stat.id}
                className={cn(
                  "text-center space-y-1 relative",
                  idx > 0 ? "md:before:absolute md:before:left-0 md:before:top-2 md:before:bottom-2 md:before:w-[1px] md:before:bg-white/10" : ""
                )}
              >
                <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest block font-bold">
                  {stat.label}
                </span>
                <span className="text-2xl sm:text-3xl font-black block font-display tracking-tight text-[#f27447]">
                  <CountUp value={stat.value} />
                </span>
                <p className="text-[10px] text-white/70 max-w-[160px] mx-auto leading-tight">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* SMOOTH RUNNING TICKER */}
          <div className="w-full bg-[#dfd3eb] border-2 border-[#5c253d] rounded-xl py-3.5 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16 text-xs font-mono font-bold uppercase tracking-widest text-[#5c253d]">
              <span>RIZWAN SAEED ⚡ DUBAI GROWTH SPECIALIST</span>
              <span>SHOPIFY CUSTOM THEME DEV ⚡ META BUSINESS PARTNER</span>
              <span>GOOGLE ADS CERTIFIED ⚡ CONVERSION OPTIMIZATION AUDIT</span>
              <span>RIZWAN SAEED ⚡ DUBAI GROWTH SPECIALIST</span>
              <span>SHOPIFY CUSTOM THEME DEV ⚡ META BUSINESS PARTNER</span>
              <span>GOOGLE ADS CERTIFIED ⚡ CONVERSION OPTIMIZATION AUDIT</span>
              <span>RIZWAN SAEED ⚡ DUBAI GROWTH SPECIALIST</span>
              <span>SHOPIFY CUSTOM THEME DEV ⚡ META BUSINESS PARTNER</span>
              <span>GOOGLE ADS CERTIFIED ⚡ CONVERSION OPTIMIZATION AUDIT</span>
            </div>
          </div>
        </motion.section>

        {/* EXECUTIVE BIOGRAPHY SECTION */}
        <motion.section 
          id="executive-biography" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">01 / BRAND LEADER</div>
                <h2 className="text-3xl font-black tracking-tight text-[#5c253d] uppercase font-display">Executive Biography</h2>
                <div className="h-1 w-20 bg-[#5c253d] rounded" />
                <p className="text-[#5c253d]/70 text-xs font-mono pt-4">Targeting UAE, US, & UK E-commerce & Hospitality Landscapes</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <p className="text-[#5c253d]/80 text-base sm:text-lg leading-relaxed font-light">
                With over 5 years of experience in the digital landscape, I have successfully scaled businesses across the USA, UK, UAE, and Pakistan markets. My expertise lies in a holistic approach combining Shopify Development, Technical SEO, and high-converting Paid Advertising campaigns on Google and Meta platforms.
              </p>

              <div className="p-6 rounded-2xl bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#5c253d]/10">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#5c253d]/80 font-bold">Core Strengths & Platform Integrations</h4>
                  <span className="text-[10px] font-mono text-[#f27447] bg-[#f27447]/5 px-2.5 py-0.5 rounded border border-[#f27447]/20 font-bold">
                    Click / Hover tags to inspect outcomes
                  </span>
                </div>
                
                {/* TAG CLOUD */}
                <div className="flex flex-wrap gap-2">
                  {BIOGRAPHY_TAGS.map((tag) => {
                    const details = BIOGRAPHY_TAG_DETAILS[tag.label];
                    const isActive = activeBioTag === tag.label;
                    return (
                      <button 
                        key={tag.label}
                        onClick={() => setActiveBioTag(tag.label)}
                        onMouseEnter={() => setActiveBioTag(tag.label)}
                        className={cn(
                          "inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-300 transform cursor-pointer border text-left",
                          isActive 
                            ? `bg-[#5c253d] border-[#5c253d] text-white scale-[1.03] border-opacity-100` 
                            : "bg-[#dfd3eb]/10 border-[#5c253d]/15 text-[#5c253d] hover:border-[#5c253d]/40 hover:text-[#5c253d] hover:bg-[#dfd3eb]/20"
                        )}
                        style={{ outline: 'none' }}
                      >
                        {getTagLogo(tag.label)}
                        <span className="font-bold">{tag.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* DYNAMIC DETAIL PANE */}
                {activeBioTag && BIOGRAPHY_TAG_DETAILS[activeBioTag] && (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#f6f3f8] border-2 border-[#5c253d] flex flex-col md:flex-row md:items-center gap-6 transition-all duration-300 animate-fadeIn text-[#5c253d]">
                    
                    {/* Left: Info & Bullets */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f27447] animate-pulse" />
                        <h5 className="text-sm font-mono font-black text-[#5c253d] uppercase tracking-tight">
                          {activeBioTag} Expertise
                        </h5>
                      </div>
                      
                      <p className="text-[#5c253d]/80 text-xs sm:text-sm leading-relaxed font-sans font-light">
                        {BIOGRAPHY_TAG_DETAILS[activeBioTag].description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {BIOGRAPHY_TAG_DETAILS[activeBioTag].keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-[11px] font-mono text-[#5c253d]/70">
                            <span className="text-xs text-[#f27447] font-bold">✔</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Premium Metric Box */}
                    <div className="w-full md:w-48 p-4 rounded-xl bg-white border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d] flex flex-col items-center justify-center text-center space-y-1.5 flex-shrink-0 self-stretch">
                      <span className="text-[9px] font-mono text-[#5c253d]/60 uppercase tracking-widest font-bold">
                        {BIOGRAPHY_TAG_DETAILS[activeBioTag].metricLabel}
                      </span>
                      <div className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-[#f27447]">
                        {BIOGRAPHY_TAG_DETAILS[activeBioTag].metric}
                      </div>
                      <div className="text-[9px] font-mono text-white bg-[#5c253d] px-2 py-0.5 rounded border border-[#5c253d]">
                        Verified Outcome
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>

          {/* INTERACTIVE GROWTH TIMELINE */}
          <div className="mt-12 pt-12 border-t border-[#5c253d]/15">
            <div className="space-y-4 mb-10 text-left">
              <span className="text-[10px] font-mono text-[#f27447] uppercase tracking-widest block font-bold">✦ EVOLUTION PATHWAY</span>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#5c253d]">Milestone Story Timeline</h3>
              <p className="text-xs text-[#5c253d]/80 max-w-xl font-sans leading-relaxed">
                Tracing the progression from building static web pages to architecting integrated, multi-channel growth engines for high-value brands in Dubai, New York, and London.
              </p>
            </div>

            <div className="relative border-l-2 border-[#5c253d]/20 pl-6 ml-4 space-y-8 text-left">
              {[
                {
                  year: "2026",
                  title: "Elite Growth Partner Model",
                  desc: "Aligning interest as a select equity & retention performance growth partner. Deploying advanced automated marketing chains, Shopify Plus liquid blueprints, and Gemini server-side automation protocols to drive custom pipeline conversions.",
                  status: "CURRENT FOCUS",
                  badgeClass: "bg-[#5c253d] border-[#5c253d] text-white",
                  dotClass: "bg-[#f27447]"
                },
                {
                  year: "2025",
                  title: "AI Integration & Dynamic CRO",
                  desc: "Integrated Gemini/GPT content pipelines and automated workflows into custom shopify structures. Combined multi-channel acquisition tracking setups to feed real-time first-party data securely back into ad architectures.",
                  status: "AI TRANSITION",
                  badgeClass: "bg-[#f27447]/10 border-[#f27447] text-[#f27447]",
                  dotClass: "bg-[#5c253d]"
                },
                {
                  year: "2023",
                  title: "International Horizons (UAE, USA, UK)",
                  desc: "Secured high-scale e-commerce retaining contracts in Dubai, London, and New York. Transformed legacy search frameworks into blazing-fast performance architecture that drives multi-million dollar annual store pipelines.",
                  status: "GLOBAL EXPANSION",
                  badgeClass: "bg-[#dfd3eb] border-[#5c253d]/40 text-[#5c253d]",
                  dotClass: "bg-[#f27447]"
                },
                {
                  year: "2021",
                  title: "Agency Acceleration",
                  desc: "Expanded into high-performance Shopify custom liquid development and full-funnel CRO strategy. Handled comprehensive search ranking profiles and established technical multi-channel acquisition channels.",
                  status: "PLATFORM MATURITY",
                  badgeClass: "bg-white border-[#5c253d]/40 text-[#5c253d]/80",
                  dotClass: "bg-[#5c253d]"
                },
                {
                  year: "2019",
                  title: "Founded Freelance Channel",
                  desc: "Launched custom digital design & development offerings. Delivered robust WordPress sites, managed local paid advertising, and formulated custom performance standards.",
                  status: "FOUNDATION",
                  badgeClass: "bg-white border-[#5c253d]/20 text-[#5c253d]/60",
                  dotClass: "bg-[#5c253d]/40"
                }
              ].map((milestone, idx) => (
                <div key={idx} className="relative group/timeline transition-all duration-300 hover:translate-x-1.5">
                  {/* Glowing vertical line connectors */}
                  <div className="absolute -left-[32px] top-2 w-3 h-3 rounded-full border-2 border-[#5c253d] transition-all duration-300 group-hover/timeline:scale-125 z-10 bg-white flex items-center justify-center">
                    <span className={cn("w-1.5 h-1.5 rounded-full transition-colors", milestone.dotClass)} />
                  </div>
                  
                  <div className="bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-2xl p-5 md:p-6 space-y-3 relative overflow-hidden transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-black text-lg md:text-xl text-[#f27447]">{milestone.year}</span>
                        <div className="h-4 w-[1px] bg-[#5c253d]/20 hidden sm:block" />
                        <h4 className="text-sm font-black text-[#5c253d] tracking-tight font-sans uppercase">{milestone.title}</h4>
                      </div>
                      <span className={cn("text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", milestone.badgeClass)}>
                        {milestone.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c253d]/80 font-sans leading-relaxed font-light">
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PREMIUM SERVICES & INTERACTIVE ESTIMATOR */}
        <motion.section 
          id="services-estimator" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="space-y-4 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">02 / CORE CAPABILITIES</div>
            <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Premium Digital Services</h2>
            <p className="text-[#5c253d]/80 text-sm max-w-2xl font-sans">
              Deploying high-converting paid traffic, technical search engine visibility, and fast-rendering storefront code optimized for direct growth.
            </p>
          </div>

          {/* Interactive Service Explorer Accordion Flow */}
          <div className="bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-2xl overflow-hidden relative mb-12 text-[#5c253d]">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#5c253d]/15">
              
              {/* Left sidebar: The service categories */}
              <div className="lg:col-span-4 p-6 space-y-4 text-left bg-[#f6f3f8]/50">
                <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase tracking-wider block mb-2 font-black">EXPLORE CATEGORIES // SERVICE LIST</span>
                <div className="space-y-2">
                  {SERVICES.map((serv: any) => {
                    const isSelected = activeServiceExplorerTab === serv.id;
                    return (
                      <button
                        key={serv.id}
                        onClick={() => {
                          setActiveServiceExplorerTab(serv.id);
                          showToast(`calibrated for ${serv.title.toUpperCase()}`, "success");
                        }}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden",
                          isSelected
                            ? "bg-[#dfd3eb]/50 border-2 border-[#5c253d] text-[#5c253d]"
                            : "bg-transparent border-[#5c253d]/10 text-[#5c253d]/75 hover:bg-[#5c253d]/5 hover:text-[#5c253d]"
                        )}
                      >
                        <div className="space-y-0.5 text-left">
                          <span className="text-[9px] font-mono uppercase tracking-widest block opacity-70 font-semibold">{serv.subtitle}</span>
                          <span className="text-sm font-black font-sans block">{serv.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white rounded border border-[#5c253d]/15 uppercase text-[#5c253d]/70">{serv.badge}</span>
                          <ChevronRight className={cn("w-4 h-4 transition-transform", isSelected ? "rotate-90 text-[#f27447]" : "text-[#5c253d]/50 group-hover:translate-x-0.5")} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#5c253d]/10 text-[11px] font-mono text-[#5c253d]/70 leading-relaxed space-y-1">
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f27447] animate-pulse" />
                    <span>98% Average Customer ROAS/SEO lift</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5c253d] animate-pulse" />
                    <span>Pure Liquid and CSS optimization frameworks</span>
                  </p>
                </div>
              </div>

              {/* Right content display: The Accordion Flow & Interactive Stages */}
              <div className="lg:col-span-8 p-6 sm:p-8 space-y-8 text-left bg-white">
                {/* Active Service Title & Description */}
                {(() => {
                  const activeService = SERVICES.find((s: any) => s.id === activeServiceExplorerTab) || SERVICES[0];
                  
                  let processPhases = [
                    { name: 'Phase 01', title: 'Deep Audit', desc: 'Analyzing existing configuration bugs, conversion barriers, & tracking errors.' },
                    { name: 'Phase 02', title: 'Tailored Setup', desc: 'Crafting pixel placements, conversion events, or modular clean code.' },
                    { name: 'Phase 03', title: 'Scale & Growth', desc: 'Budget allocation optimizations or strategic Search Console expansion.' }
                  ];
                  let relatedCaseStudy = { client: 'floorcarpet.ae', tag: 'SEO & Ads', metrics: '990 Clicks / 180K Imps' };
                  let roiDetails = { multiplier: '4.2x ROAS', description: 'Avg target advertising return mapped from campaign structures' };

                  if (activeService.id === 'shopify-development') {
                    processPhases = [
                      { name: 'Phase 01', title: 'Clean Architecture', desc: 'Designing lightning-fast schema layouts using clean, standard Liquid code.' },
                      { name: 'Phase 02', title: 'PageSpeed Audits', desc: 'Stripping bloat apps, compressing static modules, and minifying scripts.' },
                      { name: 'Phase 03', title: 'High-Converting CRO', desc: 'A/B testing fast cart slide-outs, single-step checkouts, & mobile urgency hooks.' }
                    ];
                    relatedCaseStudy = { client: 'Alphalete Athletics', tag: 'Shopify & Speed', metrics: '45% Speed Boost' };
                    roiDetails = { multiplier: 'Under 1.5s Load', description: 'Proven conversion uplift by cutting mobile friction & page load time' };
                  } else if (activeService.id === 'seo-optimization') {
                    processPhases = [
                      { name: 'Phase 01', title: 'Keyword Mining', desc: 'Identifying low-competition, high-intent localized commercial phrases.' },
                      { name: 'Phase 02', title: 'Technical On-Page', desc: 'Injecting dynamic schema, custom page layouts, and clean slug structures.' },
                      { name: 'Phase 03', title: 'Regional GMB Domination', desc: 'Optimizing local business citations to capture high-volume map packs.' }
                    ];
                    relatedCaseStudy = { client: 'luxurycurtain.ae', tag: 'Shopify & SEO', metrics: 'Top Rank Dubai' };
                    roiDetails = { multiplier: '+140% Organic Traffic', description: 'Average client search footprint growth after technical crawls pass' };
                  }

                  return (
                    <div className="space-y-6">
                      {/* Section Heading */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#5c253d]/10">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#f27447] uppercase tracking-widest font-bold">CURRENT STACK CALIBRATION</span>
                          <h3 className="text-xl font-black text-[#5c253d] uppercase tracking-tight">{activeService.title}</h3>
                        </div>
                        <span className="text-xs font-mono text-[#5c253d]/50">ENGAGEMENT SEQUENCE // DIRECT RESPONSE</span>
                      </div>

                      {/* Interactive Sequence Explorer Map */}
                      <div className="space-y-4">
                        <span className="text-[9px] font-mono text-[#5c253d]/60 uppercase tracking-widest block font-bold">CONVERSION FUNNEL STAGES // CLICK TO PROGRESS</span>
                        
                        <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-bold">
                          {[
                            { id: 'problem', label: '1. Problem' },
                            { id: 'solution', label: '2. Solution' },
                            { id: 'process', label: '3. Process' },
                            { id: 'result', label: '4. Result' },
                            { id: 'book_call', label: '5. Book Call' }
                          ].map((step) => {
                            const isActiveStep = activeSequenceStep === step.id;
                            return (
                              <button
                                key={step.id}
                                onClick={() => setActiveSequenceStep(step.id as any)}
                                className={cn(
                                  "py-2 rounded-lg border text-[9px] transition-all uppercase tracking-wider font-bold cursor-pointer",
                                  isActiveStep
                                    ? "bg-[#5c253d] border-[#5c253d] text-white shadow-sm"
                                    : "bg-[#dfd3eb]/10 border-[#5c253d]/15 text-[#5c253d]/70 hover:bg-[#5c253d]/5 hover:text-[#5c253d]"
                                )}
                              >
                                {step.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active Pipeline Card Content */}
                      <div className="p-6 rounded-xl bg-[#f6f3f8] border-2 border-[#5c253d] relative min-h-[160px] flex flex-col justify-between text-[#5c253d]">
                        
                        {/* 1. Problem Card */}
                        {activeSequenceStep === 'problem' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-[#f27447] uppercase font-black">STEP 01 // CRITICAL FRICTION POINT</span>
                              <span className="text-[9px] font-mono text-[#f27447] font-bold animate-pulse">REVENUE LOSS STATE</span>
                            </div>
                            <h4 className="text-sm font-black text-[#5c253d] uppercase tracking-tight">The Core Bottleneck</h4>
                            <p className="text-[#5c253d]/80 text-xs sm:text-sm leading-relaxed font-sans font-light">
                              {activeService.id === 'shopify-development' 
                                ? "Shopify storefronts lose up to 40% of standard checkout volume because of heavy bloated themes, slow third-party application chains, clunky responsive touch layouts, and multi-step carts."
                                : activeService.id === 'seo-optimization'
                                ? "High-value local search traffic bypasses your site because of outdated site speed architecture, incomplete Schema microdata structures, and keyword mapping gaps that yield zero search impressions."
                                : "Most digital brands drain over 35% of ad budgets on high-friction broad keywords, irrelevant traffic, or bad checkout attribution, giving platform giants free profit."
                              }
                            </p>
                            <div className="p-3 bg-white border border-[#5c253d]/15 rounded-xl flex items-center space-x-3">
                              <span className="text-xs">⚠️</span>
                              <span className="text-[10px] font-mono text-[#5c253d]/80 uppercase">Impact: Cuts conversion ratios and inflates customer acquisition costs.</span>
                            </div>
                          </div>
                        )}

                        {/* 2. Solution Card */}
                        {activeSequenceStep === 'solution' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-[#5c253d] uppercase font-black">STEP 02 // TECHNICAL BLUEPRINT</span>
                              <span className="text-[9px] font-mono text-[#5c253d] font-bold">SYSTEMIC CURE</span>
                            </div>
                            <h4 className="text-sm font-black text-[#5c253d] uppercase tracking-tight">The Growth Architecture</h4>
                            <p className="text-[#5c253d]/80 text-xs sm:text-sm leading-relaxed font-sans font-light">
                              {activeService.id === 'shopify-development'
                                ? "Complete speed restoration utilizing custom Shopify liquid blocks, stripping redundant apps, compressing media pipelines, and deploying high-converting AJAX sliding cart mechanics."
                                : activeService.id === 'seo-optimization'
                                ? "Structured technical crawl updates, dense commercial keyword targeting layouts, and dynamic search console profiles that turn search algorithms into passive client pipelines."
                                : "Deploying laser-targeted search queries, structural Performance Max campaigns, precision lookalikes, and direct WhatsApp / Conversion API tracking setups for airtight attribution."
                              }
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {activeService.items.map((it: string) => (
                                <div key={it} className="flex items-center space-x-2 text-[11px] font-mono text-[#5c253d]/80">
                                  <Check className="w-3.5 h-3.5 text-[#f27447]" />
                                  <span>{it}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. Process Card */}
                        {activeSequenceStep === 'process' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-[#5c253d]/70 uppercase font-black">STEP 03 // EXECUTION FLOW</span>
                              <span className="text-[9px] font-mono text-[#f27447] font-bold">THREE-PHASE ENGAGEMENT</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                              {processPhases.map((phase) => (
                                <div key={phase.name} className="p-3 bg-white border border-[#5c253d]/15 rounded-xl space-y-1 text-left">
                                  <span className="text-[8px] font-mono text-[#f27447] uppercase font-black">{phase.name}</span>
                                  <h4 className="text-xs font-black text-[#5c253d] uppercase">{phase.title}</h4>
                                  <p className="text-[10px] text-[#5c253d]/70 leading-relaxed font-sans font-light">{phase.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. Result Card */}
                        {activeSequenceStep === 'result' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-[#5c253d]/70 uppercase font-black">STEP 04 // MEASURED VERIFIED EVIDENCE</span>
                              <span className="text-[9px] font-mono text-[#5c253d] font-bold font-black">OUTCOME METRIC</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 p-4 bg-white border-2 border-[#5c253d] rounded-xl">
                              <div className="space-y-1 text-left flex-1">
                                <span className="text-[8px] font-mono text-[#f27447] uppercase font-bold">CLIENT CASE STUDY</span>
                                <h4 className="text-sm font-black text-[#5c253d] font-mono">{relatedCaseStudy.client}</h4>
                                <p className="text-[11px] text-[#5c253d]/70 font-sans font-light">Successfully integrated customized workflows and optimized search profiles.</p>
                              </div>
                              <div className="text-center flex flex-col justify-center bg-[#dfd3eb]/30 px-4 py-3 rounded-lg border border-[#5c253d]/30">
                                <span className="text-[8px] font-mono text-[#5c253d]/60 uppercase leading-none block font-bold">OUTCOME LIFT</span>
                                <span className="text-sm font-black font-mono text-[#5c253d] mt-1 block whitespace-nowrap">{relatedCaseStudy.metrics}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 pt-1">
                              <span className="text-3xl font-black font-mono text-[#f27447]">{roiDetails.multiplier}</span>
                              <div className="text-left">
                                <span className="text-[9px] font-mono text-[#5c253d]/60 uppercase block font-bold">Projected Benchmark</span>
                                <span className="text-[10px] text-[#5c253d]/70 font-sans">{roiDetails.description}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. Book Call Card */}
                        {activeSequenceStep === 'book_call' && (
                          <div className="space-y-4 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-[#5c253d]/70 uppercase font-black">STEP 05 // ACTION COGNITION</span>
                              <span className="text-[9px] font-mono text-[#f27447] font-bold">RESERVE TIME SLOT</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                              <p className="text-[#5c253d]/80 text-xs sm:text-sm leading-relaxed max-w-md text-left font-sans font-light">
                                Let&apos;s map these premium Shopify development, CRO modifications, and technical search funnels to your specific company domain. Reserve a free audit strategy slot.
                              </p>
                              <button 
                                onClick={() => setIsContactModalOpen(true)}
                                className="px-5 py-3.5 bg-[#f27447] text-white hover:bg-[#d65f33] border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d] font-bold font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer whitespace-nowrap"
                              >
                                Book Strategy Session
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Next Action Tooltip bar at bottom of card */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#5c253d]/10 text-[9px] font-mono text-[#5c253d]/60">
                          <span>* CLICK CONVERSION SEQUENCE STAGES TO FLOW STATE</span>
                          <button
                            onClick={() => {
                              const stepCycle = ['problem', 'solution', 'process', 'result', 'book_call'];
                              const currentIdx = stepCycle.indexOf(activeSequenceStep);
                              const nextIdx = (currentIdx + 1) % stepCycle.length;
                              setActiveSequenceStep(stepCycle[nextIdx] as any);
                            }}
                            className="text-[#f27447] hover:text-[#d65f33] transition-colors uppercase font-bold cursor-pointer"
                          >
                            NEXT STATE &gt;&gt;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

          {/* DYNAMIC ESTIMATOR SLIDER WIDGET */}
          <div className="bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-2xl p-6 sm:p-8 relative overflow-hidden text-[#5c253d]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="px-2.5 py-1 bg-[#dfd3eb]/50 border border-[#5c253d]/20 rounded text-[10px] font-mono uppercase text-[#5c253d] font-black">
                  Interactive Planner
                </span>
                <h3 className="text-xl font-black text-[#5c253d] uppercase tracking-tight font-display">Growth Strategy Recommendation Engine</h3>
                <p className="text-[#5c253d]/80 text-xs font-sans leading-relaxed">
                  Slide your projected monthly advertising or SEO investment plan (AED) to dynamically discover high-converting channels and forecasted strategic allocation.
                </p>

                {/* SLIDER CONTROLS */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#5c253d]/70 font-semibold">Projected Monthly Allocation:</span>
                    <span className="text-[#f27447] font-bold">AED {estimateBudget.toLocaleString()} / mo</span>
                  </div>
                  <input 
                    type="range" 
                    min="2000" 
                    max="30000" 
                    step="500"
                    value={estimateBudget}
                    onChange={(e) => setEstimateBudget(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#dfd3eb] rounded-lg appearance-none cursor-pointer accent-[#f27447]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#5c253d]/50">
                    <span>AED 2K</span>
                    <span>AED 15K</span>
                    <span>AED 30K+</span>
                  </div>
                </div>
              </div>

              {/* RECOMMENDED OUTCOMES */}
              <div className="lg:col-span-7 bg-[#f6f3f8] border-2 border-[#5c253d] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-start border-b border-[#5c253d]/15 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase font-semibold">Recommended Strategy Grade</span>
                    <h4 className="text-sm font-mono font-black text-[#5c253d] uppercase mt-0.5">{recommendedStrategy.level}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#f27447] uppercase font-bold">Estimated ROAS Multiplier</span>
                    <div className="text-sm font-mono font-black text-[#f27447]">{recommendedStrategy.roasMultiplier}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                  <div className="bg-white p-2.5 rounded-xl border border-[#5c253d]/15 text-center">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 block uppercase font-semibold">Paid Traffic Focus</span>
                    <span className="text-xs font-mono font-bold text-[#5c253d] block mt-1">{recommendedStrategy.split.ads}% Ads</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#5c253d]/15 text-center">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 block uppercase font-semibold">Organic Authority</span>
                    <span className="text-xs font-mono font-bold text-[#5c253d] block mt-1">{recommendedStrategy.split.seo}% SEO</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#5c253d]/15 text-center">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 block uppercase font-semibold">Conversion Tuning</span>
                    <span className="text-xs font-mono font-bold text-[#5c253d] block mt-1">{recommendedStrategy.split.cro}% CRO</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block font-semibold">Strategic Tasks & Channels Included:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recommendedStrategy.channels.map((ch, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-[10px] font-mono text-[#5c253d]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#f27447] flex-shrink-0" />
                        <span className="truncate">{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#5c253d]/15 pt-3 flex justify-between items-center text-[11px] font-mono text-[#5c253d]">
                  <span className="text-[#5c253d]/70">Theme Optimization Level:</span>
                  <span className="text-[#f27447] font-bold">{recommendedStrategy.speedImprovement}</span>
                </div>

              </div>

            </div>
          </div>
        </motion.section>

        {/* OFFICIAL BRAND LOGO MATRIX */}
        <motion.section 
          id="brand-matrix" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">03 / TRUSTED BY LEADING FIRMS</div>
            <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Our Journey of Innovation & Impact</h2>
            <p className="text-[#5c253d]/80 text-xs font-sans">
              At Rizwan Saeed, innovation is at the core of everything we do. We build, manage and scale custom workflows for leading regional hospitality, commercial, and e-commerce labels.
            </p>
          </div>

          {/* Premium Glowing Card Logo Matrix */}
          <div className="bg-white rounded-3xl border-2 border-[#5c253d] p-6 sm:p-10 shadow-[4px_4px_0px_#5c253d] relative overflow-hidden text-[#5c253d]">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#5c253d] to-[#f27447]" />
            
            <div id="dynamic-brand-matrix-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch text-center">
              
              {logoWall.filter((logo: any) => logo.visible).map((logo: any) => {
                return (
                  <a 
                    key={logo.id}
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col justify-between p-5 rounded-2xl bg-[#f6f3f8] border-2 border-[#5c253d]/25 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden cursor-pointer hover:bg-white hover:border-[#5c253d]"
                  >
                    <div className="absolute top-4 right-4 text-[#5c253d]/50 group-hover:text-[#f27447] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      <div className="h-16 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-xl bg-white border border-[#5c253d]/15 flex items-center justify-center p-2.5 transition-all duration-300 group-hover:border-[#f27447]/40 group-hover:shadow-sm">
                          <LogoImage 
                            src={logo.img} 
                            alt={`${logo.label} Logo`}
                            className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
                            fallbackDomain={(() => {
                              try {
                                return new URL(logo.href).hostname;
                              } catch {
                                return 'google.com';
                              }
                            })()}
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <span className="font-sans font-black text-xs sm:text-sm tracking-wider text-[#5c253d] block uppercase truncate">{logo.label}</span>
                        <span className="text-[9px] font-mono uppercase tracking-widest block font-bold truncate text-[#f27447]">{logo.subLabel}</span>
                      </div>
                    </div>
                    <div className="border-t border-[#5c253d]/10 pt-3 mt-4 space-y-1">
                      <span className="text-[9px] font-mono text-[#5c253d]/60 block uppercase truncate">{logo.desc}</span>
                      <div className="text-xs font-mono font-bold truncate text-[#5c253d]">{logo.badge}</div>
                    </div>
                  </a>
                );
              })}



















            </div>
          </div>
        </motion.section>

        {/* PROFESSIONAL EXPERIENCE TIMELINE */}
        <motion.section 
          id="experience-timeline" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">04 / HISTORY OF ROLES</div>
                <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Professional Experience</h2>
                <div className="h-1 w-20 bg-[#5c253d] rounded" />
                <p className="text-[#5c253d]/70 text-xs font-sans pt-4 max-w-sm">
                  Over 5 years of active deployment spanning premium hospitality lead conversion and custom Shopify Liquid builds.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8 relative">
              {/* Vertical center track */}
              <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-[#5c253d]/20" />

              {TIMELINE.map((time: any) => (
                <div key={time.id} className="relative pl-10 group">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#5c253d] group-hover:border-[#f27447] group-hover:bg-[#f27447] transition-colors z-10" />
                  
                  <div className="p-5 sm:p-6 bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-2xl space-y-3 transition-all hover:translate-x-1 hover:shadow-[6px_6px_0px_#5c253d]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="font-mono text-xs font-black text-[#f27447]">{time.period}</span>
                      <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase flex items-center">
                        <MapPin className="w-3 h-3 text-[#f27447] mr-1" /> {time.location}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#5c253d] uppercase tracking-wide">{time.role}</h3>
                      <span className="font-mono text-xs text-[#5c253d]/70">@ <strong className="text-[#f27447] font-bold">{time.company}</strong></span>
                    </div>

                    <p className="text-[#5c253d]/80 text-xs font-sans leading-relaxed">{time.description}</p>

                    <div className="space-y-1.5 border-t border-[#5c253d]/10 pt-3">
                      <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block">Verified Deliverables:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {time.achievements.map((ach: any, idx: number) => (
                          <li key={idx} className="text-[10px] font-mono text-[#5c253d]/80 flex items-start space-x-1.5">
                            <span className="text-[#f27447] flex-shrink-0 mt-0.5">{"//"}</span>
                            <span className="leading-tight">{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.section>

        {/* FILTERABLE CLIENT SHOWCASE & DETAIL POPUPS */}
        <motion.section 
          id="portfolio-grid" 
          className="border-t border-[color-mix(in_srgb,var(--primary)_15%,transparent)] pt-16 text-[var(--primary)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--secondary)] font-bold">05 / PORTFOLIO DEMO</div>
              <h2 className="text-3xl font-black text-[var(--primary)] uppercase tracking-tight font-display">Selected Case Studies</h2>
              <p className="text-[color-mix(in_srgb,var(--primary)_80%,transparent)] text-xs font-sans">
                Search and explore real luxury, hospitality, and e-commerce domains optimized by Rizwan. Click cards for case study details.
              </p>
            </div>

            {/* Live Search & Filter Panel */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Fuzzy-search Input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color-mix(in_srgb,var(--primary)_50%,transparent)]" />
                <input 
                  type="text"
                  placeholder="Fuzzy-search domains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-white border-2 border-[var(--primary)] text-[var(--primary)] focus:border-[var(--secondary)] placeholder-[color-mix(in_srgb,var(--primary)_40%,transparent)] rounded-xl px-3 py-2 pl-9 text-xs font-mono shadow-[2px_2px_0px_var(--primary)] focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color-mix(in_srgb,var(--primary)_60%,transparent)] hover:text-[var(--primary)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Dropdown Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[color-mix(in_srgb,var(--primary)_60%,transparent)]">Filter:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-xl px-3 py-2 text-xs font-mono focus:border-[var(--secondary)] shadow-[2px_2px_0px_var(--primary)] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Specialties</option>
                  <option value="carpet">Carpet & Furnishings</option>
                  <option value="curtain">Curtains & Blinds</option>
                  <option value="Shopify">Shopify & E-com</option>
                </select>
              </div>
            </div>
          </div>

          {/* PORTFOLIO GRID */}
          {isPortfolioLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((idx) => (
                <div 
                  key={`skeleton-${idx}`}
                  className="bg-white border-2 border-[var(--primary)] rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full space-y-4 shadow-[4px_4px_0px_var(--primary)]"
                >
                  <div className="space-y-4 w-full">
                    {/* Browser Mockup Frame Skeleton */}
                    <div className="relative w-full rounded-lg overflow-hidden border border-[color-mix(in_srgb,var(--primary)_15%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] flex flex-col shrink-0">
                      {/* Browser Window Chrome/Header */}
                      <div className="bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] border-b border-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-3 py-2 flex items-center justify-between shrink-0">
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)]" />
                        </div>
                        <div className="mx-2 flex-1 max-w-[120px] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] rounded h-3.5" />
                        <div className="w-3" />
                      </div>

                      {/* Live Screenshot Shimmer cover */}
                      <div className="relative w-full h-40 bg-white flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-[color-mix(in_srgb,var(--primary)_5%,transparent)] to-white animate-pulse" />
                        <Globe className="w-4 h-4 text-[color-mix(in_srgb,var(--primary)_20%,transparent)] animate-bounce" />
                      </div>
                    </div>

                    {/* Title & Subtitle skeleton lines */}
                    <div className="space-y-2 pt-1">
                      <div className="h-5 w-2/3 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] rounded animate-pulse" />
                      <div className="h-3 w-1/3 bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] rounded animate-pulse" />
                    </div>

                    {/* Split Metrics Columns Skeletons */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-zinc-900/80">
                      <div className="space-y-2">
                        <div className="h-6 w-1/2 bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded animate-pulse" />
                        <div className="h-2.5 w-1/3 bg-zinc-900/50 rounded animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 w-1/2 bg-[color-mix(in_srgb,var(--secondary)_20%,transparent)] rounded animate-pulse" />
                        <div className="h-2.5 w-1/3 bg-zinc-900/50 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Card Footer Skeletons */}
                  <div className="mt-5 pt-3 border-t border-zinc-900/80 flex items-center gap-2">
                    <div className="flex-1 bg-zinc-950/80 border border-zinc-900 h-9 rounded animate-pulse" />
                    <div className="w-24 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] h-9 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="bg-black border border-zinc-800 rounded-xl p-10 text-center text-gray-500 text-xs font-mono">
              No matching client records found for your search inquiry. Try &quot;Shopify&quot;, &quot;carpet&quot;, or &quot;ads&quot;.
            </div>
          ) : (
            <div className="space-y-10">
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.12
                    }
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredClients.slice(0, 3).map((client: any) => {
                  // Determine badge style
                  let badgeBg = "bg-[var(--primary)] text-zinc-950 font-bold border border-[var(--primary)]/20";
                  if (client.badge === "Performance Boost") {
                    badgeBg = "bg-[var(--secondary)] text-zinc-950 font-bold border border-[var(--secondary)]/20";
                  } else if (client.badge === "CRO & Organic") {
                    badgeBg = "bg-amber-400 text-black";
                  } else if (client.badge) {
                    badgeBg = "bg-zinc-800 text-zinc-300 border border-zinc-700";
                  }

                  return (
                    <motion.div 
                      key={client.id}
                      variants={{
                        hidden: { opacity: 0, y: 35 },
                        visible: { 
                          opacity: 1, 
                          y: 0, 
                          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
                        }
                      }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty("--x", `${x}px`);
                        e.currentTarget.style.setProperty("--y", `${y}px`);
                      }}
                      onClick={() => {
                        setSelectedClientModal(client);
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.set('caseStudy', client.id);
                          window.history.pushState({}, '', url.toString());
                        }
                      }}
                      className={cn(
                        "bg-white border-2 border-[var(--primary)] rounded-3xl p-5 cursor-pointer relative group flex flex-col justify-between overflow-hidden shadow-[4px_4px_0px_var(--primary)] hover:shadow-[6px_6px_0px_var(--primary)] transition-all",
                        client.highlight && "ring-2 ring-[var(--secondary)] ring-offset-2 ring-offset-white"
                      )}
                    >
                      {/* Highlight subtle corner ribbon if VIP */}
                      {client.highlight && (
                        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-20">
                          <div className="absolute transform rotate-45 bg-[var(--secondary)] text-white font-mono text-[7px] font-bold py-1 px-5 right-[-24px] top-[14px] text-center w-[100px] shadow-sm uppercase tracking-widest">
                            VIP
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 relative z-10 w-full">
                        {/* Browser Mockup Frame with Live Website Screenshot */}
                        <div className="relative w-full rounded-xl overflow-hidden border-2 border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_3%,transparent)] flex flex-col group/browser">
                          {/* Browser Window Chrome/Header */}
                          <div className="bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] border-b-2 border-[var(--primary)] px-3 py-2 flex items-center justify-between shrink-0 select-none">
                            {/* Left Dot Controls */}
                            <div className="flex gap-1 items-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            </div>
                            {/* Center URL pill */}
                            <div className="mx-2 flex-1 max-w-[140px] sm:max-w-[180px] bg-white border border-[var(--primary)]/30 rounded-lg px-1.5 py-0.5 flex items-center gap-1 justify-center">
                              <Lock className="w-2 h-2 text-[var(--secondary)] shrink-0" />
                              <span className="text-[8.5px] font-mono text-[var(--primary)]/80 truncate tracking-wide">
                                {getClientDomain(client.name)}
                              </span>
                            </div>
                            {/* Right Mini Action */}
                            <div className="w-3" />
                          </div>

                          {/* Live Screenshot Wrapper */}
                          <div className="relative w-full h-40 overflow-hidden bg-white">
                            <ClientScreenshot 
                              key={client.id || client.name}
                              client={client} 
                              className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                            
                            {/* Top Left Badge overlay */}
                            {client.badge && (
                              <div className="absolute top-2.5 left-2.5 z-10">
                                <span className={cn("text-[8px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded shadow-sm border border-[var(--primary)]/20", badgeBg)}>
                                  {client.badge}
                                </span>
                              </div>
                            )}

                            {/* Top Right Logo icon overlay */}
                            <div className="absolute top-2.5 right-2.5 z-10 bg-white border border-[var(--primary)] p-0.5 rounded backdrop-blur-xs flex items-center justify-center shadow-sm">
                              <ClientLogoImage 
                                key={client.id}
                                domain={getClientDomain(client.name)}
                                name={client.name}
                                className="w-3.5 h-3.5 rounded-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-sans font-black text-[var(--primary)] tracking-tight group-hover:text-[var(--secondary)] transition-colors text-base sm:text-lg flex items-center gap-1.5">
                            <span>{client.name}</span>
                            <a 
                              href={client.websiteUrl || `https://${getClientDomain(client.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[var(--primary)]/40 hover:text-[var(--secondary)] transition-colors cursor-pointer inline-flex items-center"
                              title={`Visit ${client.name} live`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </h3>
                          <p className="text-[10px] font-mono text-[var(--primary)]/60 uppercase tracking-widest font-bold">
                            {client.tag}
                          </p>
                        </div>

                        {/* Split Metrics Columns */}
                        <div className="grid grid-cols-2 gap-4 py-3 border-t-2 border-b-2 border-[var(--primary)]/10">
                          <div>
                            <div className="text-base sm:text-lg font-black font-mono text-[var(--primary)]">
                              {client.metric1?.val || client.metrics?.split(' / ')[0] || '98%'}
                            </div>
                            <div className="text-[9px] font-mono uppercase text-[var(--primary)]/60 tracking-wider font-bold">
                              {client.metric1?.label || 'Score'}
                            </div>
                          </div>
                          <div>
                            <div className="text-base sm:text-lg font-black font-mono text-[var(--secondary)]">
                              {client.metric2?.val || client.metrics?.split(' / ')[1] || 'Completed'}
                            </div>
                            <div className="text-[9px] font-mono uppercase text-[var(--primary)]/60 tracking-wider font-bold">
                              {client.metric2?.label || 'Outcome'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dual Action Card Footer */}
                      <div className="mt-5 pt-3 border-t-2 border-[var(--primary)]/10 flex items-center gap-2 relative z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClientModal(client);
                            if (typeof window !== 'undefined') {
                              const url = new URL(window.location.href);
                              url.searchParams.set('caseStudy', client.id);
                              window.history.pushState({}, '', url.toString());
                            }
                          }}
                          className="flex-1 bg-white hover:bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] border-2 border-[var(--primary)] text-[var(--primary)] text-[10px] font-mono font-bold uppercase tracking-widest py-2 rounded-xl shadow-[2px_2px_0px_var(--primary)] transition-all text-center active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--primary)]"
                        >
                          {client.buttonText || 'Case Study'}
                        </button>
                        
                        <a 
                          href={client.websiteUrl || `https://${getClientDomain(client.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-2.5 bg-[var(--secondary)] hover:opacity-95 border-2 border-[var(--primary)] text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl shadow-[2px_2px_0px_var(--primary)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--primary)]"
                          title={`Visit ${client.name} live`}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                          <span>Live Site</span>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* CLIENT DETAIL MODAL POPUP */}
          {selectedClientModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div 
                className="bg-white border-2 border-[var(--primary)] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-[8px_8px_0px_var(--primary)] animate-scale-in text-[var(--primary)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  onClick={() => {
                    setSelectedClientModal(null);
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.searchParams.delete('caseStudy');
                      window.history.pushState({}, '', url.toString());
                    }
                  }}
                  className="absolute top-4 right-4 z-20 p-1.5 rounded-xl bg-white border-2 border-[var(--primary)] text-[var(--primary)] shadow-[2px_2px_0px_var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--primary)] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Cover Image banner */}
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-[var(--primary)] bg-white shadow-inner">
                  <ClientScreenshot 
                    key={selectedClientModal.id || selectedClientModal.name}
                    client={selectedClientModal} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
                  {selectedClientModal.highlight && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded border-2 border-[var(--primary)] bg-[var(--secondary)] text-white text-[8px] font-bold tracking-widest uppercase font-mono shadow-[2px_2px_0px_var(--primary)]">
                      ⭐ VIP CASE STUDY
                    </span>
                  )}
                </div>

                {/* Modal Title */}
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded border-2 border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] text-[var(--primary)] text-[10px] font-mono font-bold uppercase shadow-[2px_2px_0px_var(--primary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Rizwan&apos;s Verified Case Study</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-[var(--primary)] flex items-center justify-center p-1.5 shadow-sm">
                      <LargeClientLogoImage 
                        key={selectedClientModal.id}
                        domain={getClientDomain(selectedClientModal.name)}
                        name={selectedClientModal.name}
                        className="w-full h-full rounded-lg object-contain"
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-sans font-black text-[var(--primary)] uppercase tracking-tight">
                      {selectedClientModal.name}
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs font-mono text-[var(--secondary)] gap-1 sm:gap-0 font-bold">
                    <span>Outcome Metric: {selectedClientModal.metrics}</span>
                    <span className="text-[var(--primary)]/60 font-bold">Tag: {selectedClientModal.tag}</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="space-y-4 border-t-2 border-[var(--primary)]/10 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-red-500 uppercase font-black tracking-wider">{"// The Challenge"}</span>
                    <p className="text-[var(--primary)] text-xs sm:text-sm leading-relaxed font-sans bg-[color-mix(in_srgb,var(--primary)_3%,transparent)] p-3 rounded-xl border-2 border-[var(--primary)] font-medium">
                      {selectedClientModal.challenge}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--primary)] uppercase font-black tracking-wider">{"// Rizwan's Strategy"}</span>
                    <p className="text-[var(--primary)] text-xs sm:text-sm leading-relaxed font-sans bg-[color-mix(in_srgb,var(--primary)_3%,transparent)] p-3 rounded-xl border-2 border-[var(--primary)] font-medium">
                      {selectedClientModal.strategy}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--secondary)] uppercase font-black tracking-wider">{"// Verified Outcomes"}</span>
                    <p className="text-[var(--primary)] text-xs sm:text-sm leading-relaxed font-sans bg-[color-mix(in_srgb,var(--secondary)_5%,transparent)] p-3 rounded-xl border-2 border-[var(--primary)] font-medium">
                      {selectedClientModal.outcomes}
                    </p>
                  </div>
                </div>

                <div className="border-t-2 border-[var(--primary)]/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-[10px] font-mono text-[var(--primary)]/60 font-bold">Rizwan Saeed • Shopify Developer</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <a 
                      href={selectedClientModal.websiteUrl || `https://${getClientDomain(selectedClientModal.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[var(--secondary)] hover:opacity-95 border-2 border-[var(--primary)] text-white font-bold font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_var(--primary)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--primary)]"
                    >
                      <Globe className="w-3.5 h-3.5 text-white" />
                      <span>Visit Live Website</span>
                    </a>
                    <button 
                      onClick={() => {
                        setSelectedClientModal(null);
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.delete('caseStudy');
                          window.history.pushState({}, '', url.toString());
                        }
                      }}
                      className="px-4 py-2 bg-white hover:bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] text-[var(--primary)] border-2 border-[var(--primary)] rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider shadow-[2px_2px_0px_var(--primary)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--primary)] cursor-pointer"
                    >
                      Close Study
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* INDUSTRIES WE COVER SECTION */}
        <motion.section 
          id="industries-coverage" 
          className="border-t border-[#5c253d]/15 pt-24 pb-16 space-y-12 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold text-[#f27447] uppercase tracking-widest bg-[#f27447]/5 border border-[#f27447]/20 px-3 py-1 rounded-full">
              ✦ Targeted Market Sectors
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#5c253d] uppercase tracking-tight leading-none font-display">
              Industries We Cover
            </h2>
            <p className="text-[#5c253d]/80 text-sm font-sans leading-relaxed max-w-2xl mx-auto">
              Deploying tailormade acquisition funnels, technical search frameworks, and premium conversion engineering across high-value commercial domains.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
            {[
              { name: "Events Digital Marketing", desc: "Ticket sales & venue promotion", icon: Calendar },
              { name: "Hotel Digital Marketing", desc: "Direct bookings & hospitality CRO", icon: Hotel },
              { name: "Health Digital Marketing", desc: "Patient acquisition & clinics SEO", icon: HeartPulse },
              { name: "Sports Digital Marketing", desc: "Athletic brands & fitness channels", icon: Activity },
              { name: "Educational Marketing", desc: "Student enrollment & courses scaling", icon: GraduationCap },
              
              { name: "HVAC Digital Marketing", desc: "Local dispatch & service contracts", icon: Wind },
              { name: "Small Business Marketing", desc: "Hyperlocal visibility & store traffic", icon: Store },
              { name: "Fashion Marketing", desc: "D2C retail scaling & lookbooks CRO", icon: Sparkles },
              { name: "Entertainment & Arts", desc: "Creative campaigns & media exposure", icon: Theater },
              { name: "E-Commerce Marketing", desc: "Shopify scale & cart optimizations", icon: ShoppingBag },
              
              { name: "Food Digital Marketing", desc: "Restaurant chains & delivery funnels", icon: Utensils },
              { name: "Electrician Digital Marketing", desc: "Emergency service leads & commercial", icon: Zap },
              { name: "B2B Marketing", desc: "Lead generation & enterprise outreach", icon: Network },
              { name: "Cleaning Marketing", desc: "Residential & commercial contracts", icon: Brush },
              { name: "Photography Marketing", desc: "Studio bookings & portfolio prestige", icon: Camera },
            ].map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-2xl p-6 flex flex-col items-center text-center space-y-4 transition-all duration-300 hover:shadow-[6px_6px_0px_#5c253d] hover:bg-[#f6f3f8]"
                >
                  <div className="p-3 rounded-xl bg-[#f6f3f8] border border-[#5c253d]/15 text-[#f27447]">
                    <IconComponent className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#5c253d] tracking-tight font-sans uppercase">{industry.name}</h3>
                    <p className="text-[10px] font-mono text-[#5c253d]/70">{industry.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* DUAL-MODE ROI GROWTH CALCULATOR */}
        <motion.section 
          id="roi-calculator" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="space-y-4 mb-10">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">07 / PROJECT FINANCIAL RETURNS</div>
            <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Growth & ROI Estimator</h2>
            <p className="text-[#5c253d]/80 text-sm max-w-2xl font-sans">
              Enter details below to compare e-commerce (B2C) sales or custom B2B lead targets, simulating your ROI based on Rizwan&apos;s historical optimization multipliers.
            </p>
          </div>

          <div className="bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-2xl p-6 sm:p-8 relative overflow-hidden text-[#5c253d]">
            
            {/* Mode Selector Toggle */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#5c253d]/10 pb-5 mb-6">
              <span className="text-xs font-mono text-[#5c253d]/60 mr-2">Target Funnel Type:</span>
              <button 
                onClick={() => setCalculatorMode('b2c')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border-2",
                  calculatorMode === 'b2c' 
                    ? "bg-[#5c253d] border-[#5c253d] text-white font-bold" 
                    : "bg-transparent border-[#5c253d]/20 text-[#5c253d] hover:bg-[#5c253d]/5"
                )}
              >
                E-commerce (B2C) Funnel
              </button>
              <button 
                onClick={() => setCalculatorMode('b2b')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border-2",
                  calculatorMode === 'b2b' 
                    ? "bg-[#5c253d] border-[#5c253d] text-white font-bold" 
                    : "bg-transparent border-[#5c253d]/20 text-[#5c253d] hover:bg-[#5c253d]/5"
                )}
              >
                Lead Generation (B2B)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Inputs Column */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Spend Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#5c253d]/70">Projected Ad Spend Plan:</span>
                    <span className="text-[#5c253d] font-bold">AED {adSpend.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="50000" 
                    step="500"
                    value={adSpend}
                    onChange={(e) => setAdSpend(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#f6f3f8] border border-[#5c253d]/20 rounded-lg accent-[#f27447] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#5c253d]/50">
                    <span>AED 1K</span>
                    <span>AED 25K</span>
                    <span>AED 50K</span>
                  </div>
                </div>

                {/* 2. Conversion Rate Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#5c253d]/70">Target Conversion Rate:</span>
                    <span className="text-[#f27447] font-bold">{conversionRate.toFixed(1)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="10.0" 
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#f6f3f8] border border-[#5c253d]/20 rounded-lg accent-[#f27447] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#5c253d]/50">
                    <span>0.5% (Weak)</span>
                    <span>5.0% (Average)</span>
                    <span>10.0% (Elite Shopify)</span>
                  </div>
                </div>

                {/* Mode Specific Slider */}
                {calculatorMode === 'b2c' ? (
                  /* B2C Average Order Value Slider */
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#5c253d]/70">Average Order Value (AOV):</span>
                      <span className="text-[#f27447] font-bold">AED {avgOrderValue}</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="1500" 
                      step="25"
                      value={avgOrderValue}
                      onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#f6f3f8] border border-[#5c253d]/20 rounded-lg accent-[#f27447] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-[#5c253d]/50">
                      <span>AED 50</span>
                      <span>AED 750</span>
                      <span>AED 1,500</span>
                    </div>
                  </div>
                ) : (
                  /* B2B Close Rate & Lead value sliders */
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#5c253d]/70">Lead Close Rate:</span>
                        <span className="text-[#f27447] font-bold">{leadCloseRate}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="50" 
                        step="1"
                        value={leadCloseRate}
                        onChange={(e) => setLeadCloseRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#f6f3f8] border border-[#5c253d]/20 rounded-lg accent-[#f27447] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-[#5c253d]/50">
                        <span>5% Close</span>
                        <span>25% Close</span>
                        <span>50% Close</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#5c253d]/70">Average Sales Deal Value:</span>
                        <span className="text-[#f27447] font-bold">AED {leadValue.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="200" 
                        max="10000" 
                        step="100"
                        value={leadValue}
                        onChange={(e) => setLeadValue(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#f6f3f8] border border-[#5c253d]/20 rounded-lg accent-[#f27447] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-[#5c253d]/50">
                        <span>AED 200</span>
                        <span>AED 5,000</span>
                        <span>AED 10,000</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Calculator Output Display Box */}
              <div className="lg:col-span-7 bg-[#f6f3f8] border-2 border-[#5c253d] rounded-2xl p-6 space-y-6">
                
                <div className="flex justify-between items-center border-b border-[#5c253d]/10 pb-4">
                  <span className="text-xs font-mono text-[#5c253d]/60 uppercase">Estimated Return Simulation</span>
                  <span className="text-[10px] font-mono text-[#f27447] uppercase tracking-widest font-bold">Computed Benchmarks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Revenue output */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block">Projected Sales Revenue</span>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-[#5c253d]">{calculatedROI.secondaryMetric}</div>
                    <span className="text-[9px] font-mono text-[#5c253d]/50 block">Gross return footprint</span>
                  </div>

                  {/* Net ROI output */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block">Net Gains (Minus Spend)</span>
                    <div className={cn(
                      "text-2xl sm:text-3xl font-mono font-black",
                      calculatedROI.netGain >= 0 ? "text-[#f27447]" : "text-red-500"
                    )}>
                      AED {calculatedROI.netGain.toLocaleString()}
                    </div>
                    <span className="text-[9px] font-mono text-[#5c253d]/50 block">Total advertising net margin</span>
                  </div>

                  {/* Volume output */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block">{calculatedROI.metricLabel}</span>
                    <div className="text-xl font-mono font-black text-[#5c253d]">{calculatedROI.primaryMetric}</div>
                    <span className="text-[9px] font-mono text-[#5c253d]/50 block">From estimated traffic segment</span>
                  </div>

                  {/* ROI / ROAS multiplier output */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block">{calculatedROI.efficiencyLabel}</span>
                    <div className="text-xl font-mono font-black text-[#f27447]">{calculatedROI.efficiencyValue}</div>
                    <span className="text-[9px] font-mono text-[#5c253d]/50 block">Cost tracking safety factor</span>
                  </div>

                </div>

                <div className="border-t border-[#5c253d]/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-[10px] font-mono text-[#5c253d]/70 max-w-sm">
                    {calculatedROI.speedBoostDesc}
                  </p>
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#f27447]/10 border border-[#f27447]/30 text-[#f27447] rounded-xl flex items-center space-x-1.5 self-start font-bold">
                    <Sparkles className="w-3 h-3 text-[#f27447]" />
                    <span>Speed Boost Multiplier Active</span>
                  </span>
                </div>

              </div>

            </div>
          </div>
        </motion.section>

        {/* CLIENT TESTIMONIALS HUB */}
        <motion.section 
          id="testimonials-hub" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">08 / VERIFIED ENDORSEMENTS</div>
            <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Client Testimonials</h2>
            <p className="text-[#5c253d]/80 text-xs font-sans">
              Real testimonials from founders and directors scaled by Rizwan Saeed.
            </p>
          </div>

          <div className="w-full">
            <TestimonialCarousel testimonials={TESTIMONIALS} />
          </div>
        </motion.section>

        {/* FAQS */}
        <motion.section 
          id="faqs" 
          className="border-t border-[#5c253d]/15 pt-16 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">09 / CORE FAQ</div>
                <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Technical FAQs</h2>
                <div className="h-1 w-20 bg-[#5c253d] rounded" />
                <p className="text-[#5c253d]/80 text-xs font-sans pt-4">
                  Common queries covering Liquid, technical crawl maps, and pixel attributions for Middle East campaigns.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {FAQS.map((faq: any, idx: number) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[4px_4px_0px_#5c253d]"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full text-left p-5 flex justify-between items-center text-xs sm:text-sm font-mono text-[#5c253d] font-bold hover:text-[#f27447] transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={cn("w-4 h-4 text-[#5c253d]/50 transition-transform", isExpanded ? "rotate-180 text-[#f27447]" : "")} />
                    </button>

                    {isExpanded && (
                      <div className="p-5 border-t border-[#5c253d]/10 bg-[#f6f3f8]/50 text-xs sm:text-sm text-[#5c253d]/80 font-sans leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* SECURE PROJECT ACQUISITION & CONTACT INTAKE */}
        <motion.section 
          id="contact-form" 
          className="border-t border-[#5c253d]/15 pt-16 scroll-mt-24 text-[#5c253d]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Context, Location and Telemetry Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 space-y-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#f27447] font-bold">08 / SECURE GET IN TOUCH</div>
                <h2 className="text-3xl font-black text-[#5c253d] uppercase tracking-tight font-display">Initiate Project</h2>
                <div className="h-1 w-20 bg-[#5c253d] rounded" />
                <p className="text-[#5c253d]/80 text-xs sm:text-sm font-sans leading-relaxed pt-2">
                  Ready to deploy high-converting Shopify designs or optimize your paid advertising budget? Complete the intake secure protocol. Rizwan generally responds within 2 hours.
                </p>

                {/* Direct details bento cards */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d]">
                    <MapPin className="w-4 h-4 text-[#f27447] mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <span className="text-[10px] font-mono uppercase text-[#5c253d]/50 block font-bold">HQ Operations</span>
                      <span className="text-xs font-mono text-[#5c253d] font-semibold">{liveMapConfig?.address || 'Dubai Marina, Dubai, United Arab Emirates'}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d]">
                    <Mail className="w-4 h-4 text-[#f27447] mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <span className="text-[10px] font-mono uppercase text-[#5c253d]/50 block font-bold">Direct Channel</span>
                      <a href={`mailto:${brandInfo.contactEmail || 'RIZWANSAEED610@gmail.com'}`} className="text-xs font-mono text-[#f27447] hover:underline font-semibold">
                        {brandInfo.contactEmail || 'RIZWANSAEED610@gmail.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d]">
                    <Phone className="w-4 h-4 text-[#f27447] mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <span className="text-[10px] font-mono uppercase text-[#5c253d]/50 block font-bold">Direct Voice Line</span>
                      <a href={`tel:${brandInfo.contactPhone || '+971500000000'}`} className="text-xs font-mono text-[#f27447] hover:underline font-semibold">
                        {brandInfo.contactPhone || '+971 50 000 0000'}
                      </a>
                    </div>
                  </div>

                  {brandInfo.whatsappNumber && (
                    <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d]">
                      <svg className="w-4 h-4 text-[#f27447] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.592 1.978 14.12 1.01 11.625 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847l-.994 3.63 3.771-.978zm11.531-7.141c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.672-1.62-.922-2.206-.24-.584-.487-.51-.67-.51-.172-.008-.371-.008-.57-.008-.198 0-.523.074-.797.371-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      <div className="text-left">
                        <span className="text-[10px] font-mono uppercase text-[#5c253d]/50 block font-bold">Direct WhatsApp</span>
                        <a href={`https://wa.me/${brandInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#f27447] hover:underline font-semibold">
                          WhatsApp Chat
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* DYNAMIC GOOGLE MAPS COMPONENT */}
                <div className="bg-white p-4 rounded-xl border-2 border-[#5c253d] shadow-[2px_2px_0px_#5c253d] space-y-3 relative overflow-hidden group transition-all duration-300">
                  <div className="flex justify-between items-center border-b border-[#5c253d]/10 pb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#f27447]" />
                      <span className="text-[10px] font-mono uppercase text-[#f27447] font-bold">Dynamic Office Location</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#5c253d]/50 uppercase font-semibold">Live Operations Map</span>
                  </div>
                  
                  <div className="w-full h-44 rounded-lg overflow-hidden border border-[#5c253d]/15 relative bg-neutral-100">
                    {liveMapConfig?.mapEmbedUrl ? (
                      <iframe
                        src={liveMapConfig.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        className="absolute inset-0 border-0 filter grayscale contrast-115 brightness-95 opacity-90 hover:opacity-100 transition-opacity duration-300"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#5c253d]/50 p-4 text-center">
                        Active operations coordinates not available.
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] font-mono text-[#5c253d]/80 bg-[#f6f3f8] p-2.5 rounded-lg border border-[#5c253d]/10 leading-normal text-left">
                    <span className="text-[#5c253d]/50 uppercase block mb-0.5 text-[8px] font-bold">HQ Office Address:</span>
                    <span className="text-[#5c253d] font-semibold">{liveMapConfig?.address || 'Dubai Marina, Dubai, United Arab Emirates'}</span>
                  </div>
                </div>

                {/* Telemetry live status indicators */}
                <div className="p-4 bg-[#f6f3f8] border-2 border-[#5c253d] rounded-xl space-y-2.5 shadow-[2px_2px_0px_#5c253d]">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#5c253d]/60 font-bold uppercase">SYSTEM RESPONSE TIME</span>
                    <span className="text-[#f27447] font-bold">&lt; 120 MIN</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#5c253d]/60 font-bold uppercase">AVAILABILITY WINDOW</span>
                    <span className="text-[#f27447] font-bold">2 OPEN SLOTS</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#f27447] h-1.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact intake form with advanced UI validation & cyber accents */}
            <div className="lg:col-span-8">
              <div className="bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] hover:shadow-[6px_6px_0px_#5c253d] transition-all duration-300 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                {/* Ambient decorative soft glow elements */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f27447]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#5c253d]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center space-x-2 text-[#f27447] font-mono text-[10px] uppercase tracking-wider font-bold mb-4 border-b border-[#5c253d]/10 pb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TRANSMISSION PROTOCOL: INQUIRY_INTAKE</span>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#5c253d]/80 uppercase tracking-wider block font-bold">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          if (contactErrors.name) {
                            setContactErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-[#f6f3f8]/50 border-2 text-[#5c253d] font-sans text-sm rounded-xl transition-all outline-none focus:bg-white placeholder:text-[#5c253d]/45",
                          contactErrors.name 
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20" 
                            : "border-[#5c253d]/20 focus:border-[#5c253d] focus:ring-1 focus:ring-[#5c253d]/15"
                        )}
                      />
                      {contactErrors.name && (
                        <p className="text-[10px] font-mono text-red-500 flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{contactErrors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#5c253d]/80 uppercase tracking-wider block font-bold">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. john@company.com"
                        value={contactEmail}
                        onChange={(e) => {
                          setContactEmail(e.target.value);
                          if (contactErrors.email) {
                            setContactErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-[#f6f3f8]/50 border-2 text-[#5c253d] font-sans text-sm rounded-xl transition-all outline-none focus:bg-white placeholder:text-[#5c253d]/45",
                          contactErrors.email 
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20" 
                            : "border-[#5c253d]/20 focus:border-[#5c253d] focus:ring-1 focus:ring-[#5c253d]/15"
                        )}
                      />
                      {contactErrors.email && (
                        <p className="text-[10px] font-mono text-red-500 flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{contactErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company / Website URL */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#5c253d]/80 uppercase tracking-wider block font-bold">
                        Company or Current Website URL <span className="text-[#5c253d]/50 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c253d]/40" />
                        <input
                          type="text"
                          placeholder="e.g. mycompany.com"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f6f3f8]/50 border-2 border-[#5c253d]/20 focus:border-[#5c253d] focus:bg-white focus:ring-1 focus:ring-[#5c253d]/15 text-[#5c253d] font-sans text-sm rounded-xl transition-all outline-none placeholder:text-[#5c253d]/45"
                        />
                      </div>
                    </div>

                    {/* Estimated Budget */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#5c253d]/80 uppercase tracking-wider block font-bold">
                        Target Monthly Budget
                      </label>
                      <select
                        value={contactBudget}
                        onChange={(e) => setContactBudget(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f6f3f8]/50 border-2 border-[#5c253d]/20 focus:border-[#5c253d] focus:bg-white focus:ring-1 focus:ring-[#5c253d]/15 text-[#5c253d] font-mono text-xs rounded-xl transition-all outline-none"
                      >
                        <option value="under-5k">Under AED 5,000 / month</option>
                        <option value="5k-15k">AED 5,000 - 15,000 / month</option>
                        <option value="15k-50k">AED 15,000 - 50,000 / month</option>
                        <option value="over-50k">Over AED 50,000 / month</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Focus Chips */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-[#5c253d]/80 uppercase tracking-wider block font-bold">
                      Core Project Focus / Alignment
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { id: 'shopify-development', label: 'Shopify Custom Liquid Dev' },
                        { id: 'ads-management', label: 'Google & Meta Ads Strategy' },
                        { id: 'seo-audit', label: 'Technical SEO Crawl Mapping' },
                        { id: 'all-inclusive', label: 'All-Inclusive Scale Package' },
                      ].map((chip) => {
                        const isSelected = contactProjectType === chip.id;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => setContactProjectType(chip.id)}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-mono border-2 transition-all cursor-pointer",
                              isSelected 
                                ? "bg-[#f27447]/15 border-[#f27447] text-[#f27447] font-bold shadow-[2px_2px_0px_#f27447]"
                                : "bg-white border-[#5c253d]/20 text-[#5c253d]/70 hover:border-[#5c253d] hover:text-[#5c253d]"
                            )}
                          >
                            {chip.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Requirements text area */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#5c253d]/80 uppercase tracking-wider block font-bold">
                      Project Requirements & Goals <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g. We are looking to scale our Shopify conversion rate and set up custom server-side conversion API events on Meta. Our current Shopify theme feels heavy..."
                      value={contactRequirements}
                      onChange={(e) => {
                        setContactRequirements(e.target.value);
                        if (contactErrors.requirements) {
                          setContactErrors(prev => ({ ...prev, requirements: '' }));
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 bg-[#f6f3f8]/50 border-2 text-[#5c253d] font-sans text-sm rounded-xl transition-all outline-none resize-none focus:bg-white placeholder:text-[#5c253d]/45",
                        contactErrors.requirements 
                          ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20" 
                          : "border-[#5c253d]/20 focus:border-[#5c253d] focus:ring-1 focus:ring-[#5c253d]/15"
                      )}
                    />
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#5c253d]/50 font-semibold">
                      <span>Provide as much detail as possible. Minimum 15 chars.</span>
                      <span className={cn(
                        contactRequirements.trim().length >= 15 ? "text-emerald-600 font-bold" : "text-[#5c253d]/50"
                      )}>
                        {contactRequirements.trim().length} chars
                      </span>
                    </div>
                    {contactErrors.requirements && (
                      <p className="text-[10px] font-mono text-red-500 flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{contactErrors.requirements}</span>
                      </p>
                    )}
                  </div>

                  {/* Form Submission Actions */}
                  <div className="pt-3 border-t border-[#5c253d]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-[#5c253d]/60 font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Encrypted SSL Socket Connection Active</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isContactSubmitting}
                      className={cn(
                        "w-full sm:w-auto px-6 py-3 bg-[#f27447] hover:bg-[#f27447]/90 text-white font-semibold font-mono text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 border-2 border-[#5c253d] shadow-[3px_3px_0px_#5c253d] hover:shadow-[5px_5px_0px_#5c253d] active:scale-[0.98] cursor-pointer",
                        isContactSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      )}
                    >
                      {isContactSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>SECURE TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>TRANSMIT PROJECT PROTOCOL</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </motion.section>

          </>
        )}
      </main>

      {/* FOOTER SECTION */}
      <footer id="main-footer" className="bg-[#f6f3f8] border-t-2 border-[#5c253d] pt-16 pb-12 mt-24 relative overflow-hidden text-[#5c253d]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#5c253d]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#5c253d]/15 text-left">
            
            {/* COLUMN 1: BRAND IDENTITY */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#5c253d] flex items-center justify-center font-mono font-black text-xs text-[#5c253d] shadow-[2px_2px_0px_#5c253d] overflow-hidden">
                  {brandInfo.logoImageUrl ? (
                    <img 
                      src={brandInfo.logoImageUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    brandInfo.logoInitials || 'RS'
                  )}
                </div>
                <div>
                  <span className="font-mono text-xs tracking-widest text-[#5c253d] uppercase font-black block">{brandInfo.logoText || 'Rizwan Saeed'}</span>
                  <span className="text-[9px] font-mono text-[#f27447] uppercase tracking-tight font-bold">{brandInfo.logoTagline || 'GROWTH LEAD & SHOPIFY ENGINEER'}</span>
                </div>
              </div>
              <p className="text-xs text-[#5c253d]/80 font-sans leading-relaxed max-w-xs">
                {brandInfo.footerDesc || 'High-performance Shopify Liquid theme development & digital marketing strategies designed for high-scale hospitality and retail brands.'}
              </p>
              
              {/* Live Location / Pulse indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-2 border-[#5c253d] text-[10px] font-mono text-[#5c253d] shadow-[1px_1px_0px_#5c253d]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{brandInfo.footerLocation || 'DUBAI, UAE (GST)'}</span>
                <span className="text-gray-300">|</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wide">ACTIVE</span>
              </div>
            </div>

            {/* COLUMN 2: QUICK NAVIGATION */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase text-[#5c253d]/60 tracking-wider font-mono font-bold block">SITEMAP</span>
              <ul className="space-y-2 text-xs font-mono text-[#5c253d]/80">
                {[
                  { label: "Home Base", href: "#hero-section" },
                  { label: "Client Portfolio", href: "#portfolio-grid" },
                  { label: "Core Services", href: "#services-section" },
                  { label: "Strategic Process", href: "#process-sequence" },
                  { label: "Blog & Insights", href: "#blog-section" },
                  { label: "Contact Terminal", href: "#contact-form" }
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="hover:text-[#f27447] transition-colors flex items-center space-x-1.5">
                      <span className="text-[#f27447]">→</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: DIRECT CHANNELS & BACK-TO-TOP */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase text-[#5c253d]/60 tracking-wider font-mono font-bold block">DIRECT CHANNELS</span>
              <div className="space-y-3 font-mono text-xs">
                <a 
                  href={`mailto:${brandInfo.contactEmail || 'RIZWANSAEED610@gmail.com'}`} 
                  className="group flex items-start gap-2.5 text-[#5c253d] hover:text-[#f27447] transition-all" 
                  id="footer-contact-email"
                >
                  <div className="p-1.5 rounded-lg bg-white border-2 border-[#5c253d] shadow-[1px_1px_0px_#5c253d] group-hover:bg-[#f6f3f8] transition-all">
                    <Mail className="w-3.5 h-3.5 text-[#f27447]" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#5c253d]/50 block uppercase font-bold tracking-tight">Write Message</span>
                    <span className="text-[#5c253d] group-hover:text-[#f27447] transition-colors font-semibold">{brandInfo.contactEmail || 'RIZWANSAEED610@gmail.com'}</span>
                  </div>
                </a>
                
                <a 
                  href={`tel:${brandInfo.contactPhone || '+971500000000'}`} 
                  className="group flex items-start gap-2.5 text-[#5c253d] hover:text-[#f27447] transition-all" 
                  id="footer-contact-phone"
                >
                  <div className="p-1.5 rounded-lg bg-white border-2 border-[#5c253d] shadow-[1px_1px_0px_#5c253d] group-hover:bg-[#f6f3f8] transition-all">
                    <Phone className="w-3.5 h-3.5 text-[#f27447]" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#5c253d]/50 block uppercase font-bold tracking-tight">Direct Call Line</span>
                    <span className="text-[#5c253d] group-hover:text-[#f27447] transition-colors font-semibold">{brandInfo.contactPhone || '+971 50 000 0000'}</span>
                  </div>
                </a>

                {/* Return To Top Button */}
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full flex items-center justify-between p-2.5 mt-2 rounded-xl border-2 border-[#5c253d] bg-white hover:bg-[#f6f3f8] text-[#5c253d] shadow-[2px_2px_0px_#5c253d] hover:shadow-[3px_3px_0px_#5c253d] transition-all duration-300 cursor-pointer text-left font-mono text-[10px]"
                >
                  <span className="text-[#5c253d]/80 group-hover:text-[#5c253d] transition-colors uppercase font-bold flex items-center gap-1.5">
                    <ChevronUp className="w-3.5 h-3.5 text-[#f27447]" />
                    Back To Top
                  </span>
                  <span className="text-[#5c253d]/60 group-hover:text-[#f27447] transition-colors">▲</span>
                </button>
              </div>
            </div>

            {/* COLUMN 4: NEWSLETTER & CONTROL */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase text-[#5c253d]/60 tracking-wider font-mono font-bold block">SCALE INTELLIGENCE</span>
              <p className="text-xs text-[#5c253d]/80 font-sans leading-relaxed">
                Join for 2026 Shopify scaling playbooks, conversion metrics, and technical SEO frameworks.
              </p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newsletterEmail || !newsletterEmail.includes('@')) {
                    showToast('Please enter a valid email address.', 'error');
                    return;
                  }
                  showToast('Thank you for subscribing! Free Shopify playbooks on their way.', 'success');
                  setNewsletterEmail('');
                }}
                className="space-y-2 pt-1"
              >
                <div className="relative">
                  <input 
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-white border-2 border-[#5c253d]/30 focus:border-[#5c253d] rounded-xl px-3 py-2.5 text-xs font-mono text-[#5c253d] focus:outline-none pr-10"
                  />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 bg-[#f27447] hover:bg-[#f27447]/90 text-white border border-[#5c253d]/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[9px] font-mono text-[#5c253d]/60 block leading-tight">
                  🔒 Zero spam. We send technical value only.
                </span>
              </form>

              {/* Administrative Control Portal Trigger */}
              <div className="pt-2">
                <button 
                  onClick={() => {
                    if (isAuthorized) {
                      setViewMode('admin');
                    } else {
                      setShowPasskeyModal(true);
                    }
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border-2 border-[#5c253d] bg-white hover:bg-[#f6f3f8] text-[#5c253d] shadow-[2px_2px_0px_#5c253d] hover:shadow-[3px_3px_0px_#5c253d] group transition-all duration-300 cursor-pointer"
                  title="Access Secure Administrative Control Panel"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-[#f27447]" />
                    <span className="text-[10px] font-mono text-[#5c253d]/80 group-hover:text-[#5c253d] uppercase font-bold">Admin Portal</span>
                  </div>
                  <span className="text-xs text-[#5c253d]/60 group-hover:text-[#f27447] transition-colors">▶</span>
                </button>
              </div>

              {/* Social Icons */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-[#5c253d]/50 uppercase block tracking-wider font-semibold">Social Connect Nodes</span>
                <div className="flex items-center gap-2">
                  {brandInfo.linkedinUrl && (
                    <a 
                      href={brandInfo.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-[#5c253d] bg-white text-[#5c253d] hover:text-[#f27447] hover:shadow-[1px_1px_0px_#5c253d] transition-all cursor-pointer"
                      title="LinkedIn Secure Connection"
                      id="footer-social-linkedin"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {brandInfo.twitterUrl && (
                    <a 
                      href={brandInfo.twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-[#5c253d] bg-white text-[#5c253d] hover:text-[#f27447] hover:shadow-[1px_1px_0px_#5c253d] transition-all cursor-pointer"
                      title="Twitter Channel"
                      id="footer-social-twitter"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {brandInfo.facebookUrl && (
                    <a 
                      href={brandInfo.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-[#5c253d] bg-white text-[#5c253d] hover:text-[#f27447] hover:shadow-[1px_1px_0px_#5c253d] transition-all cursor-pointer"
                      title="Facebook Profile"
                      id="footer-social-facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {brandInfo.instagramUrl && (
                    <a 
                      href={brandInfo.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-[#5c253d] bg-white text-[#5c253d] hover:text-[#f27447] hover:shadow-[1px_1px_0px_#5c253d] transition-all cursor-pointer"
                      title="Instagram Profile"
                      id="footer-social-instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {brandInfo.githubUrl && (
                    <a 
                      href={brandInfo.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-[#5c253d] bg-white text-[#5c253d] hover:text-[#f27447] hover:shadow-[1px_1px_0px_#5c253d] transition-all cursor-pointer"
                      title="GitHub Repository"
                      id="footer-social-github"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {brandInfo.whatsappNumber && (
                    <a 
                      href={`https://wa.me/${brandInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-[#5c253d] bg-white text-[#5c253d] hover:text-[#f27447] hover:shadow-[1px_1px_0px_#5c253d] transition-all cursor-pointer"
                      title="WhatsApp Channel"
                      id="footer-social-whatsapp"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.592 1.978 14.12 1.01 11.625 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847l-.994 3.63 3.771-.978zm11.531-7.141c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.672-1.62-.922-2.206-.24-.584-.487-.51-.67-.51-.172-.008-.371-.008-.57-.008-.198 0-.523.074-.797.371-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT ROW */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-[10px] font-mono text-[#5c253d]/60 font-semibold">
            <div className="flex items-center gap-2">
              <span>© 2026 Rizwan Saeed. All Rights Reserved.</span>
              <span className="text-[#5c253d]/30">|</span>
              <span className="text-[9px] uppercase tracking-wider text-[#f27447] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f27447] inline-block animate-pulse" /> Cryptographically Validated
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4">
              <span className="hover:text-[#f27447] transition-colors">Next.js 15 App Router</span>
              <span className="text-[#5c253d]/30">•</span>
              <span className="hover:text-[#f27447] transition-colors">Tailwind CSS v4 Engine</span>
              <span className="text-[#5c253d]/30">•</span>
              <span className="hover:text-[#f27447] transition-colors">Secure Attribution</span>
            </div>
          </div>
        </div>
      </footer>



      {/* FLOATING WHATSAPP WIDGET INTEGRATION */}
      {liveWhatsappConfig?.enabled && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <AnimatePresence>
            {isWhatsAppOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-black border border-emerald-500/50 rounded-2xl w-80 sm:w-85 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-950 via-black to-emerald-950 border-b border-emerald-500/30 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={liveWhatsappConfig.agentAvatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop"} 
                        alt={liveWhatsappConfig.agentName || "Rizwan Saeed"} 
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full animate-ping" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black tracking-wider uppercase font-sans text-emerald-400">
                        {activeSupportTab === 'whatsapp' ? (liveWhatsappConfig.agentName || "Rizwan Saeed") : activeSupportTab === 'email' ? "Email Support Desk" : "Customer Care Hub"}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-mono flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>
                          {activeSupportTab === 'whatsapp' 
                            ? (liveWhatsappConfig.agentStatus || "Online (Replies in 5m)") 
                            : activeSupportTab === 'email' 
                            ? "SMTP Mail Routing Active" 
                            : "Timings & Live Call Line"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsWhatsAppOpen(false)}
                    className="text-gray-400 hover:text-emerald-400 p-1.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/20 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tab switcher */}
                <div className="flex border-b border-emerald-500/20 bg-black">
                  <button
                    onClick={() => setActiveSupportTab('whatsapp')}
                    className={cn(
                      "flex-1 py-2 text-[9px] font-black font-sans uppercase tracking-wider text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1",
                      activeSupportTab === 'whatsapp'
                        ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-emerald-950/5"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setActiveSupportTab('email')}
                    className={cn(
                      "flex-1 py-2 text-[9px] font-black font-sans uppercase tracking-wider text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1",
                      activeSupportTab === 'email'
                        ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-cyan-950/5"
                    )}
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    Email
                  </button>
                  <button
                    onClick={() => setActiveSupportTab('care')}
                    className={cn(
                      "flex-1 py-2 text-[9px] font-black font-sans uppercase tracking-wider text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1",
                      activeSupportTab === 'care'
                        ? "border-violet-500 text-violet-400 bg-violet-950/20"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-violet-950/5"
                    )}
                  >
                    <Headphones className="w-3.5 h-3.5 text-violet-400" />
                    Care
                  </button>
                  <button
                    onClick={() => setActiveSupportTab('ai')}
                    className={cn(
                      "flex-1 py-2 text-[9px] font-black font-sans uppercase tracking-wider text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1",
                      activeSupportTab === 'ai'
                        ? "border-pink-500 text-pink-400 bg-pink-950/20"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-pink-950/5"
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    AI Agent
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 bg-black space-y-4 max-h-60 overflow-y-auto">
                  {activeSupportTab === 'whatsapp' && (
                    <>
                      {/* Greeting card */}
                      <div className="space-y-2 text-left">
                        <span className="text-[8px] font-mono text-emerald-500/80 uppercase tracking-widest block">Conversation Gateway</span>
                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 leading-relaxed max-h-24 overflow-y-auto font-sans relative shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
                          <Quote className="w-8 h-8 text-emerald-500/10 absolute -bottom-1 -right-1 pointer-events-none" />
                          {liveWhatsappConfig.message || "Hello Rizwan, I visited your portfolio and want to discuss a project with you!"}
                        </div>
                      </div>

                      {/* User prefilled input customizer */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[8px] font-mono text-gray-400 uppercase tracking-wider block">Your Custom Message (Editable)</label>
                        <textarea
                          value={customWAMsg}
                          onChange={(e) => setUserEditedMsg(e.target.value)}
                          placeholder="Type your message here..."
                          rows={3}
                          className="w-full bg-black border border-emerald-500/30 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 text-white placeholder-gray-700 font-sans text-xs rounded-xl p-3 outline-none resize-none transition-all shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                        />
                      </div>
                    </>
                  )}

                  {activeSupportTab === 'email' && (
                    <div className="space-y-3 text-left">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-cyan-500 uppercase tracking-wider block">Email Subject</label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="e.g. Project Inquiry"
                          className="w-full bg-black border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-700 font-sans text-xs rounded-xl px-3 py-2 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-cyan-500 uppercase tracking-wider block">Your Message Body</label>
                        <textarea
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Write your email details here..."
                          rows={3}
                          className="w-full bg-black border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-700 font-sans text-xs rounded-xl p-3 outline-none resize-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {activeSupportTab === 'care' && (
                    <div className="space-y-3 text-left">
                      {/* Helpdesk Details */}
                      <div className="bg-violet-950/20 border border-violet-500/20 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="w-3.5 h-3.5 text-violet-400" />
                          <div>
                            <span className="text-[9px] font-mono text-gray-400 block leading-none">SUPPORT TIMINGS</span>
                            <span className="text-violet-300 font-sans font-bold block mt-0.5">
                              {liveWhatsappConfig.supportHours || "9:00 AM - 6:00 PM (GST)"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-violet-400" />
                          <div>
                            <span className="text-[9px] font-mono text-gray-400 block leading-none">WORKING DAYS</span>
                            <span className="text-violet-300 font-sans font-bold block mt-0.5">
                              {liveWhatsappConfig.supportDays || "Monday - Saturday"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-violet-400" />
                          <div>
                            <span className="text-[9px] font-mono text-gray-400 block leading-none">BUSINESS LOCATION</span>
                            <span className="text-violet-300 font-sans font-bold block mt-0.5">
                              {brandInfo.footerLocation || "Dubai Marina, Dubai, UAE"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Live status message */}
                      <div className="p-2 bg-black border border-violet-500/10 rounded-xl flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <p className="text-[10px] text-gray-400 leading-normal font-sans">
                          Response time is extremely fast during active Dubai hours.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSupportTab === 'ai' && (
                    <div className="space-y-3 text-left">
                      {/* Chat messages viewport */}
                      <div className="bg-black/60 border border-white/[0.04] rounded-xl p-3 h-48 overflow-y-auto space-y-2.5 font-sans scrollbar-thin shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                        {aiChatLogs.map((log, idx) => (
                          <div key={idx} className={cn("flex flex-col max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed", 
                            log.sender === 'user' 
                              ? "bg-pink-500/10 border border-pink-500/20 text-pink-100 ml-auto text-left" 
                              : "bg-white/[0.02] border border-white/[0.05] text-gray-300"
                          )}>
                            <p className="whitespace-pre-line">{log.text}</p>
                            <span className="text-[7.5px] font-mono text-gray-500 mt-1 block">
                              {log.sender === 'user' ? 'Client' : 'RS AI'} • {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                        {isAiChatTyping && (
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2 text-[11px] text-gray-400 w-24 text-left">
                            <span className="animate-pulse flex items-center gap-1">
                              <span>Thinking</span>
                              <span className="inline-flex gap-0.5"><span className="animate-bounce">.</span><span className="animate-bounce [animation-delay:0.2s]">.</span><span className="animate-bounce [animation-delay:0.4s]">.</span></span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick chips suggested prompts */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          "Want an SEO Audit?",
                          "Want Google Ads Estimate?",
                          "Need Website Review?",
                        ].map((chip) => (
                          <button
                            key={chip}
                            onClick={async () => {
                              const userMsg = chip;
                              setAiChatLogs(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
                              setIsAiChatTyping(true);

                              try {
                                const res = await fetch('/api/gemini', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    prompt: userMsg,
                                    section: "chatbot"
                                  })
                                });
                                const data = await res.json();
                                setAiChatLogs(prev => [...prev, { sender: 'bot', text: data.text, timestamp: new Date() }]);
                              } catch (err) {
                                setAiChatLogs(prev => [...prev, { sender: 'bot', text: "Apologies, I encountered a minor routing glitch. Please try again or book a direct meeting!", timestamp: new Date() }]);
                              } finally {
                                setIsAiChatTyping(false);
                              }
                            }}
                            className="text-[8px] font-sans font-bold uppercase tracking-wider bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-pink-500/30 text-gray-300 hover:text-white px-2 py-1 rounded-full transition-all cursor-pointer animate-fade-in"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Input line for custom text */}
                      <div className="flex gap-1.5 items-center pt-1 border-t border-white/[0.05]">
                        <input
                          type="text"
                          value={aiChatInput}
                          onChange={(e) => setAiChatInput(e.target.value)}
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' && aiChatInput.trim()) {
                              const userMsg = aiChatInput;
                              setAiChatInput('');
                              setAiChatLogs(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
                              setIsAiChatTyping(true);

                              try {
                                const res = await fetch('/api/gemini', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    prompt: userMsg,
                                    section: "chatbot"
                                  })
                                });
                                const data = await res.json();
                                setAiChatLogs(prev => [...prev, { sender: 'bot', text: data.text, timestamp: new Date() }]);
                              } catch (err) {
                                setAiChatLogs(prev => [...prev, { sender: 'bot', text: "Routing failed. Please schedule a strategy slot or try typing again!", timestamp: new Date() }]);
                              } finally {
                                setIsAiChatTyping(false);
                              }
                            }
                          }}
                          placeholder="Ask AI anything..."
                          className="flex-grow bg-black border border-white/[0.08] focus:border-pink-500/50 text-white placeholder-gray-600 font-sans text-xs rounded-xl px-3 py-2 outline-none transition-all"
                        />
                        <button
                          onClick={async () => {
                            if (!aiChatInput.trim()) return;
                            const userMsg = aiChatInput;
                            setAiChatInput('');
                            setAiChatLogs(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
                            setIsAiChatTyping(true);

                            try {
                              const res = await fetch('/api/gemini', {
                                method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    prompt: userMsg,
                                    section: "chatbot"
                                  })
                              });
                              const data = await res.json();
                              setAiChatLogs(prev => [...prev, { sender: 'bot', text: data.text, timestamp: new Date() }]);
                            } catch (err) {
                              setAiChatLogs(prev => [...prev, { sender: 'bot', text: "Routing failed. Please try again or book a slot!", timestamp: new Date() }]);
                            } finally {
                              setIsAiChatTyping(false);
                            }
                          }}
                          className="p-2 bg-pink-500 hover:bg-pink-400 text-black rounded-xl transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-black" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer contains action triggers */}
                <div className="p-3 bg-black border-t border-emerald-500/20 flex flex-col gap-2">
                  {activeSupportTab === 'whatsapp' && (
                    <>
                      <a
                        href={`https://wa.me/${liveWhatsappConfig.number?.replace(/[^0-9]/g, '') || '971500000000'}?text=${encodeURIComponent(customWAMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          showToast("Opening secure WhatsApp chat terminal...", "success");
                          setIsWhatsAppOpen(false);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-black font-black font-sans text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                        </svg>
                        <span>Connect on WhatsApp</span>
                      </a>
                      <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-tight text-center">
                        Direct connection with secure prefilled parameter
                      </span>
                    </>
                  )}

                  {activeSupportTab === 'email' && (
                    <>
                      <a
                        href={`mailto:${liveWhatsappConfig.supportEmail || brandInfo.contactEmail || 'RIZWANSAEED610@gmail.com'}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                        onClick={() => {
                          showToast("Launching default email client...", "success");
                          setIsWhatsAppOpen(false);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 hover:from-cyan-400 hover:via-teal-400 hover:to-cyan-500 text-black font-black font-sans text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Mail className="w-3.5 h-3.5 text-black" />
                        <span>Send Official Email</span>
                      </a>
                      <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-tight text-center">
                        Securely loads native client with preset subject
                      </span>
                    </>
                  )}

                  {activeSupportTab === 'care' && (
                    <div className="flex flex-col gap-2">
                      <a
                        href={`tel:${liveWhatsappConfig.supportPhone?.replace(/[^0-9+]/g, '') || brandInfo.contactPhone || '+971500000000'}`}
                        onClick={() => {
                          showToast("Initiating direct helpline route...", "success");
                          setIsWhatsAppOpen(false);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600 hover:from-violet-400 hover:via-purple-400 hover:to-fuchsia-500 text-white font-black font-sans text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Support Hotline</span>
                      </a>

                      <button
                        onClick={() => {
                          setIsContactModalOpen(true);
                          setIsWhatsAppOpen(false);
                        }}
                        className="w-full py-2 bg-black border border-violet-500/30 hover:border-violet-400/60 text-violet-400 hover:text-violet-300 font-sans text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                      >
                        Open Main Inquiry Form
                      </button>
                    </div>
                  )}

                  {activeSupportTab === 'ai' && (
                    <>
                      <button
                        onClick={() => {
                          setIsContactModalOpen(true);
                          setIsWhatsAppOpen(false);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:from-pink-400 hover:via-purple-400 hover:to-pink-500 text-white font-black font-sans text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Meeting with Rizwan</span>
                      </button>
                      <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-tight text-center">
                        Instant consultation calendar booking modal
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Bubble Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
            className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] z-50 transition-all cursor-pointer relative group flex items-center justify-center border-2 border-emerald-400"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
            </svg>
            {/* Mini notification dot to entice users */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-black flex items-center justify-center font-sans font-bold text-[8px] text-white animate-pulse">
              3
            </span>
            
            {/* Tooltip on hover */}
            <div className="absolute right-14 bg-black/90 border border-emerald-500/30 text-white text-[9px] font-black font-mono uppercase tracking-widest px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Support Center (3 channels) ⚡
            </div>
          </motion.button>
        </div>
      )}

      {/* SECURE ADMIN ACCESS GATEWAY MODAL */}
      {showPasskeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f17] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden animate-fadeIn">
            {/* Ambient neon decorative gradient */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-[11px] uppercase tracking-wider font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Security Firewall active</span>
                </div>
                <h3 className="text-lg font-black text-white font-mono uppercase tracking-tight">Admin Authentication</h3>
              </div>
              <button 
                onClick={() => {
                  setShowPasskeyModal(false);
                  setEnteredPasskey('');
                  setPasskeyError('');
                }}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg bg-gray-950/40 border border-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasskeySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Admin Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="ENTER ADMIN CODENAME..."
                    value={enteredUsername}
                    onChange={(e) => {
                      setEnteredUsername(e.target.value);
                      if (passkeyError) setPasskeyError('');
                    }}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-gray-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-white placeholder-gray-600 font-mono text-xs rounded-xl transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Security Passkey</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="ENTER CODENAME PASSKEY..."
                    value={enteredPasskey}
                    onChange={(e) => {
                      setEnteredPasskey(e.target.value);
                      if (passkeyError) setPasskeyError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-gray-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-white placeholder-gray-600 font-mono text-xs rounded-xl transition-all outline-none"
                  />
                </div>
                {passkeyError && (
                  <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-black flex items-center space-x-1 mt-1 animate-pulse">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{passkeyError}</span>
                  </p>
                )}
                <p className="text-[9px] font-sans text-gray-500 leading-relaxed mt-2">
                  Notice: System locks default security credentials to codename <code className="font-mono text-cyan-400/80 bg-gray-950 px-1 py-0.5 rounded">admin</code> and passkey <code className="font-mono text-cyan-400/80 bg-gray-950 px-1 py-0.5 rounded">admin123</code>.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasskeyModal(false);
                    setEnteredUsername('');
                    setEnteredPasskey('');
                    setPasskeyError('');
                  }}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 font-mono text-xs font-bold transition-all uppercase cursor-pointer"
                >
                  Close Gateway
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-mono text-xs font-bold transition-all uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Authorize Gate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CENTERED GLASSMORPHISM CONTACT INTAKE MODAL */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with elegant blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Centered glassmorphic card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl bg-[#0c1221]/90 border border-white/[0.08] rounded-[24px] shadow-[0_10px_50px_rgba(6,182,212,0.15)] overflow-hidden z-10 p-6 sm:p-8"
              style={{
                fontFamily: liveThemeConfig?.fontFamily === 'Inter' ? 'inherit' : liveThemeConfig?.fontFamily,
                borderColor: liveThemeConfig?.customPrimary ? `color-mix(in srgb, ${liveThemeConfig.customPrimary} 20%, transparent)` : undefined
              }}
            >
              {/* Decorative dynamic top bar */}
              <div 
                className="absolute top-0 inset-x-0 h-[3.5px]" 
                style={{
                  backgroundImage: `linear-gradient(to right, ${liveThemeConfig?.customPrimary || '#5c253d'}, ${liveThemeConfig?.customSecondary || '#f27447'})`
                }}
              />

              {/* Glowing decorative background ambient spots */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
                style={{ backgroundColor: liveThemeConfig?.customPrimary || '#5c253d' }}
              />
              <div 
                className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: liveThemeConfig?.customSecondary || '#f27447' }}
              />

              {/* Header */}
              <div className="relative flex justify-between items-start pb-5 border-b border-white/[0.06] mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl"
                    style={{
                      borderColor: liveThemeConfig?.customPrimary ? `color-mix(in srgb, ${liveThemeConfig.customPrimary} 25%, transparent)` : undefined,
                      backgroundColor: liveThemeConfig?.customPrimary ? `color-mix(in srgb, ${liveThemeConfig.customPrimary} 10%, transparent)` : undefined
                    }}
                  >
                    <Mail 
                      className="w-5 h-5 animate-pulse" 
                      style={{ color: liveThemeConfig?.customPrimary || '#5c253d' }}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-sans text-white uppercase tracking-tight">Initiate Project Discovery</h3>
                    <p className="text-[9px] font-mono text-gray-400 uppercase">Secure Handshake Intake Protocol</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-1.5 hover:bg-white/5 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form or Success state */}
              {!modalSuccessData ? (
                <form onSubmit={handleModalContactSubmit} className="space-y-4 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={modalName}
                        onChange={(e) => {
                          setModalName(e.target.value);
                          if (modalErrors.name) setModalErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-black/50 border text-white font-sans text-sm rounded-xl transition-all outline-none focus:ring-1",
                          modalErrors.name 
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                            : "border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        )}
                        style={!modalErrors.name && liveThemeConfig?.customPrimary ? {
                          borderColor: `color-mix(in srgb, ${liveThemeConfig.customPrimary} 15%, transparent)`
                        } : undefined}
                      />
                      {modalErrors.name && (
                        <p className="text-red-400 text-[10px] font-mono">{modalErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                        Business Email <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={modalEmail}
                        onChange={(e) => {
                          setModalEmail(e.target.value);
                          if (modalErrors.email) setModalErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-black/50 border text-white font-sans text-sm rounded-xl transition-all outline-none focus:ring-1",
                          modalErrors.email 
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                            : "border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        )}
                        style={!modalErrors.email && liveThemeConfig?.customPrimary ? {
                          borderColor: `color-mix(in srgb, ${liveThemeConfig.customPrimary} 15%, transparent)`
                        } : undefined}
                      />
                      {modalErrors.email && (
                        <p className="text-red-400 text-[10px] font-mono">{modalErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                        Company or current website URL
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. brand.com"
                        value={modalCompany}
                        onChange={(e) => setModalCompany(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/[0.08] text-white font-sans text-sm rounded-xl transition-all outline-none focus:ring-1 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        style={liveThemeConfig?.customPrimary ? {
                          borderColor: `color-mix(in srgb, ${liveThemeConfig.customPrimary} 15%, transparent)`
                        } : undefined}
                      />
                    </div>

                    {/* Project Focus */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                        Core Project Focus
                      </label>
                      <select
                        value={modalProjectType}
                        onChange={(e) => setModalProjectType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#070a13] border border-white/[0.08] text-white font-sans text-sm rounded-xl transition-all outline-none focus:ring-1 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        style={liveThemeConfig?.customPrimary ? {
                          borderColor: `color-mix(in srgb, ${liveThemeConfig.customPrimary} 15%, transparent)`
                        } : undefined}
                      >
                        <option value="shopify-development">Shopify Custom Development</option>
                        <option value="digital-marketing">Google & Meta Ads High Scale</option>
                        <option value="conversion-optimization">Conversion Rate Optimization (CRO)</option>
                        <option value="seo-boost">Technical SEO & Auditing</option>
                        <option value="full-funnel">Full-Funnel Growth Partnership</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      Target Monthly Budget Range
                    </label>
                    <select
                      value={modalBudget}
                      onChange={(e) => setModalBudget(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#070a13] border border-white/[0.08] text-white font-sans text-sm rounded-xl transition-all outline-none focus:ring-1 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      style={liveThemeConfig?.customPrimary ? {
                        borderColor: `color-mix(in srgb, ${liveThemeConfig.customPrimary} 15%, transparent)`
                      } : undefined}
                    >
                      <option value="under-5k">Under AED 5,000 / month</option>
                      <option value="5k-15k">AED 5,000 - AED 15,000 / month</option>
                      <option value="15k-30k">AED 15,000 - AED 30,000 / month</option>
                      <option value="above-30k">AED 30,000+ / month (Enterprise)</option>
                    </select>
                  </div>

                  {/* Project Requirements / Message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      Project Goals & Requirements <span className="text-red-400">*</span>
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Please specify your requirements, current storefront performance, or primary acquisition blockages... (Minimum 15 characters)"
                      value={modalRequirements}
                      onChange={(e) => {
                        setModalRequirements(e.target.value);
                        if (modalErrors.requirements) setModalErrors(prev => ({ ...prev, requirements: '' }));
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 bg-black/50 border text-white font-sans text-sm rounded-xl transition-all outline-none focus:ring-1 resize-none",
                        modalErrors.requirements 
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      )}
                      style={!modalErrors.requirements && liveThemeConfig?.customPrimary ? {
                        borderColor: `color-mix(in srgb, ${liveThemeConfig.customPrimary} 15%, transparent)`
                      } : undefined}
                    />
                    {modalErrors.requirements && (
                      <p className="text-red-400 text-[10px] font-mono">{modalErrors.requirements}</p>
                    )}
                  </div>

                  {/* Security Connection Disclaimer */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 border-t border-white/[0.04] pt-3.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Secure socket encryption layers fully active.</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isModalSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${liveThemeConfig?.customPrimary || '#5c253d'}, ${liveThemeConfig?.customSecondary || '#f27447'})`
                    }}
                  >
                    {isModalSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Securely...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Establish Handshake</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success screen */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5 text-center py-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold font-sans text-white">TRANSMISSION LOGGER ACTIVE!</h4>
                    <p className="text-xs text-gray-400 font-sans">
                      Your inquiry ID: <span className="font-mono text-cyan-400 font-bold">{modalSuccessData.id}</span>
                    </p>
                  </div>

                  <div className="bg-black/80 border border-white/[0.05] rounded-2xl p-4 text-left space-y-2 text-xs">
                    <p className="text-gray-300">
                      Hello <span className="text-white font-bold">{modalSuccessData.name}</span>, your project parameters have been written to the master database.
                    </p>
                    <p className="text-gray-400 leading-relaxed pt-1.5 border-t border-white/[0.03]">
                      I am reviewing your focus on <span className="text-cyan-400 font-bold">{modalSuccessData.projectType}</span> and will respond to <span className="text-white font-mono">{modalSuccessData.email}</span> as soon as possible.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <a 
                      href={`https://wa.me/${liveWhatsappConfig?.number?.replace(/[^0-9]/g, '') || '971500000000'}?text=Hello Rizwan, I just submitted project discovery handshake ${modalSuccessData.id} for ${modalSuccessData.name}. Let's chat!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-1/2 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold font-sans text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 hover:brightness-110"
                      style={{
                        borderColor: liveThemeConfig?.customPrimary ? `color-mix(in srgb, ${liveThemeConfig.customPrimary} 40%, transparent)` : undefined,
                        color: liveThemeConfig?.customPrimary || '#5c253d'
                      }}
                    >
                      Instant WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => {
                        setIsContactModalOpen(false);
                        setModalSuccessData(null);
                        // Reset forms
                        setModalName('');
                        setModalEmail('');
                        setModalCompany('');
                        setModalRequirements('');
                      }}
                      className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-sans text-xs uppercase tracking-wider rounded-xl transition-all"
                      style={{
                        backgroundColor: liveThemeConfig?.customSecondary || '#f27447'
                      }}
                    >
                      Dismiss Gateway
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE CONTACT TRANSACTION SUCCESS CONFIRMATION MODAL */}
      {contactSuccessData && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden animate-scale-in font-mono text-xs text-gray-300">
            {/* Holographic grid scan lines decorative panel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center space-x-3 text-emerald-400 font-bold uppercase tracking-wider mb-4 pb-3 border-b border-gray-900">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>HANDSHAKE SECURED // DATA TRANSMITTED</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1 bg-black/60 p-4 rounded-xl border border-gray-900">
                <span className="text-[10px] text-gray-500 uppercase block">TRANSACTION ID</span>
                <span className="text-cyan-300 font-bold tracking-wider">{contactSuccessData.id}</span>
                <span className="text-[10px] text-gray-500 uppercase block mt-2">TIMESTAMP</span>
                <span className="text-white">{contactSuccessData.timestamp}</span>
              </div>

              <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-gray-900">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">CLIENT CODENAME / SENDER</span>
                  <span className="text-white font-sans text-sm font-semibold">{contactSuccessData.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">EMAIL ENDPOINT</span>
                  <span className="text-white font-sans text-sm font-semibold">{contactSuccessData.email}</span>
                </div>
                {contactSuccessData.company !== 'N/A' && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">COMPANY CHANNEL</span>
                    <span className="text-white font-sans text-sm font-semibold">{contactSuccessData.company}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-900/60 pt-2">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">PROJECT FOCUS</span>
                    <span className="text-cyan-400 uppercase font-bold text-[10px] tracking-wider">{contactSuccessData.projectType.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">BUDGET ALLOCATION</span>
                    <span className="text-emerald-400 uppercase font-bold text-[10px] tracking-wider">{contactSuccessData.budget.replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="border-t border-gray-900/60 pt-2">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">INTENT & REQUIREMENTS DATASET</span>
                  <p className="text-gray-400 font-sans text-xs bg-black/20 p-2.5 rounded border border-gray-950/60 leading-relaxed max-h-24 overflow-y-auto">
                    {contactSuccessData.requirements}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-center text-[10px] text-emerald-400 uppercase tracking-wider">
                ✓ Rizwan Saeed has been notified. Expect custom strategic roadmap analysis.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setContactSuccessData(null)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                DISMISS PROTOCOL
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

interface TestimonialCarouselProps {
  testimonials: any[];
}

function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPlaying, setIsPlaying] = useState(false);
  const { showToast } = useAdmin();

  const items = testimonials && testimonials.length > 0 ? testimonials : [];

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-[#0b0f17] border border-gray-800/60 rounded-2xl text-gray-400 font-mono text-xs">
        No client endorsements available.
      </div>
    );
  }

  const active = items[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Extract a high-impact success metric based on the testimonial ID or content
  const getSuccessMetric = (t: any) => {
    if (t.metric) return { value: t.metric, label: 'KEY PERFORMANCE METRIC' };
    if (t.id === 't-1') return { value: '+48%', label: 'CONVERSION INCREASE' };
    if (t.id === 't-2') return { value: '4.5x', label: 'CAMPAIGN ROAS' };
    if (t.id === 't-3') return { value: '12k+', label: 'ORGANIC TRAFFIC CLICKS' };
    if (t.id === 't-4') return { value: '22%', label: 'COMMISSIONS SAVED' };

    // Regex auto-extraction for custom testimonials
    const pct = t.content.match(/[+-]?\d+%/);
    if (pct) return { value: pct[0], label: 'PERFORMANCE GAIN' };
    const roas = t.content.match(/\d+(\.\d+)?x\s*ROAS/i);
    if (roas) return { value: roas[0].split(' ')[0], label: 'CAMPAIGN ROAS' };
    const clicks = t.content.match(/\d+k\+/i);
    if (clicks) return { value: clicks[0], label: 'ORGANIC CLICKS' };

    return { value: '100%', label: t.tag ? t.tag.toUpperCase() : 'VERIFIED PERFORMANCE' };
  };

  const metric = getSuccessMetric(active);

  // Framer Motion Variants for smooth, responsive sliding transitions
  const slideVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="relative max-w-5xl mx-auto px-1 sm:px-4 text-[#5c253d]">
      {/* Testimonial Active Display Panel */}
      <div 
        className="relative bg-white border-2 border-[#5c253d] shadow-[4px_4px_0px_#5c253d] rounded-3xl overflow-hidden p-6 sm:p-10 md:p-12 transition-all duration-500 group hover:shadow-[6px_6px_0px_#5c253d]"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Background decorative soft glow elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f27447]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5c253d]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Large Decorative Quote Icon */}
        <div className="absolute top-6 left-6 text-[#f27447]/10 group-hover:text-[#f27447]/15 transition-colors duration-300 pointer-events-none">
          <Quote className="w-16 h-16 transform -scale-x-100" />
        </div>

        {/* Animated Slide Content */}
        <div className="relative z-10 overflow-hidden min-h-[320px] md:min-h-[220px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Quote & Stars (md:col-span-7) */}
              <div className="md:col-span-7 space-y-6 text-left">
                <div className="flex items-center space-x-1.5 bg-[#f6f3f8] border border-[#5c253d]/15 px-3 py-1 rounded-full w-fit">
                  {[...Array(active.rating || 5)].map((_, i) => (
                    <span key={i} className="text-amber-500 text-sm drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>★</span>
                  ))}
                  <span className="text-[10px] font-mono text-[#5c253d]/60 ml-1.5 uppercase tracking-wider font-bold">5.0 Star Rating</span>
                </div>

                <blockquote className="text-[#5c253d] text-base sm:text-lg md:text-xl font-sans font-medium italic leading-relaxed">
                  &quot;{active.content}&quot;
                </blockquote>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#f27447]/10 border border-[#f27447]/30 text-[#f27447] rounded-full uppercase font-bold tracking-wider">
                    {active.tag}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#5c253d]/10 border border-[#5c253d]/30 text-[#5c253d] rounded-full uppercase font-bold tracking-wider">
                    Verified Endorsement
                  </span>
                </div>
              </div>

              {/* Right Column: Profile & Success Highlight Stats Card (md:col-span-5) */}
              <div className="md:col-span-5 flex flex-col items-center md:items-start bg-[#f6f3f8] border-2 border-[#5c253d] p-6 rounded-2xl relative shadow-[2px_2px_0px_#5c253d] w-full text-[#5c253d]">
                {/* Micro Tag */}
                <div className="absolute top-4 right-4 text-[9px] font-mono bg-[#f27447]/10 border border-[#f27447]/30 text-[#f27447] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                  Active Partner
                </div>

                {/* Avatar and Name */}
                <div className="flex items-center gap-4 text-left w-full">
                  {active.imageUrl ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#5c253d]/30 shrink-0 bg-white">
                      <Image 
                        src={active.imageUrl} 
                        alt={active.name || "Client"} 
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#f27447]/10 border-2 border-[#f27447]/20 flex items-center justify-center font-mono font-black text-lg text-[#f27447] shrink-0">
                      {active.name ? active.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'C'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-[#5c253d] font-mono uppercase tracking-tight leading-tight truncate">{active.name}</h3>
                    <span className="text-xs text-[#5c253d]/70 font-mono block mt-0.5 truncate">
                      {active.role} @ <strong className="text-[#f27447] font-black tracking-tight">{active.company}</strong>
                    </span>
                  </div>
                </div>

                {/* Pulsing Highlight Metric Box */}
                <div className="mt-5 w-full bg-white border-2 border-[#5c253d] p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group/metric shadow-[2px_2px_0px_#5c253d]">
                  <div className="text-2xl sm:text-3xl font-black text-[#f27447] font-mono tracking-tighter shrink-0 select-none">
                    {metric.value}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-[#5c253d]/50 uppercase block font-black tracking-widest leading-none">KEY ACHIEVEMENT</span>
                    <span className="text-xs font-bold text-[#5c253d] uppercase font-mono block mt-1 tracking-tight leading-none truncate">
                      {metric.label}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls and Indicator Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
        
        {/* Play/Pause Autoplay Controller */}
        <div className="flex items-center gap-3 order-3 sm:order-1">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              showToast(isPlaying ? "Autoplay paused." : "Autoplay activated.", "info");
            }}
            className={cn(
              "p-2 rounded-xl border-2 font-mono text-[10px] flex items-center gap-1.5 transition-all cursor-pointer",
              isPlaying 
                ? "bg-[#f27447]/10 border-[#f27447] text-[#f27447] hover:bg-[#f27447]/20" 
                : "bg-transparent border-[#5c253d]/30 text-[#5c253d] hover:bg-[#5c253d]/5"
            )}
            title={isPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-bold">AUTOPLAY ACTIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="font-bold">AUTOPLAY PAUSED</span>
              </>
            )}
          </button>
        </div>

        {/* Clickable Dot Indicators */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="relative p-1.5 focus:outline-none cursor-pointer group"
              title={`Go to slide ${idx + 1}`}
            >
              <div className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === currentIndex 
                  ? "w-6 bg-[#f27447] shadow-[0_0_8px_rgba(242,116,71,0.4)]" 
                  : "w-2 bg-[#5c253d]/30 group-hover:bg-[#5c253d]/50"
              )} />
            </button>
          ))}
        </div>

        {/* Next/Prev Directional Arrow Buttons */}
        <div className="flex items-center gap-2.5 order-2 sm:order-3">
          <button
            onClick={handlePrev}
            className="p-2.5 bg-white hover:bg-[#f6f3f8] border-2 border-[#5c253d] text-[#5c253d] shadow-[2px_2px_0px_#5c253d] hover:shadow-[3px_3px_0px_#5c253d] rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center group"
            title="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 bg-white hover:bg-[#f6f3f8] border-2 border-[#5c253d] text-[#5c253d] shadow-[2px_2px_0px_#5c253d] hover:shadow-[3px_3px_0px_#5c253d] rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center group"
            title="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
