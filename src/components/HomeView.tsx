import React, { useState } from 'react';
import { ViewMode, Language, Review, AboutContent, GalleryItem, SiteSettings, CategoryItem, Service } from '../types';
import { WriteReviewModal } from './WriteReviewModal';

interface HomeViewProps {
  setViewMode: (mode: ViewMode) => void;
  language: Language;
  reviews: Review[];
  services?: Service[];
  onAddReview?: (review: Review) => void;
  onSelectServiceCategory: (cat: string) => void;
  aboutContent: AboutContent;
  gallery: GalleryItem[];
  siteSettings: SiteSettings;
  categories: CategoryItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  setViewMode,
  language,
  reviews,
  services = [],
  onAddReview,
  onSelectServiceCategory,
  aboutContent,
  gallery,
  siteSettings,
  categories,
}) => {
  const isArabic = language === 'ar';
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-12 pb-16 overflow-hidden">
        {/* Background Image with High-End Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center scale-105 transition-transform duration-[12s] ease-linear hover:scale-100"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsMGMXYhPrbH1WJ_aj9vE92B6K-WMS0arHtFnIauna3ItgRupCK4TPg_9yAcnWrjlvHwryuTvw3SB3ZtnpoGjAcYeDccrPC5kqrd5yyEXOYmPaECy5zTC44GbsSDkGdcpl0R0REnYWCcUnw-s2CDEkfUPc2bQi7QIqZg-MOBOlIG9GmhZLiS_gZAPvdKP0DRv3Cxqr_9cc2TAYibe2ed3pToJxqhnp1zUR84yCHeIJGHC8NUP-v18I')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8] via-[#fcf9f8]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-start gap-6 py-8">
          
          {/* Qatar Badge Header */}
          <div className="inline-flex items-center gap-2 bg-[#9b0044] text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold border border-[#D4AF37]/50 shadow-md">
            <span>🇶🇦</span>
            <span>{isArabic ? 'صالون التجميل الملكي الأول في قطر - الدوحة' : 'Qatar’s Premier Luxury Sanctuary - Doha'}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#9b0044] max-w-2xl leading-tight font-extrabold tracking-tight">
            {isArabic ? (
              <>
                إشراقة ملكية، <br />
                <span className="text-[#1c1b1b] font-bold">بلمسة قطرية فاخرة.</span>
              </>
            ) : (
              <>
                Effortless Radiance, <br />
                <span className="text-[#1c1b1b] font-bold">Exclusively in Qatar.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#594045] max-w-xl leading-relaxed font-medium">
            {isArabic
              ? 'اختبري أرقى تجارب الرفاهية والعناية بالذات في أبراج الخليج الغربي بالدوحة. نجمع بين أحدث صيحات التجميل العالمية والضيافة القطرية الأصيلة.'
              : 'Experience the pinnacle of royal pampering in West Bay, Doha. From hair transformations to dermal therapy, we refine your natural beauty.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={() => setViewMode('booking')}
              className="btn-burgundy px-8 py-4 rounded-full font-bold text-base flex items-center gap-2 cursor-pointer shadow-xl"
            >
              <span className="material-symbols-outlined text-xl">calendar_month</span>
              <span>{isArabic ? 'احجزي جلستكِ الآن' : 'Reserve Your Session'}</span>
            </button>

            <button
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline-gold px-7 py-3.5 rounded-full font-bold text-base flex items-center gap-2 cursor-pointer"
            >
              <span>{isArabic ? 'استكشفي الخدمات' : 'Explore Services'}</span>
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </button>

            <a
              href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebd53] text-white px-5 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-xl">chat</span>
              <span>{isArabic ? 'استشارة واتساب' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-[#f8f3f1] border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Story Box */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[#9b0044] font-bold text-xs tracking-widest uppercase bg-[#ffd9df] px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>{isArabic ? 'عن صالون غلو بريتي' : 'ABOUT GLOW PRETTY'}</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1c1b1b]">
                {isArabic ? aboutContent.titleAR : aboutContent.titleEN}
              </h2>

              <p className="text-[#594045] leading-relaxed text-base font-medium">
                {isArabic ? aboutContent.storyAR : aboutContent.storyEN}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(isArabic ? aboutContent.featuresAR : aboutContent.featuresEN).map((ft, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#D4AF37]/30 shadow-2xs">
                    <span className="material-symbols-outlined text-[#9b0044] text-lg">verified</span>
                    <span className="text-xs font-bold text-[#1c1b1b]">{ft}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Feature Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 h-[400px]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa1kmAYlPAESsmMTj8fLNVnuNpGhcEbhb_sA3eLnpMjMojqKWbzpWE7m5pe6vWWxJoDMl0RK4X9n8RqVn6gLqu2eLQjajQrq-PP8ilxlnTS7f4B3EbM5MCqmlijpgaCiCrXvqqWvx6qW0kSt2F_MwhawkhFDJOTuPKEsjdsgWvrHl9NyEj2Ul7NVGzl_Ljdejn3Gup7WkjCKLlrbeDw1JEQGITH36Ylrzw7fpRMl4t6jCX52Ffz_ON"
                alt="Glow Pretty Salon"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 glass-panel rounded-2xl border border-[#D4AF37]/40">
                <p className="font-bold text-sm text-[#D4AF37]">
                  {isArabic ? 'الدوحة - مدينة خليفة - قطر 🇶🇦' : 'Doha - Madinat Khalifa - Qatar 🇶🇦'}
                </p>
                <p className="text-xs text-white/90">
                  {isArabic ? 'هاتف التواصل: ' + siteSettings.phone : 'Phone: ' + siteSettings.phone}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Categories & Services Highlights */}
      <section id="services" className="py-20 bg-[#fcf9f8]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-[#9b0044] font-bold text-xs tracking-widest uppercase bg-[#ffd9df] px-3 py-1 rounded-full">
                {isArabic ? 'خدماتنا الفاخرة' : 'OUR LUXURY SERVICES'}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-3 text-[#1c1b1b]">
                {isArabic ? 'تصنيفات الخدمات المتاحة' : 'Explore Service Categories'}
              </h2>
            </div>
            <button
              onClick={() => setViewMode('booking')}
              className="btn-burgundy px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>{isArabic ? 'استعرضي القائمة وحجزي (ر.ق)' : 'Full Menu & Prices (QAR)'}</span>
              <span className="material-symbols-outlined text-base">east</span>
            </button>
          </div>

          {/* Dynamic Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectServiceCategory(cat.id);
                  setViewMode('booking');
                }}
                className="bg-white p-6 rounded-2xl border-2 border-[#D4AF37]/30 hover:border-[#9b0044] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#D4AF37]/15 p-3 rounded-bl-2xl">
                  <span className="material-symbols-outlined text-[#9b0044] text-2xl group-hover:scale-125 transition-transform">
                    sparkles
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-[#9b0044] group-hover:text-[#68002b] transition-colors mt-2">
                    {isArabic ? cat.arabicLabel : cat.label}
                  </h3>
                  <p className="text-xs text-[#594045] mt-2 font-semibold">
                    {isArabic ? 'انقري للاستعراض والحجز الفوري بالريال القطري' : 'Click to view & book with QAR pricing'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-[#9b0044]">
                  <span>{isArabic ? 'احجزي الآن' : 'Book Now'}</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#fdf5f7] border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-14">
            <span className="text-[#9b0044] font-bold text-xs tracking-widest uppercase bg-white px-3 py-1 rounded-full border border-[#D4AF37]/40">
              {isArabic ? 'تقييمات الزائرات في قطر' : 'QATAR CLIENT REVIEWS'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1c1b1b] mt-3">
              {isArabic ? 'آراء وتجارب عميلاتنا الفاخرة' : 'Reflections of Royalty'}
            </h2>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setWriteReviewOpen(true)}
                className="bg-white hover:bg-[#9b0044] text-[#9b0044] hover:text-white border-2 border-[#D4AF37] px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">rate_review</span>
                <span>{isArabic ? 'أضيفي تقييمكِ وانطباعكِ' : 'Write a Review'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-[#D4AF37]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-[#D4AF37]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined filled text-lg">
                          star
                        </span>
                      ))}
                    </div>
                    {rev.serviceName && (
                      <span className="text-[11px] font-bold text-[#9b0044] bg-[#ffd9df] px-2.5 py-0.5 rounded-full">
                        {rev.serviceName}
                      </span>
                    )}
                  </div>
                  <p className="text-[#1c1b1b] font-medium text-sm leading-relaxed mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#f0eded]">
                  <div className={`w-10 h-10 rounded-full ${rev.avatarColor} flex items-center justify-center font-bold text-[#9b0044] border border-[#D4AF37]`}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1c1b1b] text-sm">{rev.name}</h4>
                    <span className="text-xs text-[#6b5a60] font-medium">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Client Write Review */}
        {onAddReview && (
          <WriteReviewModal
            isOpen={writeReviewOpen}
            onClose={() => setWriteReviewOpen(false)}
            onAddReview={onAddReview}
            services={services}
            language={language}
          />
        )}
      </section>

      {/* Dynamic Gallery Section */}
      <section id="gallery" className="py-20 bg-[#fcf9f8]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <span className="text-[#9b0044] font-bold text-xs tracking-widest uppercase bg-[#ffd9df] px-3 py-1 rounded-full">
              {isArabic ? 'معرض الصور الفاخر' : 'SALON ATMOSPHERE'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-3 text-[#1c1b1b]">
              {isArabic ? 'أجواء صالون غلو بريتي بالدوحة' : 'Inside GLOW PRETTY Qatar'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="rounded-2xl overflow-hidden relative group shadow-md hover:shadow-2xl transition-all duration-500 h-64 border border-[#D4AF37]/30"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                  <span className="text-white font-bold text-sm text-[#D4AF37]">
                    {isArabic ? img.arabicTitle : img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 burgundy-gradient-bg text-white text-center relative overflow-hidden border-t-2 border-[#D4AF37]">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-5 leading-tight text-white">
            {isArabic ? 'احجزي موعدكِ الملكي في الدوحة' : 'Begin Your Transformation in Doha'}
          </h2>
          <p className="text-[#ffd9df] text-base md:text-lg mb-8 font-medium">
            {isArabic
              ? 'تألقي بأجمل الإطلالات مع أفضل الخبراء في صالون غلو بريتي - الدوحة، مدينة خليفة.'
              : 'Book your appointment today in Madinat Khalifa, Doha.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setViewMode('booking')}
              className="btn-gold px-10 py-4 rounded-full font-bold text-base cursor-pointer shadow-2xl"
            >
              {isArabic ? 'حجز موعد الآن (ر.ق)' : 'Book Session (QAR)'}
            </button>
            <a
              href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-base transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">call</span>
              <span dir="ltr" className="inline-block unicode-bidi-isolate font-bold">{siteSettings.phone}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
