import React, { useState } from 'react';
import { Instagram, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    // Show success message
    alert('شكراً لانضمامك إلى نادي 7777!');
  };

  return (
    <footer className="bg-black text-white pt-20 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Logo */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 logo-text">
            ٧٧٧٧
          </h2>
          <p className="text-gray-400">
            حيث تلتقي الأناقة بالفخامة
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="footer-link">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/collections" className="footer-link">
                  المجموعات
                </a>
              </li>
              <li>
                <a href="/about" className="footer-link">
                  من نحن
                </a>
              </li>
              <li>
                <a href="/contact" className="footer-link">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">
              خدمة العملاء
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/shipping" className="footer-link">
                  سياسة الشحن
                </a>
              </li>
              <li>
                <a href="/returns" className="footer-link">
                  الإرجاع والاستبدال
                </a>
              </li>
              <li>
                <a href="/faq" className="footer-link">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="/privacy" className="footer-link">
                  سياسة الخصوصية
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">
              تابعنا
            </h3>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://snapchat.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Snapchat"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.206 2.024c-2.948 0-5.294 2.265-5.438 5.293-.063 1.325.261 2.261.486 2.791a5.012 5.012 0 0 1-.522.089c-.45.061-.972.13-1.251.477-.311.386-.236.948-.167 1.282.153.748.973 1.075 1.619 1.326.167.065.32.123.44.181-.008.031-.019.062-.029.092a4.26 4.26 0 0 1-.172.41c-.336.705-1.021 1.049-1.681 1.38a7.675 7.675 0 0 0-.56.28c-.496.294-.858.64-.967 1.214-.069.356.015.693.237.947.395.453 1.098.649 2.089.582.355-.025.695-.099 1.003-.17.225-.05.448-.1.659-.131a.62.62 0 0 1 .08-.006c.124 0 .239.046.369.14.388.282.804.72 1.249 1.191.726.768 1.549 1.639 2.643 1.992.236.076.486.114.74.114.255 0 .504-.038.74-.114 1.094-.353 1.917-1.224 2.643-1.992.445-.471.861-.909 1.249-1.191.13-.094.245-.14.369-.14a.62.62 0 0 1 .08.006c.211.031.434.081.659.131.308.071.648.145 1.003.17.991.067 1.694-.129 2.089-.582.222-.254.306-.591.237-.947-.109-.574-.471-.92-.967-1.214a7.675 7.675 0 0 0-.56-.28c-.66-.331-1.345-.675-1.681-1.38a4.26 4.26 0 0 1-.172-.41c-.01-.03-.021-.061-.029-.092.12-.058.273-.116.44-.181.646-.251 1.466-.578 1.619-1.326.069-.334.144-.896-.167-1.282-.279-.347-.801-.416-1.251-.477a5.012 5.012 0 0 1-.522-.089c.225-.53.549-1.466.486-2.791-.144-3.028-2.49-5.293-5.438-5.293z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">
              انضم لنادي 7777
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              احصل على آخر العروض والتحديثات
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="newsletter-input flex-1"
                required
                dir="rtl"
              />
              <button 
                type="submit"
                className="newsletter-button"
                aria-label="Subscribe"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © ٢٠٢٥ 7777 Fashion. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
