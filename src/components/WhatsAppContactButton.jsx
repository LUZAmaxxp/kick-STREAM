import React from 'react';

function sanitizePhone(raw = '') {
  return String(raw).replace(/[^\d]/g, '');
}

export default function WhatsAppContactButton() {
  const rawNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER ||
    import.meta.env.VITE_PUBLIC_WHATSAPP_NUMBER ||
    '212631604905';
  const phone = sanitizePhone(rawNumber);
  const defaultMessage = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hi, I need help with KickStream.';

  if (!phone) return null;

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 9999,
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: '#25D366',
          color: '#0B2414',
          borderRadius: 999,
          border: '2px solid #1A1A1A',
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
          padding: '10px 14px',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          animation: 'whatsappPulse 2.2s ease-in-out infinite',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 3C8.83 3 3 8.66 3 15.62c0 2.47.74 4.76 2 6.69L3 29l6.97-1.86A13.2 13.2 0 0 0 16 28.25C23.17 28.25 29 22.6 29 15.62 29 8.66 23.17 3 16 3Z"
            fill="#fff"
          />
          <path
            d="M23 19.57c-.3-.15-1.78-.86-2.06-.96-.28-.1-.48-.15-.68.15-.2.29-.78.96-.96 1.16-.17.2-.35.22-.65.08-.3-.15-1.27-.46-2.41-1.46-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.94-2.25-.24-.57-.49-.49-.68-.5l-.58-.01c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.92 1.22 3.12c.15.2 2.1 3.3 5.1 4.49.71.3 1.27.47 1.7.6.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.44.25-.72.25-1.33.18-1.45-.08-.12-.28-.2-.58-.35Z"
            fill="#25D366"
          />
        </svg>
        <span>WhatsApp</span>
      </span>
      <style>{`
        @keyframes whatsappPulse {
          0%, 100% { transform: translateY(0); box-shadow: 0 12px 24px rgba(0,0,0,0.2); }
          50% { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(0,0,0,0.24); }
        }
      `}</style>
    </a>
  );
}
