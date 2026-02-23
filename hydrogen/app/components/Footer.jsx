import {useState} from 'react';
import {Facebook, Instagram} from 'lucide-react';

const translations = {
  en: {
    newsletterTitle: "BE PART OF THE 7777 COMMUNITY",
    newsletterDesc: "Subscribe for early access, runway previews, and exclusive offers.",
    emailPlaceholder: "Your email",
    subscribeBtn: "SUBSCRIBE",
    aboutTitle: "ABOUT 7777",
    contactUs: "CONTACT US",
    termsConditions: "TERMS & CONDITIONS",
    privacyPolicy: "PRIVACY POLICY",
    returnsExchanges: "RETURNS & EXCHANGES",
    shippingPolicy: "SHIPPING POLICY",
    clientServicesTitle: "CLIENT SERVICES",
    onlineReturn: "ONLINE RETURN",
    storeLocator: "STORE LOCATOR",
    trackOrder: "TRACK ORDER",
    eGiftCard: "E GIFT CARD",
    faq: "FAQ",
    copyright: "© 2026 7777 fashion.",
    alertMessage: "Thanks for joining the 7777 community!",
  },
  ar: {
    newsletterTitle: "كن جزءاً من مجتمع 7777",
    newsletterDesc: "اشترك للحصول على وصول مبكر وعروض حصرية ومعاينة لأحدث التصاميم.",
    emailPlaceholder: "بريدك الإلكتروني",
    subscribeBtn: "اشترك",
    aboutTitle: "عن 7777",
    contactUs: "اتصل بنا",
    termsConditions: "الشروط والأحكام",
    privacyPolicy: "سياسة الخصوصية",
    returnsExchanges: "الإرجاع والاستبدال",
    shippingPolicy: "سياسة الشحن",
    clientServicesTitle: "خدمات العملاء",
    onlineReturn: "الإرجاع عبر الإنترنت",
    storeLocator: "فروعنا",
    trackOrder: "تتبع طلبك",
    eGiftCard: "بطاقة هدايا إلكترونية",
    faq: "الأسئلة الشائعة",
    copyright: "© 2026 7777 أزياء.",
    alertMessage: "شكراً لانضمامك إلى مجتمع 7777!",
  },
};

/**
 * Footer component adapted for Shopify Hydrogen.
 */
export function Footer() {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmail('');
    alert(t.alertMessage);
  };

  return (
    <footer id="contact" className="bg-white border-t-2 border-black">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6 uppercase tracking-wide text-black">
              {t.newsletterTitle}
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {t.newsletterDesc}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 text-sm mb-4 focus:outline-none focus:border-black transition-colors"
                required
              />
              <button
                type="submit"
                className="text-sm uppercase tracking-wider text-black hover:text-gray-600 transition-colors font-medium"
              >
                {t.subscribeBtn}
              </button>
            </form>
            <div className="flex gap-4 mt-8">
              <a
                href="https://instagram.com/4sevens.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Client Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-black">
              {t.clientServicesTitle}
            </h4>
            <ul className="space-y-3">
              {[
                t.onlineReturn,
                t.storeLocator,
                t.trackOrder,
                t.eGiftCard,
                t.faq,
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-black transition-colors uppercase tracking-wide"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-black">
              {t.aboutTitle}
            </h4>
            <ul className="space-y-3">
              {[
                t.contactUs,
                t.termsConditions,
                t.privacyPolicy,
                t.returnsExchanges,
                t.shippingPolicy,
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-black transition-colors uppercase tracking-wide"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-500">{t.copyright}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors border border-gray-300 px-3 py-1"
            >
              {language === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
