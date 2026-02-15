import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const CheckoutSuccess = () => {
  const [status, setStatus] = useState('checking');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
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

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setStatus('timeout');
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
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

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="ltr">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        {status === 'checking' || status === 'processing' ? (
          <>
            <div className="animate-spin w-16 h-16 border-4 border-gray-200 border-t-black rounded-full mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Order Details</span>
                </div>
                <p className="text-sm text-gray-600">
                  Total: {(orderDetails.amount_total / 100).toFixed(2)} {orderDetails.currency?.toUpperCase()}
                </p>
              </div>
            )}
            <button
              onClick={goHome}
              className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              data-testid="continue-shopping-btn"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : status === 'expired' ? (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏱️</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Session Expired</h1>
            <p className="text-gray-600 mb-6">
              Your payment session has expired. Please try again.
            </p>
            <button
              onClick={goHome}
              className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Return to Store
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <button
              onClick={goHome}
              className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Return to Store
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
