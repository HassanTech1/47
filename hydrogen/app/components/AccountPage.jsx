import React, { useState, useEffect } from 'react';
import { User, Package, Heart, MapPin, LogOut, ChevronLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AccountPage = ({ isOpen, onClose }) => {
  const { user, token, logout, updateProfile, authFetch } = useAuth();
  const { t, language, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: '',
    full_name: '',
    phone: '',
    street: '',
    city: '',
    region: '',
    postal_code: '',
    is_default: false,
  });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const res = await authFetch(`${API_URL}/api/orders`);
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (activeTab === 'wishlist') {
        const res = await authFetch(`${API_URL}/api/wishlist`);
        const data = await res.json();
        setWishlist(data.items || []);
      } else if (activeTab === 'addresses') {
        const res = await authFetch(`${API_URL}/api/addresses`);
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, authFetch]);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && token) {
      loadData();
    }
  }, [isOpen, token, loadData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm.name, profileForm.phone);
      setEditingProfile(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await authFetch(`${API_URL}/api/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      setShowAddAddress(false);
      setAddressForm({
        title: '', full_name: '', phone: '', street: '',
        city: '', region: '', postal_code: '', is_default: false,
      });
      loadData();
    } catch (error) {
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await authFetch(`${API_URL}/api/addresses/${addressId}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await authFetch(`${API_URL}/api/wishlist/${productId}`, { method: 'DELETE' });
      setWishlist(wishlist.filter(item => item.product_id !== productId));
    } catch (error) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', icon: User, label: t('profileInfo') },
    { id: 'orders', icon: Package, label: t('orderHistory') },
    { id: 'wishlist', icon: Heart, label: t('myWishlist') },
    { id: 'addresses', icon: MapPin, label: t('savedAddresses') },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-white overflow-y-auto" data-testid="account-page">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            data-testid="close-account"
          >
            <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span>{t('backToStore')}</span>
          </button>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            ٧٧٧٧
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            data-testid="logout-btn"
          >
            <LogOut className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-medium">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">{t('profileInfo')}</h2>
                      {!editingProfile && (
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('edit')}
                        </button>
                      )}
                    </div>

                    {editingProfile ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('name')}</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('phone')}</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800"
                          >
                            {t('saveChanges')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProfile(false)}
                            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">{t('name')}</p>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('email')}</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('phone')}</p>
                          <p className="font-medium">{user?.phone || ''}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">{t('orderHistory')}</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t('noOrders')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex gap-3">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Size: {item.size} × {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                              <span className="font-medium">{t('totalAmount')}</span>
                              <span className="font-bold">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">{t('myWishlist')}</h2>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t('wishlistEmpty')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.product_id} className="relative group">
                            <button
                              onClick={() => removeFromWishlist(item.product_id)}
                              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                            <div className="bg-gray-100 h-48 rounded-lg overflow-hidden mb-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">{t('savedAddresses')}</h2>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                        {t('addAddress')}
                      </button>
                    </div>

                    {showAddAddress && (
                      <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="font-medium mb-4">{t('newAddress')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            placeholder="Title (e.g., Home, Work)"
                            value={addressForm.title}
                            onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                            required
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <input
                            placeholder="Full Name"
                            value={addressForm.full_name}
                            onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                            required
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <input
                            placeholder="Phone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            required
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <input
                            placeholder="Street Address"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            required
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <input
                            placeholder="City"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            required
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <input
                            placeholder="Region"
                            value={addressForm.region}
                            onChange={(e) => setAddressForm({ ...addressForm, region: e.target.value })}
                            required
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <input
                            placeholder="Postal Code (Optional)"
                            value={addressForm.postal_code}
                            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          />
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={addressForm.is_default}
                              onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                              className="w-4 h-4"
                            />
                            Set as default address
                          </label>
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800"
                          >
                            {t('saveAddress')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(false)}
                            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </form>
                    )}

                    {addresses.length === 0 && !showAddAddress ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t('noAddresses')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
                            {address.is_default && (
                              <span className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'} bg-black text-white text-xs px-2 py-1 rounded`}>
                                {t('default')}
                              </span>
                            )}
                            <h3 className="font-medium mb-2">{address.title}</h3>
                            <p className="text-sm text-gray-600">{address.full_name}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">{address.city}, {address.region}</p>
                            {address.postal_code && (
                              <p className="text-sm text-gray-600">{address.postal_code}</p>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="mt-4 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('delete')}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
