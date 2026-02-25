import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {useCart} from '~/context/CartContext';
import {useLanguage} from '~/context/LanguageContext';
import {CheckCircle, ChevronRight, Lock, Truck} from 'lucide-react';

export function meta() {
  return [{title: "Checkout | 4Seven's"}];
}

// ── Shipping options ────────────────────────────────────────────────────────
// Initial fallback rates
const INITIAL_RATES = [
  {
    id: 'aramex-standard',
    carrier: 'Aramex',
    carrierLogo: '/logo/aramex.png',
    nameAr: 'عادي',
    nameEn: 'Standard',
    daysAr: '3-5 أيام عمل',
    daysEn: '3-5 business days',
    price: 27,
  },
  {
    id: 'aramex-express',
    carrier: 'Aramex',
    carrierLogo: '/logo/aramex.png',
    nameAr: 'سريع',
    nameEn: 'Express',
    daysAr: '1-2 يوم عمل',
    daysEn: '1-2 business days',
    price: 42,
  },
  {
    id: 'dhl-economy',
    carrier: 'DHL',
    carrierLogo: '/logo/dhl.png',
    nameAr: 'اقتصادي',
    nameEn: 'Economy',
    daysAr: '5-7 أيام عمل',
    daysEn: '5-7 business days',
    price: 25,
  },
  {
    id: 'dhl-express',
    carrier: 'DHL',
    carrierLogo: '/logo/dhl.png',
    nameAr: 'سريع',
    nameEn: 'Express',
    daysAr: '1-3 أيام عمل',
    daysEn: '1-3 business days',
    price: 45,
  },
];

import { countries } from '~/data/countries';

const COUNTRIES = countries;

// ── Main page ───────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const {cartItems} = useCart();
  const {t, language, formatPrice} = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('info'); // 'info' | 'payment'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dynamic Shipping Rates
  const [shippingRates, setShippingRates] = useState(INITIAL_RATES);
  const [isRatesLoading, setIsRatesLoading] = useState(false);

  const [form, setForm] = useState({
    givenName: '',
    surname: '',
    email: '',
    phone: '',
    country: 'SA',
    city: '',
    address: '',
    apartment: '',
    postalCode: '',
    saveInfo: false,
    emailNews: true,
  });

  const [selectedShipping, setSelectedShipping] = useState(INITIAL_RATES[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch shipping rates when country/city changes
  useEffect(() => {
    if (!mounted) return;
    
    const fetchRates = async () => {
      setIsRatesLoading(true);
      try {
        const res = await fetch('/api/shipping', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            country: form.country,
            city: form.city
          }),
        });
        const data = await res.json();
        if (data.rates && Array.isArray(data.rates)) {
          setShippingRates(data.rates);
          // If previously selected shipping is not in new rates, select first
          const stillExists = data.rates.find(r => r.id === selectedShipping.id);
          if (!stillExists && data.rates.length > 0) {
            setSelectedShipping(data.rates[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch shipping rates:', err);
      } finally {
        setIsRatesLoading(false);
      }
    };

    // Debounce to avoid too many requests while typing city
    const timer = setTimeout(fetchRates, 800);
    return () => clearTimeout(timer);
  }, [form.country, form.city, mounted]);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0,
  );
  const total = subtotal + selectedShipping.price;

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const validate = () => {
    const required = {
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      city: 'المدينة',
      address: 'العنوان',
    };
    for (const [k, label] of Object.entries(required)) {
      if (!form[k]?.trim()) return `يرجى ملء حقل: ${label}`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'البريد الإلكتروني غير صحيح';
    return null;
  };

  const handleProceedToPayment = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/hyperpay', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          amount: total.toFixed(2),
          currency: 'SAR',
          customer: form,
          items: cartItems,
          shipping: selectedShipping,
        }),
      });
      const resData = await res.json();
      if (resData.checkoutId) {
        try {
          sessionStorage.setItem(
            'hp_order',
            JSON.stringify({items: cartItems, form, shipping: selectedShipping, subtotal, total}),
          );
        } catch {}
        setCheckoutId(resData.checkoutId);
        if (resData.baseUrl) setHyperpayBaseUrl(resData.baseUrl);
        setStep('payment');
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        setError(resData.error ?? 'فشل الاتصال ببوابة الدفع. يرجى المحاولة مجدداً.');
      }
    } catch {
      setError('خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مجدداً.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  if (cartItems.length === 0 && step === 'info') {
    return (
      <main className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-6">{t('cartEmpty')}</p>
          <Link
            to="/"
            className="px-8 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            {t('returnToStore')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl py-12">
        {/* Header Logo */}
        <div className="text-center mb-12">
          <Link to="/" className="text-3xl font-bold tracking-[0.3em] uppercase text-black">
            1886
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* ── Left column: Form ── */}
          <div className="lg:col-span-7">
            {step === 'info' ? (
              <InfoForm
                form={form}
                onChange={handleChange}
                selectedShipping={selectedShipping}
                onShippingChange={setSelectedShipping}
                onNext={handleProceedToPayment}
                isLoading={isLoading}
                error={error}
                shippingRates={shippingRates}
                t={t}
                language={language}
                formatPrice={formatPrice}
              />
            ) : (
              <PaymentWidget
                checkoutId={checkoutId}
                baseUrl={hyperpayBaseUrl}
                total={total}
                form={form}
                onBack={() => setStep('info')}
                t={t}
              />
            )}
            
            {/* Simple Footer Links */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-[10px] text-gray-400 uppercase tracking-widest justify-center lg:justify-start">
              <a href="#" className="hover:text-black">{t('refundPolicy') || 'Refund policy'}</a>
              <a href="#" className="hover:text-black">{t('shippingPolicy') || 'Shipping policy'}</a>
              <a href="#" className="hover:text-black">{t('privacyPolicy') || 'Privacy policy'}</a>
              <a href="#" className="hover:text-black">{t('termsOfService') || 'Terms of service'}</a>
              <a href="#" className="hover:text-black">{t('contactInfo') || 'Contact'}</a>
            </div>
          </div>

          {/* ── Right column: Order summary ── */}
          <div className="lg:col-span-5 border-l border-gray-100 lg:pl-12">
            <OrderSummary
              items={cartItems}
              shipping={selectedShipping}
              subtotal={subtotal}
              total={total}
              t={t}
              language={language}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Info & Shipping form ─────────────────────────────────────────────────────
function InfoForm({
  form,
  onChange,
  selectedShipping,
  onShippingChange,
  onNext,
  isLoading,
  error,
  shippingRates = INITIAL_RATES,
  t,
  language,
  formatPrice,
}) {
  return (
    <div className="space-y-12">
      {/* ── Contact Section ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{t('contactInfo')}</h2>
          <a href="/account/login" className="text-xs text-gray-500 underline hover:text-black">{t('login') || 'Sign in'}</a>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder={t('email') || 'Email'}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="emailNews" 
              checked={form.emailNews} 
              onChange={(e) => onChange({target: {name: 'emailNews', value: e.target.checked}})}
              className="w-4 h-4 border-gray-300 rounded accent-black"
            />
            <span className="text-xs text-gray-600">{t('emailNewsMsg') || 'Email me with news and offers'}</span>
          </label>
        </div>
      </section>

      {/* ── Delivery Section ── */}
      <section>
        <h2 className="text-lg font-bold mb-4">{t('delivery') || 'Delivery'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 ml-1">
              {t('country') || 'Country/Region'}
            </label>
            <select
              name="country"
              value={form.country}
              onChange={onChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black rounded-md appearance-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {language === 'ar' ? c.labelAr : c.labelEn}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="givenName"
              value={form.givenName}
              onChange={onChange}
              placeholder={t('firstName') || 'First name'}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
            />
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={onChange}
              placeholder={t('lastName') || 'Last name'}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder={t('address') || 'Address'}
              className="w-full border border-gray-200 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-black rounded-md"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            name="apartment"
            value={form.apartment}
            onChange={onChange}
            placeholder={t('apartment') || 'Apartment, suite, etc. (optional)'}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder={t('city') || 'City'}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
            />
            <input
              type="text"
              name="region"
              placeholder={t('region') || 'State'}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
            />
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={onChange}
              placeholder={t('postalCode') || 'ZIP code'}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md"
            />
          </div>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder={t('phone') || 'Phone'}
              className="w-full border border-gray-200 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-black rounded-md"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-help" title="In case we need to contact you about your order">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input 
              type="checkbox" 
              name="saveInfo" 
              checked={form.saveInfo} 
              onChange={(e) => onChange({target: {name: 'saveInfo', value: e.target.checked}})}
              className="w-4 h-4 border-gray-300 rounded accent-black"
            />
            <span className="text-xs text-gray-600">{t('saveInfoMsg') || 'Save this information for next time'}</span>
          </label>
        </div>
      </section>

      {/* ── Shipping Section ── */}
      <section>
        <h2 className="text-lg font-bold mb-4">{t('shippingMethod')}</h2>
        {shippingRates.length > 0 ? (
          <div className="border border-gray-200 rounded-md divide-y divide-gray-100 overflow-hidden">
            {shippingRates.map((option) => (
              <label key={option.id} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping.id === option.id}
                    onChange={() => onShippingChange(option)}
                    className="w-4 h-4 accent-black"
                  />
                  <div className="text-sm">
                    <span className="font-medium">{option.carrier} — {language === 'ar' ? option.nameAr : option.nameEn}</span>
                    <p className="text-xs text-gray-400">{language === 'ar' ? option.daysAr : (option.daysEn || option.daysAr)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold">{formatPrice(option.price)}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 text-gray-400 text-sm rounded-md border border-gray-100 italic">
            {t('shippingRatesEmpty') || 'Enter your shipping address to view available shipping methods.'}
          </div>
        )}
      </section>

      {/* ── Payment Section ── */}
      <section>
        <h2 className="text-lg font-bold mb-1">{t('payment')}</h2>
        <p className="text-xs text-gray-400 mb-4">{t('secureTransaction')}</p>
        
        <div className="border border-gray-200 rounded-md divide-y divide-gray-200 overflow-hidden">
          {/* Tabby */}
          <div className="p-4 bg-[#f4fafa] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" className="w-4 h-4 accent-black" checked readOnly />
              <div className="text-sm">
                <span className="font-medium">Pay later with Tabby</span>
              </div>
            </div>
            <img src="/icons/tabby.png" alt="Tabby" className="h-6 object-contain" />
          </div>
          
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-60">
              <input type="radio" name="payment" className="w-4 h-4 accent-black" disabled />
              <div className="text-sm">
                <span className="font-medium">Pay with Local & Alternative Payments</span>
              </div>
            </div>
            <div className="flex gap-1">
              <img src="/logo/visa.png" alt="Visa" className="h-4 grayscale" />
              <img src="/logo/mastercard.png" alt="Mastercard" className="h-4 grayscale" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Billing Address ── */}
      <section>
        <h2 className="text-lg font-bold mb-4">{t('billingAddress') || 'Billing address'}</h2>
        <div className="border border-gray-200 rounded-md divide-y divide-gray-100 overflow-hidden">
          <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="billing" checked readOnly className="w-4 h-4 accent-black" />
            <span className="text-sm">{t('sameAsShipping') || 'Same as shipping address'}</span>
          </label>
          <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors opacity-60">
            <input type="radio" name="billing" disabled className="w-4 h-4 accent-black" />
            <span className="text-sm">{t('differentBilling') || 'Use a different billing address'}</span>
          </label>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded">
          {error}
        </div>
      )}

      <button
        onClick={onNext}
        disabled={isLoading}
        className="w-full py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all rounded-md shadow-lg"
      >
        {isLoading ? '...' : t('payNow') || 'Pay now'}
      </button>
    </div>
  );
}

// ── Order summary sidebar ────────────────────────────────────────────────────
function OrderSummary({items, shipping, subtotal, total, t, language, formatPrice}) {
  const [discount, setDiscount] = useState('');

  return (
    <div className="space-y-8 bg-[#f9f9f9] p-8 lg:p-0 rounded-lg">
      <div className="space-y-6">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-20 bg-white border border-gray-100 overflow-hidden rounded-md flex items-center justify-center p-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.nameEn ?? item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide leading-tight text-gray-800">
                {language === 'ar' && item.name ? item.name : (item.nameEn || item.name)}
              </p>
              {item.size && (
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{item.size}</p>
              )}
            </div>
            <div className="text-right">
               <p className="text-xs font-medium text-gray-500 line-through mb-1 opacity-50 italic">
                {formatPrice((item.price ?? 0) * (item.quantity ?? 1) * 1.2)}
               </p>
               <p className="text-xs font-bold text-gray-800">
                {formatPrice((item.price ?? 0) * (item.quantity ?? 1))}
               </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 py-6 border-t border-b border-gray-200">
        <input
          type="text"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder={t('discountPlaceholder') || 'Discount code or gift card'}
          className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-md bg-white"
        />
        <button className="px-6 py-3 bg-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-black hover:text-white transition-all">
          {t('apply') || 'Apply'}
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t('subtotal')}</span>
          <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t('shipping')}</span>
          <span className="font-medium text-gray-800">{shipping.price === 0 ? (language === 'ar' ? 'مجاني' : 'FREE') : formatPrice(shipping.price)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 text-black">
          <span>{t('totalAmount')}</span>
          <span className="text-xl">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function FormSection({title, children}) {
  return (
    <section className="bg-white border border-gray-200 p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-5 border-b border-gray-100 pb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({label, name, value, onChange, type = 'text', placeholder, className = '', required=false}) {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-black transition-colors"
        autoComplete={name}
      />
    </div>
  );
}
