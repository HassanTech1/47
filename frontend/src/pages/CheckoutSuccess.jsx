import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Printer } from 'lucide-react';
import logo1 from '../assest/logo/1.png';
import logo2 from '../assest/logo/2.png';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CheckoutSuccess = () => {
  const [status, setStatus] = useState('checking');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const pollPaymentStatus = async (sessionId, attempts = 0) => {
      const maxAttempts = 5;
      const pollInterval = 2000;
  
      if (attempts >= maxAttempts) {
        setStatus('timeout');
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/api/checkout/status/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check payment status');
        }
  
        const data = await response.json();
  
        if (data.payment_status === 'paid') {
          setStatus('success');
          setOrderDetails(data);
          return;
        } else if (data.status === 'expired') {
          setStatus('expired');
          return;
        }
  
        // Continue polling
        setStatus('processing');
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
      }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else {
      setStatus('error');
    }

    // Clear cart after successful payment
    localStorage.removeItem('7777_cart');
  }, []);

  const goHome = () => {
    window.location.href = '/';
  };

  const printInvoice = () => {
    window.print();
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white" dir="ltr">
      {/* Header */}
      <div className="bg-black border-b border-white/10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/">
            <img src={logo2} alt="4Seven's" className="h-10 w-auto object-contain" />
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {status === 'checking' || status === 'processing' ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-white/10 border-t-white rounded-full mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-white/50">Please wait while we confirm your payment...</p>
          </div>
        ) : status === 'success' ? (
          <>
            {/* Success Message */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-6 text-center print:shadow-none">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
              <p className="text-white/60 mb-4">
                Your order has been confirmed and will be shipped soon.
              </p>
              <p className="text-sm text-white/40">
                Order confirmation has been sent to your email.
              </p>
            </div>

            {/* Invoice / Order Details */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden print:shadow-none" id="invoice">
              {/* Invoice Header */}
              <div className="bg-black text-white p-6 print:bg-black">
                <div className="flex justify-between items-start">
                  <div>
                    <img src={logo1} alt="4Seven's" className="h-10 w-auto object-contain mb-1" />
                    <p className="text-gray-300 text-sm">Premium Fashion</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-medium mb-1">INVOICE</h3>
                    <p className="text-gray-300 text-sm">#{orderDetails?.metadata?.order_id?.slice(0, 8) || 'N/A'}</p>
                    <p className="text-gray-300 text-sm">{formatDate()}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Body */}
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 rounded-full text-sm font-medium">
                    Payment Successful
                  </span>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Shipping Address */}
                  <div className="border border-white/10 bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-white/30" />
                      <h4 className="font-medium">Shipping Address</h4>
                    </div>
                    <p className="text-sm text-white/50">
                      {orderDetails?.metadata?.shipping_name || 'Customer'}<br />
                      {orderDetails?.metadata?.shipping_address || 'Address on file'}<br />
                      {orderDetails?.metadata?.shipping_city || ''} {orderDetails?.metadata?.shipping_region || ''}<br />
                      {orderDetails?.metadata?.shipping_phone || ''}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="border border-white/10 bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5 text-white/30" />
                      <h4 className="font-medium">Payment Method</h4>
                    </div>
                    <p className="text-sm text-white/50">
                      Credit/Debit Card<br />
                      <span className="text-emerald-400">Paid</span>
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border border-white/10 rounded-lg overflow-hidden mb-6">
                  <div className="bg-white/5 px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-white/30" />
                      <h4 className="font-medium">Order Items</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-white/40 border-b border-white/10">
                          <th className="pb-3">Item</th>
                          <th className="pb-3 text-center">Qty</th>
                          <th className="pb-3 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="py-3">
                            <p className="font-medium text-white/90">Order Items</p>
                            <p className="text-sm text-white/40">{orderDetails?.metadata?.items_count || '1'} item(s)</p>
                          </td>
                          <td className="py-3 text-center">{orderDetails?.metadata?.items_count || '1'}</td>
                          <td className="py-3 text-right font-medium">
                            SAR {((orderDetails?.amount_total || 0) / 100 / 1.15).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border border-white/10 bg-white/5 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Subtotal</span>
                      <span>SAR {((orderDetails?.amount_total || 0) / 100 / 1.15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Shipping</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">VAT (15%)</span>
                      <span>SAR {((orderDetails?.amount_total || 0) / 100 * 0.15 / 1.15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                      <span>Total</span>
                      <span>SAR {((orderDetails?.amount_total || 0) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                  <p className="text-sm text-white/50">
                    Thank you for shopping with us! If you have any questions about your order,
                    please contact our customer service.
                  </p>
                  <p className="text-sm text-white/30 mt-2">
                    support@7777store.com | +966 50 000 0000
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 print:hidden">
              <button
                onClick={printInvoice}
                className="flex-1 py-4 border border-white/30 text-white/70 font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print Invoice
              </button>
              <button
                onClick={goHome}
                className="flex-1 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                data-testid="continue-shopping-btn"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : status === 'expired' ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-yellow-900/30 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏱️</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Session Expired</h1>
            <p className="text-white/50 mb-6">
              Your payment session has expired. Please try again.
            </p>
            <button
              onClick={goHome}
              className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Return to Store
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Error</h1>
            <p className="text-white/50 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <button
              onClick={goHome}
              className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Return to Store
            </button>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:bg-black { background-color: black !important; color: white !important; }
        }
      `}</style>
    </div>
  );
};

export default CheckoutSuccess;
