import React, { useState, useEffect } from 'react';
import { User, Package, Heart, MapPin, LogOut, ChevronLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '~/context/AuthContext';
import logo1 from '@assets/logo/1.png';

const AccountPage = ({ isOpen, onClose }) => {
  const { user, token, logout, updateProfile, authFetch } = useAuth();
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
        const res = await authFetch(`/api/orders`);
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (activeTab === 'wishlist') {
        const res = await authFetch(`/api/wishlist`);
        const data = await res.json();
        setWishlist(data.items || []);
      } else if (activeTab === 'addresses') {
        const res = await authFetch(`/api/addresses`);
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
      await authFetch(`/api/addresses`, {
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
      await authFetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await authFetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
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
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white overflow-y-auto" data-testid="account-page">
      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-white/10 z-10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            data-testid="close-account"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </button>
          <img src={logo1} alt="4Seven's" className="h-8 w-auto object-contain" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8" dir="ltr">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-medium text-white">{user?.name}</h2>
                <p className="text-sm text-white/40">{user?.email}</p>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-black'
                        : 'hover:bg-white/10 text-white/70'
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
                <div className="animate-spin w-8 h-8 border-2 border-white/10 border-t-white rounded-full" />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Profile Information</h2>
                      {!editingProfile && (
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="flex items-center gap-2 text-sm text-white/50 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>

                    {editingProfile ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-white/90"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProfile(false)}
                            className="px-6 py-3 border border-white/20 text-white/70 rounded hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-white/40">Name</p>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Phone</p>
                          <p className="font-medium">{user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
                        <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">No orders yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-white/10 bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-sm text-white/40">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-white/40">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-white/10 text-white/60'
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
                                    <p className="text-sm text-white/40">Size: {item.size} × {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                              <span className="font-medium">Total</span>
                              <span className="font-bold">{order.total?.toFixed(2)} SAR</span>
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
                    <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
                        <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Your wishlist is empty</p>
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
                            <div className="bg-white/5 border border-white/10 h-48 rounded-lg overflow-hidden mb-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-sm text-white/50">{item.price.toFixed(2)} SAR</p>
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
                      <h2 className="text-xl font-bold">Saved Addresses</h2>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-white/90"
                      >
                        <Plus className="w-4 h-4" />
                        Add Address
                      </button>
                    </div>

                    {showAddAddress && (
                      <form onSubmit={handleAddAddress} className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                        <h3 className="font-medium mb-4">New Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            placeholder="Title (e.g., Home, Work)"
                            value={addressForm.title}
                            onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                            required
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                          <input
                            placeholder="Full Name"
                            value={addressForm.full_name}
                            onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                            required
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                          <input
                            placeholder="Phone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            required
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                          <input
                            placeholder="Street Address"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            required
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                          <input
                            placeholder="City"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            required
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                          <input
                            placeholder="Region"
                            value={addressForm.region}
                            onChange={(e) => setAddressForm({ ...addressForm, region: e.target.value })}
                            required
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
                          />
                          <input
                            placeholder="Postal Code (Optional)"
                            value={addressForm.postal_code}
                            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                            className="px-4 py-3 bg-white/5 border border-white/20 text-white rounded focus:outline-none focus:border-white/60 placeholder-white/30"
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
                            className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-white/90"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(false)}
                            className="px-6 py-3 border border-white/20 text-white/70 rounded hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {addresses.length === 0 && !showAddAddress ? (
                      <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
                        <MapPin className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">No saved addresses</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border border-white/10 bg-white/5 rounded-lg p-4 relative">
                            {address.is_default && (
                              <span className="absolute top-2 right-2 bg-white text-black text-xs px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                            <h3 className="font-medium mb-2">{address.title}</h3>
                            <p className="text-sm text-white/50">{address.full_name}</p>
                            <p className="text-sm text-white/50">{address.phone}</p>
                            <p className="text-sm text-white/50">{address.street}</p>
                            <p className="text-sm text-white/50">{address.city}, {address.region}</p>
                            {address.postal_code && (
                              <p className="text-sm text-white/50">{address.postal_code}</p>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="mt-4 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
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
