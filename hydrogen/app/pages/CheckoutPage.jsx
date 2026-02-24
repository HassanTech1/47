import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(null);
  const [saveInfo, setSaveInfo] = useState(false);
  const [emailNews, setEmailNews] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    region: 'الرياض',
    postalCode: '',
    phone: user?.phone || '',
    country: 'Saudi Arabia',
  });

  const regions = [
    'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'الشرقية',
    'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف'
  ];

  // Load saved addresses if authenticated
  useEffect(() => {
    const loadSavedAddresses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setSavedAddresses(data.addresses || []);
        
        // Auto-select default address
        const defaultAddr = data.addresses?.find(a => a.is_default);
        if (defaultAddr) {
          selectAddress(defaultAddr);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };

    if (isAuthenticated && token) {
      loadSavedAddresses();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const selectAddress = (address) => {
    setSelectedAddressId(address.id);
    const nameParts = address.full_name.split(' ');
    setFormData({
      ...formData,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      address: address.street,
      city: address.city,
      region: address.region,
      postalCode: address.postal_code || '',
      phone: address.phone,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSelectedAddressId(null); // Clear selected address when manually editing
  };

  const calculateTax = () => {
    return getCartTotal() * 0.15; // 15% VAT
  };

  const getShippingCost = () => {
    return 0; // Free shipping
  };

  const getFinalTotal = () => {
    let total = getCartTotal() + calculateTax() + getShippingCost();
    if (discountApplied) {
      total -= discountApplied.amount;
    }
    return total;
  };

  const applyDiscount = () => {
    // Mock discount codes
    if (discountCode.toUpperCase() === '7777') {
      setDiscountApplied({ code: '7777', amount: getCartTotal() * 0.1, percent: 10 });
    } else if (discountCode.toUpperCase() === 'WELCOME') {
      setDiscountApplied({ code: 'WELCOME', amount: 50, percent: null });
    } else {
      alert('Invalid discount code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // This implementation bypasses the custom backend and uses Shopify's
    // native checkout (with shipping and payment) as requested.
    //
    // You still may send the cart or address to your own server if you need
    // to save the order before redirect, but the URL below must be generated
    // by calling the Storefront API `cartCreate` / `cartLinesAdd` chain
    // (or using `cart.checkoutUrl` if you maintain a server-side cart).
    //
    // Here we assume there is an endpoint at `/api/shopify/create-checkout`
    // which returns `{checkoutUrl}` after talking to Shopify.

    setLoading(true);
    try {
      const resp = await fetch('/api/shopify/create-checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: cartItems,
          // optionally include shipping address, discounts, etc.
        }),
      });
      const {checkoutUrl} = await resp.json();
      if (checkoutUrl) {
        // delegate shipping & payment to Shopify
        window.location.href = checkoutUrl;
      } else {
        throw new Error('no checkoutUrl returned');
      }
    } catch (err) {
      console.error('Redirect to Shopify checkout failed', err);
      alert('Could not start Shopify checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="ltr">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <a href="/" className="text-black underline">Continue shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="ltr">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="lg:w-[60%] p-6 lg:p-12 lg:pr-16">
            {/* Logo */}
            <div className="mb-8">
              <a href="/" className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                ٧٧٧٧
              </a>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-black">Cart</a>
              <span>›</span>
              <span className="text-black">Information</span>
              <span>›</span>
              <span>Shipping</span>
              <span>›</span>
              <span>Payment</span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Contact Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Contact</h2>
                  {!isAuthenticated && (
                    <a href="#" className="text-sm text-blue-600 hover:underline">Sign in</a>
                  )}
                </div>
                
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-3"
                  data-testid="checkout-email"
                />
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={emailNews}
                    onChange={(e) => setEmailNews(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  Email me with news and offers
                </label>
              </div>

              {/* Delivery Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Delivery</h2>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Saved Addresses</label>
                    <div className="space-y-2">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => selectAddress(addr)}
                          className={`w-full text-left p-3 border rounded-lg transition-colors ${
                            selectedAddressId === addr.id 
                              ? 'border-black bg-gray-50' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}>
                          <p className="font-medium">{addr.full_name}</p>
                          <p className="text-sm text-gray-600">{addr.street}, {addr.city}</p>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Or enter a new address below:</p>
                  </div>
                )}

                {/* Country */}
                <div className="mb-4">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white">
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Oman">Oman</option>
                  </select>
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4 mb-4"> ... (snipped remaining)
