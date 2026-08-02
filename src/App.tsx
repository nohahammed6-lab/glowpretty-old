import { useState, useEffect } from 'react';
import {
  ViewMode,
  Language,
  Service,
  Appointment,
  AppointmentStatus,
  Review,
  AdminStat,
  CategoryItem,
  GalleryItem,
  SiteSettings,
  AboutContent,
  Supervisor,
  UserSession,
} from './types';
import {
  INITIAL_SERVICES,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
  INITIAL_CATEGORIES,
  INITIAL_GALLERY,
  INITIAL_SITE_SETTINGS,
  INITIAL_ABOUT_CONTENT,
  INITIAL_SUPERVISORS,
} from './data/mockData';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ServicesBookingView } from './components/ServicesBookingView';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { NewServiceModal } from './components/NewServiceModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { NotificationToast } from './components/NotificationToast';
import {
  subscribeToDoc,
  subscribeToDocArray,
  saveDoc,
  saveDocArray,
} from './lib/firebase';

export default function App() {
  // Navigation & Language
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [language, setLanguage] = useState<Language>('ar'); // Default to Arabic for Qatar
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userSession, setUserSession] = useState<UserSession>({ role: 'owner' });

  // Dynamic Application State with localStorage Persistence & Firestore Real-time Sync
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('glow_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('glow_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('glow_appointments');
      if (saved) {
        const parsed: Appointment[] = JSON.parse(saved);
        return parsed.filter(
          (item) =>
            item &&
            !item.serviceName?.includes('مكياج السهرات') &&
            !item.serviceName?.includes('Qatar Gala Evening') &&
            !JSON.stringify(item).includes('مكياج السهرات')
        );
      }
      return [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('glow_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('glow_gallery');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('glow_site_settings');
      return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    try {
      const saved = localStorage.getItem('glow_about_content');
      return saved ? JSON.parse(saved) : INITIAL_ABOUT_CONTENT;
    } catch {
      return INITIAL_ABOUT_CONTENT;
    }
  });

  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => {
    try {
      const saved = localStorage.getItem('glow_supervisors');
      return saved ? JSON.parse(saved) : INITIAL_SUPERVISORS;
    } catch {
      return INITIAL_SUPERVISORS;
    }
  });

  const [ownerPin, setOwnerPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('glow_owner_pin');
      return saved ? saved : '1234';
    } catch {
      return '1234';
    }
  });

  // Real-time listener for Firestore DB synchronization across all devices
  useEffect(() => {
    const unsubSite = subscribeToDoc<SiteSettings>('site_settings', (data) => setSiteSettings(data), INITIAL_SITE_SETTINGS);
    const unsubCat = subscribeToDocArray<CategoryItem>('categories', (items) => setCategories(items), INITIAL_CATEGORIES);
    const unsubSrv = subscribeToDocArray<Service>('services', (items) => setServices(items), INITIAL_SERVICES);
    const unsubApt = subscribeToDocArray<Appointment>('appointments', (items) => {
      const validItems = items.filter((item) => {
        if (!item) return false;
        const sName = item.serviceName || '';
        const rawJson = JSON.stringify(item);
        if (
          sName.includes('مكياج السهرات') ||
          sName.includes('Qatar Gala Evening') ||
          rawJson.includes('مكياج السهرات')
        ) {
          return false;
        }
        return true;
      }).map((item, idx) => ({
        ...item,
        id: item.id || `apt-fixed-${idx}`,
      }));

      if (validItems.length !== items.length) {
        saveDocArray('appointments', validItems);
      }

      setAppointments(validItems);
    }, []);
    const unsubRev = subscribeToDocArray<Review>('reviews', (items) => setReviews(items), INITIAL_REVIEWS);
    const unsubGal = subscribeToDocArray<GalleryItem>('gallery', (items) => setGallery(items), INITIAL_GALLERY);
    const unsubAbt = subscribeToDoc<AboutContent>('about_content', (data) => setAboutContent(data), INITIAL_ABOUT_CONTENT);
    const unsubSup = subscribeToDocArray<Supervisor>('supervisors', (items) => {
      const hasCleanedSup = localStorage.getItem('glow_supervisors_clean_v1');
      if (!hasCleanedSup) {
        saveDocArray('supervisors', []);
        try {
          localStorage.setItem('glow_supervisors', JSON.stringify([]));
          localStorage.setItem('glow_supervisors_clean_v1', 'true');
        } catch {}
        setSupervisors([]);
        return;
      }
      const sanitized = (items || []).filter(Boolean).map((sup, idx) => ({
        ...sup,
        id: sup.id || `sup-fixed-${idx}`,
      }));
      setSupervisors(sanitized);
    }, INITIAL_SUPERVISORS);
    const unsubPin = subscribeToDoc<{ pin: string }>('owner_pin', (data) => setOwnerPin(data?.pin || '1234'), { pin: '1234' });

    return () => {
      unsubSite();
      unsubCat();
      unsubSrv();
      unsubApt();
      unsubRev();
      unsubGal();
      unsubAbt();
      unsubSup();
      unsubPin();
    };
  }, []);

  const handleUpdateOwnerPin = (newPin: string) => {
    setOwnerPin(newPin);
    saveDoc('owner_pin', { pin: newPin });
    try {
      localStorage.setItem('glow_owner_pin', newPin);
    } catch {
      // ignore
    }
  };

  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [adminLoginInitialTab, setAdminLoginInitialTab] = useState<'owner' | 'supervisor'>('owner');

  const handleOpenAdminLogin = (tab: 'owner' | 'supervisor') => {
    setAdminLoginInitialTab(tab);
    setAdminLoginModalOpen(true);
  };

  // Calculate real-time dynamic statistics
  const computedStats: AdminStat = {
    totalBookings: appointments.length,
    bookingsGrowth: appointments.length > 0 ? '+100%' : '0%',
    todayRevenueQAR: appointments.reduce((sum, apt) => {
      if (apt.status === 'Cancelled') return sum;
      if (typeof apt.priceQAR === 'number' && apt.priceQAR > 0) return sum + apt.priceQAR;
      const srv = services.find((s) => s.id === apt.serviceId);
      return sum + (srv ? srv.priceQAR : 0);
    }, 0),
    revenueGrowth: appointments.length > 0 ? '+100%' : '0%',
    activeServicesCount: services.length,
    customerSatisfaction:
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0,
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('glow_categories', JSON.stringify(categories));
    } catch (e) { console.error(e); }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_services', JSON.stringify(services));
    } catch (e) { console.error(e); }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_appointments', JSON.stringify(appointments));
    } catch (e) { console.error(e); }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_reviews', JSON.stringify(reviews));
    } catch (e) { console.error(e); }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_gallery', JSON.stringify(gallery));
    } catch (e) { console.error(e); }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_site_settings', JSON.stringify(siteSettings));
    } catch (e) { console.error(e); }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_about_content', JSON.stringify(aboutContent));
    } catch (e) { console.error(e); }
  }, [aboutContent]);

  useEffect(() => {
    try {
      localStorage.setItem('glow_supervisors', JSON.stringify(supervisors));
    } catch (e) { console.error(e); }
  }, [supervisors]);

  // Modals & Toast State
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [newAppointmentModalOpen, setNewAppointmentModalOpen] = useState(false);
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync RTL direction & check URL hash for admin secret entrance
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }

    // Check if URL hash is #admin or #manager
    if (window.location.hash === '#admin' || window.location.hash === '#manager') {
      setAdminLoginModalOpen(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#manager') {
        setAdminLoginModalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Handlers for Client Booking
  const handleConfirmBooking = (
    bookingData: Omit<Appointment, 'id' | 'createdAt' | 'status'>
  ) => {
    const newApt: Appointment = {
      ...bookingData,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => {
      const nextAppointments = [newApt, ...prev];
      saveDocArray('appointments', nextAppointments);
      return nextAppointments;
    });

    setConfirmedAppointment(newApt);
    showToast(
      language === 'ar'
        ? `تم حجز الموعد بنجاح للعميلة ${newApt.clientName}!`
        : `Appointment reserved for ${newApt.clientName}!`
    );
  };

  // Handlers for Admin - Appointments
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) => {
      const nextAppointments = prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
      saveDocArray('appointments', nextAppointments);
      return nextAppointments;
    });
    showToast(
      language === 'ar' ? `تم تغيير حالة الحجز إلى: ${newStatus}` : `Status updated to ${newStatus}`
    );
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => {
      const nextAppointments = prev.filter((a) => a.id !== id);
      saveDocArray('appointments', nextAppointments);
      return nextAppointments;
    });
    showToast(language === 'ar' ? 'تم حذف الموعد' : 'Appointment deleted.');
  };

  const handleAddAppointmentAdmin = (
    newAptData: Omit<Appointment, 'id' | 'createdAt'>
  ) => {
    const newApt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => {
      const nextAppointments = [newApt, ...prev];
      saveDocArray('appointments', nextAppointments);
      return nextAppointments;
    });
    showToast(language === 'ar' ? 'تم إضافة حجز جديد بنجاح' : 'New appointment added.');
  };

  // Handlers for Admin - Categories
  const handleAddCategory = (cat: CategoryItem) => {
    setCategories((prev) => {
      const nextCategories = [...prev, cat];
      saveDocArray('categories', nextCategories);
      return nextCategories;
    });
    showToast(language === 'ar' ? `تم إضافة تصنيف: ${cat.arabicLabel}` : `Category added: ${cat.label}`);
  };

  const handleUpdateCategory = (cat: CategoryItem) => {
    setCategories((prev) => {
      const nextCategories = prev.map((c) => (c.id === cat.id ? cat : c));
      saveDocArray('categories', nextCategories);
      return nextCategories;
    });
    showToast(language === 'ar' ? 'تم تحديث التصنيف' : 'Category updated.');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => {
      const nextCategories = prev.filter((c) => c.id !== id);
      saveDocArray('categories', nextCategories);
      return nextCategories;
    });
    showToast(language === 'ar' ? 'تم حذف التصنيف' : 'Category deleted.');
  };

  // Handlers for Admin - Services
  const handleAddServiceAdmin = (newService: Service) => {
    setServices((prev) => {
      const nextServices = [...prev, newService];
      saveDocArray('services', nextServices);
      return nextServices;
    });
    showToast(language === 'ar' ? `تم إضافة خدمة: ${newService.arabicTitle}` : `New service added.`);
  };

  const handleUpdateServiceAdmin = (updatedService: Service) => {
    setServices((prev) => {
      const nextServices = prev.map((s) => (s.id === updatedService.id ? updatedService : s));
      saveDocArray('services', nextServices);
      return nextServices;
    });
    showToast(language === 'ar' ? 'تم تحديث بيانات الخدمة' : 'Service updated.');
  };

  const handleDeleteServiceAdmin = (id: string) => {
    setServices((prev) => {
      const nextServices = prev.filter((s) => s.id !== id);
      saveDocArray('services', nextServices);
      return nextServices;
    });
    showToast(language === 'ar' ? 'تم حذف الخدمة من القائمة' : 'Service deleted.');
  };

  // Handlers for Admin - Site Settings
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    saveDoc('site_settings', newSettings);
    showToast(language === 'ar' ? 'تم حفظ بيانات الموقع والتواصل بنجاح' : 'Site settings saved.');
  };

  // Handlers for Admin - Gallery
  const handleAddGalleryItem = (item: GalleryItem) => {
    setGallery((prev) => {
      const nextGallery = [item, ...prev];
      saveDocArray('gallery', nextGallery);
      return nextGallery;
    });
    showToast(language === 'ar' ? 'تم إضافة الصورة لمعرض الصور' : 'Gallery item added.');
  };

  const handleUpdateGalleryItem = (updatedItem: GalleryItem) => {
    setGallery((prev) => {
      const nextGallery = prev.map((g) => (g.id === updatedItem.id ? updatedItem : g));
      saveDocArray('gallery', nextGallery);
      return nextGallery;
    });
    showToast(language === 'ar' ? 'تم تحديث الصورة بالمعرض' : 'Gallery item updated.');
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGallery((prev) => {
      const nextGallery = prev.filter((g) => g.id !== id);
      saveDocArray('gallery', nextGallery);
      return nextGallery;
    });
    showToast(language === 'ar' ? 'تم حذف الصورة من المعرض' : 'Gallery item deleted.');
  };

  // Handlers for Admin - Supervisors Management
  const handleAddSupervisor = (sup: Supervisor) => {
    setSupervisors((prev) => {
      const nextSupervisors = [sup, ...prev];
      saveDocArray('supervisors', nextSupervisors);
      return nextSupervisors;
    });
    showToast(language === 'ar' ? `تم إضافة المشرف: ${sup.name}` : `Supervisor ${sup.name} added.`);
  };

  const handleUpdateSupervisor = (updatedSup: Supervisor) => {
    setSupervisors((prev) => {
      const nextSupervisors = prev.map((s) => (s.id === updatedSup.id ? updatedSup : s));
      saveDocArray('supervisors', nextSupervisors);
      return nextSupervisors;
    });
    showToast(language === 'ar' ? 'تم تحديث بيانات وصلاحيات المشرف' : 'Supervisor updated.');
  };

  const handleDeleteSupervisor = (id: string) => {
    setSupervisors((prev) => {
      const nextSupervisors = prev.filter((s) => s.id !== id);
      saveDocArray('supervisors', nextSupervisors);
      return nextSupervisors;
    });
    showToast(language === 'ar' ? 'تم حذف حساب المشرف' : 'Supervisor deleted.');
  };

  // Handlers for Admin - About Content
  const handleUpdateAboutContent = (about: AboutContent) => {
    setAboutContent(about);
    saveDoc('about_content', about);
    showToast(language === 'ar' ? 'تم حفظ النبذة التعريفية للصالون' : 'About section updated.');
  };

  // Handlers for Admin/Client - Reviews
  const handleAddReview = (review: Review) => {
    setReviews((prev) => {
      const nextReviews = [review, ...prev];
      saveDocArray('reviews', nextReviews);
      return nextReviews;
    });
    showToast(language === 'ar' ? 'شكراً لكِ! تم إضافة تقييمكِ بنجاح.' : 'Thank you! Your review has been submitted.');
  };

  const handleUpdateReview = (review: Review) => {
    setReviews((prev) => {
      const nextReviews = prev.map((r) => (r.id === review.id ? review : r));
      saveDocArray('reviews', nextReviews);
      return nextReviews;
    });
    showToast(language === 'ar' ? 'تم تعديل التقييم بنجاح' : 'Review updated successfully.');
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => {
      const nextReviews = prev.filter((r) => r.id !== id);
      saveDocArray('reviews', nextReviews);
      return nextReviews;
    });
    showToast(language === 'ar' ? 'تم حذف التقييم' : 'Review deleted.');
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-[#fcf9f8] text-[#1c1b1b] selection:bg-[#ffd9df] selection:text-[#3f0018]">
      
      {/* Active Admin Indicator Bar */}
      {viewMode === 'admin' && (
        <div className="bg-[#8f003f] text-[#D4AF37] px-6 py-2 border-b border-[#D4AF37]/50 flex items-center justify-between text-xs font-bold shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#D4AF37]">admin_panel_settings</span>
            <span>
              {userSession.role === 'owner'
                ? language === 'ar'
                  ? 'أنتِ الآن في لوحة تحكم المدير العام للصالون 👑'
                  : 'Salon Manager Console (Owner) 👑'
                : language === 'ar'
                ? `لوحة تحكم المشرف: ${userSession.supervisorData?.name || ''} 🔑`
                : `Supervisor Console: ${userSession.supervisorData?.name || ''} 🔑`}
            </span>
          </div>
          <button
            onClick={() => setViewMode('home')}
            className="bg-[#D4AF37] text-[#3f0018] hover:bg-white px-3.5 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>{language === 'ar' ? 'العودة لموقع العملاء' : 'Back to Client Site'}</span>
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        language={language}
        setLanguage={setLanguage}
        onBookNowClick={() => {
          setViewMode('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminLoginClick={(tab) => {
          if (viewMode === 'admin') {
            setViewMode('home');
          } else {
            handleOpenAdminLogin(tab);
          }
        }}
        siteSettings={siteSettings}
      />

      {/* Main View Canvas */}
      <div className="flex-1">
        {viewMode === 'home' && (
          <HomeView
            setViewMode={setViewMode}
            language={language}
            reviews={reviews}
            services={services}
            onAddReview={handleAddReview}
            onSelectServiceCategory={(cat) => setSelectedCategory(cat)}
            aboutContent={aboutContent}
            gallery={gallery}
            siteSettings={siteSettings}
            categories={categories}
          />
        )}

        {viewMode === 'booking' && (
          <ServicesBookingView
            services={services}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            language={language}
            onConfirmBooking={handleConfirmBooking}
            categories={categories}
            siteSettings={siteSettings}
          />
        )}

        {viewMode === 'admin' && (
          <AdminDashboard
            appointments={appointments}
            services={services}
            stats={computedStats}
            language={language}
            categories={categories}
            gallery={gallery}
            siteSettings={siteSettings}
            aboutContent={aboutContent}
            reviews={reviews}
            supervisors={supervisors}
            userSession={userSession}
            ownerPin={ownerPin}
            onUpdateOwnerPin={handleUpdateOwnerPin}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onOpenNewAppointmentModal={() => setNewAppointmentModalOpen(true)}
            onOpenNewServiceModal={() => setNewServiceModalOpen(true)}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateService={handleUpdateServiceAdmin}
            onDeleteService={handleDeleteServiceAdmin}
            onUpdateSiteSettings={handleUpdateSiteSettings}
            onAddGalleryItem={handleAddGalleryItem}
            onUpdateGalleryItem={handleUpdateGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onAddSupervisor={handleAddSupervisor}
            onUpdateSupervisor={handleUpdateSupervisor}
            onDeleteSupervisor={handleDeleteSupervisor}
            onUpdateAboutContent={handleUpdateAboutContent}
            onAddReview={handleAddReview}
            onUpdateReview={handleUpdateReview}
            onDeleteReview={handleDeleteReview}
            onBackToClientView={() => setViewMode('home')}
          />
        )}
      </div>

      {/* Footer (Hidden in Admin Console for full dashboard view) */}
      {viewMode !== 'admin' && (
        <Footer
          setViewMode={setViewMode}
          language={language}
          siteSettings={siteSettings}
          onAdminLoginClick={(tab) => handleOpenAdminLogin(tab)}
        />
      )}

      {/* Modals & Toast Alerts */}
      <BookingModal
        appointment={confirmedAppointment}
        language={language}
        onClose={() => {
          setConfirmedAppointment(null);
          setSelectedCategory('all');
          setViewMode('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <NewAppointmentModal
        services={services}
        isOpen={newAppointmentModalOpen}
        onClose={() => setNewAppointmentModalOpen(false)}
        onAdd={handleAddAppointmentAdmin}
      />

      <NewServiceModal
        isOpen={newServiceModalOpen}
        onClose={() => setNewServiceModalOpen(false)}
        onAdd={handleAddServiceAdmin}
        categories={categories}
      />

      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        supervisors={supervisors}
        initialTab={adminLoginInitialTab}
        ownerPin={ownerPin}
        onSuccess={(session) => {
          setUserSession(session);
          setViewMode('admin');
          const title =
            session.role === 'owner'
              ? language === 'ar'
                ? 'تم الدخول بصلحية المدير العام'
                : 'Logged in as Owner'
              : language === 'ar'
              ? `مرحباً المشرفة ${session.supervisorData?.name || ''}`
              : `Welcome Supervisor ${session.supervisorData?.name || ''}`;
          showToast(title);
        }}
        language={language}
      />

      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}
