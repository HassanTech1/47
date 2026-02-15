import React, { useState } from 'react';
import { Facebook, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('شكراً لانضمامك إلى مجتمع 7777!');
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Newsletter Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 uppercase tracking-wide text-black">
              BE PART OF THE 7777 COMMUNITY
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Subscribe for early access, runway previews, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 text-sm mb-4 focus:outline-none focus:border-black transition-colors"
                required
              />
              <button 
                type="submit"
                className="text-sm uppercase tracking-wider text-black hover:text-gray-600 transition-colors font-medium"
              >
                SUBSCRIBE
              </button>
            </form>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" fill="currentColor" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" fill="currentColor" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" fill="currentColor" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 uppercase tracking-wide text-black">
              ABOUT 7777
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="footer-link-minimal">
                  CONTACT US
                </a>
              </li>
              <li>
                <a href="/terms" className="footer-link-minimal">
                  TERMS & CONDITIONS
                </a>
              </li>
              <li>
                <a href="/privacy" className="footer-link-minimal">
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a href="/returns" className="footer-link-minimal">
                  RETURNS & EXCHANGES
                </a>
              </li>
              <li>
                <a href="/shipping" className="footer-link-minimal">
                  SHIPPING POLICY
                </a>
              </li>
            </ul>
          </div>

          {/* Client Services Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 uppercase tracking-wide text-black">
              CLIENT SERVICES
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/return" className="footer-link-minimal">
                  ONLINE RETURN
                </a>
              </li>
              <li>
                <a href="/stores" className="footer-link-minimal">
                  STORE LOCATOR
                </a>
              </li>
              <li>
                <a href="/track" className="footer-link-minimal">
                  TRACK ORDER
                </a>
              </li>
              <li>
                <a href="/giftcard" className="footer-link-minimal">
                  E GIFT CARD
                </a>
              </li>
              <li>
                <a href="/faq" className="footer-link-minimal">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Country & Language Selectors */}
          <div className="flex gap-4">
            <select className="footer-select">
              <option>Saudi Arabia (SAR ر.س)</option>
              <option>UAE (AED د.إ)</option>
              <option>Kuwait (KWD د.ك)</option>
            </select>
            <select className="footer-select">
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-sm">
            © 2026 7777 fashion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
