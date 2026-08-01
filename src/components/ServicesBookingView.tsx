import React, { useState } from 'react';
import { Service, Language, Appointment, CategoryItem, SiteSettings } from '../types';
import { TIME_SLOTS } from '../data/mockData';
import { PriceTag } from './PriceTag';

interface ServicesBookingViewProps {
  services: Service[];
  selectedCategory: string; // 'all' or category id
  setSelectedCategory: (cat: string) => void;
  language: Language;
  onConfirmBooking: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  categories: CategoryItem[];
  siteSettings: SiteSettings;
}

export const ServicesBookingView: React.FC<ServicesBookingViewProps> = ({
  services,
  selectedCategory,
  setSelectedCategory,
  language,
  onConfirmBooking,
  categories,
  siteSettings,
}) => {
  const isArabic = language === 'ar';

  // Selected Services Array (Supports multiple selection)
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const toggleServiceSelection = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const removeServiceSelection = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const totalPriceQAR = selectedServices.reduce((sum, s) => sum + (s.priceQAR || 0), 0);
  const totalDurationMinutes = selectedServices.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  // Calendar Date selection state (Default: Today's date YYYY-MM-DD)
  const [selectedBookingDate, setSelectedBookingDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // Preferred Time selection state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:30 AM');

  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+974 ');

  // Form Error state
  const [formError, setFormError] = useState('');

  // Combined Category Filter Items (including "All")
  const allCategoryOption: CategoryItem = { id: 'all', label: 'All Services', arabicLabel: 'جميع الخدمات' };
  const filterCategories = [allCategoryOption, ...categories];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setFormError(isArabic ? 'يرجى اختيار خدمة واحدة على الأقل من القائمة أولاً' : 'Please select at least one service from the menu.');
      return;
    }
    if (!selectedBookingDate) {
      setFormError(isArabic ? 'يرجى تحديد تاريخ الحجز' : 'Please select an appointment date.');
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim() || phone.trim() === '+974') {
      setFormError(isArabic ? 'يرجى إكمال جميع حقول الحجز' : 'Please complete all required booking fields.');
      return;
    }

    setFormError('');

    const nameParts = fullName.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const serviceIds = selectedServices.map((s) => s.id).join(', ');
    const serviceNamesList = selectedServices.map((s) => (isArabic ? s.arabicTitle : s.title)).join(' + ');
    const serviceNameSummary = selectedServices.length > 1
      ? `${serviceNamesList} (${isArabic ? 'الإجمالي' : 'Total'}: ${totalPriceQAR} ${isArabic ? 'ر.ق' : 'QAR'})`
      : serviceNamesList;

    onConfirmBooking({
      clientName: fullName,
      clientInitials: initials,
      clientEmail: email,
      clientPhone: phone,
      serviceId: serviceIds,
      serviceName: serviceNameSummary,
      date: selectedBookingDate,
      time: selectedTimeSlot,
    });

    setFullName('');
    setEmail('');
    setPhone('+974 ');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 min-h-screen">
      
      {/* Hero Header */}
      <section className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#9b0044] text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
          <span>🇶🇦</span>
          <span>{isArabic ? 'الأسعار المعلنة بالريال القطري (ر.ق)' : 'Prices in Qatari Riyal (QAR)'}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl text-[#9b0044] mb-3 font-extrabold">
          {isArabic ? 'قائمة الخدمات والحجز الفوري' : 'Luxury Beauty Services & Reservation'}
        </h1>
        <p className="text-[#594045] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          {isArabic
            ? 'اختاري الخدمة المناسبة لكِ واستكملي بيانات الحجز بسهولة لضمان موعدكِ الملكي في صالون غلو بريتي بالدوحة.'
            : 'Explore our bespoke hair, nail, skincare, and makeup offerings in West Bay, Doha.'}
        </p>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Category Tabs & Services Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category Filter Tabs & Multi-select Hint */}
          <div className="space-y-3">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {filterCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#9b0044] text-white shadow-md border border-[#D4AF37]'
                        : 'bg-white text-[#594045] border border-[#D4AF37]/30 hover:border-[#9b0044] hover:bg-[#fdf5f7]'
                    }`}
                  >
                    {isArabic ? cat.arabicLabel : cat.label}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#fdf5f7] border border-[#D4AF37]/40 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-[#9b0044] font-bold shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">checklist</span>
                <span>
                  {isArabic
                    ? 'يمكنكِ تحديد أكثر من خدمة للحجز في نفس الموعد'
                    : 'You can select multiple services for a single appointment'}
                </span>
              </div>
              <span className="bg-[#9b0044] text-white px-2.5 py-1 rounded-full font-bold text-[11px] whitespace-nowrap">
                {isArabic ? `${selectedServices.length} خدمات محددة` : `${selectedServices.length} Selected`}
              </span>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredServices.map((service) => {
              const isSelected = selectedServices.some((s) => s.id === service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleServiceSelection(service)}
                  className={`bg-white p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                    isSelected 
                      ? 'border-[#9b0044] bg-[#fdf5f7] shadow-xl scale-[1.01]' 
                      : 'border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-md'
                  }`}
                >
                  {/* Selected Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    {isSelected ? (
                      <span className="bg-[#9b0044] text-[#D4AF37] border border-[#D4AF37] rounded-full px-2.5 py-0.5 shadow-md text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>{isArabic ? 'محددة' : 'Selected'}</span>
                      </span>
                    ) : (
                      <span className="bg-white/90 text-[#8f003f] border border-[#D4AF37]/50 rounded-full px-2.5 py-0.5 text-xs font-bold flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>{isArabic ? 'إضافة' : 'Add'}</span>
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Image */}
                  <div className="w-full h-44 mb-4 overflow-hidden rounded-xl bg-[#e5e2e1] border border-[#D4AF37]/20">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="font-display text-lg font-extrabold text-[#9b0044]">
                        {isArabic ? service.arabicTitle : service.title}
                      </h3>
                      <div className="text-end bg-[#9b0044]/10 text-[#9b0044] px-2.5 py-1 rounded-lg font-extrabold text-sm border border-[#D4AF37]/30 whitespace-nowrap ms-2">
                        <PriceTag
                          priceQAR={service.priceQAR}
                          priceDisplay={service.priceDisplay}
                          arabicPrice={service.arabicPrice}
                          isArabic={isArabic}
                        />
                      </div>
                    </div>

                    <p className="text-[#594045] text-xs leading-relaxed mb-3 font-medium">
                      {isArabic ? service.arabicDescription : service.description}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex justify-between items-center border-t border-[#D4AF37]/20 pt-3 mt-2 text-xs font-semibold">
                    <span className="text-[#594045] text-[11px]">
                      {service.durationMinutes ? `${service.durationMinutes} ${isArabic ? 'دقيقة' : 'mins'}` : ''}
                    </span>
                    <span className={isSelected ? "text-[#9b0044] font-bold" : "text-[#D4AF37] font-bold"}>
                      {isSelected 
                        ? (isArabic ? '✓ محددة (انقري للإلغاء)' : '✓ Selected (Click to remove)') 
                        : (isArabic ? '+ انقري لإضافة الخدمة' : '+ Click to add service')}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Reservation Widget Box */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/40">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-[#9b0044] font-extrabold">
                {isArabic ? 'تأكيد حجز الموعد' : 'Reserve Appointment'}
              </h2>
              <span className="text-xs bg-[#ffd9df] text-[#9b0044] font-bold px-2.5 py-1 rounded-md">
                🇶🇦 {isArabic ? 'الدوحة' : 'Doha'}
              </span>
            </div>

            {/* Selected Services Box */}
            <div className="mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#8f003f]">
                  {isArabic ? `الخدمات المختارة (${selectedServices.length}):` : `Selected Services (${selectedServices.length}):`}
                </span>
                {selectedServices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedServices([])}
                    className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    {isArabic ? 'إلغاء الكل' : 'Clear All'}
                  </button>
                )}
              </div>

              {selectedServices.length === 0 ? (
                <div className="p-4 bg-[#fdf5f7] rounded-2xl border border-dashed border-[#9b0044]/30 text-center text-xs text-[#8f003f] font-semibold">
                  {isArabic ? 'لم تقمي باختيار أي خدمة بعد. انقري على إحدى الخدمات لإضافتها للحجز.' : 'No services selected yet. Click any service to add it to your reservation.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="p-3 bg-[#fdf5f7] rounded-xl border border-[#D4AF37]/40 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#1c1b1b] truncate">
                          {isArabic ? service.arabicTitle : service.title}
                        </h4>
                        {service.durationMinutes ? (
                          <span className="text-[10px] text-[#594045] font-semibold block">
                            {service.durationMinutes} {isArabic ? 'دقيقة' : 'mins'}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-end flex items-center gap-2">
                        <span className="font-extrabold text-[#9b0044] text-xs">
                          <PriceTag
                            priceQAR={service.priceQAR}
                            priceDisplay={service.priceDisplay}
                            arabicPrice={service.arabicPrice}
                            isArabic={isArabic}
                          />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeServiceSelection(service.id);
                          }}
                          className="text-[#9b0044] hover:bg-[#9b0044] hover:text-white rounded-full p-0.5 transition-colors cursor-pointer"
                          title={isArabic ? 'حذف هذه الخدمة' : 'Remove service'}
                        >
                          <span className="material-symbols-outlined text-sm block">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Price & Duration Summary */}
              {selectedServices.length > 0 && (
                <div className="p-3.5 bg-gradient-to-r from-[#9b0044] to-[#730032] text-white rounded-2xl flex justify-between items-center shadow-md border border-[#D4AF37]/50">
                  <div>
                    <span className="text-[11px] text-[#D4AF37] font-bold block">
                      {isArabic ? `الإجمالي (${selectedServices.length} خدمات):` : `Total (${selectedServices.length} services):`}
                    </span>
                    {totalDurationMinutes > 0 && (
                      <span className="text-[10px] text-white/80 block font-medium">
                        {isArabic ? `الوقت المتوقع: ${totalDurationMinutes} دقيقة` : `Est. Time: ${totalDurationMinutes} mins`}
                      </span>
                    )}
                  </div>
                  <div className="text-end">
                    <span className="font-extrabold text-lg text-[#D4AF37]">
                      {totalPriceQAR} {isArabic ? 'ر.ق' : 'QAR'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5" id="bookingForm">
              
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8f003f] mb-2">
                  {isArabic ? 'اختر تاريخ الموعد المناسب:' : 'Select Appointment Date:'}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedBookingDate}
                    onChange={(e) => setSelectedBookingDate(e.target.value)}
                    className="w-full border-2 border-[#D4AF37]/50 rounded-xl py-2.5 px-3.5 bg-[#fdf5f7] focus:bg-white focus:outline-none focus:border-[#9b0044] text-sm font-bold text-[#1c1b1b] cursor-pointer"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8f003f] mb-2.5">
                  {isArabic ? 'توقيت الموعد المفضل:' : 'Preferred Time Slot:'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSlotSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          isSlotSelected
                            ? 'bg-[#9b0044] text-white border-[#D4AF37] shadow-sm'
                            : 'border-[#D4AF37]/30 text-[#1c1b1b] hover:bg-[#fdf5f7]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Info Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#594045] mb-1">
                    {isArabic ? 'الاسم الكامل:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'مثال: شيخة الكواري' : 'e.g., Sheikha Al-Kuwari'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-[#D4AF37]/40 rounded-xl py-2.5 px-3 bg-[#fcf9f8] focus:bg-white focus:outline-none focus:border-[#9b0044] text-sm text-[#1c1b1b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#594045] mb-1">
                    {isArabic ? 'البريد الإلكتروني:' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.qa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#D4AF37]/40 rounded-xl py-2.5 px-3 bg-[#fcf9f8] focus:bg-white focus:outline-none focus:border-[#9b0044] text-sm text-[#1c1b1b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#594045] mb-1">
                    {isArabic ? 'رقم الهاتف القطري:' : 'Qatar Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+974 5512 3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[#D4AF37]/40 rounded-xl py-2.5 px-3 bg-[#fcf9f8] focus:bg-white focus:outline-none focus:border-[#9b0044] text-sm text-[#1c1b1b]"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {formError}
                </p>
              )}

              {/* Confirm Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-burgundy w-full py-3.5 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">verified</span>
                  <span>{isArabic ? 'تأكيد الحجز الفوري' : 'Confirm Instant Booking'}</span>
                </button>
              </div>
            </form>

            {/* Direct WhatsApp Quick Booking Option */}
            <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 text-center">
              <p className="text-xs text-[#594045] font-semibold mb-2">
                {isArabic ? 'أو يمكنكِ الحجز المباشر عبر الواتساب:' : 'Or book directly via WhatsApp:'}
              </p>
              <a
                href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  isArabic
                    ? `مرحباً، أود حجز الخدمات التالية: ${
                        selectedServices.map((s) => s.arabicTitle).join(' + ') || 'خدمات التجميل'
                      }${totalPriceQAR > 0 ? ` (المجموع: ${totalPriceQAR} ر.ق)` : ''}`
                    : `Hello, I would like to book: ${
                        selectedServices.map((s) => s.title).join(' + ') || 'Beauty Services'
                      }${totalPriceQAR > 0 ? ` (Total: ${totalPriceQAR} QAR)` : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>{isArabic ? 'حجز سريع عبر واتساب الصالون' : 'Quick WhatsApp Reservation'}</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
