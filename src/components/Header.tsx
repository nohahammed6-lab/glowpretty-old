import React, { useState } from 'react';
import { ViewMode, Language, SiteSettings } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onBookNowClick: () => void;
  onAdminLoginClick: (tab: 'owner' | 'supervisor') => void;
  siteSettings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  language,
  setLanguage,
  onBookNowClick,
  onAdminLoginClick,
  siteSettings,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isArabic = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(isArabic ? 'en' : 'ar');
  };

  const navTo = (target: 'home' | 'booking' | 'gallery' | 'about' | 'contact') => {
    setSidebarOpen(false);
    if (target === 'home') {
      setViewMode('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'booking') {
      setViewMode('booking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (viewMode !== 'home') {
        setViewMode('home');
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#fcf9f8]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center px-4 md:px-8 py-3.5 w-full max-w-7xl mx-auto">
          
          {/* Left / Start: Side Menu Toggle + Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full text-[#9b0044] hover:bg-[#9b0044]/10 transition-colors cursor-pointer"
              title={isArabic ? 'افتح القائمة الجانبية' : 'Open Sidebar Menu'}
            >
              <span className="material-symbols-outlined text-2xl">
                menu
              </span>
            </button>

            {/* Brand Logo & Qatar Badge */}
            <div 
              onClick={() => navTo('home')}
              className="cursor-pointer group flex items-center gap-2"
            >
              <span className="font-display text-2xl md:text-3xl font-extrabold text-[#9b0044] tracking-tight group-hover:text-[#8f003f] transition-colors">
                GLOW PRETTY
              </span>
              <span className="bg-[#9b0044] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1 shadow-2xs">
                <span>🇶🇦</span>
                <span>{isArabic ? 'قطر' : 'QATAR'}</span>
              </span>
            </div>
          </div>



          {/* Right Actions: Clean Language Switcher + Sleek Book Button */}
          <div className="flex items-center gap-3">
            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold text-[#9b0044] hover:bg-[#9b0044]/10 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
            >
              <span className="material-symbols-outlined text-base">language</span>
              <span className="font-extrabold">{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Sleek Fancy Book Button */}
            <button
              onClick={onBookNowClick}
              className="btn-burgundy px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              <span>{isArabic ? 'احجزي الآن' : 'Book Now'}</span>
            </button>
          </div>

        </nav>
      </header>

      {/* Slide-Out Side Navigation Drawer (القائمة الجانبية) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dark Glass Overlay */}
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Side Drawer Content */}
          <div className={`relative w-80 max-w-[85vw] bg-[#fcf9f8] h-full shadow-2xl flex flex-col justify-between border-e border-[#D4AF37]/40 z-10 animate-fade-in overflow-y-auto ${
            isArabic ? 'right-0 ms-auto' : 'left-0 me-auto'
          }`}>
            
            {/* Top Bar */}
            <div className="p-5 border-b border-[#D4AF37]/30 bg-[#9b0044] text-white flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-xl text-[#D4AF37] tracking-wide">
                  GLOW PRETTY
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  {isArabic ? 'الدوحة، قطر 🇶🇦' : 'Doha, Qatar 🇶🇦'}
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-[#D4AF37] p-1 rounded-full transition-colors"
                aria-label="Close Sidebar"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Navigation Buttons inside Sidebar */}
            <div className="p-5 flex flex-col gap-2.5 flex-1">
              <p className="text-[11px] font-bold text-[#8f003f] uppercase tracking-wider mb-1">
                {isArabic ? 'تنقل في الموقع' : 'Main Navigation'}
              </p>

              <button
                onClick={() => navTo('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-start font-bold transition-all cursor-pointer ${
                  viewMode === 'home'
                    ? 'bg-[#9b0044] text-white shadow-md'
                    : 'bg-white hover:bg-[#fdf6e2] text-[#4d363b] border border-[#e1bec4]/40'
                }`}
              >
                <span className="material-symbols-outlined">home</span>
                <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
              </button>

              <button
                onClick={() => navTo('booking')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-start font-bold transition-all cursor-pointer ${
                  viewMode === 'booking'
                    ? 'bg-[#9b0044] text-white shadow-md'
                    : 'bg-white hover:bg-[#fdf6e2] text-[#4d363b] border border-[#e1bec4]/40'
                }`}
              >
                <span className="material-symbols-outlined">spa</span>
                <span>{isArabic ? 'الخدمات والحجز' : 'Services & Booking'}</span>
              </button>

              <button
                onClick={() => navTo('gallery')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-start font-bold bg-white hover:bg-[#fdf6e2] text-[#4d363b] border border-[#e1bec4]/40 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">photo_library</span>
                <span>{isArabic ? 'معرض الصور' : 'Gallery'}</span>
              </button>

              <button
                onClick={() => navTo('about')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-start font-bold bg-white hover:bg-[#fdf6e2] text-[#4d363b] border border-[#e1bec4]/40 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">info</span>
                <span>{isArabic ? 'عن الصالون' : 'About Salon'}</span>
              </button>

              <button
                onClick={() => navTo('contact')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-start font-bold bg-white hover:bg-[#fdf6e2] text-[#4d363b] border border-[#e1bec4]/40 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">call</span>
                <span>{isArabic ? 'اتصل بنا واللوكيشن' : 'Contact & Location'}</span>
              </button>

              {/* Management Portals - Separate Links */}
              <div className="pt-3 border-t border-[#D4AF37]/30 mt-2 space-y-2">
                <p className="text-[11px] font-bold text-[#8f003f] uppercase tracking-wider mb-1">
                  {isArabic ? 'لوحات التحكم والإدارة' : 'Management Consoles'}
                </p>

                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    onAdminLoginClick('owner');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-start font-bold bg-[#9b0044] text-white hover:bg-[#8f003f] transition-all cursor-pointer shadow-xs text-xs"
                >
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  <span>{isArabic ? 'دخول المدير العام 👑' : 'Owner / Manager Portal 👑'}</span>
                </button>

                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    onAdminLoginClick('supervisor');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-start font-bold bg-[#fdf5f7] text-[#9b0044] hover:bg-[#f9e2e8] border border-[#9b0044]/30 transition-all cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>{isArabic ? 'دخول المشرفين 🔑' : 'Supervisor Portal 🔑'}</span>
                </button>
              </div>

            </div>

            {/* Quick Contact & WhatsApp Bottom Info */}
            <div className="p-5 border-t border-[#D4AF37]/30 bg-[#fdf5f7]">
              <div className="flex flex-col gap-2 mb-4 text-xs text-[#594045]">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="material-symbols-outlined text-base text-[#9b0044]">phone</span>
                  <span dir="ltr" className="inline-block unicode-bidi-isolate font-bold">{siteSettings.phone}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="material-symbols-outlined text-base text-[#9b0044]">location_on</span>
                  <span className="truncate">{isArabic ? siteSettings.locationAR : siteSettings.locationEN}</span>
                </div>
              </div>

              {/* Instant WhatsApp Button */}
              <a
                href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span className="text-sm">{isArabic ? 'واتساب الصالون المباشر' : 'Direct WhatsApp'}</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
