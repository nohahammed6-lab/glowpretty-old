import React from 'react';
import { Appointment, Language } from '../types';

interface BookingModalProps {
  appointment: Appointment | null;
  language: Language;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  appointment,
  language,
  onClose,
}) => {
  if (!appointment) return null;
  const isArabic = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/50 relative overflow-hidden text-center transform transition-all animate-scale-up">
        {/* Top Decorative Gold & Magenta Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#9b0044] via-[#D4AF37] to-[#9b0044]" />

        {/* Floating Sparkle / Success Badge */}
        <div className="relative mx-auto mb-5 w-20 h-20">
          <div className="absolute inset-0 bg-[#9b0044]/15 rounded-full animate-ping" />
          <div className="relative w-20 h-20 bg-gradient-to-tr from-[#9b0044] to-[#730032] rounded-full flex items-center justify-center text-[#D4AF37] shadow-xl border-2 border-[#D4AF37]">
            <span className="material-symbols-outlined text-4xl font-extrabold">task_alt</span>
          </div>
        </div>

        {/* Header */}
        <span className="inline-block bg-[#fdf5f7] text-[#9b0044] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
          {isArabic ? '✨ تم تأكيد طلب الحجز بنجاح' : '✨ Booking Request Confirmed'}
        </span>

        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] mb-2 leading-tight">
          {isArabic ? 'شكراً لكِ، يسعدنا استقبالكِ! 🌸' : 'Thank You! We Can’t Wait to Welcome You! 🌸'}
        </h3>
        
        <p className="text-sm text-[#594045] mb-6 max-w-md mx-auto leading-relaxed">
          {isArabic
            ? 'تم تسجيل طلب حجزكِ بنجاح في نظام صالون جلو بريتي. سنقوم بالتواصل معكِ قريباً لتأكيد الموعد النهائي.'
            : 'Your appointment request has been recorded in our system. Our team will contact you shortly to confirm.'}
        </p>

        {/* Detailed Ticket Card */}
        <div className="bg-[#fdf5f7] p-5 rounded-2xl border border-[#D4AF37]/40 text-start space-y-3 mb-6 shadow-xs text-xs sm:text-sm relative overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-2.5">
            <span className="text-[#8f003f] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">person</span>
              {isArabic ? 'اسم العميلة:' : 'Client Name:'}
            </span>
            <span className="font-extrabold text-[#1c1b1b]">{appointment.clientName}</span>
          </div>

          <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-2.5">
            <span className="text-[#8f003f] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">call</span>
              {isArabic ? 'رقم الهاتف:' : 'Phone Number:'}
            </span>
            <span className="font-extrabold text-[#1c1b1b]" dir="ltr">{appointment.clientPhone}</span>
          </div>

          <div className="flex justify-between items-start border-b border-[#D4AF37]/20 pb-2.5">
            <span className="text-[#8f003f] font-bold flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-base">spa</span>
              {isArabic ? 'الخدمات المختارة:' : 'Service(s):'}
            </span>
            <span className="font-extrabold text-[#9b0044] text-end max-w-[220px]">
              {appointment.serviceName}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-2.5">
            <span className="text-[#8f003f] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">calendar_month</span>
              {isArabic ? 'التاريخ والوقت:' : 'Date & Time:'}
            </span>
            <span className="font-extrabold text-[#1c1b1b]">
              {appointment.date} — {appointment.time}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[#594045] font-semibold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">qr_code</span>
              {isArabic ? 'رقم الحجز المرجعي:' : 'Booking Ref:'}
            </span>
            <span className="font-mono text-xs font-bold text-[#9b0044] bg-white px-2.5 py-1 rounded-md border border-[#D4AF37]/30">
              {appointment.id}
            </span>
          </div>
        </div>

        {/* Action Button: Return to Home */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#9b0044] to-[#730032] text-white py-4 rounded-full font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-[#b0004e] hover:to-[#8a003c] active:scale-98 transition-all cursor-pointer border border-[#D4AF37]/40 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          <span>{isArabic ? 'العودة للصفحة الرئيسية 🌸' : 'Return to Home Page 🌸'}</span>
        </button>
      </div>
    </div>
  );
};

