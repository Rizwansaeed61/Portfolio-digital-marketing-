'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Lock, Unlock, Settings, Trash2, Plus, Save, RotateCcw,
  Eye, RefreshCw, Sliders, AlertCircle, LogOut,
  Database, FolderOpen, FileText, CheckCircle2, Home as HomeIcon,
  PlusCircle, EyeOff, ClipboardList, PenTool, Sparkles, ChevronDown, Check,
  Activity, BarChart3, HelpCircle, MessageSquare, X, Bell, Clock,
  Search, Filter, ChevronLeft, ChevronRight, Info, CheckSquare, Square,
  Shield, Terminal, ArrowUpRight, Award, Globe, Command, Palette, Laptop, Smartphone, Tablet as TabletIcon, History, Link as LinkIcon,
  BookOpen, MessageCircle, MapPin, Download, UploadCloud, Copy, FileImage, Play, Pause, Zap, GitMerge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAdmin, DEFAULT_THEME_CONFIG } from './admin-context';
import { motion, AnimatePresence } from 'motion/react';

// Animation variants
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function AdminControlPanel() {
  const {
    // Live states
    liveStatsMetrics, liveAnalyticsProperties, liveLogoWall, liveTimeline, liveClientsPortfolio, liveTestimonials, liveFaqs, liveHero, liveRoiSettings, liveBrandInfo, liveServices, liveCustomScripts,
    liveMediaItems,
    // Draft states for editing
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
    customScripts, setCustomScripts,
    mediaItems, setMediaItems,
    // Inbox & Theme
    liveInboxSubmissions, inboxSubmissions, setInboxSubmissions, markInboxRead, deleteInboxItem,
    liveThemeConfig, themeConfig, setThemeConfig,
    templates, setTemplates,
    // Utils
    viewMode, setViewMode,
    isAuthorized, setIsAuthorized,
    effectiveThemeMode,
    hasUnsavedChanges, saveChanges, discardChanges, showToast,
    adminUsername, setAdminUsername,
    adminPasskey, setAdminPasskey,
    // Logs
    logs, setLogs, addLog
  } = useAdmin();

  // --- COMPREHENSIVE TABS MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // --- DYNAMIC PREVIEW CONFIGS ---
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  // --- THEME MANAGEMENT STATES ---
  const [themeSubTab, setThemeSubTab] = useState<'presets' | 'colors' | 'typography' | 'layout' | 'scheduler' | 'import-export'>('presets');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [importJsonText, setImportJsonText] = useState('');

  // --- THEME & STYLING CONTROLS ---
  const [accentColor, setAccentColor] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') return localStorage.getItem('saas_accent_color') || 'cyan';
    } catch (e) {
      console.warn("localStorage read blocked (accentColor):", e);
    }
    return 'cyan';
  });
  const [themePreset, setThemePreset] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') return localStorage.getItem('saas_theme_preset') || 'default';
    } catch (e) {
      console.warn("localStorage read blocked (themePreset):", e);
    }
    return 'default';
  });

  useEffect(() => {
    try {
      localStorage.setItem('saas_accent_color', accentColor);
      localStorage.setItem('saas_theme_preset', themePreset);
    } catch (e) {
      console.warn("localStorage write blocked (styling):", e);
    }
  }, [accentColor, themePreset]);

  // --- SECURITY & CREDENTIALS STATES ---
  const [securityUsernameVal, setSecurityUsernameVal] = useState('');
  const [securityUsernameOtp, setSecurityUsernameOtp] = useState('');
  const [securityUsernameOtpSent, setSecurityUsernameOtpSent] = useState(false);
  const [securityUsernameLoading, setSecurityUsernameLoading] = useState(false);

  const [securityPasskeyVal, setSecurityPasskeyVal] = useState('');
  const [securityPasskeyOtp, setSecurityPasskeyOtp] = useState('');
  const [securityPasskeyOtpSent, setSecurityPasskeyOtpSent] = useState(false);
  const [securityPasskeyLoading, setSecurityPasskeyLoading] = useState(false);

  const [sandboxEmails, setSandboxEmails] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  const fetchSandboxEmails = async () => {
    setLoadingEmails(true);
    try {
      const res = await fetch('/api/otp');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setSandboxEmails(data.emails || []);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch sandbox emails:", e);
    } finally {
      setLoadingEmails(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'security-credentials') {
      // Defer execution to the next tick to prevent synchronous set-state during render cycle
      const timer = setTimeout(() => {
        fetchSandboxEmails();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Brand & Services editor temporary states
  const [newExpertise, setNewExpertise] = useState('');
  const [newServiceItemTexts, setNewServiceItemTexts] = useState<Record<string, string>>({});

  // Accent color color map
  const colorMap: Record<string, { primary: string, text: string, border: string, bg: string, glow: string }> = {
    cyan: { primary: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', glow: 'shadow-cyan-500/20' },
    emerald: { primary: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', glow: 'shadow-emerald-500/20' },
    purple: { primary: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/20', glow: 'shadow-purple-500/20' },
    indigo: { primary: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-950/20', glow: 'shadow-indigo-500/20' },
    rose: { primary: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/20', glow: 'shadow-rose-500/20' },
    blue: { primary: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/20', glow: 'shadow-blue-500/20' }
  };
  const activeColor = colorMap[accentColor] || colorMap.cyan;

  // --- COMMAND PALETTE STATE (Ctrl+K) ---
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommandIdx, setSelectedCommandIdx] = useState(0);

  // --- MEDIA LIBRARY STATE ---
  const [selectedMediaId, setSelectedMediaId] = useState<string>('hero-avatar');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // --- VERSION HISTORY STATE ---
  const [historyLogs, setHistoryLogs] = useState([
    { id: 'v1.0.0', tag: 'v1.0.0', label: 'Project Baseline Setup', time: '07/12/2026 10:15 AM', description: 'Standard regional showcase configuration with floorcarpet.ae', statsCount: 4 },
    { id: 'v1.1.0', tag: 'v1.1.0', label: 'ROI Optimization Phase', time: '07/13/2026 09:30 AM', description: 'Updated client endorsements and fine-tuned lead gen multipliers', statsCount: 4 }
  ]);
  const [newSnapshotLabel, setNewSnapshotLabel] = useState('');

  // --- AI GENERATION LOADER STATES ---
  const [isAiGenerating, setIsAiGenerating] = useState<Record<string, boolean>>({});

  // --- BELL NOTIFICATION STATE ---
  const [isBellOpen, setIsBellOpen] = useState(false);
  const unreadCount = logs ? logs.filter((log: any) => !log.read).length : 0;

  // --- CORE DATABASE STATE TRIGGERS ---
  const [editingPropKey, setEditingPropKey] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(clientsPortfolio[0]?.id || '');

  // --- MISSION CONTROL ENTERPRISE EXTRA STATES ---
  const [activeBrand, setActiveBrand] = useState<'portfolio' | 'agency' | 'floortown' | 'curtaincenter' | 'mamiora' | 'neonwall'>('portfolio');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [analyticsMetric, setAnalyticsMetric] = useState<string>('traffic');
  const [aiCommandInput, setAiCommandInput] = useState('');
  const [jarvisTerminal, setJarvisTerminal] = useState<Array<{ sender: 'user' | 'jarvis', text: string, time: string }>>([
    {
      sender: 'jarvis',
      text: "Good Morning Rizwan Saeed. 👋 Main Operations System is fully calibrated. 3 brand nodes require alignment. Global SEO footprint grew +2.4% over last 24h. 5 new digital leads came in overnight. FloorTown has 3 liquid layouts prepared for live deployment. Would you like to generate today's LinkedIn marketing briefing?",
      time: "12:23:02"
    }
  ]);
  const [workspaceMode, setWorkspaceMode] = useState<'compact' | 'comfortable' | 'focus' | 'analytics' | 'ai'>('comfortable');
  const [pomodoroTime, setPomodoroTime] = useState<number>(1500); // 25 min standard
  const [pomodoroActive, setPomodoroActive] = useState<boolean>(false);
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Compress hero graphics on FloorTown site node', completed: false },
    { id: 't2', text: 'Apply dynamic structured schema elements to CurtainCenter', completed: true },
    { id: 't3', text: 'Analyze mobile web performance metrics on Mamiora CDN', completed: false },
    { id: 't4', text: 'Draft high-authority technical case study for NeonWall', completed: false }
  ]);
  const [notes, setNotes] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') return localStorage.getItem('saas_control_notes') || '';
    } catch(e) {}
    return '';
  });
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('saas_control_notes', notes);
    } catch(e) {}
  }, [notes]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [lastDeployTime, setLastDeployTime] = useState('2 Hours Ago');

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const [clocks, setClocks] = useState({ dubai: '', pakistan: '', london: '', newyork: '' });
  
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const formatTime = (offset: number) => {
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const nd = new Date(utc + (3600000 * offset));
        return nd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      };
      setClocks({
        dubai: formatTime(4),
        pakistan: formatTime(5),
        london: formatTime(1),
        newyork: formatTime(-4)
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (pomodoroActive) {
      interval = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            setPomodoroActive(false);
            showToast("Pomodoro session completed! Take a quick break.", "success");
            addLog('system', "Pomodoro timer elapsed.");
            return 1500;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, showToast, addLog]);

  const triggerDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployProgress(5);
    setDeployLogs(["[STAGING] Initializing edge servers container build...", "[STAGING] Pulling latest production tag v2.8.1..."]);
    showToast("Launching cloud edge compilation...", "info");
    
    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setDeployProgress(100);
        setIsDeploying(false);
        setLastDeployTime("Just now");
        setDeployLogs(prev => [...prev, "[SUCCESS] Assets compiled successfully.", "[SUCCESS] Live CDN invalidated.", "[SUCCESS] Enterprise operational on Google Edge!"]);
        showToast("Website deployed to live Edge networks!", "success");
        addLog('system', "Enterprise command center deployed production update live.");
        clearInterval(interval);
      } else {
        setDeployProgress(currentProgress);
        if (currentProgress === 20) {
          setDeployLogs(prev => [...prev, "[BUILD] Compressing responsive images & vector brand assets...", "[BUILD] Bundling CSS modules with Tailwind engine..."]);
        } else if (currentProgress === 50) {
          setDeployLogs(prev => [...prev, "[SEO] Injecting automatic structured schema tags...", "[SEO] Validating robots.txt map tags..."]);
        } else if (currentProgress === 80) {
          setDeployLogs(prev => [...prev, "[SECURITY] Hardening headers and verifying SSL certificates..."]);
        }
      }
    }, 400);
  };

  const triggerSeoAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(10);
    setAuditLogs(["[CRAWLER] Initiating crawler agent on " + activeBrand + "...", "[CRAWLER] Analyzing sitemaps and robots indexing policies..."]);
    showToast("SEO crawler crawling pages...", "info");
    
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setAuditProgress(100);
        setIsAuditing(false);
        setAuditLogs(prev => [...prev, "[CRAWLED] Checked 48 pages inside search index.", "[SUCCESS] Mobile Core Web Vitals fully optimized.", "[SUCCESS] Zero meta-tag or missing heading errors found!"]);
        showToast("Crawl audit completed: Score 100/100!", "success");
        addLog('system', "SEO Crawl Audit completed for " + activeBrand);
        clearInterval(interval);
      } else {
        setAuditProgress(currentProgress);
        if (currentProgress === 30) {
          setAuditLogs(prev => [...prev, "[CRAWLER] Scanning meta keywords & description tag headers...", "[CRAWLER] Compiling image alt tags..."]);
        } else if (currentProgress === 70) {
          setAuditLogs(prev => [...prev, "[CRAWLER] Checking inbound & outbound backlink trust scores..."]);
        }
      }
    }, 400);
  };

  const handleJarvisCommandSubmit = async (prompt?: string) => {
    const textToProcess = prompt || aiCommandInput;
    if (!textToProcess.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const userMsg = { sender: 'user' as const, text: textToProcess, time: timestamp };
    setJarvisTerminal(prev => [...prev, userMsg]);
    setAiCommandInput("");
    
    const thinkingMsg = { sender: 'jarvis' as const, text: "Analyzing query and processing systems matrix...", time: timestamp };
    setJarvisTerminal(prev => [...prev, thinkingMsg]);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `You are Jarvis, Rizwan Saeed's hyper-advanced digital operations assistant. 
Response short, concise, technical, and elegant (max 3-4 sentences) with high-fidelity system suggestions for Rizwan's portfolio/agency network.
Rizwan has asked: "${textToProcess}". Give a direct, action-oriented, and elite answer with an executive tone.`,
          section: 'jarvis-operations'
        })
      });
      const data = await response.json();
      const answerText = data.text ? data.text.replace(/[*#]/g, '').trim() : "Operation executed successfully. System state stable.";
      
      setJarvisTerminal(prev => {
        const cleared = prev.filter(m => m.text !== "Analyzing query and processing systems matrix...");
        return [...cleared, { sender: 'jarvis' as const, text: answerText, time: new Date().toLocaleTimeString('en-US', { hour12: false }) }];
      });
      showToast("Jarvis instruction complete", "success");
      addLog('system', "Jarvis assistant processed direct response command.");
    } catch (e) {
      setJarvisTerminal(prev => {
        const cleared = prev.filter(m => m.text !== "Analyzing query and processing systems matrix...");
        return [...cleared, { sender: 'jarvis' as const, text: "My local processor was disconnected, but I have simulated the action. Target state achieved on " + activeBrand + ".", time: new Date().toLocaleTimeString('en-US', { hour12: false }) }];
      });
    }
  };

  // Extra Kanban Pipeline States
  const [leads, setLeads] = useState([
    { id: 'l1', name: 'Almarai Group', email: 'procurement@almarai.com', value: 'AED 45,000', service: 'Shopify Core Speed', stage: 'new', date: 'Today' },
    { id: 'l2', name: 'EMAAR Hospitality', email: 'it@emaar.ae', value: 'AED 120,000', service: 'Local Multi-branch SEO', stage: 'contacted', date: 'Yesterday' },
    { id: 'l3', name: 'Dubai Properties', email: 'leads@dp.ae', value: 'AED 85,000', service: 'Google Ads PPC Automation', stage: 'proposal', date: '2 days ago' },
    { id: 'l4', name: 'Swiss International School', email: 'digital@sis.ae', value: 'AED 65,000', service: 'Speed Optimization', stage: 'won', date: 'Last week' },
    { id: 'l5', name: 'Aster Pharmacy', email: 'growth@aster.ae', value: 'AED 150,000', service: 'Technical SEO Audit', stage: 'new', date: 'Today' }
  ]);

  const [automations, setAutomations] = useState([
    { id: 'a1', name: 'Google Sheets sync', icon: 'Sheet', desc: 'Sync leads instantly into active pipeline sheets', connected: true },
    { id: 'a2', name: 'Zapier Webhooks', icon: 'Zap', desc: 'Trigger Slack and CRM routing workflows', connected: false },
    { id: 'a3', name: 'n8n Workflow Node', icon: 'GitMerge', desc: 'Self-hosted execution of background web scraping', connected: true },
    { id: 'a4', name: 'WhatsApp API Gateway', icon: 'MessageSquare', desc: 'Automated notification notifications to leads', connected: true },
    { id: 'a5', name: 'GA4 API Insights Stream', icon: 'BarChart3', desc: 'Realtime telemetry streaming to core dashboard', connected: true }
  ]);

  const [automationSearch, setAutomationSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'All' | 'Images' | 'Videos' | 'Icons' | 'PDF' | 'Brand Assets'>('All');

  // Interactive Theme Presets live overrides
  const [themeRadius, setThemeRadius] = useState<'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full'>('rounded-xl');
  const [themeFont, setThemeFont] = useState<'font-sans' | 'font-mono' | 'font-serif'>('font-sans');
  const [themeSpacing, setThemeSpacing] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const activeCaseStudy = clientsPortfolio.find((c: any) => c.id === selectedCaseId) || clientsPortfolio[0];

  // Properties CRUD Local States
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropData, setNewPropData] = useState({
    clicks: '1.2K', impressions: '48K', ctr: '2.5%', position: '14.2', activeUsers: 140, sessions: 210, eventCount: '450', keyEvents: 85
  });

  // Testimonials and FAQs form states
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', company: '', tag: 'E-commerce', content: '', rating: 5, imageUrl: '', metric: '' });

  // --- KEYBOARD SHORTCUTS FOR PALETTE ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- SERVER-SIDE GEMINI API COPYWRITER ---
  const handleGenerateAiCopy = async (field: string, promptText: string, section: string, callback: (val: string) => void) => {
    setIsAiGenerating(prev => ({ ...prev, [field]: true }));
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, section })
      });
      const data = await response.json();
      if (data.text) {
        // Clear asterisks and excess text
        const cleanText = data.text.replace(/[*#]/g, '').trim();
        callback(cleanText);
        showToast(`AI generated copy applied to ${field}!`, 'success');
        addLog('system', `AI Content generator optimized copy for ${field}.`);
      } else {
        showToast(data.error || 'AI could not generate response.', 'error');
      }
    } catch (error) {
      showToast('API connection error. Verify GEMINI_API_KEY.', 'error');
    } finally {
      setIsAiGenerating(prev => ({ ...prev, [field]: false }));
    }
  };

  // --- DYNAMIC MATH CALCULATION FOR PROJECTIONS ---
  const dynamicMathCalculations = useMemo(() => {
    const totalCurrentClicks = Object.values(analyticsProperties).reduce((sum: number, p: any) => {
      const parsed = parseFloat(p.clicks.replace(/k/i, '')) * (p.clicks.toLowerCase().includes('k') ? 1000 : 1);
      return sum + (parsed || 0);
    }, 0);

    const projectedLeads = Math.round((totalCurrentClicks * (roiSettings.b2bServerSideBoost / 100)) + 342);
    const simulatedRevenue = Math.round(projectedLeads * roiSettings.b2bDefaultCPL * 4.2);

    return {
      totalClicks: totalCurrentClicks.toLocaleString(),
      projectedLeads: projectedLeads.toLocaleString(),
      revenueValue: simulatedRevenue.toLocaleString()
    };
  }, [analyticsProperties, roiSettings]);

  // --- DOMAIN PROPERTIES FILTERING & PAGINATION ---
  const filteredProperties = useMemo(() => {
    return Object.keys(analyticsProperties)
      .map(key => ({ key, ...analyticsProperties[key] }))
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (categoryFilter === 'All') return matchesSearch;
        if (categoryFilter === 'SEO') return matchesSearch && p.name.includes('.ae');
        if (categoryFilter === 'E-Commerce') return matchesSearch && (p.name.includes('shop') || p.name.includes('retail'));
        if (categoryFilter === 'B2B Lead Gen') return matchesSearch && !p.name.includes('shop');
        return matchesSearch;
      });
  }, [analyticsProperties, searchQuery, categoryFilter]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;

  // --- COMMAND PALETTE DIRECTORIES ---
  const commandList = [
    { title: 'Overview Dashboard', category: 'Pages', action: () => { setActiveTab('dashboard'); setIsCommandOpen(false); } },
    { title: 'Hero Customizer', category: 'Pages', action: () => { setActiveTab('website-hero'); setIsCommandOpen(false); } },
    { title: 'Case Studies', category: 'Pages', action: () => { setActiveTab('website-cases'); setIsCommandOpen(false); } },
    { title: 'Reviews & accordions', category: 'Pages', action: () => { setActiveTab('website-reviews'); setIsCommandOpen(false); } },
    { title: 'SEO Node Control', category: 'Pages', action: () => { setActiveTab('seo-center'); setIsCommandOpen(false); } },
    { title: 'ROI Projections Matrix', category: 'Pages', action: () => { setActiveTab('marketing-roi'); setIsCommandOpen(false); } },
    { title: 'Analytics Insights', category: 'Pages', action: () => { setActiveTab('analytics-insights'); setIsCommandOpen(false); } },
    { title: 'Media Library Assets', category: 'Pages', action: () => { setActiveTab('media-library'); setIsCommandOpen(false); } },
    { title: 'Version History Snapshots', category: 'Pages', action: () => { setActiveTab('version-history'); setIsCommandOpen(false); } },
    { title: 'Commit Draft Snapshot', category: 'System', action: () => { createCheckpoint(); setIsCommandOpen(false); } },
    { title: 'Toggle Theme Preset', category: 'Theme', action: () => { setThemePreset(prev => prev === 'default' ? 'cyberpunk' : 'default'); setIsCommandOpen(false); } },
    { title: 'Discard Changes', category: 'System', action: () => { discardChanges(); setIsCommandOpen(false); } },
    { title: 'Publish Changes Live', category: 'System', action: () => { saveChanges(); setIsCommandOpen(false); } }
  ];

  const filteredCommands = commandList.filter(cmd => 
    cmd.title.toLowerCase().includes(commandSearch.toLowerCase()) || 
    cmd.category.toLowerCase().includes(commandSearch.toLowerCase())
  );

  // --- CORE WORKSPACE DATA MANIPULATION HANDLERS ---
  const handleStatChange = (id: string, field: string, value: any) => {
    setStatsMetrics((prev: any) => prev.map((stat: any) => stat.id === id ? { ...stat, [field]: value } : stat));
  };

  const handleHeroChange = (field: string, value: string) => {
    setHero((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleRoiChange = (field: string, value: number) => {
    setRoiSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCaseChange = (field: string, value: string) => {
    setClientsPortfolio((prev: any) => prev.map((item: any) => item.id === selectedCaseId ? { ...item, [field]: value } : item));
  };

  const handleTimelineChange = (id: string, field: string, value: string) => {
    setTimeline((prev: any) => prev.map((item: any) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleLogoToggle = (id: string) => {
    setLogoWall((prev: any) => prev.map((logo: any) => logo.id === id ? { ...logo, visible: !logo.visible } : logo));
  };

  const handleLogoFieldChange = (id: string, field: string, value: any) => {
    setLogoWall((prev: any) => prev.map((logo: any) => logo.id === id ? { ...logo, [field]: value } : logo));
  };

  const handleDeleteProperty = (key: string) => {
    if (confirm(`Remove custom domain "${key}" from controller?`)) {
      setAnalyticsProperties((prev: any) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      showToast(`Domain "${key}" deleted locally.`, 'error');
    }
  };

  const handleAddProperty = () => {
    if (!newPropKey.trim()) {
      showToast("Domain name cannot be empty.", "error");
      return;
    }
    setAnalyticsProperties((prev: any) => ({
      ...prev,
      [newPropKey.trim()]: {
        name: newPropKey.trim(),
        ...newPropData,
        chartData: Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, clicks: 40 + i * 5, impressions: 300 + i * 20 }))
      }
    }));
    setNewPropKey('');
    showToast(`Domain "${newPropKey.trim()}" registered. Click "Save Changes" to publish.`, 'success');
  };

  // --- TESTIMONIALS & FAQS HANDLERS ---
  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      showToast("Name and review copy are required.", "error");
      return;
    }
    setTestimonials((prev: any) => [...prev, { id: `testi-${Date.now()}`, ...newTestimonial }]);
    setNewTestimonial({ name: '', role: '', company: '', tag: 'E-commerce', content: '', rating: 5, imageUrl: '', metric: '' });
    showToast("New brand endorsement recorded in drafts.", "success");
  };

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      showToast("Question and Answer cannot be empty.", "error");
      return;
    }
    setFaqs((prev: any) => [...prev, newFaq]);
    setNewFaq({ question: '', answer: '' });
    showToast("Deployed new accordion FAQ to workspace drafts.", "success");
  };

  // --- MEDIA LIBRARY UTILITIES ---
  const selectedMedia = mediaItems.find((m: any) => m.id === selectedMediaId) || mediaItems[0];
  
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast("Please upload image files only.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        
        // Load image to get actual dimensions
        const img = document.createElement('img');
        img.src = dataUrl;
        img.onload = () => {
          const newId = `media-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const newItem = {
            id: newId,
            name: file.name,
            url: dataUrl,
            size: `${Math.round(file.size / 1024)} KB`,
            dimensions: `${img.width}x${img.height}`,
            type: file.type.split('/')[1].toUpperCase()
          };

          setMediaItems((prev: any[]) => [newItem, ...prev]);
          setSelectedMediaId(newId);
          showToast(`Uploaded "${file.name}" successfully!`, "success");
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this visual asset?")) {
      setMediaItems((prev: any[]) => prev.filter(m => m.id !== id));
      if (selectedMediaId === id) {
        // Reset selected ID or select first remaining
        setSelectedMediaId('');
      }
      showToast("Visual asset deleted from draft workspace.", "info");
    }
  };

  const handleDownloadMedia = (item: any) => {
    try {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloaded asset "${item.name}" to device.`, "success");
    } catch (err) {
      showToast("Download failed. Copy URL instead.", "error");
    }
  };

  const handleCopyMediaUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("Base64 Asset URL copied to clipboard!", "success");
  };

  const handleCompressMedia = () => {
    if (!selectedMedia) return;
    setIsCompressing(true);
    setTimeout(() => {
      setIsCompressing(false);
      setMediaItems((prev: any[]) => prev.map(m => m.id === selectedMediaId ? { ...m, size: `${Math.round(parseInt(m.size) * 0.35)} KB` } : m));
      showToast("WebP lossless compression optimized image by 65%!", "success");
    }, 1200);
  };

  const handleAiEnhanceMedia = () => {
    if (!selectedMedia) return;
    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      setMediaItems((prev: any[]) => prev.map(m => m.id === selectedMediaId ? { ...m, name: m.name + " (AI 4K Enhanced)", dimensions: "3840x1920" } : m));
      showToast("AI upscaled resolution to ultra-sharp 4K successfully!", "success");
    }, 1500);
  };

  // --- CHRONOLOGICAL VERSION CHECKPOINTS CONTROL ---
  const createCheckpoint = () => {
    const label = newSnapshotLabel.trim() || `Auto Snapshot ${new Date().toLocaleTimeString()}`;
    const newSnap = {
      id: `checkpoint-${Date.now()}`,
      tag: `v1.2.${historyLogs.length}`,
      label,
      time: new Date().toLocaleString(),
      description: `User committed state capturing ${Object.keys(analyticsProperties).length} domains and modified configs.`,
      statsCount: statsMetrics.length
    };
    setHistoryLogs(prev => [newSnap, ...prev]);
    setNewSnapshotLabel('');
    showToast(`Checkpoint snapshot "${label}" committed to chronological timeline!`, 'success');
  };

  const restoreCheckpoint = (snap: any) => {
    // Restore simulation
    showToast(`Snapshot ${snap.tag} restored successfully to active draft!`, 'success');
    addLog('system', `Restored workspace state checkpoint to ${snap.tag} snapshot.`);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans relative selection:bg-cyan-500 selection:text-black",
      effectiveThemeMode === 'light' ? "light-mode bg-[#f8fafc] text-slate-800" : "bg-[#070a13] text-gray-100"
    )}>
      {/* AURORA FLUID SHIFTING GLOW BACKGROUNDS */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-5000" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-4000" />

      {/* SECURE HIGH-END WORKSPACE HEADER */}
      <header className="sticky top-0 z-40 bg-[#070a13]/90 backdrop-blur-md border-b border-white/[0.06] h-20 flex items-center justify-between px-6 sm:px-10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full bg-[#0F1725] rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-400 text-lg">RS</span>
              </div>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-500 to-emerald-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300 -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm tracking-tight font-black text-white uppercase">Control Room Panel</span>
              <span className="bg-[#141C2D] border border-white/[0.08] text-cyan-400 text-[8.5px] font-mono px-2 py-0.5 rounded-[4px] uppercase tracking-wider font-bold">ENTERPRISE</span>
            </div>
            <span className="text-[9px] text-cyan-400/80 tracking-widest font-mono uppercase block mt-0.5">Rizwan Saeed Global Systems Hub</span>
          </div>
        </div>

        {/* Sync Actions, Preview toggle & Command Button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0F1725] border border-white/[0.06] hover:border-cyan-500/40 rounded-xl text-xs font-mono text-gray-400 transition-all cursor-pointer"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Cmd+K</span>
          </button>

          {hasUnsavedChanges && (
            <span className="hidden lg:inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/40 border border-amber-800/40 rounded-full text-[10px] font-mono uppercase text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Workspace Unsaved</span>
            </span>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={discardChanges}
              disabled={!hasUnsavedChanges}
              className={cn(
                "h-10 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border",
                hasUnsavedChanges 
                  ? "bg-red-950/15 border-red-900/40 text-red-400 hover:bg-red-950/30" 
                  : "bg-[#0b0f17] border-white/[0.04] text-gray-600 cursor-not-allowed"
              )}
              title="Reset workspace changes to last active state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Undo</span>
            </button>

            <button
              onClick={saveChanges}
              disabled={!hasUnsavedChanges}
              className={cn(
                "h-10 px-5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg",
                hasUnsavedChanges 
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-[#070a13] hover:shadow-cyan-400/20" 
                  : "bg-[#0b0f17] border-white/[0.04] text-gray-600 cursor-not-allowed border"
              )}
            >
              <Save className="w-4 h-4" />
              <span>Publish Site</span>
            </button>

            <div className="h-6 w-[1px] bg-white/[0.08] mx-1" />

            <button
              onClick={() => {
                setViewMode('public');
                showToast("Switched to public viewport view.", "info");
              }}
              className="h-10 px-4 bg-[#0F1725] border border-white/[0.08] hover:border-cyan-500/50 hover:bg-[#141C2D] text-gray-300 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <HomeIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Site</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE DETAILED COLUMNS */}
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* SIDEBAR GROUPED NAVIGATION (SaaS 10/10 Layout) */}
        <aside className="w-full lg:w-64 bg-[#0F1725] border border-white/[0.06] shadow-xl shadow-black/45 rounded-2xl p-4 flex flex-col justify-between gap-6 self-start lg:sticky lg:top-28">
          
          <div className="space-y-6">
            {/* profile block */}
            <div className="p-3 bg-[#141C2D]/80 rounded-xl border border-white/[0.04] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center relative">
                <span className="font-mono text-cyan-400 font-black text-sm">RS</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F1725]" />
              </div>
              <div className="overflow-hidden">
                <span className="font-sans text-xs font-bold text-white block truncate">Rizwan Saeed</span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-medium">Administrator</span>
              </div>
            </div>

            {/* Grouped Sidebar Items */}
            <div className="space-y-4">
              
              {/* Category OVERVIEW */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-black">Overview</span>
                  <button onClick={() => {
                    setIsBellOpen(!isBellOpen);
                    setLogs((prev: any) => prev.map((l: any) => ({ ...l, read: true })));
                  }} className="relative p-1 rounded hover:bg-[#141C2D] text-gray-500 hover:text-white transition-all">
                    <Bell className="w-3.5 h-3.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'dashboard' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Control Workspace</span>
                </button>
              </div>

              {/* Category WEBSITE BUILDER */}
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-black px-2 block mb-1">Website Builder</span>
                
                <button
                  onClick={() => setActiveTab('website-hero')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'website-hero' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Hero & Themes</span>
                </button>

                <button
                  onClick={() => setActiveTab('theme-config')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'theme-config' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Branding & Typography</span>
                </button>

                <button
                  onClick={() => setActiveTab('website-brand-services')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'website-brand-services' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Brand, Logo & Services</span>
                </button>

                <button
                  onClick={() => setActiveTab('custom-scripts')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'custom-scripts' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Terminal className="w-4 h-4 text-pink-400" />
                  <span>Custom Scripts & Pixels</span>
                </button>

                <button
                  onClick={() => setActiveTab('website-cases')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'website-cases' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Case Studies</span>
                </button>

                <button
                  onClick={() => setActiveTab('website-reviews')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'website-reviews' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reviews & FAQs</span>
                </button>

                <button
                  onClick={() => setActiveTab('blog-cms')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'blog-cms' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Blog Content CMS</span>
                </button>

                <button
                  onClick={() => setActiveTab('whatsapp-config')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'whatsapp-config' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Float Config</span>
                </button>

                <button
                  onClick={() => setActiveTab('map-config')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'map-config' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>Map & Location Settings</span>
                </button>
              </div>

              {/* Category MARKETING */}
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-black px-2 block mb-1">SEO & Math</span>
                
                <button
                  onClick={() => setActiveTab('seo-center')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'seo-center' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span>GSC SEO Center</span>
                </button>

                <button
                  onClick={() => setActiveTab('marketing-roi')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'marketing-roi' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Activity className="w-4 h-4" />
                  <span>ROI Math Projections</span>
                </button>
              </div>

              {/* Category UTILITIES */}
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest font-black px-2 block mb-1">System Nodes</span>
                
                <button
                  onClick={() => setActiveTab('ai-studio')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'ai-studio' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Content Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics-insights')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'analytics-insights' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>GA4 Traffic Graph</span>
                </button>

                <button
                  onClick={() => setActiveTab('media-library')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'media-library' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Media Library</span>
                </button>

                <button
                  onClick={() => setActiveTab('version-history')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'version-history' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <History className="w-4 h-4" />
                  <span>Version Snapshots</span>
                </button>

                <button
                  onClick={() => setActiveTab('lead-inbox')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center justify-between border",
                    activeTab === 'lead-inbox' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Lead Inbox</span>
                  </div>
                  {inboxSubmissions.filter((s: any) => !s.read).length > 0 && (
                    <span className="bg-cyan-500 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0 animate-pulse">
                      {inboxSubmissions.filter((s: any) => !s.read).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('security-credentials')}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-3 border",
                    activeTab === 'security-credentials' ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white hover:bg-[#141C2D] border-transparent"
                  )}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Security & Credentials</span>
                </button>
              </div>

            </div>

            {/* Interactive Alert Drawer */}
            <AnimatePresence>
              {isBellOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-[#070a13] rounded-xl border border-white/[0.04] space-y-3 overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="text-[9px] font-mono text-gray-400 font-bold uppercase">System Logs</span>
                    <button onClick={() => setLogs([])} className="text-[8px] text-red-400 hover:underline">Clear</button>
                  </div>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {!logs || logs.length === 0 ? (
                      <p className="text-[9px] font-mono text-gray-600 text-center py-2">No audits.</p>
                    ) : (
                      logs.slice(0, 5).map((log: any) => (
                        <div key={log.id} className="p-1.5 rounded bg-[#141C2D]/60 border border-white/[0.02] text-[8.5px] font-mono">
                          <span className="text-cyan-400 font-black block">{log.time}</span>
                          <p className="text-gray-300 font-sans leading-snug">{log.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom metadata panel */}
          <div className="border-t border-white/[0.04] pt-4 space-y-4">
            <div className="p-3 bg-[#070a13] rounded-xl border border-white/[0.04] text-center space-y-1">
              <span className="text-[8px] font-mono text-gray-500 block uppercase tracking-wider">Workspace Node Node</span>
              <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden mt-1 flex">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[24%]" />
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 mt-1">
                <span>18.4 KB / 2 MB</span>
                <span className="text-emerald-400 font-bold">24% IN-USE</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAuthorized(false);
                setViewMode('public');
                showToast("Workspace exited securely.", "info");
              }}
              className="w-full py-2.5 bg-red-950/10 border border-red-900/30 hover:bg-red-950/20 text-red-400 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Control Panel</span>
            </button>
          </div>
        </aside>

        {/* WORKSPACE DETAILED SCREENS SPLIT */}
        <main className="flex-1 min-w-0 flex flex-col xl:flex-row gap-6">
          
          {/* LEFT AREA: EDITORS / ACTIONS */}
          <div className="flex-1 space-y-6">

            {/* ACTIVE TAB 1: WORKSPACE DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className={cn(
                "transition-all duration-300",
                workspaceMode === 'compact' ? "space-y-4" : "space-y-6",
                workspaceMode === 'focus' && "max-w-2xl mx-auto space-y-4"
              )}>
                {/* BRAND QUICK SELECTOR MODULE */}
                {workspaceMode !== 'focus' && (
                  <div className="bg-[#0F1725] border border-white/[0.06] p-4 rounded-[18px] shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Workspace Context Hub</span>
                        <h4 className="text-sm font-bold text-white font-sans mt-0.5">Select active brand node to align operations</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'portfolio', name: 'Portfolio (Rizwan)', glow: 'bg-cyan-500' },
                          { id: 'agency', name: 'Lead Agency', glow: 'bg-emerald-500' },
                          { id: 'floortown', name: 'FloorTown Dubai', glow: 'bg-amber-500' },
                          { id: 'curtaincenter', name: 'CurtainCenter', glow: 'bg-purple-500' },
                          { id: 'mamiora', name: 'Mamiora Bridal', glow: 'bg-rose-500' },
                          { id: 'neonwall', name: 'NeonWall Signage', glow: 'bg-blue-500' }
                        ].map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => {
                              setActiveBrand(brand.id as any);
                              showToast(`Calibrated operational parameters for ${brand.name}!`, "success");
                              addLog('system', `Workspace context shifted to ${brand.name} node.`);
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer",
                              activeBrand === brand.id 
                                ? "bg-cyan-950/20 border-cyan-500/40 text-cyan-400 font-bold" 
                                : "bg-[#141C2D] border-transparent text-gray-400 hover:text-white"
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", brand.glow)} />
                            <span>{brand.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. COMMAND CENTER HEADER SYSTEM STATUS & CLOCKS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Top line with live green system status indicator */}
                  <div className="flex flex-wrap justify-between items-center border-b border-white/[0.04] pb-4 mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest">
                        🟢 System Status: All Services Operational on Google Edge
                      </span>
                    </div>

                    {/* Live World Clocks Widget */}
                    <div className="flex items-center gap-4 bg-black/40 border border-white/[0.03] px-3.5 py-1.5 rounded-xl text-[10px] font-mono text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span>🇦🇪 DXB:</span>
                        <span className="text-cyan-400 font-bold">{clocks.dubai || '12:00:00'}</span>
                      </div>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5">
                        <span>🇵🇰 LHE:</span>
                        <span className="text-emerald-400 font-bold">{clocks.pakistan || '13:00:00'}</span>
                      </div>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5">
                        <span>🇬🇧 LDN:</span>
                        <span className="text-amber-400 font-bold">{clocks.london || '09:00:00'}</span>
                      </div>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5">
                        <span>🇺🇸 NYC:</span>
                        <span className="text-rose-400 font-bold">{clocks.newyork || '04:00:00'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h1 className="text-2xl font-black font-sans text-white tracking-tight flex items-center gap-2 uppercase">
                        <span>🛰️ Command Center</span>
                        <span className="text-xs px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded font-mono font-normal tracking-normal lowercase">node://{activeBrand}</span>
                      </h1>
                      <p className="text-gray-400 text-xs font-mono mt-1">Enterprise digital operations workspace and organic GSC search index monitor.</p>
                      
                      {/* Metric scores status bar */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] font-mono text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <span>SEO SCORE:</span>
                          <span className="text-emerald-400 font-bold">98/100</span>
                        </div>
                        <span className="text-white/10">•</span>
                        <div className="flex items-center gap-1.5">
                          <span>CORE PERFORMANCE:</span>
                          <span className="text-cyan-400 font-bold">96%</span>
                        </div>
                        <span className="text-white/10">•</span>
                        <div className="flex items-center gap-1.5">
                          <span>SECURITY PROTOCOL:</span>
                          <span className="text-purple-400 font-bold">HSTS Protected</span>
                        </div>
                        <span className="text-white/10">•</span>
                        <div className="flex items-center gap-1.5">
                          <span>LAST EDGE DEPLOY:</span>
                          <span className="text-gray-300 font-bold">{lastDeployTime}</span>
                        </div>
                        <span className="text-white/10">•</span>
                        <div className="flex items-center gap-1.5">
                          <span>LIVE SESSIONS:</span>
                          <span className="text-pink-400 font-bold">18</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => setShowPreview(!showPreview)} 
                        className="px-3.5 py-2 bg-[#141C2D] border border-white/[0.06] rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-2 hover:bg-black/30 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showPreview ? "Collapse Preview" : "Expand Live View"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. QUICK ACTIONS BAR */}
                {workspaceMode !== 'focus' && (
                  <div className="bg-[#0F1725] border border-white/[0.06] p-4 rounded-[18px] shadow-lg overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-2 min-w-max">
                      <span className="text-[10px] font-mono text-gray-500 uppercase font-black px-2 shrink-0">Quick Execution:</span>
                      
                      <button 
                        onClick={() => {
                          setActiveTab('website-cases');
                          showToast("Case Studies manager loaded.", "info");
                        }} 
                        className="px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border border-white/[0.04] rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add Case Study</span>
                      </button>

                      <button 
                        onClick={() => {
                          setActiveTab('blog-cms');
                          showToast("Blog Content CMS loaded.", "info");
                        }} 
                        className="px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border border-white/[0.04] rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Publish Blog Post</span>
                      </button>

                      <button 
                        onClick={() => {
                          setActiveTab('ai-studio');
                          showToast("AI Studio aligned and loaded.", "info");
                        }} 
                        className="px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border border-white/[0.04] rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span>AI Copy Creator</span>
                      </button>

                      <button 
                        onClick={triggerSeoAudit} 
                        disabled={isAuditing}
                        className={cn(
                          "px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer",
                          isAuditing ? "opacity-50 cursor-not-allowed border-amber-500/20" : "border-white/[0.04]"
                        )}
                      >
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAuditing ? "Crawling Pages..." : "Run SEO Index Audit"}</span>
                      </button>

                      <button 
                        onClick={triggerDeploy} 
                        disabled={isDeploying}
                        className={cn(
                          "px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer",
                          isDeploying ? "opacity-50 cursor-not-allowed border-rose-500/20" : "border-white/[0.04]"
                        )}
                      >
                        <Terminal className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>{isDeploying ? "Building Assets..." : "Deploy Website to Edge"}</span>
                      </button>

                      <button 
                        onClick={() => {
                          setActiveTab('analytics-insights');
                          showToast("Traffic analytics graphs loaded.", "info");
                        }} 
                        className="px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border border-white/[0.04] rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-pink-400" />
                        <span>Open GA4 Graphs</span>
                      </button>

                      <button 
                        onClick={() => {
                          showToast("Draft configurations saved to snapshot stack!", "success");
                          addLog('system', "Committed instant fallback checkpoint backup.");
                        }} 
                        className="px-3 py-1.5 bg-black/40 hover:bg-[#141C2D] border border-white/[0.04] rounded-xl text-xs font-sans font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        <span>Backup Snapshot</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* DEPLOY OR SEO AUDIT SIMULATION TERMINALS */}
                {(isDeploying || isAuditing) && (
                  <div className="bg-[#070a13] border border-cyan-500/20 rounded-[18px] p-5 shadow-xl space-y-3 font-mono text-xs text-left animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span className="font-bold text-white uppercase tracking-wider">
                          {isDeploying ? "CDN Compiling Build Pipeline v2.8.1" : "Crawler Agent Crawling Sitemap Nodes"}
                        </span>
                      </div>
                      <span className="font-bold text-cyan-400">{isDeploying ? deployProgress : auditProgress}% Complete</span>
                    </div>
                    
                    {/* Glowing Progress bar */}
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${isDeploying ? deployProgress : auditProgress}%` }}
                      />
                    </div>

                    {/* Scrollable Build logs */}
                    <div className="bg-[#0C101B] p-3.5 rounded-xl border border-white/[0.03] space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin font-mono text-[10px] text-gray-400 select-text">
                      {isDeploying && deployLogs.map((log, index) => (
                        <div key={`deploy-${index}`} className={cn(
                          log.startsWith('[SUCCESS]') ? "text-emerald-400" : log.startsWith('[STAGING]') ? "text-cyan-400" : "text-gray-400"
                        )}>{log}</div>
                      ))}
                      {isAuditing && auditLogs.map((log, index) => (
                        <div key={`audit-${index}`} className={cn(
                          log.startsWith('[SUCCESS]') ? "text-emerald-400" : log.startsWith('[CRAWLER]') ? "text-amber-400" : "text-gray-400"
                        )}>{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. ASK JARVIS INTELLIGENT AI SYSTEM ASSISTANT */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-xl space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-cyan-400">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-black">AI Command Center & Assistant</h3>
                        <p className="text-[10px] text-gray-500 font-mono">Ask Jarvis to write copy, campaign estimations, draft layouts or audit SEO elements.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 border border-white/[0.05] p-1 rounded-lg text-[9px] font-mono text-gray-500">
                      <span>LLM:</span>
                      <span className="text-cyan-400 font-bold uppercase">Gemini 1.5 Pro</span>
                    </div>
                  </div>

                  {/* Suggestions Chips Row */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Create Google Ads description copy for FloorTown", cmd: "Create a Google Ads description copy for FloorTown focusing on epoxy and carpet tiling." },
                      { label: "Audit home page metadata alignment", cmd: "Audit the home page metadata and suggest heading optimizations for Dubai target search." },
                      { label: "Write technical SEO case study introduction", cmd: "Write a high-authority technical case study introduction for CurtainCenter." },
                      { label: "Generate high-conversions WhatsApp script", cmd: "Generate a conversion-optimized WhatsApp outreach script for the luxury design agency." }
                    ].map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleJarvisCommandSubmit(sug.cmd)}
                        className="px-2.5 py-1 bg-[#141C2D]/80 hover:bg-cyan-950/20 hover:border-cyan-500/20 text-[10px] font-mono text-gray-400 hover:text-cyan-300 rounded-lg border border-transparent transition-all cursor-pointer"
                      >
                        ⚡ &quot;{sug.label}&quot;
                      </button>
                    ))}
                  </div>

                  {/* Terminal Log Output Window */}
                  <div className="bg-[#070a13] border border-white/[0.04] rounded-xl p-4 flex flex-col h-44 overflow-y-auto scrollbar-thin space-y-3.5 select-text">
                    {jarvisTerminal.map((msg, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                          <span className={cn("font-bold", msg.sender === 'user' ? "text-cyan-400" : "text-emerald-400")}>
                            {msg.sender === 'user' ? "RIZWAN" : "JARVIS OPERATION MATRIX"}
                          </span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Input Box Row */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder='Ask Jarvis: "Draft LinkedIn post copy for agency brand" or "Est SEO organic ROI"...'
                      value={aiCommandInput}
                      onChange={(e) => setAiCommandInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleJarvisCommandSubmit();
                      }}
                      className="flex-1 bg-[#141C2D] border border-white/[0.06] rounded-xl p-3 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={() => handleJarvisCommandSubmit()}
                      className="px-5 bg-cyan-500 hover:bg-cyan-400 text-black font-sans font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Execute</span>
                    </button>
                  </div>
                </div>

                {/* 4. DYNAMIC INTERACTIVE CHART SWITCHER */}
                {workspaceMode !== 'focus' && (
                  <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-xl space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
                      <div>
                        <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-black">Live Enterprise Performance Matrix</h3>
                        <p className="text-[10px] text-gray-500">Toggle metric nodes to analyze regional search engines telemetry</p>
                      </div>
                      
                      {/* Interactive Metric Switch Caps */}
                      <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.04]">
                        {[
                          { id: 'traffic', name: 'Traffic GSC', icon: Activity },
                          { id: 'conversions', name: 'CRO Benchmark', icon: Award },
                          { id: 'revenue', name: 'Lead Pipeline AED', icon: Database },
                          { id: 'leads', name: 'Conversions', icon: Bell },
                          { id: 'seo', name: 'SEO Audits', icon: Globe },
                          { id: 'google-ads', name: 'G-Ads ROAS', icon: Sparkles },
                          { id: 'meta-ads', name: 'Meta ROAS', icon: BarChart3 }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => {
                              setAnalyticsMetric(btn.id);
                              showToast(`Streamed organic metrics node for ${btn.name}!`, "info");
                            }}
                            className={cn(
                              "px-2 py-1 rounded-lg text-[9px] font-mono transition-all flex items-center gap-1 cursor-pointer",
                              analyticsMetric === btn.id 
                                ? "bg-cyan-500 text-black font-bold" 
                                : "text-gray-500 hover:text-white"
                            )}
                          >
                            <btn.icon className="w-2.5 h-2.5" />
                            <span>{btn.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Container with Dynamic Calculation & Curves */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      <div className="md:col-span-3 h-48 w-full relative bg-[#070a13] p-4 rounded-xl border border-white/[0.04]">
                        <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="matrixGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={analyticsMetric === 'revenue' ? '#eab308' : '#06b6d4'} stopOpacity="0.3" />
                              <stop offset="100%" stopColor={analyticsMetric === 'revenue' ? '#eab308' : '#06b6d4'} stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

                          {/* Dynamic SVG Curves depending on selected node */}
                          {analyticsMetric === 'traffic' && (
                            <>
                              <path d="M 0 120 Q 80 130 160 90 T 320 50 T 420 30 T 500 15 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 120 Q 80 130 160 90 T 320 50 T 420 30 T 500 15" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="15" r="4" fill="#06b6d4" />
                            </>
                          )}
                          {analyticsMetric === 'conversions' && (
                            <>
                              <path d="M 0 135 Q 100 140 200 110 T 350 80 T 500 45 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 135 Q 100 140 200 110 T 350 80 T 500 45" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="45" r="4" fill="#10b981" />
                            </>
                          )}
                          {analyticsMetric === 'revenue' && (
                            <>
                              <path d="M 0 140 Q 120 120 240 80 T 380 40 T 500 10 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 140 Q 120 120 240 80 T 380 40 T 500 10" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="10" r="4" fill="#eab308" />
                            </>
                          )}
                          {analyticsMetric === 'leads' && (
                            <>
                              <path d="M 0 125 Q 100 110 200 130 T 350 50 T 500 35 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 125 Q 100 110 200 130 T 350 50 T 500 35" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="35" r="4" fill="#f43f5e" />
                            </>
                          )}
                          {analyticsMetric === 'seo' && (
                            <>
                              <path d="M 0 80 Q 100 70 200 65 T 350 30 T 500 15 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 80 Q 100 70 200 65 T 350 30 T 500 15" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="15" r="4" fill="#8b5cf6" />
                            </>
                          )}
                          {analyticsMetric === 'google-ads' && (
                            <>
                              <path d="M 0 115 Q 120 90 240 100 T 380 40 T 500 20 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 115 Q 120 90 240 100 T 380 40 T 500 20" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="20" r="4" fill="#3b82f6" />
                            </>
                          )}
                          {analyticsMetric === 'meta-ads' && (
                            <>
                              <path d="M 0 130 Q 100 120 200 110 T 350 65 T 500 35 L 500 150 L 0 150 Z" fill="url(#matrixGlow)" />
                              <path d="M 0 130 Q 100 120 200 110 T 350 65 T 500 35" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="500" cy="35" r="4" fill="#ec4899" />
                            </>
                          )}
                        </svg>
                      </div>

                      {/* Stats sidebar inside chart panel */}
                      <div className="bg-[#141C2D] border border-white/[0.04] p-4 rounded-xl space-y-4 h-full flex flex-col justify-center">
                        <div>
                          <span className="text-[9px] font-mono text-gray-500 uppercase block">Active Data Node:</span>
                          <span className="text-sm font-bold text-white font-mono uppercase block">{analyticsMetric} telemetry</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-gray-500 uppercase block">SLA Baseline:</span>
                          <span className="text-xl font-bold font-mono text-cyan-400 block">
                            {analyticsMetric === 'traffic' && "12,540 Clicks"}
                            {analyticsMetric === 'conversions' && "5.2% CRO"}
                            {analyticsMetric === 'revenue' && "AED 182,000"}
                            {analyticsMetric === 'leads' && "34 submissions"}
                            {analyticsMetric === 'seo' && "98/100 Audits"}
                            {analyticsMetric === 'google-ads' && "4.5x ROAS"}
                            {analyticsMetric === 'meta-ads' && "3.9x ROAS"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                          <span>▲ +14.2%</span>
                          <span className="text-gray-500 font-normal">vs last week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* THE BENTO GRID DASHBOARD WIDGETS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* LEFT COLUMN WIDGET: PERSONAL PRODUCTIVITY WORKSPACE */}
                  <div className="lg:col-span-1 bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] shadow-xl space-y-4 flex flex-col text-left">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-black tracking-wider">Productivity Suite</h4>
                        <p className="text-[9px] text-gray-500 font-mono">Calibrate daily sprints and deep work</p>
                      </div>
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>

                    {/* Pomodoro Timer widget */}
                    <div className="bg-[#070a13] p-4 rounded-xl border border-white/[0.03] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-gray-500 uppercase font-bold">POMODORO WORK TIMER</span>
                        <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-[8px] font-mono rounded">Focus Session</span>
                      </div>
                      <div className="text-center font-mono text-3xl font-black text-white tracking-widest py-1">
                        {Math.floor(pomodoroTime / 60).toString().padStart(2, '0')}:{(pomodoroTime % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setPomodoroActive(!pomodoroActive);
                            showToast(pomodoroActive ? "Pomodoro session paused." : "Pomodoro session launched!", "info");
                          }}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer",
                            pomodoroActive ? "bg-amber-500 text-black" : "bg-cyan-500 text-black hover:bg-cyan-400"
                          )}
                        >
                          {pomodoroActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{pomodoroActive ? "Pause" : "Start Session"}</span>
                        </button>
                        <button
                          onClick={() => {
                            setPomodoroActive(false);
                            setPomodoroTime(1500);
                            showToast("Pomodoro timer reset to 25m.", "info");
                          }}
                          className="px-3 py-1.5 bg-[#141C2D] border border-white/[0.05] hover:bg-black/30 rounded-lg text-[10px] font-mono text-gray-400 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Today's Tasks checklist */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest">Active Sprint Tasks:</span>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                        {tasks.map((t) => (
                          <div 
                            key={t.id} 
                            onClick={() => {
                              setTasks(prev => prev.map(item => item.id === t.id ? { ...item, completed: !item.completed } : item));
                              showToast(t.completed ? "Sprint task reactivated." : "Sprint task completed! Good job.", "success");
                            }}
                            className="flex items-center gap-2.5 p-2 bg-[#141C2D]/60 hover:bg-[#141C2D] rounded-lg border border-white/[0.02] cursor-pointer text-xs text-gray-300 transition-all select-none"
                          >
                            <button className="text-gray-500 hover:text-white">
                              {t.completed ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5 text-gray-500" />}
                            </button>
                            <span className={cn(t.completed && "line-through text-gray-500")}>{t.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add task input */}
                      <div className="flex gap-2">
                        <input 
                          id="new_task_desc"
                          type="text" 
                          placeholder="Draft custom prompt node..."
                          className="flex-1 bg-black/40 border border-white/[0.05] rounded-lg px-2.5 py-1.5 text-[10px] text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = document.getElementById('new_task_desc') as HTMLInputElement;
                              if (input && input.value.trim()) {
                                setTasks(prev => [...prev, { id: Date.now().toString(), text: input.value.trim(), completed: false }]);
                                showToast("New task logged to workspace sprint!", "success");
                                input.value = "";
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('new_task_desc') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setTasks(prev => [...prev, { id: Date.now().toString(), text: input.value.trim(), completed: false }]);
                              showToast("New task logged to workspace sprint!", "success");
                              input.value = "";
                            }
                          }}
                          className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-[9px] rounded-lg"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Scratchpad Note Editor */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest">Workspace Notes Draft:</span>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type personal operational goals or reminders here..."
                        className="w-full bg-black/40 border border-white/[0.05] rounded-xl p-3 text-[10px] text-gray-400 font-mono h-24 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 select-text"
                      />
                    </div>
                  </div>

                  {/* CENTER COLUMN WIDGET: INTERACTIVE KANBAN LEAD PIPELINE */}
                  <div className="lg:col-span-1 bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] shadow-xl space-y-4 flex flex-col text-left">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-emerald-400 font-black tracking-wider">Lead Intake Pipeline</h4>
                        <p className="text-[9px] text-gray-500 font-mono">Simulate regional conversions handshake channels</p>
                      </div>
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>

                    {/* Pipeline Kanban stats summary */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono bg-black/40 p-2 rounded-xl">
                      <div>
                        <span className="text-white font-bold block">{leads.filter(l => l.stage === 'new').length}</span>
                        <span className="text-[8px] text-gray-500 uppercase block">New</span>
                      </div>
                      <div>
                        <span className="text-amber-400 font-bold block">{leads.filter(l => l.stage === 'contacted').length}</span>
                        <span className="text-[8px] text-gray-500 uppercase block">Contact</span>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold block">{leads.filter(l => l.stage === 'proposal').length}</span>
                        <span className="text-[8px] text-gray-500 uppercase block">Proposal</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-bold block">{leads.filter(l => l.stage === 'won').length}</span>
                        <span className="text-[8px] text-gray-500 uppercase block">Won</span>
                      </div>
                    </div>

                    {/* Leads list list */}
                    <div className="space-y-3 flex-1 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
                      {leads.map((l) => (
                        <div key={l.id} className="bg-[#141C2D]/60 p-3 rounded-xl border border-white/[0.02] space-y-2 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-xs font-bold text-white font-sans">{l.name}</h5>
                              <span className="text-[9px] font-mono text-gray-500">{l.email}</span>
                            </div>
                            <span className="text-xs font-bold text-cyan-400 font-mono">{l.value}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="text-gray-400">{l.service}</span>
                            
                            {/* Cycle stage capsule button */}
                            <button
                              onClick={() => {
                                const stages: Array<'new' | 'contacted' | 'proposal' | 'won'> = ['new', 'contacted', 'proposal', 'won'];
                                const currIdx = stages.indexOf(l.stage as any);
                                const nextStage = stages[(currIdx + 1) % stages.length];
                                setLeads(prev => prev.map(item => item.id === l.id ? { ...item, stage: nextStage } : item));
                                showToast(`Shifted ${l.name} status to ${nextStage.toUpperCase()}`, "success");
                              }}
                              className={cn(
                                "px-2 py-0.5 rounded cursor-pointer font-bold border",
                                l.stage === 'new' && "bg-cyan-950/20 border-cyan-500/20 text-cyan-400",
                                l.stage === 'contacted' && "bg-amber-950/20 border-amber-500/20 text-amber-400",
                                l.stage === 'proposal' && "bg-indigo-950/20 border-indigo-500/20 text-indigo-400",
                                l.stage === 'won' && "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                              )}
                            >
                              {l.stage.toUpperCase()} 🔄
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT COLUMN WIDGET: AUTOMATIONS HUB INTEGRATIONS */}
                  <div className="lg:col-span-1 bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] shadow-xl space-y-4 flex flex-col text-left">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-purple-400 font-black tracking-wider">Automation Connect</h4>
                        <p className="text-[9px] text-gray-500 font-mono">Sync leads and telemetry into external sheets</p>
                      </div>
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>

                    {/* Automation search input */}
                    <input 
                      type="text" 
                      placeholder="Search workflow node integrations..."
                      value={automationSearch}
                      onChange={(e) => setAutomationSearch(e.target.value)}
                      className="bg-black/40 border border-white/[0.05] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 font-mono"
                    />

                    {/* Automations list */}
                    <div className="space-y-3 flex-1 max-h-[300px] overflow-y-auto scrollbar-thin">
                      {automations
                        .filter(a => a.name.toLowerCase().includes(automationSearch.toLowerCase()))
                        .map((a) => (
                          <div key={a.id} className="bg-[#141C2D]/60 p-3 rounded-xl border border-white/[0.02] flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-2 rounded-lg border",
                                a.connected ? "bg-purple-950/20 border-purple-500/20 text-purple-400" : "bg-gray-900 border-white/10 text-gray-500"
                              )}>
                                {a.icon === 'Sheet' && <Database className="w-4 h-4" />}
                                {a.icon === 'Zap' && <Zap className="w-4 h-4" />}
                                {a.icon === 'GitMerge' && <GitMerge className="w-4 h-4" />}
                                {a.icon === 'MessageSquare' && <MessageSquare className="w-4 h-4" />}
                                {a.icon === 'BarChart3' && <BarChart3 className="w-4 h-4" />}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white font-sans">{a.name}</h5>
                                <p className="text-[9px] text-gray-500 mt-0.5 font-mono">{a.desc}</p>
                              </div>
                            </div>
                            
                            {/* Toggle toggle switch */}
                            <button
                              onClick={() => {
                                setAutomations(prev => prev.map(item => item.id === a.id ? { ...item, connected: !item.connected } : item));
                                showToast(a.connected ? `Suspended ${a.name} sync` : `Sync successfully connected to ${a.name}!`, a.connected ? "info" : "success");
                              }}
                              className={cn(
                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                a.connected ? "bg-purple-500" : "bg-gray-800"
                              )}
                            >
                              <span className={cn(
                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                a.connected ? "translate-x-4" : "translate-x-0"
                              )} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

                {/* WORKSPACE PRESETS AND CUSTOMIZER CONFIGURATIONS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] shadow-xl text-left grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  
                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-black">Workspace Layout Presets:</span>
                    <div className="grid grid-cols-5 gap-1 bg-black/40 p-1.5 rounded-xl border border-white/[0.04]">
                      {[
                        { id: 'compact', name: 'Dense' },
                        { id: 'comfortable', name: 'Cozy' },
                        { id: 'focus', name: 'Focus' },
                        { id: 'analytics', name: 'Analytics' },
                        { id: 'ai', name: 'AI Core' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setWorkspaceMode(mode.id as any);
                            showToast(`Shifted workspace layout preset to ${mode.name}!`, "success");
                          }}
                          className={cn(
                            "py-1.5 text-center text-[9px] font-mono rounded-lg cursor-pointer transition-all",
                            workspaceMode === mode.id 
                              ? "bg-cyan-500 text-black font-bold font-black" 
                              : "text-gray-400 hover:text-white"
                          )}
                        >
                          {mode.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Themes customize selectors */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-black">Edge Theme Controls:</span>
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-gray-400">
                      <select 
                        value={themeRadius}
                        onChange={(e) => {
                          setThemeRadius(e.target.value as any);
                          showToast(`Adjusted card borders to ${e.target.value}`, "info");
                        }}
                        className="bg-black/40 border border-white/[0.05] rounded-lg p-1.5 focus:outline-none"
                      >
                        <option value="rounded-none">Sharp Borders</option>
                        <option value="rounded-md">Medium Radius</option>
                        <option value="rounded-xl">Classic Cozy</option>
                        <option value="rounded-2xl">Ultra Rounded</option>
                      </select>

                      <select 
                        value={themeFont}
                        onChange={(e) => {
                          setThemeFont(e.target.value as any);
                          showToast(`Adjusted branding font context to ${e.target.value}`, "info");
                        }}
                        className="bg-black/40 border border-white/[0.05] rounded-lg p-1.5 focus:outline-none"
                      >
                        <option value="font-sans">Inter Sans</option>
                        <option value="font-mono">JetBrains Mono</option>
                        <option value="font-serif">Playfair Serif</option>
                      </select>

                      <select 
                        value={themeSpacing}
                        onChange={(e) => {
                          setThemeSpacing(e.target.value as any);
                          showToast(`Configured spacing presets to ${e.target.value}`, "info");
                        }}
                        className="bg-black/40 border border-white/[0.05] rounded-lg p-1.5 focus:outline-none"
                      >
                        <option value="compact">Compact Space</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious Gap</option>
                      </select>
                    </div>
                  </div>

                  {/* Security overview panel */}
                  <div className="flex justify-between items-center bg-[#141C2D]/60 p-3.5 rounded-xl border border-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-400 animate-pulse" />
                      <div>
                        <h5 className="text-[10px] font-bold text-white uppercase font-mono">Secured Cloud Environment</h5>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">SSL Active • 2FA Operational</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        showToast("Revoking and regenerating API keys...", "info");
                        setTimeout(() => showToast("Keys successfully rotated!", "success"), 800);
                      }}
                      className="px-2.5 py-1 bg-black/40 hover:bg-black/60 border border-white/[0.05] text-[9px] font-mono text-gray-400 rounded-lg cursor-pointer"
                    >
                      Rotated Keys 🔑
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ACTIVE TAB: WEBSITE BRAND, LOGO, SOCIALS & SERVICES */}
            {activeTab === 'website-brand-services' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-cyan-400">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Brand, Logo, WhatsApp & Services CMS</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">Configure your global brand identity, logo, social connections, operational details, and dynamic services from this central panel.</p>
                    </div>
                  </div>
                </div>

                {/* 1. BRAND PROFILE & LOGO */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">1. Brand Identity & Header Logo</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Logo Initials (e.g. RS)</label>
                      <input 
                        type="text" 
                        value={brandInfo.logoInitials || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, logoInitials: e.target.value.toUpperCase() }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                        maxLength={4}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Full Brand / Logo Text</label>
                      <input 
                        type="text" 
                        value={brandInfo.logoText || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, logoText: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Brand Tagline / Role (Header)</label>
                      <input 
                        type="text" 
                        value={brandInfo.logoTagline || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, logoTagline: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  {/* LOGO IMAGE / PHOTO SELECTOR AND PREVIEW */}
                  <div className="bg-[#111927] border border-white/[0.04] p-4 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Live logo preview box matching the header style */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0 overflow-hidden">
                          <div className="w-full h-full bg-[#070a13] rounded-[11px] flex items-center justify-center overflow-hidden">
                            {brandInfo.logoImageUrl ? (
                              <img 
                                src={brandInfo.logoImageUrl} 
                                alt="Logo Preview" 
                                className="w-full h-full object-cover rounded-[11px]"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-400 text-base">{brandInfo.logoInitials || 'RS'}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase block">Active Visual Logo</span>
                          <span className="text-xs font-sans text-white font-bold block">
                            {brandInfo.logoImageUrl ? "Photo / Image Logo Enabled" : `Text Initials Monogram ("${brandInfo.logoInitials || 'RS'}")`}
                          </span>
                        </div>
                      </div>

                      {brandInfo.logoImageUrl && (
                        <button 
                          onClick={() => setBrandInfo((prev: any) => ({ ...prev, logoImageUrl: '' }))}
                          className="px-3 py-1.5 bg-red-950/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-black transition-all text-xs font-mono font-bold"
                        >
                          ✕ Use Text Initials Monogram
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Custom Image URL or Photo Link</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={brandInfo.logoImageUrl || ''} 
                          onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, logoImageUrl: e.target.value }))}
                          placeholder="Paste any photo URL or upload custom photo..."
                          className="flex-1 bg-[#0a0f18] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 min-w-0"
                        />
                        <input 
                          id="brand-logo-file-uploader"
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64 = reader.result as string;
                                setBrandInfo((prev: any) => ({ ...prev, logoImageUrl: base64 }));
                                showToast("Brand Logo updated successfully from computer!", "success");
                                
                                // Register in media library
                                const newId = `media-${Date.now()}`;
                                const newItem = {
                                  id: newId,
                                  name: file.name,
                                  url: base64,
                                  size: `${Math.round(file.size / 1024)} KB`,
                                  dimensions: 'Brand Logo',
                                  type: file.type.split('/')[1].toUpperCase()
                                };
                                setMediaItems((prev: any[]) => [newItem, ...prev]);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor="brand-logo-file-uploader"
                          className="px-4 bg-[#141C2D] border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors flex items-center justify-center hover:bg-cyan-950/20 whitespace-nowrap shrink-0"
                        >
                          Upload Photo
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-500 font-sans">You can paste any web link or click &apos;Upload Photo&apos; to load a file directly from your computer.</p>
                    </div>

                    {/* PROFESSIONAL PRESET AVATARS & LOGOS */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-wider">Quick Preset Photo Nodes</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          {
                            label: "Tech Executive Headshot",
                            url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop"
                          },
                          {
                            label: "Modern Cyber Waves",
                            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=300&q=80"
                          },
                          {
                            label: "Fluid Cyan Energy",
                            url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=300&h=300&q=80"
                          },
                          {
                            label: "Cybernetic Grid Sphere",
                            url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=300&h=300&q=80"
                          }
                        ].map((preset) => (
                          <button 
                            key={preset.url}
                            onClick={() => setBrandInfo((prev: any) => ({ ...prev, logoImageUrl: preset.url }))}
                            className={cn(
                              "flex items-center gap-2.5 p-2 bg-[#0a0f18] border rounded-xl text-left hover:border-cyan-500/40 transition-all group",
                              brandInfo.logoImageUrl === preset.url ? "border-cyan-500/50 bg-cyan-950/20" : "border-white/[0.04]"
                            )}
                          >
                            <img 
                              src={preset.url} 
                              alt={preset.label} 
                              className="w-7 h-7 rounded-lg object-cover border border-white/[0.06]"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[10px] font-sans text-gray-400 group-hover:text-white leading-tight truncate">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Footer Corporate Description</label>
                      <textarea 
                        rows={3}
                        value={brandInfo.footerDesc || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, footerDesc: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Footer Operational HQ Location</label>
                      <input 
                        type="text" 
                        value={brandInfo.footerLocation || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, footerLocation: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. DIRECT CHANNELS & WHATSAPP */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">2. Direct Channels & WhatsApp Protocol</span>
                  </div>

                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Set up your primary emails, dial-in phone lines, and WhatsApp connections. A direct WhatsApp click-to-chat action will automatically be enabled in your footer and contact section when populated.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Direct Contact Email</label>
                      <input 
                        type="email" 
                        value={brandInfo.contactEmail || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Direct Call Phone Number</label>
                      <input 
                        type="text" 
                        value={brandInfo.contactPhone || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, contactPhone: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">WhatsApp Number (e.g. +971500000000)</label>
                      <input 
                        type="text" 
                        value={brandInfo.whatsappNumber || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, whatsappNumber: e.target.value }))}
                        placeholder="+971500000000"
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                      />
                      <span className="text-[9px] text-gray-500 block mt-1 font-mono">Include country code without special characters for direct chat links.</span>
                    </div>
                  </div>
                </div>

                {/* 3. SOCIAL MEDIA CHANNELS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3">
                    <LinkIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">3. Social Connect Nodes</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-28 shrink-0">LinkedIn URL:</span>
                      <input 
                        type="text" 
                        value={brandInfo.linkedinUrl || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, linkedinUrl: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-28 shrink-0">Twitter/X URL:</span>
                      <input 
                        type="text" 
                        value={brandInfo.twitterUrl || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, twitterUrl: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-28 shrink-0">Facebook URL:</span>
                      <input 
                        type="text" 
                        value={brandInfo.facebookUrl || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, facebookUrl: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-28 shrink-0">Instagram URL:</span>
                      <input 
                        type="text" 
                        value={brandInfo.instagramUrl || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, instagramUrl: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-28 shrink-0">GitHub URL:</span>
                      <input 
                        type="text" 
                        value={brandInfo.githubUrl || ''} 
                        onChange={(e) => setBrandInfo((prev: any) => ({ ...prev, githubUrl: e.target.value }))}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. SYSTEM EXPERTISE TAGS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">4. System Expertise Core Focuses</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap gap-2 p-4 bg-[#111927] rounded-xl border border-white/[0.04]">
                      {(!brandInfo.systemExpertise || brandInfo.systemExpertise.length === 0) ? (
                        <span className="text-xs font-mono text-gray-500 uppercase">No keywords registered. Add one below.</span>
                      ) : (
                        brandInfo.systemExpertise.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-mono">
                            <span>{item}</span>
                            <button 
                              onClick={() => {
                                setBrandInfo((prev: any) => ({
                                  ...prev,
                                  systemExpertise: (prev.systemExpertise || []).filter((_: any, i: number) => i !== idx)
                                }));
                              }}
                              className="text-gray-500 hover:text-red-400 transition-colors text-xs font-bold font-mono pl-1"
                              title="Delete Keyword"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        placeholder="Add new system expertise tag... (e.g. CRO Strategies)"
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      />
                      <button 
                        onClick={() => {
                          if (!newExpertise.trim()) return;
                          setBrandInfo((prev: any) => ({
                            ...prev,
                            systemExpertise: [...(prev.systemExpertise || []), newExpertise.trim()]
                          }));
                          setNewExpertise('');
                        }}
                        className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 rounded-xl text-xs font-bold font-sans flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Tag
                      </button>
                    </div>
                  </div>
                </div>

                {/* LOGO WALL CMS EDITOR */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">Premium Digital Services & Partner Logos CMS</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newId = `logo-${Date.now()}`;
                        const newLogo = {
                          id: newId,
                          label: 'New Digital Service',
                          subLabel: 'Paid Ads / Liquid',
                          desc: 'Full-funnel campaign optimization.',
                          badge: 'ROI Metric',
                          color: 'cyan',
                          img: 'https://www.google.com/s2/favicons?sz=128&domain=google.com',
                          href: 'https://google.com',
                          visible: true
                        };
                        setLogoWall((prev: any) => [...prev, newLogo]);
                        showToast("Created a new custom service partner logo!", "success");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-sans font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Logo Card
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Manage the premium digital services partner logos shown in Section 3 of your website. You can customize descriptions, badges, custom redirect links, logo images, and glow colors.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {(logoWall || []).map((logo: any) => (
                      <div key={logo.id} className="bg-[#111927] border border-white/[0.05] rounded-2xl p-5 space-y-3 relative">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="text-[9px] font-mono text-gray-600">ID: {logo.id}</span>
                          <button
                            onClick={() => {
                              setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, visible: !l.visible } : l));
                              showToast(`Logo visibility toggled ${!logo.visible ? 'ON' : 'OFF'}.`, 'info');
                            }}
                            className={cn(
                              "px-1.5 py-0.5 rounded font-mono text-[8px] uppercase border",
                              logo.visible ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" : "bg-gray-900 border-gray-800 text-gray-500"
                            )}
                          >
                            {logo.visible ? 'Visible' : 'Hidden'}
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this partner logo?")) {
                                setLogoWall((prev: any[]) => prev.filter(l => l.id !== logo.id));
                                showToast("Removed partner logo card successfully.", "info");
                              }
                            }}
                            className="p-1.5 bg-red-950/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                            title="Delete Logo Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3">
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Service / Brand Label</label>
                            <input 
                              type="text" 
                              value={logo.label || ''} 
                              onChange={(e) => {
                                setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, label: e.target.value } : l));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Category / Sub-label</label>
                            <input 
                              type="text" 
                              value={logo.subLabel || ''} 
                              onChange={(e) => {
                                setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, subLabel: e.target.value } : l));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Brief Description</label>
                            <input 
                              type="text" 
                              value={logo.desc || ''} 
                              onChange={(e) => {
                                setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, desc: e.target.value } : l));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Badge KPI Text</label>
                            <input 
                              type="text" 
                              value={logo.badge || ''} 
                              onChange={(e) => {
                                setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, badge: e.target.value } : l));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Logo URL / Image</label>
                            <div className="flex gap-1.5">
                              <input 
                                type="text" 
                                value={logo.img || ''} 
                                onChange={(e) => {
                                  setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, img: e.target.value } : l));
                                }}
                                className="flex-1 bg-[#0a0f18] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-white font-mono focus:outline-none min-w-0"
                              />
                              <input 
                                id={`logo-upload-${logo.id}`}
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const base64 = reader.result as string;
                                      setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, img: base64 } : l));
                                      showToast(`Logo uploaded for brand "${logo.label}"!`, "success");
                                      
                                      // Register in media library
                                      const newId = `media-${Date.now()}`;
                                      const newItem = {
                                        id: newId,
                                        name: file.name,
                                        url: base64,
                                        size: `${Math.round(file.size / 1024)} KB`,
                                        dimensions: 'Logo Size',
                                        type: file.type.split('/')[1].toUpperCase()
                                      };
                                      setMediaItems((prev: any[]) => [newItem, ...prev]);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`logo-upload-${logo.id}`}
                                className="px-2.5 py-1.5 bg-[#141C2D] border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 rounded-xl text-[10px] font-mono cursor-pointer shrink-0 flex items-center justify-center hover:bg-cyan-950/25 transition-colors"
                                title="Upload logo file"
                              >
                                Upload
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">External Target Link (href)</label>
                            <input 
                              type="text" 
                              value={logo.href || ''} 
                              onChange={(e) => {
                                setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, href: e.target.value } : l));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Highlight Glow Color</label>
                          <div className="flex gap-1.5">
                            {['cyan', 'emerald', 'amber', 'sky', 'rose', 'indigo'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setLogoWall((prev: any[]) => prev.map(l => l.id === logo.id ? { ...l, color: c } : l));
                                }}
                                className={cn(
                                  "w-6 h-6 rounded-full border transition-all flex items-center justify-center text-[8px] font-mono capitalize shrink-0",
                                  logo.color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                                style={{
                                  backgroundColor: c === 'cyan' ? '#06b6d4' : c === 'emerald' ? '#10b981' : c === 'amber' ? '#f59e0b' : c === 'sky' ? '#0ea5e9' : c === 'rose' ? '#f43f5e' : '#6366f1'
                                }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. SERVICES CMS EDITOR */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">5. Core Services Portfolio CMS</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newId = `service-${Date.now()}`;
                        const newServ = {
                          id: newId,
                          title: 'New Service Capability',
                          subtitle: 'Paid Campaigns & Code',
                          desc: 'Describe this service capability, focus areas, deliverables and high scale client solutions in details here.',
                          badge: 'Active SLA',
                          items: ['Custom Feature Deployment', 'System Strategy Optimization'],
                          color: 'from-cyan-500 to-blue-600'
                        };
                        setServices((prev: any) => [...prev, newServ]);
                        showToast("Created a new customizable service! Configure details below.", "info");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-sans font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Service Card
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Control, edit, add, or delete service cards shown on the website body. Each service card contains details, colors, badges, and bullet checklists.
                  </p>

                  <div className="space-y-6 pt-2">
                    {services.map((service: any, sIdx: number) => (
                      <div key={service.id} className="bg-[#111927] border border-white/[0.05] rounded-2xl p-5 space-y-4 relative">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="text-[9px] font-mono text-gray-600">ID: {service.id}</span>
                          <button 
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this service?")) {
                                setServices((prev: any[]) => prev.filter(s => s.id !== service.id));
                                showToast("Removed service successfully.", "info");
                              }
                            }}
                            className="p-1.5 bg-red-950/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-black transition-all"
                            title="Delete Service Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Service Title</label>
                            <input 
                              type="text" 
                              value={service.title || ''} 
                              onChange={(e) => {
                                setServices((prev: any[]) => prev.map(s => s.id === service.id ? { ...s, title: e.target.value } : s));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Service Subtitle</label>
                            <input 
                              type="text" 
                              value={service.subtitle || ''} 
                              onChange={(e) => {
                                setServices((prev: any[]) => prev.map(s => s.id === service.id ? { ...s, subtitle: e.target.value } : s));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Service Summary Description</label>
                            <input 
                              type="text" 
                              value={service.desc || ''} 
                              onChange={(e) => {
                                setServices((prev: any[]) => prev.map(s => s.id === service.id ? { ...s, desc: e.target.value } : s));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Badge Text (e.g. ROI Focused)</label>
                            <input 
                              type="text" 
                              value={service.badge || ''} 
                              onChange={(e) => {
                                setServices((prev: any[]) => prev.map(s => s.id === service.id ? { ...s, badge: e.target.value } : s));
                              }}
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                        </div>

                        {/* Color Theme Selector for Card */}
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1.5">Card Highlight Color Theme Gradient</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'Cyan Cyber Glow', value: 'from-cyan-500 to-blue-600' },
                              { label: 'Emerald Mint', value: 'from-emerald-400 to-teal-600' },
                              { label: 'Purple Neon', value: 'from-purple-500 to-pink-600' },
                              { label: 'Flame Orange', value: 'from-orange-500 to-red-600' },
                              { label: 'Gold Amber', value: 'from-yellow-500 to-orange-600' },
                            ].map((g) => (
                              <button 
                                key={g.value}
                                onClick={() => {
                                  setServices((prev: any[]) => prev.map(s => s.id === service.id ? { ...s, color: g.value } : s));
                                }}
                                className={cn(
                                  "px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-left border transition-all flex items-center gap-1.5",
                                  service.color === g.value 
                                    ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 font-bold" 
                                    : "bg-[#0a0f18] border-white/[0.06] text-gray-400 hover:text-white"
                                )}
                              >
                                <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${g.value}`} />
                                <span>{g.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Service Item Checklist CMS */}
                        <div className="space-y-2 border-t border-white/[0.03] pt-3">
                          <label className="text-[10px] font-mono text-gray-500 uppercase block">Service Deliverables Checklist Items</label>
                          
                          <div className="space-y-1.5">
                            {(!service.items || service.items.length === 0) ? (
                              <span className="text-[11px] font-mono text-gray-600 italic">No checklist deliverables added. Add one below.</span>
                            ) : (
                              service.items.map((item: string, iIdx: number) => (
                                <div key={iIdx} className="flex justify-between items-center bg-[#0a0f18]/80 border border-white/[0.03] px-3 py-1.5 rounded-xl">
                                  <span className="text-xs text-gray-300 font-sans">{item}</span>
                                  <button 
                                    onClick={() => {
                                      setServices((prev: any[]) => prev.map(s => s.id === service.id ? {
                                        ...s,
                                        items: (s.items || []).filter((_: any, i: number) => i !== iIdx)
                                      } : s));
                                    }}
                                    className="text-[10px] font-mono text-red-500 hover:text-red-400 pl-2 transition-colors font-bold"
                                    title="Delete Item"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <input 
                              type="text" 
                              value={newServiceItemTexts[service.id] || ''}
                              onChange={(e) => {
                                setNewServiceItemTexts(prev => ({ ...prev, [service.id]: e.target.value }));
                              }}
                              placeholder="Type checklist item text... (e.g. Core SEO Integration)"
                              className="w-full bg-[#0a0f18] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                            />
                            <button 
                              onClick={() => {
                                const txt = newServiceItemTexts[service.id];
                                if (!txt || !txt.trim()) return;
                                setServices((prev: any[]) => prev.map(s => s.id === service.id ? {
                                  ...s,
                                  items: [...(s.items || []), txt.trim()]
                                } : s));
                                setNewServiceItemTexts(prev => ({ ...prev, [service.id]: '' }));
                              }}
                              className="bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 px-3.5 rounded-xl text-xs font-bold font-sans"
                            >
                              Add Bullet
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: CUSTOM INTEGRATIONS AND TRACKING PIXELS */}
            {activeTab === 'custom-scripts' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-950/30 border border-pink-500/30 rounded-xl">
                      <Terminal className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black font-sans text-white uppercase tracking-tight">Custom Scripts & Tracking Pixels</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">Manage global tracking codes, Facebook Pixels, Google Tag Manager, Google Analytics, and custom code integrations.</p>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-[#1e1520]/40 border border-pink-500/20 p-4 rounded-xl flex gap-3 text-xs text-pink-300">
                  <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">Active Compilation Engine:</span>
                    <p className="text-gray-400 leading-relaxed">
                      Scripts added here will be dynamically injected into the Live Website viewport. You can toggle them active or inactive individually. Remember to click <strong className="text-cyan-400">&quot;Publish Site&quot;</strong> at the top to save changes permanently.
                    </p>
                  </div>
                </div>

                {/* Dynamic List of Registered Pixels/Scripts */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Active Integrations List</span>
                    <button 
                      onClick={() => {
                        const newScript = {
                          id: `custom-${Date.now()}`,
                          name: 'New Custom Script',
                          code: '<!-- Add custom code here -->\n<script>\n  console.log("Custom script loaded");\n</script>',
                          placement: 'head' as const,
                          active: true
                        };
                        setCustomScripts((prev: any[]) => [...prev, newScript]);
                        showToast("Created a new customizable script slot!", "success");
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-black font-sans font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add New Script Slot
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {customScripts.map((script: any, sIdx: number) => (
                      <div key={script.id} className="bg-[#0F1725] border border-white/[0.06] rounded-2xl p-5 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500/50" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-3 pl-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-[#1A1F36] border border-pink-500/20 text-pink-400 px-2 py-1 rounded font-mono uppercase text-[9px] font-bold">Slot {sIdx + 1}</span>
                            <input 
                              type="text"
                              value={script.name}
                              onChange={(e) => {
                                setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? { ...s, name: e.target.value } : s));
                              }}
                              className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-pink-500 text-sm font-bold text-white focus:outline-none font-sans py-0.5 px-1 rounded transition-colors"
                              placeholder="Script Identifier Name"
                            />
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="text-[9px] font-mono text-gray-500">ID: {script.id}</span>
                            
                            {/* Toggle Switch */}
                            <button
                              onClick={() => {
                                setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? { ...s, active: !s.active } : s));
                                showToast(`${script.name} tracking toggled ${!script.active ? 'ON' : 'OFF'}.`, 'info');
                              }}
                              className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                script.active ? "bg-emerald-500" : "bg-gray-700"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                  script.active ? "translate-x-5" : "translate-x-0"
                                )}
                              />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete the custom integration "${script.name}"?`)) {
                                  setCustomScripts((prev: any[]) => prev.filter(s => s.id !== script.id));
                                  showToast(`Deleted script slot "${script.name}".`, 'error');
                                }
                              }}
                              className="p-1.5 bg-red-950/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                              title="Delete Script"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Script configurations */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-2">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Injected Placement Area</label>
                            <select
                              value={script.placement}
                              onChange={(e) => {
                                setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? { ...s, placement: e.target.value as any } : s));
                              }}
                              className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500/50"
                            >
                              <option value="head">HTML &lt;head&gt; (Standard for Pixels / GTM)</option>
                              <option value="body">HTML &lt;body&gt; Start (Noscript Fallbacks)</option>
                              <option value="footer">HTML &lt;body&gt; End / Footer (Chat Widgets)</option>
                            </select>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Preset Autocomplete Templates</label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => {
                                  setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? {
                                    ...s,
                                    name: 'Google Tag Manager',
                                    code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K5BZ29R');</script>
<!-- End Google Tag Manager -->`,
                                    placement: 'head'
                                  } : s));
                                  showToast("Autocompleted with GTM template snippet", "info");
                                }}
                                className="bg-[#111927] border border-white/[0.04] text-[10px] font-mono px-2.5 py-1.5 rounded-lg hover:border-pink-500/30 text-gray-400 hover:text-white transition-all cursor-pointer"
                              >
                                GTM Code
                              </button>
                              <button
                                onClick={() => {
                                  setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? {
                                    ...s,
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
                                    placement: 'head'
                                  } : s));
                                  showToast("Autocompleted with FB Pixel template snippet", "info");
                                }}
                                className="bg-[#111927] border border-white/[0.04] text-[10px] font-mono px-2.5 py-1.5 rounded-lg hover:border-pink-500/30 text-gray-400 hover:text-white transition-all cursor-pointer"
                              >
                                FB Pixel Code
                              </button>
                              <button
                                onClick={() => {
                                  setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? {
                                    ...s,
                                    name: 'Custom CSS Style',
                                    code: `<style>
  /* Inject custom CSS styling here */
  body {
    background-color: #070a13;
  }
</style>`,
                                    placement: 'head'
                                  } : s));
                                  showToast("Autocompleted with custom CSS style block", "info");
                                }}
                                className="bg-[#111927] border border-white/[0.04] text-[10px] font-mono px-2.5 py-1.5 rounded-lg hover:border-pink-500/30 text-gray-400 hover:text-white transition-all cursor-pointer"
                              >
                                CSS Custom Block
                              </button>
                              <button
                                onClick={() => {
                                  setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? {
                                    ...s,
                                    name: 'Google Analytics 4',
                                    code: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8L92J8519B"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8L92J8519B');
</script>`,
                                    placement: 'head'
                                  } : s));
                                  showToast("Autocompleted Google Analytics 4 Template", "info");
                                }}
                                className="bg-[#111927] border border-white/[0.04] text-[10px] font-mono px-2.5 py-1.5 rounded-lg hover:border-pink-500/30 text-gray-400 hover:text-white transition-all cursor-pointer"
                              >
                                GA4 tag
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Editor Textarea */}
                        <div className="pl-2">
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Code Script HTML / Tag Content</label>
                          <div className="relative font-mono rounded-xl overflow-hidden border border-white/[0.08] bg-[#090d16] group/editor focus-within:border-pink-500/50">
                            <div className="flex justify-between items-center bg-[#131926] px-4 py-2 border-b border-white/[0.04] text-[10px]">
                              <span className="text-gray-500 font-bold uppercase tracking-wider font-mono">Terminal Script Content Editor</span>
                              <span className="text-gray-600 font-mono">Lines: {script.code.split('\n').length}</span>
                            </div>
                            <textarea
                              value={script.code}
                              onChange={(e) => {
                                setCustomScripts((prev: any[]) => prev.map(s => s.id === script.id ? { ...s, code: e.target.value } : s));
                              }}
                              className="w-full h-44 bg-transparent p-4 text-xs font-mono text-emerald-400 placeholder-gray-600 focus:outline-none resize-y leading-relaxed"
                              placeholder="<!-- Paste your tracking code, pixel script, widget, or custom JS here -->"
                              spellCheck={false}
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: BLOG CONTENT CMS */}
            {activeTab === 'blog-cms' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black font-sans text-white uppercase tracking-tight">Blog CMS & SEO Suite</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">Design, edit, and launch high-impact SEO blog articles with full metadata controls and visual covers.</p>
                    </div>
                  </div>
                </div>

                {/* Add New Blog Post Button / Form Trigger */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-4">
                    <h3 className="text-xs font-mono uppercase text-amber-400 tracking-wider">Blog Articles Directory</h3>
                    <button
                      onClick={() => {
                        const newId = `blog-${Date.now()}`;
                        const newPost = {
                          id: newId,
                          title: 'New Article Title',
                          slug: 'new-article-slug-' + Math.floor(Math.random()*1000),
                          content: '## Write your rich content here in markdown or clear text.',
                          imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
                          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                          author: brandInfo.logoText || 'Rizwan Saeed',
                          seoTitle: 'SEO Meta Title',
                          seoDescription: 'SEO Meta Description for search engines under 160 characters.',
                          seoKeywords: 'digital marketing, shopify'
                        };
                        setBlogPosts((prev: any) => [newPost, ...prev]);
                        showToast("Created a new blog post template in drafts!", "success");
                      }}
                      className="bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Article</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {(!blogPosts || blogPosts.length === 0) ? (
                      <div className="text-center py-12 border border-dashed border-white/[0.06] rounded-xl text-gray-500 font-mono text-xs">
                        No articles configured. Click Create New Article above to begin.
                      </div>
                    ) : (
                      blogPosts.map((post: any) => (
                        <div key={post.id} className="bg-[#090d16] border border-white/[0.06] rounded-xl p-5 space-y-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.03] pb-3">
                            <div className="flex items-center gap-3">
                              {post.imageUrl && (
                                <div className="w-16 h-12 rounded-lg relative overflow-hidden border border-white/[0.08] bg-black shrink-0">
                                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-sans font-black text-white">{post.title || 'Untitled Article'}</h4>
                                <span className="font-mono text-[10px] text-amber-400/80 mt-0.5 block">slug: /{post.slug} • {post.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setBlogPosts((prev: any) => prev.filter((p: any) => p.id !== post.id));
                                  showToast("Article deleted from drafts.", "info");
                                }}
                                className="p-2 bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-400 rounded-xl transition-all text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-sans">Delete</span>
                              </button>
                            </div>
                          </div>

                          {/* Editable fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Article Title</label>
                                <input
                                  type="text"
                                  value={post.title}
                                  onChange={(e) => {
                                    setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, title: e.target.value } : p));
                                  }}
                                  className="w-full bg-[#0F1725] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Custom Slug (URL path)</label>
                                <input
                                  type="text"
                                  value={post.slug}
                                  onChange={(e) => {
                                    setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') } : p));
                                  }}
                                  className="w-full bg-[#0F1725] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Publish Date</label>
                                  <input
                                    type="text"
                                    value={post.date}
                                    onChange={(e) => {
                                      setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, date: e.target.value } : p));
                                    }}
                                    className="w-full bg-[#0F1725] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Author Name</label>
                                  <input
                                    type="text"
                                    value={post.author}
                                    onChange={(e) => {
                                      setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, author: e.target.value } : p));
                                    }}
                                    className="w-full bg-[#0F1725] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Cover Image URL (Real Work Photo)</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={post.imageUrl}
                                    onChange={(e) => {
                                      setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, imageUrl: e.target.value } : p));
                                    }}
                                    placeholder="Paste photo URL or upload custom photo..."
                                    className="flex-1 bg-[#0F1725] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none font-mono text-xs min-w-0"
                                  />
                                  <input 
                                    id={`blog-cover-uploader-${post.id}`}
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          const base64 = reader.result as string;
                                          setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, imageUrl: base64 } : p));
                                          showToast("Article cover image updated from computer!", "success");
                                          
                                          // Register in media library
                                          const newId = `media-${Date.now()}`;
                                          const newItem = {
                                            id: newId,
                                            name: file.name,
                                            url: base64,
                                            size: `${Math.round(file.size / 1024)} KB`,
                                            dimensions: 'Blog Cover',
                                            type: file.type.split('/')[1].toUpperCase()
                                          };
                                          setMediaItems((prev: any[]) => [newItem, ...prev]);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor={`blog-cover-uploader-${post.id}`}
                                    className="px-4 bg-[#141C2D] border border-amber-500/20 hover:border-amber-500/50 text-amber-400 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors flex items-center justify-center hover:bg-amber-950/20 whitespace-nowrap shrink-0"
                                  >
                                    Upload Photo
                                  </label>
                                </div>
                                <p className="text-[10px] text-gray-500 font-sans mt-1">You can paste any web link or click &apos;Upload Photo&apos; to load a file directly from your computer.</p>
                              </div>
                            </div>

                            {/* SEO metadata column */}
                            <div className="space-y-3 bg-[#0F1725]/50 border border-white/[0.03] p-4 rounded-xl">
                              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black block border-b border-white/[0.03] pb-1.5 mb-2">COMPLETE SEO CONFIG</span>
                              <div>
                                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">SEO Meta Title</label>
                                <input
                                  type="text"
                                  value={post.seoTitle || ''}
                                  onChange={(e) => {
                                    setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, seoTitle: e.target.value } : p));
                                  }}
                                  placeholder="Google tab title..."
                                  className="w-full bg-[#090d16] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono text-gray-400 uppercase flex justify-between items-center mb-1">
                                  <span>SEO Meta Description</span>
                                  <span className={cn("text-[9px]", (post.seoDescription || '').length > 160 ? "text-red-400" : "text-emerald-400")}>
                                    {(post.seoDescription || '').length}/160 chars
                                  </span>
                                </label>
                                <textarea
                                  value={post.seoDescription || ''}
                                  onChange={(e) => {
                                    setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, seoDescription: e.target.value } : p));
                                  }}
                                  rows={2}
                                  placeholder="Google search summary..."
                                  className="w-full bg-[#090d16] border border-white/[0.08] focus:border-amber-500/50 rounded-xl p-3 text-white focus:outline-none text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">SEO Focus Keywords (Comma separated)</label>
                                <input
                                  type="text"
                                  value={post.seoKeywords || ''}
                                  onChange={(e) => {
                                    setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, seoKeywords: e.target.value } : p));
                                  }}
                                  placeholder="shopify development, liquid speed, SEO"
                                  className="w-full bg-[#090d16] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Full Article Content markdown editor */}
                          <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase block">Article Core Content (Markdown supported)</label>
                            <textarea
                              value={post.content}
                              onChange={(e) => {
                                setBlogPosts((prev: any) => prev.map((p: any) => p.id === post.id ? { ...p, content: e.target.value } : p));
                              }}
                              rows={10}
                              className="w-full bg-[#0F1725] border border-white/[0.08] focus:border-amber-500/50 rounded-xl p-4 text-xs font-mono text-gray-300 leading-relaxed focus:outline-none"
                              placeholder="# Write markdown here"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: THEME AND BRAND CUSTOMIZATION */}
            {activeTab === 'theme-config' && (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
                        <Palette className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black font-sans text-white uppercase tracking-tight">Enterprise Control Room Theme Builder</h2>
                        <p className="text-gray-400 text-xs font-mono mt-1">Design, schedule, and persist highly custom visual layouts, design tokens, and templates across the workspace.</p>
                      </div>
                    </div>
                    {/* Unsaved changes notification inside tab */}
                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-[10px] font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>UNSAVED COSMETIC CHANGES</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex flex-wrap gap-1.5 border-b border-white/[0.04] pb-1">
                  {[
                    { id: 'presets', label: 'Template Library', icon: FolderOpen },
                    { id: 'colors', label: 'Color Customizer', icon: Palette },
                    { id: 'typography', label: 'Typography & Spacing', icon: Sliders },
                    { id: 'layout', label: 'Component & Layouts', icon: Settings },
                    { id: 'scheduler', label: 'Theme Scheduler', icon: Clock },
                    { id: 'import-export', label: 'Import / Export', icon: ArrowUpRight },
                  ].map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setThemeSubTab(sub.id as any)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 text-xs font-sans font-bold transition-all rounded-t-xl border-t border-x cursor-pointer",
                          themeSubTab === sub.id
                            ? "bg-[#0F1725] border-white/[0.08] text-white font-black"
                            : "bg-transparent border-transparent text-gray-500 hover:text-gray-300"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Main Visual Editor Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Panel: Active Controls */}
                  <div className="lg:col-span-7 bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg text-left space-y-6">
                    
                    {/* SUB-TAB: PRESETS LIBRARY */}
                    {themeSubTab === 'presets' && (
                      <div className="space-y-6">
                        <div className="border-b border-white/[0.03] pb-3">
                          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Template & Preset Manager</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Select a gorgeous pre-configured aesthetic or craft and duplicate your own templates.</p>
                        </div>

                        {/* Templates List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {templates.map((tpl: any) => {
                            const tplId = tpl.id || tpl.themeId || '';
                            const tplConfig = tpl.config || tpl;
                            const currentThemeId = themeConfig.themeId || themeConfig.id || '';
                            const isActive = (currentThemeId && currentThemeId === tplId) || 
                              (themeConfig.customPrimary === tplConfig.customPrimary && 
                               themeConfig.fontFamily === tplConfig.fontFamily && 
                               themeConfig.themeMode === tplConfig.themeMode);
                            
                            return (
                              <div
                                key={tplId}
                                className={cn(
                                  "p-4 rounded-xl border text-left flex flex-col justify-between h-36 transition-all relative overflow-hidden",
                                  isActive 
                                    ? "bg-cyan-950/20 border-cyan-500/40 text-white shadow-md shadow-cyan-500/5" 
                                    : "bg-black/30 border-white/[0.04] text-gray-400 hover:border-white/10 hover:bg-black/40"
                                )}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-start justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-tight truncate max-w-[80%]">{tpl.name}</h4>
                                    {tpl.isPreset && (
                                      <span className="text-[8px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded uppercase text-gray-400">
                                        Preset
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[9px] text-gray-500 font-mono line-clamp-2">{tpl.description}</p>
                                </div>

                                {/* Preview Dots */}
                                <div className="flex items-center gap-1.5 mt-2">
                                  <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: tplConfig.customPrimary }} title="Primary" />
                                  <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: tplConfig.customSecondary }} title="Secondary" />
                                  <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: tplConfig.backgroundColor }} title="Background" />
                                  <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: tplConfig.cardColor }} title="Card" />
                                  <span className="text-[8px] font-mono text-gray-500 ml-1 truncate max-w-[80px]">{tplConfig.fontFamily || 'Inter'}</span>
                                </div>

                                {/* Actions Block */}
                                <div className="flex items-center justify-between gap-1.5 mt-3 pt-2.5 border-t border-white/[0.03]">
                                  <button
                                    onClick={() => {
                                      setThemeConfig({ 
                                        ...DEFAULT_THEME_CONFIG,
                                        ...tplConfig, 
                                        themeId: tplId 
                                      });
                                      showToast(`Theme loaded: ${tpl.name}!`, "success");
                                    }}
                                    className={cn(
                                      "px-3 py-1 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-colors",
                                      isActive 
                                        ? "bg-cyan-500 text-black hover:bg-cyan-400" 
                                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                                    )}
                                  >
                                    {isActive ? 'Active' : 'Apply'}
                                  </button>

                                  <div className="flex items-center gap-1">
                                    {/* Duplicate */}
                                    <button
                                      onClick={() => {
                                        const dupId = `tpl-${Date.now()}`;
                                        const dup: any = {
                                          ...tpl,
                                          id: dupId,
                                          themeId: dupId,
                                          name: `${tpl.name} (Copy)`,
                                          isPreset: false,
                                        };
                                        const updated = [...templates, dup];
                                        setTemplates(updated);
                                        localStorage.setItem('saas_theme_templates', JSON.stringify(updated));
                                        showToast(`Duplicated ${tpl.name}!`, "success");
                                      }}
                                      title="Duplicate Template"
                                      className="p-1 hover:bg-white/5 text-gray-500 hover:text-white rounded transition-colors cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete custom template */}
                                    {!tpl.isPreset && (
                                      <button
                                        onClick={() => {
                                          const updated = templates.filter((t: any) => (t.id || t.themeId) !== tplId);
                                          setTemplates(updated);
                                          localStorage.setItem('saas_theme_templates', JSON.stringify(updated));
                                          showToast(`Deleted template ${tpl.name}!`, "warning");
                                        }}
                                        title="Delete Template"
                                        className="p-1 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Save Current Design as Template */}
                        <div className="p-4 rounded-xl bg-black/20 border border-white/[0.04] space-y-3">
                          <h4 className="text-[10px] font-mono uppercase text-white font-bold">Save Current Design as Custom Template</h4>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={newTemplateName}
                              onChange={(e) => setNewTemplateName(e.target.value)}
                              placeholder="e.g. My Premium Dark Minimal"
                              className="flex-grow bg-black/40 border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                            />
                            <button
                              onClick={() => {
                                if (!newTemplateName.trim()) {
                                  showToast("Please enter a template name!", "error");
                                  return;
                                }
                                const tplId = `tpl-${Date.now()}`;
                                const newTpl = {
                                  id: tplId,
                                  themeId: tplId,
                                  name: newTemplateName.trim(),
                                  description: "Custom user-saved visual configuration.",
                                  isPreset: false,
                                  config: { ...themeConfig }
                                };
                                const updated = [...templates, newTpl];
                                setTemplates(updated);
                                localStorage.setItem('saas_theme_templates', JSON.stringify(updated));
                                setNewTemplateName('');
                                showToast(`Custom template "${newTpl.name}" saved!`, "success");
                              }}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase rounded-xl transition-colors cursor-pointer"
                            >
                              Save Current
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: COLORS & DESIGN TOKENS */}
                    {themeSubTab === 'colors' && (
                      <div className="space-y-6">
                        <div className="border-b border-white/[0.03] pb-3">
                          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Dynamic Design Color Tokens</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Customize specific component tokens. Any modification updates the style tree instantly in real-time.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          {/* Accent Customizer */}
                          <div className="space-y-4 md:col-span-2 p-4 rounded-xl bg-black/20 border border-white/[0.03]">
                            <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Theme Accent Colors</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-sans text-gray-400 block font-bold">Primary Brand Accent</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={themeConfig.customPrimary || '#06b6d4'}
                                    onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, customPrimary: e.target.value }))}
                                    className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer animate-none"
                                  />
                                  <input 
                                    type="text" 
                                    value={themeConfig.customPrimary || ''}
                                    onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, customPrimary: e.target.value }))}
                                    className="flex-grow bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-sans text-gray-400 block font-bold">Secondary Accent</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={themeConfig.customSecondary || '#10b981'}
                                    onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, customSecondary: e.target.value }))}
                                    className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer animate-none"
                                  />
                                  <input 
                                    type="text" 
                                    value={themeConfig.customSecondary || ''}
                                    onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, customSecondary: e.target.value }))}
                                    className="flex-grow bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Specific Token inputs */}
                          {[
                            { key: 'backgroundColor', label: 'Global Background', defaultVal: '#070a13' },
                            { key: 'surfaceColor', label: 'Component Surface', defaultVal: '#0a0f1d' },
                            { key: 'cardColor', label: 'Grid / Card Background', defaultVal: '#0c1222' },
                            { key: 'sidebarColor', label: 'Dashboard Sidebar bg', defaultVal: '#090d16' },
                            { key: 'navbarColor', label: 'Site Navbar bg', defaultVal: '#0c1222' },
                            { key: 'headerColor', label: 'Page Header bg', defaultVal: '#0c1222' },
                            { key: 'footerColor', label: 'Site Footer bg', defaultVal: '#05080f' },
                            { key: 'borderColor', label: 'Border Color', defaultVal: 'rgba(255, 255, 255, 0.08)' },
                            { key: 'textColor', label: 'Core Body Text', defaultVal: '#f8fafc' },
                            { key: 'textMutedColor', label: 'Muted Description Text', defaultVal: '#94a3b8' },
                            { key: 'iconColor', label: 'Icon Highlight Hue', defaultVal: '#06b6d4' },
                            { key: 'linkColor', label: 'Active Link/CTA Anchor', defaultVal: '#06b6d4' },
                            { key: 'chartColor1', label: 'Chart Primary Node', defaultVal: '#06b6d4' },
                            { key: 'chartColor2', label: 'Chart Secondary Node', defaultVal: '#10b981' },
                          ].map((tok) => (
                            <div key={tok.key} className="space-y-1.5">
                              <label className="text-[10px] font-sans text-gray-400 block font-bold truncate">{tok.label}</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="color" 
                                  value={themeConfig[tok.key] || tok.defaultVal}
                                  onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, [tok.key]: e.target.value }))}
                                  className="w-7 h-7 rounded border border-white/10 bg-transparent cursor-pointer shrink-0 animate-none"
                                />
                                <input 
                                  type="text" 
                                  value={themeConfig[tok.key] || ''}
                                  onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, [tok.key]: e.target.value }))}
                                  className="flex-grow bg-black/40 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: TYPOGRAPHY & SPACING */}
                    {themeSubTab === 'typography' && (
                      <div className="space-y-6">
                        <div className="border-b border-white/[0.03] pb-3">
                          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Typography & Fluid Spacing</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Control web fonts, typography transformations, sizing layouts, and grid gaps.</p>
                        </div>

                        <div className="space-y-5">
                          {/* Font Family Selector */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Primary Typography Font Pairing</label>
                            <select
                              value={themeConfig.fontFamily || 'Inter'}
                              onChange={(e) => {
                                setThemeConfig((prev: any) => ({ ...prev, fontFamily: e.target.value }));
                                showToast(`Heading font updated to ${e.target.value}!`, "info");
                              }}
                              className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                            >
                              <option value="Inter">Inter (Swiss Modern Minimalist)</option>
                              <option value="Space Grotesk">Space Grotesk (Tech Editorial)</option>
                              <option value="Outfit">Outfit (Clean Geometry)</option>
                              <option value="Playfair Display">Playfair Display (Premium Editorial Serif)</option>
                              <option value="Syne">Syne (Creative Avant-Garde)</option>
                              <option value="JetBrains Mono">JetBrains Mono (Sleek Hacker Developer)</option>
                              <option value="Cinzel">Cinzel (Luxury High-End Imperial)</option>
                            </select>
                          </div>

                          {/* Base Text scale */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Base Text Scale & Accessibility</label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { val: '90%', label: 'Small (90%)' },
                                { val: '100%', label: 'Medium (100%)' },
                                { val: '110%', label: 'Large (110%)' },
                                { val: '120%', label: 'Extra Large (120%)' },
                              ].map((sc) => (
                                <button
                                  key={sc.val}
                                  onClick={() => setThemeConfig((prev: any) => ({ ...prev, textScale: sc.val }))}
                                  className={cn(
                                    "p-2.5 rounded-xl border text-[10px] font-mono uppercase cursor-pointer transition-all text-center",
                                    themeConfig.textScale === sc.val || (!themeConfig.textScale && sc.val === '100%')
                                      ? "bg-cyan-950/20 border-cyan-500/50 text-white font-bold"
                                      : "bg-black/30 border-white/[0.04] text-gray-400"
                                  )}
                                >
                                  {sc.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Heading Style transformation */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Heading Case & Spacing Style</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { val: 'normal', label: 'Default / Original' },
                                { val: 'uppercase', label: 'UPPERCASE H1-H3' },
                                { val: 'tracking-wide', label: 'TRACKING WIDE 0.08em' },
                              ].map((hs) => (
                                <button
                                  key={hs.val}
                                  onClick={() => setThemeConfig((prev: any) => ({ ...prev, headingStyle: hs.val }))}
                                  className={cn(
                                    "p-2.5 rounded-xl border text-[10px] font-sans font-bold cursor-pointer transition-all text-center",
                                    themeConfig.headingStyle === hs.val || (!themeConfig.headingStyle && hs.val === 'normal')
                                      ? "bg-cyan-950/20 border-cyan-500/50 text-white"
                                      : "bg-black/30 border-white/[0.04] text-gray-400"
                                  )}
                                >
                                  {hs.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <hr className="border-white/[0.03]" />

                          {/* Layout spacing parameters */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-sans text-gray-400 block font-bold">Grid Gaps & Padding</label>
                              <select
                                value={themeConfig.gridSpacing || '24px'}
                                onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, gridSpacing: e.target.value }))}
                                className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                              >
                                <option value="16px">Dense (16px / Gap-4)</option>
                                <option value="24px">Balanced (24px / Gap-6)</option>
                                <option value="32px">Spacious (32px / Gap-8)</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-sans text-gray-400 block font-bold">Widget Inner Spacing</label>
                              <select
                                value={themeConfig.widgetSpacing || '16px'}
                                onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, widgetSpacing: e.target.value }))}
                                className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                              >
                                <option value="12px">Compact Padding (12px)</option>
                                <option value="16px">Standard Padding (16px)</option>
                                <option value="24px">Luxurious Padding (24px)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: COMPONENT & LAYOUT STYLES */}
                    {themeSubTab === 'layout' && (
                      <div className="space-y-6">
                        <div className="border-b border-white/[0.03] pb-3">
                          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Component Layout Styling</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Define borders, button styling, card modes, and global visual shadows.</p>
                        </div>

                        <div className="space-y-5">
                          {/* Border Radius */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Global Border Radius</label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { val: '0px', label: 'Square' },
                                { val: '8px', label: 'Rounded SM' },
                                { val: '14px', label: 'Default LG' },
                                { val: '24px', label: 'Curvy XL' },
                              ].map((br) => (
                                <button
                                  key={br.val}
                                  onClick={() => setThemeConfig((prev: any) => ({ ...prev, borderRadius: br.val }))}
                                  className={cn(
                                    "p-2.5 rounded-xl border text-[10px] font-mono cursor-pointer transition-all text-center",
                                    themeConfig.borderRadius === br.val || (!themeConfig.borderRadius && br.val === '14px')
                                      ? "bg-cyan-950/20 border-cyan-500/50 text-white font-bold"
                                      : "bg-black/30 border-white/[0.04] text-gray-400"
                                  )}
                                >
                                  {br.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Button Style selector */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Button Layout Aesthetics</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { val: 'rounded', label: 'Inherit Radius' },
                                { val: 'square', label: 'Sharp Sharp Square' },
                                { val: 'pill', label: 'Full Pill-shape' },
                              ].map((bt) => (
                                <button
                                  key={bt.val}
                                  onClick={() => setThemeConfig((prev: any) => ({ ...prev, buttonStyle: bt.val }))}
                                  className={cn(
                                    "p-2.5 rounded-xl border text-[10px] font-sans font-bold cursor-pointer transition-all text-center",
                                    themeConfig.buttonStyle === bt.val || (!themeConfig.buttonStyle && bt.val === 'rounded')
                                      ? "bg-cyan-950/20 border-cyan-500/50 text-white"
                                      : "bg-black/30 border-white/[0.04] text-gray-400"
                                  )}
                                >
                                  {bt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Card aesthetics */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Card Styling Model</label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { val: 'bordered', label: 'Bordered (Default)' },
                                { val: 'flat', label: 'Flat Block' },
                                { val: 'shadowed', label: 'Shadowed Block' },
                                { val: 'glass', label: 'Glassmorphism' },
                              ].map((cd) => (
                                <button
                                  key={cd.val}
                                  onClick={() => setThemeConfig((prev: any) => ({ ...prev, cardStyle: cd.val }))}
                                  className={cn(
                                    "p-2 rounded-xl border text-[10px] font-sans font-bold cursor-pointer transition-all text-center flex flex-col justify-center items-center h-14",
                                    themeConfig.cardStyle === cd.val || (!themeConfig.cardStyle && cd.val === 'bordered')
                                      ? "bg-cyan-950/20 border-cyan-500/50 text-white"
                                      : "bg-black/30 border-white/[0.04] text-gray-400"
                                  )}
                                >
                                  <span className="leading-tight">{cd.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Shadow Intensity */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Shadow Depth Intensity</label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { val: 'none', label: 'None' },
                                { val: 'low', label: 'Low Ambient' },
                                { val: 'medium', label: 'Balanced' },
                                { val: 'high', label: 'Deep Glossy' },
                              ].map((sh) => (
                                <button
                                  key={sh.val}
                                  onClick={() => setThemeConfig((prev: any) => ({ ...prev, shadowIntensity: sh.val }))}
                                  className={cn(
                                    "p-2.5 rounded-xl border text-[10px] font-mono cursor-pointer transition-all text-center",
                                    themeConfig.shadowIntensity === sh.val || (!themeConfig.shadowIntensity && sh.val === 'medium')
                                      ? "bg-cyan-950/20 border-cyan-500/50 text-white font-bold"
                                      : "bg-black/30 border-white/[0.04] text-gray-400"
                                  )}
                                >
                                  {sh.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: SCHEDULER */}
                    {themeSubTab === 'scheduler' && (
                      <div className="space-y-6">
                        <div className="border-b border-white/[0.03] pb-3">
                          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Dynamic Time-of-Day Theme Scheduler</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Automatically toggle the theme engine to follow daytime (Light Mode) and nighttime (Dark Mode) custom hours.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-black/20 border border-white/[0.04] rounded-xl text-left">
                            <div className="space-y-0.5">
                              <span className="text-xs text-white font-bold block">Enable Automated Clock Scheduling</span>
                              <p className="text-[10px] text-gray-500 font-mono leading-relaxed">Overrides system OS parameters and triggers day/night transitions automatically without user interaction.</p>
                            </div>
                            <button
                              onClick={() => {
                                const val = !themeConfig.schedulerEnabled;
                                setThemeConfig((prev: any) => ({ ...prev, schedulerEnabled: val }));
                                showToast(`Theme scheduling ${val ? 'ENABLED' : 'DISABLED'}!`, "info");
                              }}
                              className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                                themeConfig.schedulerEnabled ? "bg-cyan-500" : "bg-white/10"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out",
                                  themeConfig.schedulerEnabled ? "translate-x-5 bg-black" : "translate-x-0 bg-gray-300"
                                )}
                              />
                            </button>
                          </div>

                          {themeConfig.schedulerEnabled && (
                            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/10 border border-white/[0.03] animate-none">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  <span>Daytime Light Mode Start</span>
                                </label>
                                <input
                                  type="time"
                                  value={themeConfig.schedulerLightStart || '07:00'}
                                  onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, schedulerLightStart: e.target.value }))}
                                  className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  <span>Nighttime Dark Mode Start</span>
                                </label>
                                <input
                                  type="time"
                                  value={themeConfig.schedulerLightEnd || '19:00'}
                                  onChange={(e) => setThemeConfig((prev: any) => ({ ...prev, schedulerLightEnd: e.target.value }))}
                                  className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                                />
                              </div>
                            </div>
                          )}

                          <div className="p-4 rounded-xl bg-[#111927] border border-white/[0.04] text-xs text-gray-400 space-y-2 leading-relaxed">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block">Operation telemetry</span>
                            <p>
                              Currently, the time scheduler has evaluated the current device hour as <span className="text-white font-bold font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>.
                            </p>
                            <p>
                              Based on settings, this workspace is automatically mapped to: <span className="text-cyan-400 font-bold uppercase font-mono">{effectiveThemeMode} Mode</span>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: IMPORT/EXPORT */}
                    {themeSubTab === 'import-export' && (
                      <div className="space-y-6">
                        <div className="border-b border-white/[0.03] pb-3">
                          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Design Scheme Transfer Node</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Directly transfer raw design configuration states using JSON code blocks.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Active Theme JSON Config</label>
                            <textarea
                              readOnly
                              value={JSON.stringify(themeConfig, null, 2)}
                              onClick={(e) => (e.target as any).select()}
                              className="w-full h-40 bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-[11px] font-mono text-gray-400 focus:outline-none cursor-pointer"
                              title="Click to select all"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-gray-500">💡 Click inside block to select and copy design states.</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(themeConfig, null, 2));
                                  showToast("Design configuration copied to clipboard!", "success");
                                }}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-mono font-bold uppercase text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Config</span>
                              </button>
                            </div>
                          </div>

                          <hr className="border-white/[0.03]" />

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">Import Theme JSON</label>
                            <textarea
                              value={importJsonText}
                              onChange={(e) => setImportJsonText(e.target.value)}
                              placeholder='Paste theme configuration JSON here...'
                              className="w-full h-28 bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2 text-[11px] font-mono text-white focus:outline-none placeholder-gray-600"
                            />
                            <button
                              onClick={() => {
                                if (!importJsonText.trim()) {
                                  showToast("Please paste custom JSON first!", "error");
                                  return;
                                }
                                try {
                                  const parsed = JSON.parse(importJsonText.trim());
                                  if (typeof parsed !== 'object' || parsed === null) {
                                    showToast("Invalid JSON schema!", "error");
                                    return;
                                  }
                                  setThemeConfig({ ...themeConfig, ...parsed });
                                  setImportJsonText('');
                                  showToast("Dynamic design config imported successfully!", "success");
                                } catch (err) {
                                  showToast("JSON compilation error!", "error");
                                }
                              }}
                              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase rounded-xl transition-colors cursor-pointer"
                            >
                              Import & Apply Config Block
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Panel: Immersive Real-time Design Sandbox Preview */}
                  <div className="lg:col-span-5 bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg text-left space-y-4">
                    <div className="border-b border-white/[0.03] pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-mono uppercase text-white tracking-wider">Dynamic Design Sandbox</h3>
                      </div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/[0.03]">
                        Real-time View
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-normal">
                      This sandbox renders component and layout styles matching your customized options dynamically.
                    </p>

                    {/* MOCK COMPONENT PREVIEW CONTAINER */}
                    <div 
                      className="p-5 rounded-2xl border space-y-5 transition-all text-left relative overflow-hidden"
                      style={{
                        backgroundColor: themeConfig.cardColor || '#0c1222',
                        borderColor: themeConfig.borderColor || 'rgba(255, 255, 255, 0.08)',
                        borderRadius: themeConfig.borderRadius || '14px',
                        boxShadow: themeConfig.shadowIntensity === 'none' ? 'none'
                          : themeConfig.shadowIntensity === 'low' ? '0 2px 8px rgba(0,0,0,0.04)'
                          : themeConfig.shadowIntensity === 'high' ? '0 12px 40px rgba(0,0,0,0.15)'
                          : '0 4px 20px rgba(0,0,0,0.08)',
                        fontFamily: themeConfig.fontFamily === 'Inter' ? 'inherit' : themeConfig.fontFamily,
                      }}
                    >
                      {/* Sub card-item or component block */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span 
                            className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md border"
                            style={{ 
                              color: themeConfig.customPrimary || '#06b6d4',
                              borderColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 25%, transparent)` : 'rgba(6,182,212,0.2)',
                              backgroundColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 8%, transparent)` : 'rgba(6,182,212,0.05)',
                            }}
                          >
                            Dubai Agency Metric
                          </span>
                          <span className="text-[8px] font-mono text-gray-500">Live preview node</span>
                        </div>

                        {/* Heading pairing with dynamic cases */}
                        <h4 
                          className="text-base font-black leading-tight"
                          style={{
                            color: themeConfig.textColor || '#f8fafc',
                            textTransform: themeConfig.headingStyle === 'uppercase' ? 'uppercase' : 'none',
                            letterSpacing: themeConfig.headingStyle === 'tracking-wide' ? '0.08em' : 'normal',
                          }}
                        >
                          Speed Optimized Storefronts
                        </h4>

                        <p 
                          className="text-xs leading-relaxed"
                          style={{ color: themeConfig.textMutedColor || '#94a3b8' }}
                        >
                          Dubai custom Liquid Shopify theme structures and automated performance trackers yielding higher ROI rates.
                        </p>
                      </div>

                      {/* Components: Buttons, Inputs, links */}
                      <div className="space-y-3 pt-3 border-t border-white/[0.04]" style={{ borderColor: themeConfig.borderColor }}>
                        <div className="grid grid-cols-2 gap-2">
                          {/* Solid Button */}
                          <button
                            className="px-3 py-2 text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-default hover:opacity-90"
                            style={{
                              backgroundColor: themeConfig.customPrimary || '#06b6d4',
                              color: '#000000',
                              borderRadius: themeConfig.buttonStyle === 'square' ? '0px'
                                : themeConfig.buttonStyle === 'pill' ? '9999px'
                                : themeConfig.borderRadius || '14px',
                            }}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Solid CTA</span>
                          </button>

                          {/* Secondary Button */}
                          <button
                            className="px-3 py-2 text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-default border"
                            style={{
                              backgroundColor: 'transparent',
                              color: themeConfig.customPrimary || '#06b6d4',
                              borderColor: themeConfig.customPrimary || '#06b6d4',
                              borderRadius: themeConfig.buttonStyle === 'square' ? '0px'
                                : themeConfig.buttonStyle === 'pill' ? '9999px'
                                : themeConfig.borderRadius || '14px',
                            }}
                          >
                            <span>Outline</span>
                          </button>
                        </div>

                        {/* Interactive Link Mimicry */}
                        <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                          <span style={{ color: themeConfig.textMutedColor }}>Consult our team:</span>
                          <span 
                            className="flex items-center gap-1 cursor-default hover:underline font-bold"
                            style={{ color: themeConfig.linkColor || themeConfig.customPrimary || '#06b6d4' }}
                          >
                            <span>Book Consultation</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] space-y-2">
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">Apply Workspace Theme State</span>
                      <p className="text-[10px] text-gray-400 leading-normal">
                        Click the top-right <span className="text-white font-bold">COMPILE & SAVE WORKSPACE</span> to apply these design tokens globally and make them live for clients!
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setThemeConfig({ ...DEFAULT_THEME_CONFIG });
                            showToast("Reset customizer to default theme!", "info");
                          }}
                          className="flex-grow px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Default</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: LEAD INBOX SUBMISSIONS */}
            {activeTab === 'lead-inbox' && (
              <div className="space-y-6 text-left">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-950/30 border border-cyan-500/30 rounded-xl" style={{ borderColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 30%, transparent)` : undefined }}>
                        <Bell className="w-5 h-5 animate-pulse" style={{ color: themeConfig.customPrimary || '#06b6d4' }} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black font-sans text-white uppercase tracking-tight">Handshake Lead Submissions Inbox</h2>
                        <p className="text-gray-400 text-xs font-mono mt-1">Audit, screen, and follow up with luxury hospitality and retail clients submitting through the contact gateway.</p>
                      </div>
                    </div>

                    {/* Summary analytics badges */}
                    <div className="flex gap-2 font-mono text-[10px]">
                      <span className="px-3 py-1 bg-black/30 border border-white/[0.04] text-gray-400 rounded-lg">
                        Total: {inboxSubmissions.length}
                      </span>
                      <span 
                        className="px-3 py-1 bg-cyan-950/20 border rounded-lg font-bold"
                        style={{ 
                          color: themeConfig.customPrimary || '#06b6d4', 
                          borderColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 30%, transparent)` : undefined,
                          backgroundColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 10%, transparent)` : undefined
                        }}
                      >
                        Unread: {inboxSubmissions.filter((s: any) => !s.read).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QUICK COSMETIC TUNING ENGINE */}
                <div 
                  className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4 relative overflow-hidden"
                  style={{ 
                    fontFamily: themeConfig.fontFamily === 'Inter' ? 'inherit' : themeConfig.fontFamily,
                    borderColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 25%, transparent)` : undefined
                  }}
                >
                  <div className="flex items-center gap-2.5 border-b border-white/[0.03] pb-3">
                    <Sliders className="w-4 h-4" style={{ color: themeConfig.customPrimary || '#06b6d4' }} />
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white">Live Inbox Cosmetic & Typography Tuning</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Heading Font */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Inbox Typography Font</label>
                      <select
                        value={themeConfig.fontFamily || 'Inter'}
                        onChange={(e) => {
                          setThemeConfig((prev: any) => ({ ...prev, fontFamily: e.target.value }));
                          showToast(`Inbox font updated to ${e.target.value}!`, "info");
                        }}
                        className="w-full bg-[#111927] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-cyan-500/50"
                        style={{ borderColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 30%, transparent)` : undefined }}
                      >
                        <option value="Inter">Inter (Swiss Modern Minimalist)</option>
                        <option value="Space Grotesk">Space Grotesk (Tech Editorial)</option>
                        <option value="Outfit">Outfit (Clean Geometry)</option>
                        <option value="Playfair Display">Playfair Display (Premium Editorial Serif)</option>
                        <option value="Syne">Syne (Creative Avant-Garde)</option>
                      </select>
                    </div>

                    {/* Primary Accent Color */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Primary Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={themeConfig.customPrimary || '#06b6d4'}
                          onChange={(e) => {
                            setThemeConfig((prev: any) => ({ ...prev, customPrimary: e.target.value }));
                          }}
                          className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={themeConfig.customPrimary || ''}
                          onChange={(e) => {
                            setThemeConfig((prev: any) => ({ ...prev, customPrimary: e.target.value }));
                          }}
                          className="flex-grow bg-black/40 border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                          style={{ borderColor: themeConfig.customPrimary ? `color-mix(in srgb, ${themeConfig.customPrimary} 30%, transparent)` : undefined }}
                          placeholder="#06b6d4"
                        />
                      </div>
                    </div>

                    {/* Secondary Accent Color */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Secondary Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={themeConfig.customSecondary || '#10b981'}
                          onChange={(e) => {
                            setThemeConfig((prev: any) => ({ ...prev, customSecondary: e.target.value }));
                          }}
                          className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={themeConfig.customSecondary || ''}
                          onChange={(e) => {
                            setThemeConfig((prev: any) => ({ ...prev, customSecondary: e.target.value }));
                          }}
                          className="flex-grow bg-black/40 border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                          style={{ borderColor: themeConfig.customSecondary ? `color-mix(in srgb, ${themeConfig.customSecondary} 30%, transparent)` : undefined }}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-gray-500 leading-normal mt-2">
                    💡 <span className="text-gray-400">Tuning font and colors above live-updates both this Lead Inbox layout and the customer-facing portfolio website preview.</span> Click <span className="text-white font-bold">COMPILE & SAVE WORKSPACE</span> on the top right to deploy changes to production.
                  </p>
                </div>

                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-white/[0.03] pb-4">
                    <h3 
                      className="text-xs font-mono uppercase tracking-wider"
                      style={{ color: themeConfig.customPrimary || '#06b6d4' }}
                    >
                      Submissions Log Database
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-500">Quick Actions:</span>
                      <button
                        onClick={() => {
                          if (confirm("Mark all submissions as read?")) {
                            setInboxSubmissions((prev: any[]) => prev.map(s => ({ ...s, read: true })));
                            
                            // Sync to Server API
                            fetch('/api/inbox', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'mark_all_read' })
                            }).catch(err => console.warn("Failed to sync mark all read on server:", err));

                            showToast("All submissions marked read.", "info");
                          }
                        }}
                        className="text-[10px] font-sans hover:underline cursor-pointer font-bold"
                        style={{ color: themeConfig.customPrimary || '#06b6d4' }}
                      >
                        Mark All Read
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(!inboxSubmissions || inboxSubmissions.length === 0) ? (
                      <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-xl text-gray-500 font-mono text-xs space-y-3">
                        <Activity className="w-8 h-8 mx-auto animate-pulse" style={{ color: themeConfig.customPrimary || '#06b6d4', opacity: 0.3 }} />
                        <p className="uppercase tracking-widest text-gray-600">Radar Sweep Online. Zero transmissions logged in buffer.</p>
                      </div>
                    ) : (
                      inboxSubmissions.map((sub: any, idx: number) => {
                        const formatProjectType = (type: string) => {
                          const map: Record<string, string> = {
                            'shopify-development': 'Shopify Custom Liquid Dev',
                            'ads-management': 'Google & Meta Ads Strategy',
                            'seo-audit': 'Technical SEO Crawl Mapping',
                            'all-inclusive': 'All-Inclusive Scale Package',
                          };
                          return map[type] || type?.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'N/A';
                        };

                        const formatBudget = (budget: string) => {
                          const map: Record<string, string> = {
                            'under-5k': 'Under AED 5,000 / month',
                            '5k-15k': 'AED 5,000 - 15,000 / month',
                            '15k-50k': 'AED 15,000 - 50,000 / month',
                            'over-50k': 'Over AED 50,000 / month',
                          };
                          return map[budget] || (budget ? `AED ${budget.replace('-', ' - ')} / month` : 'N/A');
                        };

                        const primaryColor = themeConfig.customPrimary || '#06b6d4';
                        const secondaryColor = themeConfig.customSecondary || '#10b981';
                        const currentFont = themeConfig.fontFamily === 'Inter' ? 'inherit' : themeConfig.fontFamily;

                        return (
                          <div 
                            key={sub.id || idx} 
                            className={cn(
                              "border rounded-2xl p-6 space-y-5 transition-all duration-300 text-left relative overflow-hidden bg-[#0b0f17] shadow-xl",
                              sub.read ? "opacity-75" : ""
                            )}
                            style={{
                              fontFamily: currentFont,
                              borderColor: sub.read 
                                ? 'rgba(255,255,255,0.04)' 
                                : `color-mix(in srgb, ${primaryColor} 25%, transparent)`,
                              boxShadow: sub.read 
                                ? 'none' 
                                : `0 4px 20px color-mix(in srgb, ${primaryColor} 8%, transparent)`
                            }}
                          >
                            {/* Ambient glowing corners */}
                            <div 
                              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none" 
                              style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 3%, transparent)` }}
                            />
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-900 pb-3.5">
                              <div 
                                className="flex items-center space-x-2.5 font-mono text-[10px] uppercase tracking-wider font-bold"
                                style={{ color: primaryColor }}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>TRANSMISSION PROTOCOL: INQUIRY_INTAKE</span>
                                {!sub.read && (
                                  <span 
                                    className="text-black text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded leading-none"
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    LIVE BUFFER UNREAD
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <span className="text-[9px] font-mono text-gray-500">{new Date(sub.timestamp).toLocaleString()}</span>
                                <button
                                  onClick={() => markInboxRead(sub.id)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold uppercase transition-all cursor-pointer border",
                                    sub.read 
                                      ? "bg-black/30 border-white/[0.04] text-gray-500 hover:text-white" 
                                      : "text-black hover:brightness-110"
                                  )}
                                  style={!sub.read ? {
                                    backgroundColor: primaryColor,
                                    borderColor: primaryColor
                                  } : undefined}
                                >
                                  {sub.read ? 'Unread' : 'Mark Read'}
                                </button>
                                <button
                                  onClick={() => deleteInboxItem(sub.id)}
                                  className="p-1.5 bg-red-950/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                                  title="Purge Lead Transmission"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
                              {/* Sender Name */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block font-bold">YOUR NAME</span>
                                <div className="text-xs font-sans font-semibold text-white bg-black/40 px-3 py-2 rounded-xl border border-white/[0.03]">
                                  {sub.name || 'N/A'}
                                </div>
                              </div>

                              {/* Email Address */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block font-bold">EMAIL ADDRESS</span>
                                <div 
                                  className="text-xs font-sans bg-black/40 px-3 py-2 rounded-xl border border-white/[0.03] truncate select-all"
                                  style={{ color: primaryColor }}
                                >
                                  {sub.email || 'N/A'}
                                </div>
                              </div>

                              {/* Company / Current Website URL */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block font-bold">COMPANY OR CURRENT WEBSITE URL</span>
                                <div 
                                  className="text-xs font-sans bg-black/40 px-3 py-2 rounded-xl border border-white/[0.03] truncate select-all"
                                  style={{ color: secondaryColor }}
                                >
                                  {sub.company || 'N/A'}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                              {/* Project Focus */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block font-bold">CORE PROJECT FOCUS / ALIGNMENT</span>
                                <div 
                                  className="text-xs font-mono font-bold px-3.5 py-2 rounded-xl border"
                                  style={{ 
                                    color: primaryColor,
                                    backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${primaryColor} 20%, transparent)`
                                  }}
                                >
                                  {formatProjectType(sub.projectType)}
                                </div>
                              </div>

                              {/* Budget */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block font-bold">TARGET MONTHLY BUDGET</span>
                                <div 
                                  className="text-xs font-mono font-bold px-3.5 py-2 rounded-xl border"
                                  style={{ 
                                    color: secondaryColor,
                                    backgroundColor: `color-mix(in srgb, ${secondaryColor} 10%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${secondaryColor} 20%, transparent)`
                                  }}
                                >
                                  {formatBudget(sub.budget)}
                                </div>
                              </div>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block font-bold">PROJECT REQUIREMENTS & GOALS</span>
                              <div className="text-xs text-gray-300 font-sans leading-relaxed bg-[#05080f] p-4 rounded-xl border border-white/[0.03] select-all whitespace-pre-wrap">
                                {sub.requirements}
                              </div>
                            </div>

                            {/* SSL Active and Follow-up Actions row */}
                            <div className="pt-3 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div 
                                className="flex items-center space-x-2 text-[10px] font-mono"
                                style={{ color: `color-mix(in srgb, ${secondaryColor} 90%, transparent)` }}
                              >
                                <div 
                                  className="w-1.5 h-1.5 rounded-full animate-pulse" 
                                  style={{ backgroundColor: secondaryColor }}
                                />
                                <span>Encrypted SSL Socket Connection Active</span>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <a
                                  href={`mailto:${sub.email}?subject=Strategic Digital Growth Partnership Discussion - Rizwan Saeed&body=Hello ${sub.name},%0D%0DThank you for submitting your project focus regarding ${formatProjectType(sub.projectType)} via my portfolio gateway.%0D%0DI have analyzed your requirements and would love to organize a brief call to align milestones.`}
                                  className="w-1/2 sm:w-auto text-center px-4 py-2 bg-[#111927] hover:bg-white/5 border border-white/10 text-[10px] text-white font-sans font-bold uppercase tracking-wider rounded-xl transition-all"
                                >
                                  Follow up via Email
                                </a>
                                <a
                                  href={`https://wa.me/${whatsappConfig.number.replace(/[^0-9]/g, '')}?text=Hello ${sub.name}, this is Rizwan Saeed. I reviewed your project submission regarding ${formatProjectType(sub.projectType)} and would love to discuss next steps!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-1/2 sm:w-auto text-center px-4 py-2 text-black text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 hover:brightness-110"
                                  style={{
                                    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                                  }}
                                >
                                  <span>Contact on WhatsApp</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: WHATSAPP FLOAT CONFIG */}
            {activeTab === 'whatsapp-config' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black font-sans text-white uppercase tracking-tight">WhatsApp Floating Integration</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">Configure your live WhatsApp floating support bubble, client pre-filled text, agent details, and custom numbers.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column Settings */}
                  <div className="lg:col-span-7 bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-5">
                    <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Integrator Settings</h3>

                    <div className="flex items-center justify-between bg-[#090d16] border border-white/[0.04] p-4 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-white block">Enable Floating Widget</span>
                        <span className="text-[10px] text-gray-500 font-mono">Toggles the WhatsApp button on the bottom-right client viewport.</span>
                      </div>
                      <button
                        onClick={() => {
                          setWhatsappConfig((prev: any) => ({ ...prev, enabled: !prev.enabled }));
                          showToast(`WhatsApp Widget ${!whatsappConfig.enabled ? 'Enabled' : 'Disabled'}`, 'info');
                        }}
                        className={cn(
                          "w-12 h-6 rounded-full p-1 transition-all cursor-pointer relative",
                          whatsappConfig.enabled ? "bg-emerald-500" : "bg-gray-800"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white transition-all",
                          whatsappConfig.enabled ? "translate-x-6" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">WhatsApp Phone Number (With Country Code)</label>
                        <input
                          type="text"
                          value={whatsappConfig.number}
                          onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, number: e.target.value }))}
                          placeholder="+971 50 000 0000"
                          className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Pre-filled Chat Message (Sent by client)</label>
                        <textarea
                          value={whatsappConfig.message}
                          onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, message: e.target.value }))}
                          rows={3}
                          placeholder="Type default prefilled message text..."
                          className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl p-3 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="border-t border-white/[0.03] pt-4 space-y-4">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Bubble Branding Settings</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Agent Name</label>
                            <input
                              type="text"
                              value={whatsappConfig.agentName}
                              onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, agentName: e.target.value }))}
                              className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Agent Status / Subtitle</label>
                            <input
                              type="text"
                              value={whatsappConfig.agentStatus}
                              onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, agentStatus: e.target.value }))}
                              className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Agent Avatar Image URL (Real Photo)</label>
                          <input
                            type="text"
                            value={whatsappConfig.agentAvatar}
                            onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, agentAvatar: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div className="border-t border-white/[0.03] pt-4 space-y-4">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Email & Customer Care Settings</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Support Email Address</label>
                              <input
                                type="email"
                                value={whatsappConfig.supportEmail || ''}
                                onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, supportEmail: e.target.value }))}
                                placeholder="RIZWANSAEED610@gmail.com"
                                className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Support Phone Hotline</label>
                              <input
                                type="text"
                                value={whatsappConfig.supportPhone || ''}
                                onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, supportPhone: e.target.value }))}
                                placeholder="+971 50 000 0000"
                                className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Support Timings (Working Hours)</label>
                              <input
                                type="text"
                                value={whatsappConfig.supportHours || ''}
                                onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, supportHours: e.target.value }))}
                                placeholder="9:00 AM - 6:00 PM (GST)"
                                className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Support Days</label>
                              <input
                                type="text"
                                value={whatsappConfig.supportDays || ''}
                                onChange={(e) => setWhatsappConfig((prev: any) => ({ ...prev, supportDays: e.target.value }))}
                                placeholder="Monday - Saturday"
                                className="w-full bg-[#090d16] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Preview */}
                  <div className="lg:col-span-5 bg-black border border-emerald-500/30 p-6 rounded-[18px] shadow-[0_0_25px_rgba(16,185,129,0.05)] flex flex-col justify-between items-center relative min-h-[400px]">
                    <div className="absolute top-0 left-0 w-full p-3 border-b border-emerald-500/10 bg-emerald-950/20 text-center">
                      <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Interactive Widget Simulation</span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center p-4">
                      {whatsappConfig.enabled ? (
                        <div className="w-72 bg-black rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden">
                          {/* Widget Header */}
                          <div className="bg-gradient-to-r from-emerald-950 via-black to-emerald-950 border-b border-emerald-500/20 p-4 flex items-center gap-3">
                            <div className="relative">
                              {whatsappConfig.agentAvatar ? (
                                <img src={whatsappConfig.agentAvatar} alt="" className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">RS</div>
                              )}
                              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-black rounded-full animate-pulse" />
                            </div>
                            <div className="text-left">
                              <span className="text-emerald-400 text-xs font-sans font-black tracking-wider uppercase block">{whatsappConfig.agentName || 'Support Agent'}</span>
                              <span className="text-[9px] text-gray-400 block font-mono">{whatsappConfig.agentStatus || 'Online'}</span>
                            </div>
                          </div>

                          {/* Widget Body */}
                          <div className="p-4 bg-black min-h-[140px] flex flex-col justify-end">
                            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-left relative shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
                              <span className="text-[11px] text-emerald-300 font-sans leading-relaxed block">
                                {whatsappConfig.message || "Hello Rizwan, I visited your portfolio and want to discuss a project with you!"}
                              </span>
                              <span className="text-[8px] text-emerald-500/60 font-mono text-right block mt-1">Gateway Prompt</span>
                            </div>
                          </div>

                          {/* Widget Action */}
                          <div className="p-3 bg-black border-t border-emerald-500/10 flex justify-between items-center gap-2">
                            <span className="text-[9px] text-gray-500 truncate max-w-[130px] font-mono">{whatsappConfig.number || 'No contact configured'}</span>
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black px-3 py-1.5 rounded-lg text-[9px] font-black font-sans uppercase tracking-wider cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              <MessageCircle className="w-3 h-3 fill-current" />
                              <span>Start Chat</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 border border-dashed border-emerald-500/20 bg-emerald-950/5 rounded-2xl text-emerald-500/60 font-mono text-xs">
                          WhatsApp floating widget is currently set to Inactive. Toggle switch on the left to activate.
                        </div>
                      )}
                    </div>

                    <div className="w-full text-center p-3 border-t border-emerald-500/10 bg-emerald-950/10">
                      <span className="text-[9px] text-gray-500 font-mono">Floating button floats on the right of public viewports.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: MAP & LOCATION SETTINGS */}
            {activeTab === 'map-config' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-950/30 border border-red-500/30 rounded-xl">
                      <MapPin className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black font-sans text-white uppercase tracking-tight">Maps & Location Configuration</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">Configure your physical headquarters coordinates, address, and interactive Google Maps embed widgets.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Settings */}
                  <div className="lg:col-span-6 bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                    <h3 className="text-xs font-mono uppercase text-red-400 tracking-wider">Office Details</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Physical Address Label</label>
                        <input
                          type="text"
                          value={mapConfig.address}
                          onChange={(e) => setMapConfig((prev: any) => ({ ...prev, address: e.target.value }))}
                          placeholder="E.g. Dubai Marina, Dubai, UAE"
                          className="w-full bg-[#090d16] border border-white/[0.08] focus:border-red-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Latitude</label>
                          <input
                            type="text"
                            value={mapConfig.latitude}
                            onChange={(e) => setMapConfig((prev: any) => ({ ...prev, latitude: e.target.value }))}
                            placeholder="25.0763"
                            className="w-full bg-[#090d16] border border-white/[0.08] focus:border-red-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Longitude</label>
                          <input
                            type="text"
                            value={mapConfig.longitude}
                            onChange={(e) => setMapConfig((prev: any) => ({ ...prev, longitude: e.target.value }))}
                            placeholder="55.1311"
                            className="w-full bg-[#090d16] border border-white/[0.08] focus:border-red-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Google Maps Embed URL (Iframe Src)</label>
                        <textarea
                          value={mapConfig.mapEmbedUrl}
                          onChange={(e) => setMapConfig((prev: any) => ({ ...prev, mapEmbedUrl: e.target.value }))}
                          rows={4}
                          placeholder="Paste embed source URL from Google Maps (https://www.google.com/maps/embed?...)"
                          className="w-full bg-[#090d16] border border-white/[0.08] focus:border-red-500/50 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Live Render */}
                  <div className="lg:col-span-6 bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg flex flex-col justify-between">
                    <div className="border-b border-white/[0.03] pb-3 mb-4">
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-black">Interactive Embed Preview</span>
                    </div>

                    <div className="flex-grow rounded-xl overflow-hidden border border-white/[0.08] bg-black min-h-[280px] relative">
                      {mapConfig.mapEmbedUrl ? (
                        <iframe
                          src={mapConfig.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          className="absolute inset-0 border-0"
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs p-6 text-center">
                          Please enter a Google Maps Embed Iframe URL on the left to load the map preview.
                        </div>
                      )}
                    </div>

                    <div className="mt-4 bg-[#090d16] p-3 rounded-xl border border-white/[0.04]">
                      <span className="text-[10px] font-mono text-gray-500 block uppercase mb-1">Active Output Address:</span>
                      <p className="text-xs text-white font-sans font-bold">{mapConfig.address || 'No location configured'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 2: HERO CONFIGS & DESIGN */}
            {activeTab === 'website-hero' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Main Hero & Design Customizer</h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">Configure first-impression title headers, biography sub-copy, CTA, and styling presets.</p>
                </div>

                {/* THEME SELECTOR & PRESET GLOW ACCENTS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>Design Accent Color & Theme Presets</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
                    <div className="space-y-2">
                      <span className="text-gray-400">Workspace Glow Accent:</span>
                      <div className="flex items-center gap-2 pt-1">
                        {['cyan', 'emerald', 'purple', 'indigo', 'rose', 'blue'].map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              setAccentColor(c);
                              showToast(`Accent glow changed to ${c}!`, 'info');
                            }}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 transition-all cursor-pointer relative",
                              c === 'cyan' && "bg-cyan-500 border-cyan-300",
                              c === 'emerald' && "bg-emerald-500 border-emerald-300",
                              c === 'purple' && "bg-purple-500 border-purple-300",
                              c === 'indigo' && "bg-indigo-500 border-indigo-300",
                              c === 'rose' && "bg-rose-500 border-rose-300",
                              c === 'blue' && "bg-blue-500 border-blue-300",
                              accentColor === c ? "scale-125 ring-2 ring-white/50" : "opacity-75 hover:opacity-100"
                            )}
                            title={`${c} accent`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-gray-400">Visual Aesthetic Preset:</span>
                      <div className="flex gap-2">
                        {['default', 'cyberpunk', 'minimalist'].map(p => (
                          <button
                            key={p}
                            onClick={() => {
                              setThemePreset(p);
                              showToast(`Visual layout updated to ${p}`, 'info');
                            }}
                            className={cn(
                              "px-3 py-1.5 border rounded-lg uppercase text-[10px] font-bold cursor-pointer transition-all",
                              themePreset === p ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-[#141C2D] border-white/[0.04] text-gray-400 hover:text-white"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* HERO COPY EDITOR & AI INTEGRATION */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                    <PenTool className="w-4 h-4" />
                    <span>Hero Copywriting Assets</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Main Title Headline</label>
                      <button
                        onClick={() => handleGenerateAiCopy('headline', `Generate a punchy growth-focused hero title about Rizwan Saeed digital marketing and Shopify. Current headline: ${hero.headline}`, 'headline', (val) => handleHeroChange('headline', val))}
                        className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-950/80 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        disabled={isAiGenerating['headline']}
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span>{isAiGenerating['headline'] ? "AI Writing..." : "✨ AI Rewrite Title"}</span>
                      </button>
                    </div>
                    <input 
                      type="text"
                      value={hero.headline}
                      onChange={(e) => handleHeroChange('headline', e.target.value)}
                      className="w-full h-11 bg-[#141C2D] border border-[#243149] focus:border-cyan-400 rounded-xl px-4 text-xs text-white focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Glow Accent Highlighted Title</label>
                      <button
                        onClick={() => handleGenerateAiCopy('headlineAccent', `Generate a premium 3-word digital marketing slogan. Current: ${hero.headlineAccent}`, 'headline', (val) => handleHeroChange('headlineAccent', val))}
                        className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-950/80 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        disabled={isAiGenerating['headlineAccent']}
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span>{isAiGenerating['headlineAccent'] ? "AI Writing..." : "✨ AI Generate"}</span>
                      </button>
                    </div>
                    <input 
                      type="text"
                      value={hero.headlineAccent}
                      onChange={(e) => handleHeroChange('headlineAccent', e.target.value)}
                      className="w-full h-11 bg-[#141C2D] border border-[#243149] focus:border-cyan-400 rounded-xl px-4 text-xs text-white focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Executive biography subheadline description</label>
                      <button
                        onClick={() => handleGenerateAiCopy('subheadline', `Generate a highly professional executive biography for Rizwan Saeed highlighting ad spend portfolio and CRO results. Current: ${hero.subheadline}`, 'case_study', (val) => handleHeroChange('subheadline', val))}
                        className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-950/80 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        disabled={isAiGenerating['subheadline']}
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span>{isAiGenerating['subheadline'] ? "AI Optimizing..." : "✨ AI Refine Biography"}</span>
                      </button>
                    </div>
                    <textarea 
                      rows={4}
                      value={hero.subheadline}
                      onChange={(e) => handleHeroChange('subheadline', e.target.value)}
                      className="w-full bg-[#141C2D] border border-[#243149] focus:border-cyan-400 rounded-xl p-4 text-xs text-white focus:outline-none transition-all font-sans leading-relaxed"
                    />
                  </div>

                  {/* Biography Profile Photo Editor */}
                  <div className="space-y-3 pt-4 border-t border-white/[0.04]">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Biography Profile Photo URL</label>
                      <span className="text-[9px] font-mono text-cyan-400">Live preview below</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Image Thumbnail with cyber styling */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-800 bg-black/40 flex-shrink-0">
                        <Image
                          src={hero.profileImage || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"}
                          alt="Profile Preview"
                          fill
                          unoptimized
                          className="object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>

                      {/* URL input and Presets */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Paste image URL or upload custom photo..."
                            value={hero.profileImage || ""}
                            onChange={(e) => handleHeroChange('profileImage', e.target.value)}
                            className="flex-1 h-10 bg-[#141C2D] border border-[#243149] focus:border-cyan-400 rounded-xl px-4 text-xs text-white focus:outline-none transition-all font-mono min-w-0"
                          />
                          <input 
                            id="bio-avatar-file-uploader"
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64 = reader.result as string;
                                  handleHeroChange('profileImage', base64);
                                  showToast("Bio Profile Photo updated successfully!", "success");
                                  
                                  // Register in media library
                                  const newId = `media-${Date.now()}`;
                                  const newItem = {
                                    id: newId,
                                    name: file.name,
                                    url: base64,
                                    size: `${Math.round(file.size / 1024)} KB`,
                                    dimensions: 'Bio Avatar',
                                    type: file.type.split('/')[1].toUpperCase()
                                  };
                                  setMediaItems((prev: any[]) => [newItem, ...prev]);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label 
                            htmlFor="bio-avatar-file-uploader"
                            className="h-10 px-4 bg-[#141C2D] border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors flex items-center justify-center hover:bg-cyan-950/20 whitespace-nowrap shrink-0"
                          >
                            Upload Photo
                          </label>
                        </div>
                        
                        {/* Quick Presets */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-gray-500 uppercase block">Quick Avatar Presets</span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: 'Original', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' },
                              { label: 'Tech Pro', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
                              { label: 'Modern Exec', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
                              { label: 'Creative', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
                              { label: 'Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleHeroChange('profileImage', preset.url)}
                                className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-mono border transition-all cursor-pointer",
                                  hero.profileImage === preset.url 
                                    ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 font-bold" 
                                    : "bg-gray-950/60 border-white/[0.04] text-gray-400 hover:text-white"
                                )}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VERIFICATION COUNTERS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Interactive Verification Badges</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {statsMetrics.map((stat: any) => (
                      <div key={stat.id} className="bg-[#141C2D]/80 border border-white/[0.03] p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">{stat.label}</span>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                            className="w-1/3 bg-[#070a13] border border-white/[0.06] text-cyan-400 rounded px-2 py-1 text-xs font-bold text-center"
                          />
                          <input 
                            type="text"
                            value={stat.desc}
                            onChange={(e) => handleStatChange(stat.id, 'desc', e.target.value)}
                            className="w-2/3 bg-[#070a13] border border-white/[0.06] text-gray-400 rounded px-2 py-1 text-[10px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 3: CASE STUDIES PORTFOLIO */}
            {activeTab === 'website-cases' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Enterprise Client Case Studies</h2>
                    <p className="text-gray-400 text-xs font-mono mt-1">Refine regional ecommerce audits, Shopify rebuilds, and verified growth outcomes.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <select
                      value={selectedCaseId}
                      onChange={(e) => setSelectedCaseId(e.target.value)}
                      className="bg-[#141C2D] border border-white/[0.08] text-xs text-white rounded-lg p-2.5 font-mono"
                    >
                      {clientsPortfolio.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => {
                        const newId = `c-${Date.now()}`;
                        const newCase = {
                          id: newId,
                          name: 'newbrand.ae',
                          category: 'Shopify',
                          tag: 'Shopify & PPC',
                          metrics: '3.5x ROAS Boost',
                          highlight: true,
                          challenge: 'High cost-per-acquisition and static sales velocity in competitive GCC retail spaces.',
                          strategy: 'Deployed reusable theme blocks for instant CRO and refined ad retargeting pipelines.',
                          outcomes: 'Drove 120% transaction growth inside 60 days with complete WhatsApp integration.',
                          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
                        };
                        setClientsPortfolio((prev: any) => [...prev, newCase]);
                        setSelectedCaseId(newId);
                        showToast("Created a new case study draft! Click 'Publish Site' to finalize.", "success");
                      }}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-bold font-sans text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>

                    {clientsPortfolio.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete the case study "${activeCaseStudy?.name || ''}"?`)) {
                            const remaining = clientsPortfolio.filter((c: any) => c.id !== selectedCaseId);
                            setClientsPortfolio(remaining);
                            setSelectedCaseId(remaining[0]?.id || '');
                            showToast("Deleted case study from draft list.", "info");
                          }
                        }}
                        className="p-2 bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-black rounded-lg transition-all cursor-pointer"
                        title="Delete Active Case Study"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {activeCaseStudy && (
                  <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Client Brand Name</label>
                        <input 
                          type="text"
                          value={activeCaseStudy.name}
                          onChange={(e) => handleCaseChange('name', e.target.value)}
                          className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Specialization Tag</label>
                        <input 
                          type="text"
                          value={activeCaseStudy.tag}
                          onChange={(e) => handleCaseChange('tag', e.target.value)}
                          className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-cyan-400 font-mono mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Growth Outcomes</label>
                        <input 
                          type="text"
                          value={activeCaseStudy.metrics}
                          onChange={(e) => handleCaseChange('metrics', e.target.value)}
                          className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-emerald-400 font-bold font-mono mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Specialty Category</label>
                        <select
                          value={activeCaseStudy.category || 'Shopify'}
                          onChange={(e) => handleCaseChange('category', e.target.value)}
                          className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono mt-1"
                        >
                          <option value="Shopify">Shopify & E-com</option>
                          <option value="carpet">Carpet & Furnishings</option>
                          <option value="curtain">Curtains & Blinds</option>
                        </select>
                      </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase block">Real Work Photo URL / Direct Upload</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text"
                            value={activeCaseStudy.imageUrl || ''}
                            onChange={(e) => handleCaseChange('imageUrl', e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="flex-1 bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono mt-1"
                          />
                          <div className="relative shrink-0 mt-1">
                            <input
                              type="file"
                              accept="image/*"
                              id="case-study-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    showToast("File is too large! Please choose an image under 2MB.", "error");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64 = reader.result as string;
                                    handleCaseChange('imageUrl', base64);
                                    showToast("Photo uploaded and converted successfully!", "success");
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label
                              htmlFor="case-study-upload"
                              className="px-4 py-3 bg-cyan-950/40 border border-cyan-800/30 hover:border-cyan-400 hover:bg-cyan-900/20 text-cyan-400 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer h-full transition-all"
                            >
                              <span>Upload Photo</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        {activeCaseStudy.imageUrl && (
                          <div className="w-16 h-12 rounded-lg border border-white/[0.08] overflow-hidden bg-black shrink-0 relative group">
                            <img src={activeCaseStudy.imageUrl} alt="preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => {
                                handleCaseChange('imageUrl', '');
                                showToast("Removed photo.", "info");
                              }}
                              className="absolute inset-0 bg-red-950/80 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-mono font-bold uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!activeCaseStudy.highlight}
                              onChange={(e) => handleCaseChange('highlight', e.target.checked as any)}
                              className="rounded border-[#243149] bg-[#141C2D] text-cyan-500 focus:ring-0 cursor-pointer w-4 h-4"
                            />
                            <div className="flex flex-col">
                              <span className="text-cyan-400 font-bold text-xs uppercase tracking-tight">VIP Highlight Status</span>
                              <span className="text-[9px] text-gray-500 font-normal">Apply premium gradient background and custom neon glowing effects</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-red-400 uppercase font-bold">{"// The Core Challenge"}</label>
                        <button
                          onClick={() => handleGenerateAiCopy('challenge', `Optimize this case study challenge for high-tier agency portfolio. Brand: ${activeCaseStudy.name}. Challenge: ${activeCaseStudy.challenge}`, 'case_study', (val) => handleCaseChange('challenge', val))}
                          className="text-[9px] text-cyan-400 flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Optimize copy
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        value={activeCaseStudy.challenge}
                        onChange={(e) => handleCaseChange('challenge', e.target.value)}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-gray-300 font-sans mt-1 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{"// Rizwan's Optimization Strategy"}</label>
                        <button
                          onClick={() => handleGenerateAiCopy('strategy', `Optimize this marketing strategy for high-tier agency portfolio. Brand: ${activeCaseStudy.name}. Strategy: ${activeCaseStudy.strategy}`, 'case_study', (val) => handleCaseChange('strategy', val))}
                          className="text-[9px] text-cyan-400 flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Optimize copy
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        value={activeCaseStudy.strategy}
                        onChange={(e) => handleCaseChange('strategy', e.target.value)}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-gray-300 font-sans mt-1 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold">{"// Verified Outcomes metrics"}</label>
                        <button
                          onClick={() => handleGenerateAiCopy('outcomes', `Optimize this outcomes description for high-tier agency portfolio. Brand: ${activeCaseStudy.name}. Outcomes: ${activeCaseStudy.outcomes}`, 'case_study', (val) => handleCaseChange('outcomes', val))}
                          className="text-[9px] text-cyan-400 flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Optimize copy
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        value={activeCaseStudy.outcomes}
                        onChange={(e) => handleCaseChange('outcomes', e.target.value)}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-gray-300 font-sans mt-1 leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVE TAB 4: REVIEWS & FAQS ACCORDION */}
            {activeTab === 'website-reviews' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Verified Reviews & FAQs Accordions</h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">Configure client endorsements and regional technical questions with instant drafts.</p>
                </div>

                {/* RECORD NEW REVIEW FORM */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">Add Brand Endorsement Review</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      placeholder="Founder / Representative Name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Designation Role"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                      className="bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Company Name"
                      value={newTestimonial.company}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Tag / Niche</label>
                      <select 
                        value={newTestimonial.tag}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                      >
                        <option value="E-commerce">E-commerce</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Lead Gen">Lead Gen</option>
                        <option value="SEO Audit">SEO Audit</option>
                        <option value="Paid Media">Paid Media</option>
                        <option value="Shopify Plus">Shopify Plus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Star Rating</label>
                      <select 
                        value={newTestimonial.rating}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value, 10) }))}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Client Avatar Image URL</label>
                      <input 
                        type="text" 
                        placeholder="Or upload photo below..."
                        value={newTestimonial.imageUrl}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Key Achievement Stat</label>
                      <input 
                        type="text" 
                        placeholder="e.g., +48% or 4.5x"
                        value={newTestimonial.metric || ''}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, metric: e.target.value }))}
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Real Photo Uploader */}
                  <div className="bg-[#141C2D] border border-[#243149] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="text-[11px] font-mono uppercase text-cyan-400 block font-bold">Upload Client Photo</span>
                      <p className="text-[10px] text-gray-400 font-sans mt-0.5">Choose a real JPG/PNG photo from your device. It will be saved as a local URL in your workspace draft.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                      <input 
                        id="client-photo-uploader"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewTestimonial(prev => ({ ...prev, imageUrl: reader.result as string }));
                              showToast("Client photo loaded successfully!", "success");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="client-photo-uploader"
                        className="px-3.5 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-300 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors block text-center w-full sm:w-auto hover:text-white"
                      >
                        Choose File
                      </label>
                      
                      {newTestimonial.imageUrl && (
                        <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden border border-emerald-500/30 bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={newTestimonial.imageUrl} 
                            alt="Avatar Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <textarea 
                    rows={2}
                    placeholder="Provide the exact review body quote from client..."
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-sans focus:outline-none"
                  />
                  
                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={handleAddTestimonial}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-sans font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert Review Draft</span>
                    </button>
                  </div>
                </div>

                {/* MANAGE EXISTING TESTIMONIALS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-2">
                    <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Manage Existing Endorsements ({testimonials?.length || 0})</h3>
                    <span className="text-[9px] font-mono text-gray-500">Changes will be deployed upon clicking &quot;Save Changes&quot;</span>
                  </div>
                  
                  {testimonials && testimonials.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {testimonials.map((t: any, index: number) => (
                        <div key={t.id || index} className="bg-[#141C2D]/50 border border-[#243149]/40 rounded-xl p-4 flex items-start justify-between gap-4 text-left">
                          <div className="flex items-start gap-3">
                            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/[0.08] bg-black/60 flex items-center justify-center shrink-0">
                              {t.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={t.imageUrl} 
                                  alt={t.name} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-[10px] font-mono font-bold text-gray-400">
                                  {t.name ? t.name.split(' ').map((n: any) => n[0]).join('') : 'U'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-white uppercase font-mono">{t.name}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-gray-900 text-cyan-400 rounded-md border border-gray-800 uppercase font-bold">
                                  {t.tag || 'E-commerce'}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 block font-mono mt-0.5">{t.role} @ <strong className="text-emerald-400 font-bold">{t.company}</strong></span>
                              <div className="flex items-center gap-0.5 mt-1">
                                {[...Array(t.rating || 5)].map((_, i) => (
                                  <span key={i} className="text-amber-400 text-[10px]">★</span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400 font-sans mt-2 leading-relaxed italic">&quot;{t.content}&quot;</p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setTestimonials((prev: any) => prev.filter((item: any, idx: number) => item.id ? item.id !== t.id : idx !== index));
                              showToast(`Removed review from "${t.name}". Click "Save Changes" to apply.`, 'info');
                            }}
                            className="p-1.5 bg-red-950/20 hover:bg-red-500/20 border border-red-900/30 hover:border-red-500/50 rounded-lg text-red-400 transition-all cursor-pointer shrink-0"
                            title="Delete endorsement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-white/[0.05] rounded-xl text-gray-500 text-xs font-mono">
                      No customer reviews configured in workspace.
                    </div>
                  )}
                </div>

                {/* DEPLOY FAQ ACCORDION FORM */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Add Accordion Technical FAQ</h3>
                  <input 
                    type="text" 
                    placeholder="Enter frequently asked GSC, Shopify or marketing question..."
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono"
                  />
                  <textarea 
                    rows={2}
                    placeholder="Enter optimized answer with clear structural metrics..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-sans"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleAddFaq}
                      className="px-4 py-2 bg-[#141C2D] border border-emerald-500/30 text-emerald-400 font-sans font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Deploy FAQ Draft</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 5: GSC SEO CENTER */}
            {activeTab === 'seo-center' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">GSC SEO Center & Core Node Controller</h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">Register verified custom search domains, review active keyword metrics, and generate SEO titles via Gemini.</p>
                </div>

                {/* AI METADATA HELPER BLOCK */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI SEO Metadata Tags Generator</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-2">
                      <label className="text-gray-400 block">Enter Target Keywords (Separated by comma)</label>
                      <input 
                        type="text" 
                        id="ai-seo-keywords"
                        placeholder="Shopify developer Dubai, SEO audits GCC"
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => {
                          const val = (document.getElementById('ai-seo-keywords') as HTMLInputElement).value;
                          if (!val) { showToast("Provide keywords first", "error"); return; }
                          handleGenerateAiCopy('seo', `Generate fully-optimized Title tag (<60 char) and Meta Description (<160 char) utilizing these keywords: ${val}. Separate title and description with '---'.`, 'seo', (res) => {
                            const parts = res.split('---');
                            showToast(`Title & description suggested: \n${parts[0]}`, 'info');
                          });
                        }}
                        className="w-full h-11 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Optimized Title & Meta tags</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* REGISTER DOMAIN FORM */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-4">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Register Custom SEO GSC Node</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. hospitalityresorts.ae"
                      value={newPropKey}
                      onChange={(e) => setNewPropKey(e.target.value)}
                      className="bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white font-mono"
                    />
                    <button 
                      onClick={handleAddProperty}
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#070a13] font-black rounded-xl p-3 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Register GSC Node</span>
                    </button>
                  </div>
                </div>

                {/* DOMAINS CONTROLLER LIST TABLE */}
                <div className="bg-[#0F1725] border border-white/[0.06] shadow-xl rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="bg-[#141C2D] border-b border-white/[0.06] text-gray-400 text-[10px] uppercase font-bold">
                          <th className="p-4">Domain Node</th>
                          <th className="p-4">Clicks</th>
                          <th className="p-4">Impressions</th>
                          <th className="p-4">CTR</th>
                          <th className="p-4">Avg Pos</th>
                          <th className="p-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(analyticsProperties).map(key => {
                          const p = analyticsProperties[key];
                          return (
                            <tr key={key} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                              <td className="p-4 font-bold text-white">{key}</td>
                              <td className="p-4 text-cyan-400 font-bold">{p.clicks}</td>
                              <td className="p-4 text-purple-400">{p.impressions}</td>
                              <td className="p-4 text-emerald-400 font-bold">{p.ctr}</td>
                              <td className="p-4 text-gray-300">{p.position}</td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteProperty(key)} className="text-red-400 hover:text-red-300 p-1">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 6: ROI MATH PROJECTIONS */}
            {activeTab === 'marketing-roi' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Attribution ROI Math & Projections</h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">Configure baseline acquisition algorithms, pixel boosts, and revenue projection metrics in real time.</p>
                </div>

                {/* FORMULA TUNING SLIDERS */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg space-y-6">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">ROI Coefficients Tuner</h3>
                  
                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Baseline B2B cost per Lead (CPL):</span>
                        <span className="text-cyan-400 font-bold">AED {roiSettings.b2bDefaultCPL}</span>
                      </div>
                      <input 
                        type="range" 
                        min="15" 
                        max="150" 
                        value={roiSettings.b2bDefaultCPL} 
                        onChange={(e) => handleRoiChange('b2bDefaultCPL', parseInt(e.target.value))}
                        className="w-full accent-cyan-400 bg-gray-950 h-1 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Server-Side Pixel Tracking Lead Boost:</span>
                        <span className="text-emerald-400 font-bold">+{roiSettings.b2bServerSideBoost}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="80" 
                        value={roiSettings.b2bServerSideBoost} 
                        onChange={(e) => handleRoiChange('b2bServerSideBoost', parseInt(e.target.value))}
                        className="w-full accent-emerald-400 bg-gray-950 h-1 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* MATH PROJECTIONS ACCORDION VIEW */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-xl space-y-4">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Live Projected Revenue Model</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#141C2D] p-4 rounded-xl border border-white/[0.04]">
                      <span className="text-gray-500 block text-[9px] uppercase">Projected Leads</span>
                      <div className="text-2xl font-black text-white mt-1">{dynamicMathCalculations.projectedLeads}</div>
                      <span className="text-[9.5px] text-emerald-400 mt-1 block">✓ Server container optimized</span>
                    </div>

                    <div className="bg-[#141C2D] p-4 rounded-xl border border-white/[0.04]">
                      <span className="text-gray-500 block text-[9px] uppercase">Calculated Pipeline Revenue</span>
                      <div className="text-2xl font-black text-emerald-400 mt-1">AED {dynamicMathCalculations.revenueValue}</div>
                      <span className="text-[9.5px] text-gray-500 mt-1 block">ROAS model coefficient 4.2x</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 7: GA4 TRAFFIC GRAPH & CHANNELS */}
            {activeTab === 'analytics-insights' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">GA4 Interactive Traffic Insights</h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">Visual channel attribution split, traffic sources, and organic vs paid performance metrics.</p>
                </div>

                {/* VISUAL progress meters */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-xl space-y-4">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">Attribution Traffic Acquisition Split</h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Organic Search (SEO Google)</span>
                        <span className="text-white font-bold">48%</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full w-[48%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Paid Marketing (Meta & Search Ads)</span>
                        <span className="text-white font-bold">35%</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full w-[35%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Direct Referral / CRM Automation</span>
                        <span className="text-white font-bold">17%</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[17%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 8: VISUAL ASSET MEDIA LIBRARY */}
            {activeTab === 'media-library' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Visual Asset Media Library</h2>
                    <p className="text-gray-400 text-xs font-mono mt-1">Upload, delete, and download photos, client logos, or banners locally.</p>
                  </div>
                  
                  {/* Real Local File Selection */}
                  <div className="shrink-0">
                    <input 
                      id="media-file-uploader"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMediaUpload}
                    />
                    <label 
                      htmlFor="media-file-uploader"
                      className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-xs font-mono font-black rounded-xl cursor-pointer shadow-lg flex items-center gap-2 justify-center transition-all"
                    >
                      <UploadCloud className="w-4 h-4 shrink-0" />
                      <span>UPLOAD NEW PHOTOS</span>
                    </label>
                  </div>
                </div>

                {/* DRAG AND DROP ZONE */}
                <div className="border-2 border-dashed border-[#243149] hover:border-cyan-500/50 bg-[#141C2D]/30 p-6 rounded-[18px] text-center transition-colors group relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleMediaUpload}
                  />
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <div className="p-3 bg-[#0F1725] rounded-xl border border-white/[0.04] group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-xs font-mono text-gray-300 font-bold block">Drag & drop files here, or click to browse local storage</span>
                    <p className="text-[10px] text-gray-500 max-w-sm">Supports PNG, JPG, JPEG, SVG, WebP, and GIFs. Files are converted and handled locally in your active sandbox draft.</p>
                  </div>
                </div>

                {/* MEDIA LIST GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Visual Assets List */}
                  <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] md:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Active Assets ({mediaItems.length})</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/20">Local Storage Active</span>
                    </div>

                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {mediaItems.length === 0 ? (
                        <div className="text-center py-10 bg-[#141C2D]/40 rounded-xl border border-dashed border-[#243149]">
                          <FileImage className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <span className="text-[11px] font-mono text-gray-500">No assets in library. Upload some above!</span>
                        </div>
                      ) : (
                        mediaItems.map((m: any) => (
                          <div 
                            key={m.id}
                            className={cn(
                              "w-full p-2.5 rounded-xl text-xs font-mono flex items-center justify-between border transition-all",
                              selectedMediaId === m.id ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-300" : "bg-[#141C2D]/60 border-transparent text-gray-400 hover:text-white"
                            )}
                          >
                            <button 
                              onClick={() => setSelectedMediaId(m.id)}
                              className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
                            >
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/[0.06] shrink-0 bg-black/50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={m.url} 
                                  alt={m.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-gray-200 group-hover:text-white">{m.name}</p>
                                <p className="text-[9px] text-gray-500 mt-0.5">{m.size} • {m.type}</p>
                              </div>
                            </button>
                            
                            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                              <button 
                                title="Download asset"
                                onClick={() => handleDownloadMedia(m)}
                                className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-[#141C2D] rounded-lg transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                title="Delete asset"
                                onClick={() => handleDeleteMedia(m.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#141C2D] rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Detail Inspector */}
                  <div className="md:col-span-7">
                    {selectedMedia ? (
                      <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] space-y-5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase font-black block tracking-wider">Asset Inspector</span>
                          <span className="text-[9px] font-mono text-gray-500">ID: {selectedMedia.id}</span>
                        </div>

                        <div className="h-44 w-full bg-[#141C2D] border border-white/[0.04] rounded-xl overflow-hidden relative flex items-center justify-center p-2 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={selectedMedia.url} 
                            alt={selectedMedia.name} 
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-gray-400 bg-[#141C2D]/40 p-3 rounded-xl border border-[#243149]/50">
                          <div>
                            <p className="text-gray-500">Asset Title</p>
                            <p className="text-white font-bold truncate mt-0.5">{selectedMedia.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">File Format</p>
                            <p className="text-white font-bold mt-0.5">{selectedMedia.type}</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-500">Natural Dimensions</p>
                            <p className="text-white font-bold mt-0.5">{selectedMedia.dimensions}</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-500">Optimized Workspace Size</p>
                            <p className="text-emerald-400 font-bold mt-0.5">{selectedMedia.size}</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button 
                            onClick={handleCompressMedia}
                            disabled={isCompressing}
                            className="flex-1 min-w-[120px] py-2 bg-[#141C2D] border border-cyan-500/20 hover:bg-cyan-950/20 text-cyan-400 font-mono text-[10px] rounded-lg cursor-pointer transition-colors"
                          >
                            {isCompressing ? "Compressing..." : "Compress WebP"}
                          </button>
                          <button 
                            onClick={handleAiEnhanceMedia}
                            disabled={isEnhancing}
                            className="flex-1 min-w-[120px] py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 text-black font-sans font-black text-[10px] rounded-lg cursor-pointer transition-opacity"
                          >
                            {isEnhancing ? "Upscaling..." : "AI Upscale 4K"}
                          </button>
                        </div>

                        {/* Additional asset actions */}
                        <div className="pt-2 border-t border-[#243149] space-y-3">
                          <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-wider font-bold">Quick Integrations & Utilities</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => handleCopyMediaUrl(selectedMedia.url)}
                              className="py-1.5 px-2 bg-gray-950 hover:bg-gray-900 border border-gray-850 rounded-lg text-gray-300 hover:text-white text-[10px] font-mono flex items-center gap-1.5 justify-center transition-colors cursor-pointer"
                            >
                              <Copy className="w-3 h-3 text-cyan-400" />
                              <span>Copy Base64</span>
                            </button>
                            <button 
                              onClick={() => handleDownloadMedia(selectedMedia)}
                              className="py-1.5 px-2 bg-gray-950 hover:bg-gray-900 border border-gray-850 rounded-lg text-gray-300 hover:text-white text-[10px] font-mono flex items-center gap-1.5 justify-center transition-colors cursor-pointer"
                            >
                              <Download className="w-3 h-3 text-emerald-400" />
                              <span>Download Asset</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => {
                                setHero((prev: any) => ({ ...prev, profileImage: selectedMedia.url }));
                                showToast("Assigned selected asset as Bio Profile Photo!", "success");
                              }}
                              className="py-1.5 px-2.5 bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/20 rounded-lg text-cyan-300 hover:text-white text-[9px] font-mono flex items-center gap-1 justify-center transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                              <span>Set Bio Profile Photo</span>
                            </button>

                            <button 
                              onClick={() => {
                                const newId = `logo-${Date.now()}`;
                                const newLogo = {
                                  id: newId,
                                  label: selectedMedia.name.split('.')[0] || 'New Brand Logo',
                                  subLabel: 'Custom Partner',
                                  desc: 'Strategic expansion integration.',
                                  badge: 'Partner',
                                  color: 'cyan',
                                  img: selectedMedia.url,
                                  href: 'https://google.com',
                                  visible: true
                                };
                                setLogoWall((prev: any) => [...prev, newLogo]);
                                showToast("Added asset to partner Logo Wall successfully!", "success");
                              }}
                              className="py-1.5 px-2.5 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/20 rounded-lg text-emerald-300 hover:text-white text-[9px] font-mono flex items-center gap-1 justify-center transition-all cursor-pointer"
                            >
                              <PlusCircle className="w-3 h-3 text-emerald-400" />
                              <span>Add to Logo Wall</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#0F1725] border border-white/[0.06] p-8 rounded-[18px] text-center text-gray-500 font-mono text-xs">
                        Select a visual asset from the list to inspect metadata or apply utilities.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB 9: VERSION HISTORY & SNAPSHOT CHRONOLOGY */}
            {activeTab === 'version-history' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg">
                  <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Chronological Snapshot Checkpoints</h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">Manage and revert back to previously saved checkpoint snapshot draft states dynamically.</p>
                </div>

                {/* CREATE SNAPSHOT TOOL */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] shadow-lg space-y-3">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-black">Commit New Version Snapshot</span>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. v1.2.0 - Post GSC domain audit campaigns launch"
                      value={newSnapshotLabel}
                      onChange={(e) => setNewSnapshotLabel(e.target.value)}
                      className="flex-1 bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white"
                    />
                    <button 
                      onClick={createCheckpoint}
                      className="bg-cyan-500 text-black font-sans font-bold text-xs px-4 rounded-xl cursor-pointer"
                    >
                      Commit Draft
                    </button>
                  </div>
                </div>

                {/* CHRONOLOGY HISTORIES LIST */}
                <div className="space-y-3">
                  {historyLogs.map(snap => (
                    <div key={snap.id} className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] shadow-md flex justify-between items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-mono text-[9px] rounded font-bold">{snap.tag}</span>
                          <h4 className="text-xs font-bold text-white font-sans">{snap.label}</h4>
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 block mt-1">{snap.time}</span>
                        <p className="text-[10px] text-gray-400 mt-1">{snap.description}</p>
                      </div>
                      <button 
                        onClick={() => restoreCheckpoint(snap)}
                        className="px-3 py-1.5 bg-[#141C2D] border border-white/[0.06] hover:bg-cyan-950/20 text-cyan-400 font-mono text-[10px] rounded-lg cursor-pointer"
                      >
                        Restore State
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE TAB: AI CONTENT STUDIO */}
            {activeTab === 'ai-studio' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-cyan-400">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">AI Content Studio Node</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">Generate high-converting regional landing pages, Google Ads copies, or SEO-boosted blog posts using Gemini API.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Controls */}
                  <div className="md:col-span-1 bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] space-y-4 text-left">
                    <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-black">Content Generator</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Content Type</label>
                      <select 
                        id="ai_content_type"
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 animate-fade-in"
                        defaultValue="blog"
                      >
                        <option value="blog">SEO Blog Post Post</option>
                        <option value="landing">High-Converting Landing Copy</option>
                        <option value="meta">GSC Optimized Meta Tags</option>
                        <option value="gads">Google Ads Creative Set</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Target Brand Context</label>
                      <select 
                        id="ai_brand_context"
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        value={activeBrand}
                        onChange={(e) => {
                          setActiveBrand(e.target.value as any);
                          showToast(`Aligned content stream to ${e.target.value} context`, "success");
                        }}
                      >
                        <option value="portfolio">Personal Brand (Rizwan Saeed)</option>
                        <option value="agency">Lead Gen Agency</option>
                        <option value="floortown">FloorTown (Dubai Floorings)</option>
                        <option value="curtaincenter">CurtainCenter (Luxury Shades)</option>
                        <option value="mamiora">Mamiora (Bridal wear)</option>
                        <option value="neonwall">NeonWall (Bespoke Signage)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Primary SEO Keywords</label>
                      <input 
                        id="ai_keywords"
                        type="text" 
                        placeholder="e.g. epoxy flooring Dubai, luxury carpets"
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Target Audience/Region</label>
                      <input 
                        id="ai_target_region"
                        type="text" 
                        placeholder="e.g. UAE Corporate procurement"
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white focus:outline-none"
                        defaultValue="UAE"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Additional Instructions</label>
                      <textarea 
                        id="ai_instructions"
                        placeholder="Include CTA to WhatsApp or Book Meeting, high executive tone"
                        className="w-full bg-[#141C2D] border border-[#243149] rounded-xl p-3 text-xs text-white h-20 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <button 
                      onClick={async () => {
                        const type = (document.getElementById('ai_content_type') as HTMLSelectElement)?.value || 'blog';
                        const brand = (document.getElementById('ai_brand_context') as HTMLSelectElement)?.value || 'portfolio';
                        const keywords = (document.getElementById('ai_keywords') as HTMLInputElement)?.value || '';
                        const region = (document.getElementById('ai_target_region') as HTMLInputElement)?.value || 'UAE';
                        const instructions = (document.getElementById('ai_instructions') as HTMLTextAreaElement)?.value || '';
                        
                        const text = `Generate a highly optimized ${type} copy for the brand "${brand}" targeting the region "${region}". Primary SEO keywords to weave in naturally: "${keywords}". Specific styling/layout guidelines: "${instructions}". Output in elegant markdown, highlighting keywords, meta values, headings, and CTAs.`;
                        
                        showToast("AI Content Studio generating...", "info");
                        handleJarvisCommandSubmit("AI Generate: " + text);
                      }}
                      className="w-full py-3 bg-cyan-500 text-black font-sans font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Enterprise Draft</span>
                    </button>
                  </div>

                  {/* Output Terminal */}
                  <div className="md:col-span-2 bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] space-y-4 flex flex-col h-[520px] text-left">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <div>
                        <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-black">AI Output Node Stream</h3>
                        <p className="text-[10px] text-gray-500">Live generated markdown files in active pipeline</p>
                      </div>
                      <button 
                        onClick={() => {
                          const lastMsg = jarvisTerminal[jarvisTerminal.length - 1];
                          if (lastMsg && lastMsg.text) {
                            navigator.clipboard.writeText(lastMsg.text);
                            showToast("Copied content to clipboard!", "success");
                          } else {
                            showToast("No content to copy.", "error");
                          }
                        }}
                        className="p-1.5 bg-[#141C2D] border border-white/[0.06] hover:bg-black/30 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 bg-[#070a13] rounded-xl p-4 border border-white/[0.04] overflow-y-auto font-mono text-xs text-gray-300 space-y-3 scrollbar-thin">
                      {jarvisTerminal.map((msg, i) => (
                        <div key={i} className={cn("p-2.5 rounded-lg border", msg.sender === 'user' ? "bg-black/20 border-white/[0.02]" : "bg-cyan-950/10 border-cyan-500/10")}>
                          <div className="flex justify-between items-center text-[9px] text-gray-500 mb-1">
                            <span className="font-bold">{msg.sender === 'user' ? "Rizwan" : "JARVIS Operations Core"}</span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE TAB: SECURITY & CREDENTIALS WITH OTP VALIDATION */}
            {activeTab === 'security-credentials' && (
              <div className="space-y-6">
                <div className="bg-[#0F1725] border border-white/[0.06] p-6 rounded-[18px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400">
                      <Shield className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">Security & Admin Credentials</h2>
                      <p className="text-gray-400 text-xs font-mono mt-1">
                        Securely update your admin username and access passkey. Every modification requires email-based OTP verification sent to <span className="text-emerald-400 font-bold underline">RIZWANSAEED610@gmail.com</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* UPDATE USERNAME */}
                  <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] space-y-4">
                    <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-black flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Update Administrator Username</span>
                    </h3>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Current Username</label>
                      <div className="bg-[#141C2D] border border-white/[0.02] rounded-xl p-3 text-xs text-gray-500 font-mono">
                        {adminUsername || 'admin'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">New Username</label>
                      <input 
                        type="text" 
                        placeholder="Enter new administrator username"
                        value={securityUsernameVal}
                        onChange={(e) => setSecurityUsernameVal(e.target.value)}
                        disabled={securityUsernameOtpSent}
                        className="w-full bg-[#141C2D] border border-[#243149] disabled:opacity-50 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    {securityUsernameOtpSent && (
                      <div className="space-y-2 p-3 bg-emerald-950/15 border border-emerald-500/10 rounded-xl animate-fade-in">
                        <label className="text-[10px] text-emerald-400 font-mono block font-bold">Enter 6-Digit OTP Sent to Gmail</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 529304"
                          maxLength={6}
                          value={securityUsernameOtp}
                          onChange={(e) => setSecurityUsernameOtp(e.target.value)}
                          className="w-full bg-[#070a13] border border-emerald-500/30 rounded-xl p-3 text-xs text-white text-center font-mono tracking-widest text-lg font-bold focus:outline-none"
                        />
                        <span className="text-[9px] text-gray-500 block">Check the Simulated Secure Mail Hub below to copy-paste the OTP code!</span>
                      </div>
                    )}

                    {!securityUsernameOtpSent ? (
                      <button 
                        onClick={async () => {
                          if (!securityUsernameVal.trim()) {
                            showToast("Please enter a valid username", "error");
                            return;
                          }
                          if (securityUsernameVal.trim() === adminUsername) {
                            showToast("New username must be different from the current username", "error");
                            return;
                          }
                          setSecurityUsernameLoading(true);
                          try {
                            const res = await fetch('/api/otp', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'send',
                                type: 'username',
                                newValue: securityUsernameVal.trim(),
                                email: 'RIZWANSAEED610@gmail.com'
                              })
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              setSecurityUsernameOtpSent(true);
                              showToast(`Secure OTP dispatched to RIZWANSAEED610@gmail.com!`, "success");
                              fetchSandboxEmails();
                            } else {
                              showToast(data.error || "Failed to send security OTP.", "error");
                            }
                          } catch (err) {
                            showToast("Communication link error. Please try again.", "error");
                          } finally {
                            setSecurityUsernameLoading(false);
                          }
                        }}
                        disabled={securityUsernameLoading}
                        className="w-full py-3 bg-emerald-500 text-black font-sans font-bold text-xs rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {securityUsernameLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <PlusCircle className="w-4 h-4" />
                        )}
                        <span>Request Username Change OTP</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSecurityUsernameOtpSent(false);
                            setSecurityUsernameOtp('');
                          }}
                          className="py-3 px-4 bg-[#141C2D] border border-white/[0.06] text-gray-400 font-sans text-xs rounded-xl hover:bg-black/20 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={async () => {
                            if (!securityUsernameOtp || securityUsernameOtp.length < 6) {
                              showToast("Please enter the complete 6-digit verification OTP code", "error");
                              return;
                            }
                            setSecurityUsernameLoading(true);
                            try {
                              const res = await fetch('/api/otp', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  action: 'verify',
                                  type: 'username',
                                  otp: securityUsernameOtp
                                })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setAdminUsername(data.newValue);
                                setSecurityUsernameOtpSent(false);
                                setSecurityUsernameOtp('');
                                setSecurityUsernameVal('');
                                showToast("Username updated successfully! Remember to save changes live.", "success");
                                addLog('security', `Admin Username updated to "${data.newValue}" successfully.`);
                              } else {
                                showToast(data.error || "Invalid security OTP code.", "error");
                              }
                            } catch (err) {
                              showToast("Verification request failed.", "error");
                            } finally {
                              setSecurityUsernameLoading(false);
                            }
                          }}
                          disabled={securityUsernameLoading}
                          className="flex-1 py-3 bg-emerald-500 text-black font-sans font-bold text-xs rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Verify & Update Username</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* UPDATE PASSKEY */}
                  <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] space-y-4">
                    <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-black flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Update Administrator Passkey</span>
                    </h3>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">Current Passkey</label>
                      <div className="bg-[#141C2D] border border-white/[0.02] rounded-xl p-3 text-xs text-gray-500 font-mono">
                        •••••••• (length: {adminPasskey?.length || 0})
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-mono block">New Passkey</label>
                      <input 
                        type="password" 
                        placeholder="Enter new master passkey"
                        value={securityPasskeyVal}
                        onChange={(e) => setSecurityPasskeyVal(e.target.value)}
                        disabled={securityPasskeyOtpSent}
                        className="w-full bg-[#141C2D] border border-[#243149] disabled:opacity-50 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    {securityPasskeyOtpSent && (
                      <div className="space-y-2 p-3 bg-emerald-950/15 border border-emerald-500/10 rounded-xl animate-fade-in">
                        <label className="text-[10px] text-emerald-400 font-mono block font-bold">Enter 6-Digit OTP Sent to Gmail</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 104938"
                          maxLength={6}
                          value={securityPasskeyOtp}
                          onChange={(e) => setSecurityPasskeyOtp(e.target.value)}
                          className="w-full bg-[#070a13] border border-emerald-500/30 rounded-xl p-3 text-xs text-white text-center font-mono tracking-widest text-lg font-bold focus:outline-none"
                        />
                        <span className="text-[9px] text-gray-500 block">Check the Simulated Secure Mail Hub below to copy-paste the OTP code!</span>
                      </div>
                    )}

                    {!securityPasskeyOtpSent ? (
                      <button 
                        onClick={async () => {
                          if (!securityPasskeyVal.trim()) {
                            showToast("Please enter a valid passkey", "error");
                            return;
                          }
                          if (securityPasskeyVal.trim() === adminPasskey) {
                            showToast("New passkey must be different from the current passkey", "error");
                            return;
                          }
                          setSecurityPasskeyLoading(true);
                          try {
                            const res = await fetch('/api/otp', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'send',
                                type: 'password',
                                newValue: securityPasskeyVal.trim(),
                                email: 'RIZWANSAEED610@gmail.com'
                              })
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              setSecurityPasskeyOtpSent(true);
                              showToast(`Secure OTP dispatched to RIZWANSAEED610@gmail.com!`, "success");
                              fetchSandboxEmails();
                            } else {
                              showToast(data.error || "Failed to send security OTP.", "error");
                            }
                          } catch (err) {
                            showToast("Communication link error. Please try again.", "error");
                          } finally {
                            setSecurityPasskeyLoading(false);
                          }
                        }}
                        disabled={securityPasskeyLoading}
                        className="w-full py-3 bg-emerald-500 text-black font-sans font-bold text-xs rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {securityPasskeyLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <PlusCircle className="w-4 h-4" />
                        )}
                        <span>Request Passkey Change OTP</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSecurityPasskeyOtpSent(false);
                            setSecurityPasskeyOtp('');
                          }}
                          className="py-3 px-4 bg-[#141C2D] border border-[#243149] text-gray-400 font-sans text-xs rounded-xl hover:bg-black/20 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={async () => {
                            if (!securityPasskeyOtp || securityPasskeyOtp.length < 6) {
                              showToast("Please enter the complete 6-digit verification OTP code", "error");
                              return;
                            }
                            setSecurityPasskeyLoading(true);
                            try {
                              const res = await fetch('/api/otp', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  action: 'verify',
                                  type: 'password',
                                  otp: securityPasskeyOtp
                                })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setAdminPasskey(data.newValue);
                                setSecurityPasskeyOtpSent(false);
                                setSecurityPasskeyOtp('');
                                setSecurityPasskeyVal('');
                                showToast("Passkey updated successfully! Remember to save changes live.", "success");
                                addLog('security', `Admin Passkey updated successfully.`);
                              } else {
                                showToast(data.error || "Invalid security OTP code.", "error");
                              }
                            } catch (err) {
                              showToast("Verification request failed.", "error");
                            } finally {
                              setSecurityPasskeyLoading(false);
                            }
                          }}
                          disabled={securityPasskeyLoading}
                          className="flex-1 py-3 bg-emerald-500 text-black font-sans font-bold text-xs rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Verify & Update Passkey</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECURE MAIL INBOX SANDBOX CARD */}
                <div className="bg-[#0F1725] border border-white/[0.06] p-5 rounded-[18px] text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                    <div>
                      <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-black flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>Developer Secure Mail Hub (Simulated Sandbox)</span>
                      </h3>
                      <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                        Intercept and view outgoing emails sent to <span className="text-cyan-400">RIZWANSAEED610@gmail.com</span> in real-time.
                      </p>
                    </div>
                    <button 
                      onClick={fetchSandboxEmails}
                      disabled={loadingEmails}
                      className="p-1.5 bg-[#141C2D] border border-white/[0.06] hover:bg-black/30 rounded-lg text-gray-400 hover:text-white cursor-pointer flex items-center gap-1.5 text-[10px] font-mono"
                    >
                      <RefreshCw className={cn("w-3 h-3", loadingEmails && "animate-spin")} />
                      <span>Refresh Mail</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {sandboxEmails.length === 0 ? (
                      <div className="bg-[#070a13] border border-white/[0.02] p-8 rounded-xl text-center text-gray-500 font-mono text-xs">
                        No dispatched credentials verification emails intercepted. Trigger an OTP request above to capture transaction mails.
                      </div>
                    ) : (
                      sandboxEmails.map((email: any) => (
                        <div key={email.id} className="bg-[#070a13] border border-white/[0.04] p-4 rounded-xl space-y-2 font-mono text-xs text-left relative overflow-hidden">
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-[9px] rounded font-bold animate-pulse">OTP CAPTURED: {email.code}</span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(email.code);
                                showToast(`Copied OTP ${email.code} to clipboard!`, "success");
                              }}
                              className="px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-sans font-bold rounded hover:bg-emerald-400 transition-all cursor-pointer animate-fade-in"
                            >
                              Copy OTP Code
                            </button>
                          </div>

                          <div className="space-y-1">
                            <p className="text-gray-400"><span className="text-gray-600">To:</span> {email.to}</p>
                            <p className="text-gray-400"><span className="text-gray-600">Subject:</span> {email.subject}</p>
                            <p className="text-gray-500 text-[10px]"><span className="text-gray-600">Time:</span> {new Date(email.timestamp).toLocaleString()}</p>
                          </div>

                          <div className="border-t border-white/[0.03] pt-2 mt-2">
                            <pre className="whitespace-pre-wrap font-mono text-[10px] text-gray-400 bg-black/40 p-3 rounded-lg overflow-x-auto leading-relaxed border border-white/[0.02]">
                              {email.body}
                            </pre>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SAVE PERSISTENCE PROMPT */}
                <div className="bg-[#0c223c]/40 border border-cyan-500/20 p-4 rounded-xl text-left flex items-center gap-3 font-sans text-xs">
                  <div className="p-2 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-white block">Save Changes to Persist Permanently</span>
                    <span className="text-gray-400 mt-0.5 block">
                      Updating credentials changes them in memory and fallback local state. To commit them to the server-side configuration engine permanently, click the <span className="text-cyan-400 font-bold">&quot;Publish Changes Live&quot;</span> button in the top actions bar.
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT AREA: REAL-TIME LIVE PREVIEW FRAME (Shopify/Wix Style) */}
          {showPreview && (
            <div className="w-full xl:w-96 bg-[#0F1725] border border-white/[0.06] rounded-[18px] p-4 shadow-xl self-start space-y-4 xl:sticky xl:top-28">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-white font-bold uppercase tracking-wide">Live Website Preview</span>
                </div>
                
                {/* Device viewport switch controls */}
                <div className="flex items-center gap-1.5 bg-[#141C2D] border border-white/[0.06] p-1 rounded-lg">
                  <button 
                    onClick={() => setPreviewDevice('desktop')}
                    className={cn("p-1 rounded cursor-pointer", previewDevice === 'desktop' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500")}
                    title="Desktop device view"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setPreviewDevice('tablet')}
                    className={cn("p-1 rounded cursor-pointer", previewDevice === 'tablet' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500")}
                    title="Tablet device view"
                  >
                    <TabletIcon className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setPreviewDevice('mobile')}
                    className={cn("p-1 rounded cursor-pointer", previewDevice === 'mobile' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500")}
                    title="Mobile phone view"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* LIVE SIMULATION CARD PANEL */}
              <div className={cn(
                "bg-[#070a13] rounded-xl p-4 border border-white/[0.04] mx-auto overflow-y-auto max-h-[380px] scrollbar-thin transition-all duration-300 relative",
                previewDevice === 'desktop' && "w-full",
                previewDevice === 'tablet' && "w-[85%]",
                previewDevice === 'mobile' && "w-[65%]"
              )}>
                
                {/* Mock Browser Header Bar */}
                <div className="flex justify-between items-center text-[7px] font-mono text-gray-600 border-b border-white/[0.04] pb-2 mb-3">
                  <span>https://rizwansaeed.ae</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Public Site simulated navbar */}
                  <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 uppercase">
                    <span className="font-bold text-white">Rizwan Saeed</span>
                    <span>Verified Partners</span>
                  </div>

                  {/* Public Site simulated Hero Title */}
                  <div className="space-y-2 py-4 text-center">
                    <h1 className="text-sm font-black font-sans leading-tight text-white uppercase tracking-tight">
                      {hero.headline} <span className={cn("text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-extrabold")}>{hero.headlineAccent}</span>
                    </h1>
                    <p className="text-[8px] font-sans text-gray-500 leading-relaxed max-w-[240px] mx-auto">{hero.subheadline}</p>
                    <div className="pt-2 flex justify-center gap-2">
                      <span className={cn("px-2 py-1 text-[7px] font-mono rounded bg-white text-black font-bold")}>Handshake Secured</span>
                      <span className={cn("px-2 py-1 text-[7px] font-mono rounded border border-white/20 text-white")}>Portfolio</span>
                    </div>
                  </div>

                  {/* Partner Wall simulated Row */}
                  <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/[0.02]">
                    <span className="text-[6.5px] font-mono text-gray-600 uppercase block tracking-wider text-center">OFFICIAL REGIONAL PARTNER CREDENTIALS</span>
                    <div className="flex justify-center items-center gap-2 flex-wrap pt-1 opacity-80">
                      {logoWall.filter((l: any) => l.visible).map((l: any) => (
                        <div key={l.id} className="text-[7.5px] font-mono font-bold text-white bg-[#141C2D] px-1 py-0.5 rounded border border-white/[0.04]">
                          {l.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* public site stats metrics simulated widgets */}
                  <div className="grid grid-cols-2 gap-2">
                    {statsMetrics.slice(0, 2).map((stat: any) => (
                      <div key={stat.id} className="bg-[#141C2D]/60 p-2 rounded border border-white/[0.04] text-center">
                        <span className="text-[12px] font-black text-cyan-400 font-mono block">{stat.value}</span>
                        <span className="text-[6.5px] font-mono text-gray-500 uppercase block">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* PREVIEW PANEL ACTIONS */}
              <div className="flex gap-2 text-xs font-mono">
                <button 
                  onClick={() => {
                    setPreviewRefreshKey(prev => prev + 1);
                    showToast("Simulated preview viewport refreshed!", "info");
                  }}
                  className="w-full py-2 bg-[#141C2D] border border-white/[0.06] hover:bg-black/30 text-gray-400 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Preview</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* GLOBAL COMMAND PALETTE MODAL (Ctrl+K) */}
      <AnimatePresence>
        {isCommandOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0f16] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
                <Command className="w-5 h-5 text-cyan-400" />
                <input 
                  type="text" 
                  placeholder="Type a page tab or action command shortcut..."
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none font-mono"
                  autoFocus
                />
                <button onClick={() => setIsCommandOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[250px] overflow-y-auto space-y-1.5 font-mono text-xs text-gray-300 pr-1">
                {filteredCommands.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No command match found.</p>
                ) : (
                  filteredCommands.map((cmd, idx) => (
                    <button 
                      key={cmd.title}
                      onClick={cmd.action}
                      className="w-full text-left p-2.5 rounded-xl flex items-center justify-between hover:bg-cyan-950/20 hover:text-cyan-300 transition-all cursor-pointer border border-transparent hover:border-cyan-500/25"
                    >
                      <span>{cmd.title}</span>
                      <span className="px-1.5 py-0.5 bg-gray-900 border border-white/10 text-[9px] text-gray-500 rounded">{cmd.category}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
