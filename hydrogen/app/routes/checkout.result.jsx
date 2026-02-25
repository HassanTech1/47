import {useLoaderData, Link} from 'react-router';
import {useCart} from '~/context/CartContext';
import {useEffect, useState} from 'react';
import {CheckCircle, XCircle, AlertCircle, Package} from 'lucide-react';

export function meta() {
  return [{title: "نتيجة الدفع | 4Seven's"}];
}

/**
 * Loader runs server-side to verify the payment with HyperPay.
 * HyperPay redirects here with: ?id={checkoutId}&resourcePath=/v1/checkouts/{id}/payment
 */
export async function loader({request, context}) {
  const {env} = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const resourcePath = url.searchParams.get('resourcePath');

  if (!id) {
    return {status: 'error', message: 'لم يتم تلقي معرف الدفع من بوابة HyperPay'};
  }

  const baseUrl = env?.HYPERPAY_BASE_URL ?? 'https://eu-test.oppwa.com';
  const accessToken = env?.HYPERPAY_ACCESS_TOKEN ?? '';
  const entityId = env?.HYPERPAY_ENTITY_ID ?? '';

  if (!accessToken || !entityId) {
    return {status: 'error', message: 'إعدادات بوابة الدفع غير مكتملة'};
  }

  try {
    const path = resourcePath ?? `/v1/checkouts/${id}/payment`;
    const verifyUrl = `${baseUrl}${path}?entityId=${entityId}`;

    const res = await fetch(verifyUrl, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });

    if (!res.ok) {
      return {status: 'error', message: `فشل التحقق من الدفع (HTTP ${res.status})`};
    }

    const data = await res.json();
    const code = data.result?.code ?? '';

    /**
     * HyperPay successful payment codes:
     * 000.000.000 - Transaction succeeded
     * 000.100.110 - Request successfully processed (3DS)
     * 000.000.100 - Successful request
     * 000.300.xxx - Pending (COD / bank transfer)
     * 000.600.xxx - Pending (COD)
     */
    const isSuccess =
      /^(000\.000\.|000\.100\.1|000\.([36]|[74]|81)[01])/.test(code) ||
      /^(000\.400\.0[^3]|000\.400\.100)/.test(code);

    const isPending = /^(000\.200\.|000\.300\.|000\.600\.)/.test(code);

    return {
      status: isSuccess ? 'success' : isPending ? 'pending' : 'failed',
      transactionId: data.id,
      amount: data.amount,
      currency: data.currency,
      code,
      description: data.result?.description,
      brand: data.paymentBrand,
      last4: data.card?.last4Digits,
    };
  } catch (err) {
    console.error('[checkout/result]', err.message);
    return {status: 'error', message: err.message};
  }
}

export default function CheckoutResult() {
  const loaderData = useLoaderData();
  const {status, transactionId, amount, currency, description, brand, last4} =
    loaderData ?? {};
  const {clearCart} = useCart();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (status === 'success') {
      clearCart();
    }
    try {
      const saved = sessionStorage.getItem('hp_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrderDetails(parsed);
        if (status === 'success') sessionStorage.removeItem('hp_order');
      }
    } catch {}
  }, [status]);

  // ── Success ──────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <main className="min-h-screen pt-24 bg-[#f9f9f9] flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white border border-gray-200 shadow-sm p-10 max-w-lg w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">
            تمت عملية الشراء بنجاح
          </h1>
          <p className="text-gray-500 mb-6">
            شكراً لطلبك! سيتم شحن طلبك وستصلك رسالة تأكيد قريباً.
          </p>

          {/* Transaction details */}
          <div className="bg-gray-50 border border-gray-100 rounded p-4 mb-6 text-right space-y-2 text-sm">
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-500">رقم المعاملة</span>
                <span className="font-mono text-xs">{transactionId}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المدفوع</span>
                <span className="font-bold">
                  {amount} {currency ?? 'SAR'}
                </span>
              </div>
            )}
            {brand && (
              <div className="flex justify-between">
                <span className="text-gray-500">طريقة الدفع</span>
                <span>
                  {brand} {last4 ? `****${last4}` : ''}
                </span>
              </div>
            )}
            {orderDetails?.shipping && (
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن</span>
                <span>
                  {orderDetails.shipping.carrier} — {orderDetails.shipping.nameAr}
                </span>
              </div>
            )}
          </div>

          {/* Order items */}
          {orderDetails?.items?.length > 0 && (
            <div className="border border-gray-100 rounded p-4 mb-6 text-right">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  الطلبات
                </span>
              </div>
              <div className="space-y-2">
                {orderDetails.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.nameEn ?? item.name}{' '}
                      {item.size && <span className="text-gray-400">({item.size})</span>}
                      {' ×'} {item.quantity}
                    </span>
                    <span>{((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)} SAR</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link
            to="/"
            className="inline-block px-8 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            العودة للمتجر
          </Link>
        </div>
      </main>
    );
  }

  // ── Pending ──────────────────────────────────────────────────────────────
  if (status === 'pending') {
    return (
      <main className="min-h-screen pt-24 bg-[#f9f9f9] flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white border border-gray-200 p-10 max-w-lg w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">الدفع قيد المعالجة</h1>
          <p className="text-gray-500 mb-4">
            طلبك قيد المعالجة. ستصلك رسالة تأكيد فور اكتمال الدفع.
          </p>
          {transactionId && (
            <p className="text-xs text-gray-400 mb-6 font-mono">ID: {transactionId}</p>
          )}
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            العودة للمتجر
          </Link>
        </div>
      </main>
    );
  }

  // ── Failed / Error ───────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pt-24 bg-[#f9f9f9] flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white border border-gray-200 p-10 max-w-lg w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-5" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">فشلت عملية الدفع</h1>
        <p className="text-gray-500 mb-2">
          {description ?? loaderData?.message ?? 'حدث خطأ أثناء معالجة الدفع.'}
        </p>
        <p className="text-xs text-gray-400 mb-6">
          يرجى التحقق من بيانات البطاقة والمحاولة مجدداً، أو التواصل مع البنك.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/checkout"
            className="px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            إعادة المحاولة
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border-2 border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    </main>
  );
}
