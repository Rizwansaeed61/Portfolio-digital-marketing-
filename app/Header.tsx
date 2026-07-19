'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, Menu, X, Calendar, Clock, Sparkles, CheckCircle2, 
  Video, Globe, Building2, Mail, Phone, ArrowRight, ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAdmin } from './admin-context';

interface HeaderProps {
  setShowPasskeyModal: (show: boolean) => void;
}

export default function Header({ setShowPasskeyModal }: HeaderProps) {
  const {
    liveBrandInfo: brandInfo,
    isAuthorized,
    setViewMode,
    activeMainPage,
    setActiveMainPage,
    showToast,
    isContactModalOpen,
    setIsContactModalOpen,
    liveThemeConfig,
    effectiveThemeMode,
    setLiveThemeConfig,
    setThemeConfig,
    liveWhatsappConfig
  } = useAdmin();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scheduler States
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [bookName, setBookName] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookCompany, setBookCompany] = useState('');
  const [bookService, setBookService] = useState('Shopify Custom Growth Funnel');
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Monitor Scroll for Dynamic Glass Styling, Hiding, and Progress
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((currentScrollY / totalScroll) * 100);
      }

      // scrolled state
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Generate dynamic schedule dates starting tomorrow (skipping Sunday)
  const bookingDates = React.useMemo(() => {
    const dates = [];
    let current = new Date();
    current.setDate(current.getDate() + 1); // Start from tomorrow

    while (dates.length < 5) {
      if (current.getDay() !== 0) { // Skip Sundays
        dates.push({
          dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: current.getDate(),
          monthName: current.toLocaleDateString('en-US', { month: 'short' }),
          formattedDate: current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  const timeSlots = [
    '10:00 AM GST (Dubai)',
    '11:30 AM GST (Dubai)',
    '02:00 PM GST (Dubai)',
    '03:30 PM GST (Dubai)',
    '05:00 PM GST (Dubai)'
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookEmail.trim()) {
      showToast("Please provide your name and email to proceed.", "error");
      return;
    }
    if (!selectedTimeSlot) {
      showToast("Please choose a time slot for the call.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate scheduling secure handshake API call
    setTimeout(() => {
      const selectedDate = bookingDates[selectedDateIdx];
      const handshakeCode = `WA-${Math.floor(100000 + Math.random() * 900000)}`;
      const baseNum = liveWhatsappConfig?.number || "+971500000000";
      const cleanNum = baseNum.replace(/[^0-9]/g, '');
      const waMsg = `Hello Rizwan Saeed, I just booked a Growth Session with you!\n\n📅 Date: ${selectedDate.formattedDate}\n⏰ Time: ${selectedTimeSlot}\n👤 Name: ${bookName}\n✉️ Email: ${bookEmail}\n🏢 Company: ${bookCompany || "Growth Protocol Partner"}\n🛠️ Service: ${bookService}\n🆔 Verification Code: ${handshakeCode}\n\nLet's connect on WhatsApp to discuss further!`;
      const whatsAppLink = `https://wa.me/${cleanNum}?text=${encodeURIComponent(waMsg)}`;
      
      setBookingSuccess({
        id: handshakeCode,
        name: bookName,
        email: bookEmail,
        company: bookCompany || "Growth Protocol Partner",
        service: bookService,
        date: selectedDate.formattedDate,
        time: selectedTimeSlot,
        meetLink: `https://meet.google.com/${handshakeCode.toLowerCase()}`,
        whatsAppLink: whatsAppLink,
      });
      setIsSubmitting(false);
      showToast("Growth Meeting Secured. Auto-WhatsApp invitation compiled!", "success");
    }, 1800);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setBookingSuccess(null);
      setBookName('');
      setBookEmail('');
      setBookCompany('');
      setSelectedTimeSlot('');
      setSelectedDateIdx(0);
    }, 300);
  };

  return (
    <>
      {/* PERSISTENT HEADER WITH PREMIUM WIX LILAC/PLUM STYLE */}
      <header 
        id="main-header" 
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, padding 0.3s'
        }}
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-300",
          scrolled 
            ? "bg-[#dfd3eb]/95 backdrop-blur-xl border-[#5c253d]/20 shadow-[0_4px_30px_rgba(92,37,61,0.08)] py-3 text-[#5c253d]" 
            : "bg-[#e2d8ee]/90 backdrop-blur-md border-[#5c253d]/10 py-5 text-[#5c253d]"
        )}
      >
        {/* Dynamic sub-pixel scrolling progress bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-[#f27447] transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <div className="flex items-center space-x-3 shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveMainPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#5c253d] p-[1px] flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="w-full h-full bg-[#f6f3f8] rounded-[7px] flex items-center justify-center overflow-hidden">
                  {brandInfo.logoImageUrl ? (
                    <Image 
                      src={brandInfo.logoImageUrl} 
                      alt={brandInfo.logoText || 'Logo'} 
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-[7px]"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  ) : (
                    <span className="font-display font-black text-[#5c253d] text-lg">
                      {brandInfo.logoInitials || 'RS'}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <span className="font-display text-sm tracking-wider font-bold block text-[#5c253d] uppercase leading-none group-hover:text-[#f27447] transition-colors">
                  {brandInfo.logoText || 'Rizwan Saeed'}
                </span>
                <span className="text-[9px] text-[#f27447] tracking-widest font-mono uppercase block mt-1.5 font-bold whitespace-nowrap">
                  {brandInfo.logoTagline || 'Shopify & Growth PPC'}
                </span>
              </div>
            </a>
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] font-sans font-bold uppercase tracking-wider text-[#5c253d]/80">
            <a 
              href="#services-estimator" 
              onClick={() => setActiveMainPage('home')}
              className={cn(
                "hover:text-[#f27447] transition-colors relative py-2 group",
                activeMainPage === 'home' && "text-[#5c253d] font-black"
              )}
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f27447] group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#experience-timeline" 
              onClick={() => setActiveMainPage('home')}
              className="hover:text-[#f27447] transition-colors relative py-2 group"
            >
              Experience
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f27447] group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#portfolio-grid" 
              onClick={() => setActiveMainPage('home')}
              className="hover:text-[#f27447] transition-colors relative py-2 group"
            >
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f27447] group-hover:w-full transition-all duration-300" />
            </a>
            <button 
              onClick={() => {
                setActiveMainPage('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "hover:text-[#f27447] transition-colors relative py-2 group cursor-pointer font-sans font-bold text-[11px] uppercase tracking-wider",
                activeMainPage === 'blog' ? "text-[#f27447]" : "text-[#5c253d]/80"
              )}
            >
              Blog
              <span className={cn(
                "absolute bottom-0 left-0 h-[2px] bg-[#f27447] transition-all duration-300",
                activeMainPage === 'blog' ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </button>
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Book a Call CTA */}
            <button 
              onClick={() => setIsBookingOpen(true)} 
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#f27447] hover:bg-[#d65f33] text-white font-bold font-sans text-xs uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Call</span>
            </button>

            {/* HAMBURGER MENUS */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg text-[#5c253d] hover:bg-[#5c253d]/5 border border-[#5c253d]/10 active:scale-95 transition-all shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#f27447]" />
              ) : (
                <Menu className="w-5 h-5 text-[#5c253d]" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN WITH GLASSMORPHISM AND SMOOTH ANIMATION */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden border-t border-[#5c253d]/15 bg-[#dfd3eb]/95 backdrop-blur-2xl px-4 py-6 space-y-4 shadow-lg text-[#5c253d]"
            >
              <div className="grid grid-cols-2 gap-3 text-xs font-sans font-bold uppercase tracking-wider text-[#5c253d]">
                <a 
                  href="#services-estimator" 
                  onClick={() => {
                    setActiveMainPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border border-[#5c253d]/10 transition-all text-center"
                >
                  Services
                </a>
                <a 
                  href="#brand-matrix" 
                  onClick={() => {
                    setActiveMainPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border border-[#5c253d]/10 transition-all text-center"
                >
                  Brands
                </a>
                <a 
                  href="#experience-timeline" 
                  onClick={() => {
                    setActiveMainPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border border-[#5c253d]/10 transition-all text-center"
                >
                  Experience
                </a>
                <a 
                  href="#portfolio-grid" 
                  onClick={() => {
                    setActiveMainPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border border-[#5c253d]/10 transition-all text-center"
                >
                  Portfolio
                </a>
                <button 
                  onClick={() => {
                    setActiveMainPage('blog');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-lg border transition-all col-span-2 gap-2 text-xs font-sans font-bold uppercase tracking-wider cursor-pointer",
                    activeMainPage === 'blog'
                      ? "bg-white/60 border-[#f27447] text-[#f27447]"
                      : "bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border-[#5c253d]/10"
                  )}
                >
                  📰 Read Blog Articles
                </button>
                <a 
                  href="#analytics-dashboard" 
                  onClick={() => {
                    setActiveMainPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border border-[#5c253d]/10 transition-all col-span-2 gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#f27447]" /> Live Analytics Dashboard
                </a>
                <a 
                  href="#roi-calculator" 
                  onClick={() => {
                    setActiveMainPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/40 hover:bg-[#f27447]/10 hover:text-[#f27447] border border-[#5c253d]/10 transition-all col-span-2"
                >
                  ROI Growth Calculator
                </a>
              </div>

              <div className="pt-3 border-t border-[#5c253d]/10 flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full py-3 bg-[#f27447] hover:bg-[#d65f33] text-white font-bold font-sans text-xs uppercase tracking-wider rounded-lg text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation Call</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* INTERACTIVE BOOKING PORTAL MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBookingModal}
              className="absolute inset-0 bg-[#5c253d]/40 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-[#f6f3f8] border-2 border-[#5c253d] rounded-[24px] shadow-2xl overflow-hidden z-10 text-[#5c253d]"
            >
              {/* Outer top highlight line */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-[#f27447]" />

              {/* Header */}
              <div className="p-6 border-b border-[#5c253d]/10 flex items-center justify-between bg-white/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#f27447]/10 border border-[#f27447]/20 rounded-xl text-[#f27447]">
                    <Calendar className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-[#5c253d]">Book Your Growth Audit Call</h3>
                    <p className="text-[10px] font-mono text-[#f27447] uppercase font-bold">Securing 1-on-1 Strategy Session</p>
                  </div>
                </div>
                <button 
                  onClick={closeBookingModal}
                  className="p-1.5 hover:bg-[#5c253d]/5 border border-[#5c253d]/10 rounded-lg text-[#5c253d] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content / Success Screen */}
              <div className="p-6">
                {!bookingSuccess ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    
                    {/* Step 1: Choose Date */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block tracking-wider font-bold">1. Select Available Date</span>
                      <div className="grid grid-cols-5 gap-2">
                        {bookingDates.map((date, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setSelectedDateIdx(idx)}
                            className={cn(
                              "p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                              selectedDateIdx === idx 
                                ? "bg-[#5c253d] border-[#5c253d] text-[#f6f3f8] shadow-sm font-bold" 
                                : "bg-white/60 border-[#5c253d]/10 text-[#5c253d]/80 hover:border-[#5c253d]/30 hover:text-[#5c253d]"
                            )}
                          >
                            <span className="text-[8px] uppercase font-mono">{date.dayName}</span>
                            <span className="text-sm font-bold font-sans my-0.5">{date.dayNumber}</span>
                            <span className="text-[8px] uppercase font-mono">{date.monthName}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Choose Time */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block tracking-wider font-bold">2. Select Time Slot</span>
                      <div className="flex flex-wrap gap-1.5">
                        {timeSlots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer",
                              selectedTimeSlot === slot 
                                ? "bg-[#f27447] border-[#f27447] text-white font-bold" 
                                : "bg-white/60 border-[#5c253d]/10 text-[#5c253d]/80 hover:border-[#5c253d]/30 hover:text-[#5c253d]"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Contact Inputs */}
                    <div className="space-y-3 pt-1 border-t border-[#5c253d]/10">
                      <span className="text-[10px] font-mono text-[#5c253d]/60 uppercase block tracking-wider font-bold">3. Provide Partnership Context</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-mono text-[#5c253d]/70 uppercase block mb-1 font-bold">Your Full Name *</label>
                          <input 
                            type="text"
                            required
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white border border-[#5c253d]/15 rounded-xl px-3 py-2 text-xs font-sans text-[#5c253d] focus:outline-none focus:border-[#5c253d]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-[#5c253d]/70 uppercase block mb-1 font-bold">Your Business Email *</label>
                          <input 
                            type="email"
                            required
                            value={bookEmail}
                            onChange={(e) => setBookEmail(e.target.value)}
                            placeholder="john@company.com"
                            className="w-full bg-white border border-[#5c253d]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#5c253d] focus:outline-none focus:border-[#5c253d]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-mono text-[#5c253d]/70 uppercase block mb-1 font-bold">Company Website URL</label>
                          <input 
                            type="text"
                            value={bookCompany}
                            onChange={(e) => setBookCompany(e.target.value)}
                            placeholder="e.g. yourbrandsite.com"
                            className="w-full bg-white border border-[#5c253d]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#5c253d] focus:outline-none focus:border-[#5c253d]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-[#5c253d]/70 uppercase block mb-1 font-bold">Primary Objective</label>
                          <select
                            value={bookService}
                            onChange={(e) => setBookService(e.target.value)}
                            className="w-full bg-white border border-[#5c253d]/15 rounded-xl px-3 py-2 text-xs font-sans text-[#5c253d] focus:outline-none focus:border-[#5c253d]"
                          >
                            <option value="Shopify Custom Growth Funnel">Shopify Custom Growth Funnel</option>
                            <option value="Google & Meta Ads High Scale ROI">Google & Meta Ads High Scale ROI</option>
                            <option value="Conversion Optimization Audit">Conversion Optimization Audit</option>
                            <option value="Hospitality/Retail Local SEO Boost">Hospitality/Retail Local SEO Boost</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Booking Trigger Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 py-3 bg-[#f27447] hover:bg-[#d65f33] text-white font-bold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Establishing Secure Connection...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Secure Strategy Session</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Success Screen */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-5 text-center py-2 text-[#5c253d]"
                  >
                    <div className="w-14 h-14 bg-[#f27447]/10 border border-[#f27447]/20 rounded-full flex items-center justify-center mx-auto text-[#f27447] shadow-sm">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold font-sans text-[#5c253d] uppercase">Growth Session Secured!</h4>
                      <p className="text-xs text-[#5c253d]/70 font-sans">Verification Code: <span className="font-mono text-[#f27447] font-bold">{bookingSuccess.id}</span></p>
                    </div>

                    {/* Meeting coordinates card */}
                    <div className="bg-white border border-[#5c253d]/15 rounded-2xl p-4 text-left space-y-3 shadow-sm">
                      <div className="flex items-center gap-2.5 border-b border-[#5c253d]/10 pb-2.5">
                        <MessageSquare className="w-4 h-4 text-[#f27447] shrink-0 animate-pulse" />
                        <div>
                          <span className="text-[8px] font-mono text-[#5c253d]/60 uppercase block font-bold">WhatsApp Secure Hotlink</span>
                          <a 
                            href={bookingSuccess.whatsAppLink || bookingSuccess.meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-mono text-[#f27447] hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>Direct WhatsApp with Rizwan</span>
                            <ArrowUpRight className="w-3 h-3 text-[#f27447]" />
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[8px] font-mono text-[#5c253d]/60 uppercase block font-bold">Scheduled Date</span>
                          <span className="text-xs font-sans text-[#5c253d] font-bold block leading-tight">{bookingSuccess.date}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-[#5c253d]/60 uppercase block font-bold">Time Coordinator</span>
                          <span className="text-xs font-sans text-[#f27447] font-bold block leading-tight">{bookingSuccess.time}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#5c253d]/10 text-[10px] text-[#5c253d]/70 font-sans leading-relaxed">
                        WhatsApp verification link compiled. Click the button below to directly launch a WhatsApp chat with Rizwan Saeed. Your scheduled Shopify & marketing channel audit is locked.
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <a 
                        href={bookingSuccess.whatsAppLink || bookingSuccess.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 py-2.5 bg-[#f27447] text-white hover:bg-[#d65f33] font-bold font-sans text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Launch WhatsApp</span>
                      </a>
                      <button 
                        onClick={closeBookingModal}
                        className="w-1/2 py-2.5 bg-white hover:bg-[#5c253d]/5 border border-[#5c253d]/15 text-[#5c253d]/80 font-bold font-sans text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        Dismiss Handshake
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
