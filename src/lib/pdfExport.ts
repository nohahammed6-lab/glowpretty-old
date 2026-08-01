import { Appointment, SiteSettings } from '../types';

export function exportAppointmentsPDF(
  appointments: Appointment[],
  language: 'ar' | 'en' = 'ar',
  siteSettings?: SiteSettings
) {
  const isArabic = language === 'ar';
  const currentDate = new Date().toLocaleDateString(isArabic ? 'ar-QA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalBookings = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <title>${isArabic ? 'فايل الحجوزات وبيانات العملاء - صالون غلو بريتي' : 'Bookings & Customer File - Glow Pretty'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        
        @page {
          size: A4 landscape;
          margin: 10mm;
        }

        * {
          box-sizing: border-box;
          font-family: 'Cairo', system-ui, sans-serif;
        }

        body {
          background-color: #ffffff;
          color: #121212;
          margin: 0;
          padding: 20px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 3px solid #D4AF37;
          margin-bottom: 20px;
        }

        .brand-title {
          font-size: 26px;
          font-weight: 900;
          color: #121212;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .brand-sub {
          font-size: 13px;
          font-weight: 700;
          color: #D4AF37;
          margin-top: 2px;
        }

        .meta-box {
          text-align: ${isArabic ? 'left' : 'right'};
          font-size: 11px;
          color: #555;
        }

        .meta-box strong {
          color: #121212;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card {
          background-color: #FAF6ED;
          border: 1px solid #D4AF37;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }

        .stat-card .label {
          font-size: 10px;
          font-weight: 700;
          color: #666;
          margin-bottom: 4px;
        }

        .stat-card .val {
          font-size: 18px;
          font-weight: 800;
          color: #121212;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 11px;
        }

        th {
          background-color: #121212;
          color: #D4AF37;
          padding: 10px 8px;
          text-align: ${isArabic ? 'right' : 'left'};
          font-weight: 800;
          border: 1px solid #121212;
        }

        td {
          padding: 8px;
          border-bottom: 1px solid #e5e5e5;
          vertical-align: middle;
        }

        tr:nth-child(even) {
          background-color: #FAF6ED;
        }

        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 10px;
          text-align: center;
        }

        .status-confirmed {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .status-completed {
          background-color: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .status-cancelled {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #D4AF37;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #777;
        }

        .print-actions {
          position: fixed;
          bottom: 20px;
          ${isArabic ? 'left: 20px;' : 'right: 20px;'}
          background: #121212;
          color: #FAF6ED;
          padding: 12px 24px;
          border-radius: 30px;
          border: 2px solid #D4AF37;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          cursor: pointer;
          font-weight: 800;
          font-size: 14px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media print {
          .print-actions {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>

      <button class="print-actions" onclick="window.print()">
        🖨️ ${isArabic ? 'حفظ بتنسيق PDF / طباعة' : 'Save as PDF / Print'}
      </button>

      <div class="header">
        <div>
          <h1 class="brand-title">GLOW PRETTY BEAUTY SALON</h1>
          <div class="brand-sub">
            ${isArabic ? 'سجل ملف الحجوزات وبيانات العملاء - الدوحة قطر 🇶🇦' : 'Bookings & Customer File Record - Doha Qatar 🇶🇦'}
          </div>
        </div>
        <div class="meta-box">
          <div><strong>${isArabic ? 'تاريخ التصدير:' : 'Export Date:'}</strong> ${currentDate}</div>
          <div><strong>${isArabic ? 'فرع الصالون:' : 'Salon Branch:'}</strong> ${siteSettings?.locationAR || 'الدوحة - مدينة خليفة'}</div>
          <div><strong>${isArabic ? 'الهاتف:' : 'Phone:'}</strong> ${siteSettings?.phone || '+974 5500 0000'}</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">${isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}</div>
          <div class="val">${totalBookings}</div>
        </div>
        <div class="stat-card">
          <div class="label">${isArabic ? 'المواعيد المؤكدة' : 'Confirmed'}</div>
          <div class="val" style="color: #065f46;">${confirmedCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">${isArabic ? 'قيد الانتظار' : 'Pending'}</div>
          <div class="val" style="color: #92400e;">${pendingCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">${isArabic ? 'المكتملة' : 'Completed'}</div>
          <div class="val" style="color: #1e40af;">${completedCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">${isArabic ? 'الملغاة' : 'Cancelled'}</div>
          <div class="val" style="color: #991b1b;">${cancelledCount}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isArabic ? 'اسم العميلة' : 'Client Name'}</th>
            <th>${isArabic ? 'رقم الهاتف' : 'Phone'}</th>
            <th>${isArabic ? 'البريد الإلكتروني' : 'Email'}</th>
            <th>${isArabic ? 'الخدمة المطلوبة' : 'Service'}</th>
            <th>${isArabic ? 'التاريخ والوقت' : 'Date & Time'}</th>
            <th>${isArabic ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${appointments
            .map(
              (apt, idx) => `
            <tr>
              <td><strong>${idx + 1}</strong></td>
              <td><strong>${apt.clientName}</strong></td>
              <td dir="ltr" style="text-align: ${isArabic ? 'right' : 'left'}; font-weight: 700;">${apt.clientPhone}</td>
              <td dir="ltr" style="text-align: ${isArabic ? 'right' : 'left'}; color: #555;">${apt.clientEmail}</td>
              <td><strong style="color: #121212;">${apt.serviceName}</strong></td>
              <td>${apt.date} | ${apt.time}</td>
              <td>
                <span class="badge ${
                  apt.status === 'Confirmed'
                    ? 'status-confirmed'
                    : apt.status === 'Pending'
                    ? 'status-pending'
                    : apt.status === 'Completed'
                    ? 'status-completed'
                    : 'status-cancelled'
                }">
                  ${apt.status}
                </span>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <div>GLOW PRETTY BEAUTY SALON — ${isArabic ? 'سجل تحفظي سري لبيانات الحجوزات والعملاء' : 'Confidential Customer Backup Record'}</div>
        <div>${isArabic ? 'صفحة 1 من 1' : 'Page 1 of 1'}</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
