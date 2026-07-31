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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#e1bec4] relative overflow-hidden">
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#9b0044] via-[#D4AF37] to-[#9b0044]" />

        {/* Success Icon */}
        <div className="w-16 h-16 bg-[#f4dce4] rounded-full flex items-center justify-center mx-auto mb-6 text-[#9b0044] shadow-inner">
          <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-center text-[#1c1b1b] mb-2">
          {isArabic ? 'تم تأكيد طلب الحجز' : 'Appointment Reserved!'}
        </h3>
        <p className="text-center text-sm text-[#594045] mb-6">
          {isArabic
            ? 'شكراً لكِ. لقد أرسلنا تفاصيل الحجز إلى بريدك الإلكتروني.'
            : 'Thank you for choosing GLOW PRETTY. A confirmation email has been dispatched.'}
        </p>

        {/* Summary Details */}
        <div className="bg-[#fcf9f8] p-4 rounded-2xl border border-[#e1bec4]/60 space-y-3 mb-6 text-sm">
          <div className="flex justify-between border-b border-[#e1bec4]/30 pb-2">
            <span className="text-[#6b5a60]">{isArabic ? 'العميلة' : 'Client'}</span>
            <span className="font-semibold text-[#1c1b1b]">{appointment.clientName}</span>
          </div>
          <div className="flex justify-between border-b border-[#e1bec4]/30 pb-2">
            <span className="text-[#6b5a60]">{isArabic ? 'الخدمة' : 'Service'}</span>
            <span className="font-semibold text-[#9b0044]">{appointment.serviceName}</span>
          </div>
          <div className="flex justify-between border-b border-[#e1bec4]/30 pb-2">
            <span className="text-[#6b5a60]">{isArabic ? 'التاريخ والوقت' : 'Date & Time'}</span>
            <span className="font-semibold text-[#1c1b1b]">
              {appointment.date} @ {appointment.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b5a60]">{isArabic ? 'رقم الحجز' : 'Booking Reference'}</span>
            <span className="font-mono text-xs font-bold text-[#8f003f]">{appointment.id}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#9b0044] text-white py-3.5 rounded-full font-bold text-sm shadow-md hover:bg-[#c2185b] active:scale-95 transition-all cursor-pointer"
        >
          {isArabic ? 'موافق' : 'Done'}
        </button>
      </div>
    </div>
  );
};
