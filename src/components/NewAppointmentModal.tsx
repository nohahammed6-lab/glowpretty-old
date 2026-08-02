import React, { useState } from 'react';
import { Service, Appointment } from '../types';
import { TIME_SLOTS } from '../data/mockData';

interface NewAppointmentModalProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newApt: Omit<Appointment, 'id' | 'createdAt'>) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  services,
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('+974 ');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [date, setDate] = useState('2026-08-01');
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [status, setStatus] = useState<'Confirmed' | 'Pending'>('Confirmed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = services.find((s) => s.id === serviceId);
    const serviceName = serviceObj ? serviceObj.arabicTitle || serviceObj.title : 'خدمة تجميل';
    const priceQAR = serviceObj ? serviceObj.priceQAR : undefined;
    const priceDisplay = serviceObj ? (serviceObj.arabicPrice || `${serviceObj.priceQAR} ر.ق`) : undefined;
    const servicesBreakdown = serviceObj ? [{
      id: serviceObj.id,
      title: serviceObj.arabicTitle || serviceObj.title,
      priceQAR: serviceObj.priceQAR,
      priceDisplay: serviceObj.arabicPrice || `${serviceObj.priceQAR} ر.ق`
    }] : undefined;

    const nameParts = clientName.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    onAdd({
      clientName,
      clientInitials: initials,
      clientEmail,
      clientPhone,
      serviceId,
      serviceName,
      priceQAR,
      priceDisplay,
      servicesBreakdown,
      date,
      time,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/40 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#6b5a60] hover:text-[#9b0044] p-1"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="font-display text-2xl font-extrabold text-[#9b0044] mb-1">
          إضافة موعد حجز جديد (قطر 🇶🇦)
        </h3>
        <p className="text-xs text-[#6b5a60] mb-6">تسجيل حجز جديد يدوياً في صالون الدوحة.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#594045] mb-1">
              اسم العميلة
            </label>
            <input
              type="text"
              required
              placeholder="مثال: منيرة الهاجري"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#9b0044]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#594045] mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                placeholder="client@example.qa"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#9b0044]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#594045] mb-1">
                رقم الهاتف (قطر)
              </label>
              <input
                type="tel"
                dir="ltr"
                required
                placeholder="+974 5500 0000"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#9b0044] text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#594045] mb-1">
              اختيار الخدمة
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#9b0044] bg-white font-bold"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.arabicTitle} ({s.priceQAR} ر.ق)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#594045] mb-1">
                التاريخ
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => {
                  try {
                    (e.currentTarget as any).showPicker?.();
                  } catch {}
                }}
                onFocus={(e) => {
                  try {
                    (e.currentTarget as any).showPicker?.();
                  } catch {}
                }}
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#9b0044] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#594045] mb-1">
                التوقيت
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#9b0044] bg-white"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#594045] mb-1">
              حالة الحجز الأولى
            </label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm text-[#1c1b1b] font-bold">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Confirmed'}
                  onChange={() => setStatus('Confirmed')}
                />
                مؤكد (Confirmed)
              </label>
              <label className="flex items-center gap-2 text-sm text-[#1c1b1b] font-bold">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Pending'}
                  onChange={() => setStatus('Pending')}
                />
                معلق (Pending)
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-[#594045] py-3 rounded-xl font-bold text-sm hover:bg-gray-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-burgundy flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer shadow-md"
            >
              حفظ الموعد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
