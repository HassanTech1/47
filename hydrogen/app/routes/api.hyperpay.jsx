import {data as routerData} from 'react-router';

const json = (p, i) => routerData(p, i);

/**
 * POST /api/hyperpay
 *
 * Creates a HyperPay checkout session and returns the checkoutId used by
 * the frontend widget.
 *
 * Required .env variables:
 *   HYPERPAY_BASE_URL          https://eu-test.oppwa.com  (test)
 *                              https://oppwa.com          (live)
 *   HYPERPAY_ACCESS_TOKEN      Bearer token from HyperPay dashboard
 *   HYPERPAY_ENTITY_ID         Entity ID for VISA / MASTER / MADA
 *
 * Optional (if MADA needs a separate entity):
 *   HYPERPAY_ENTITY_ID_MADA    Separate entity ID for MADA-only payments
 */
export async function action({request, context}) {
  const {env} = context;

  const baseUrl =
    env?.HYPERPAY_BASE_URL ?? 'https://eu-test.oppwa.com';
  const accessToken = env?.HYPERPAY_ACCESS_TOKEN;
  const entityId = env?.HYPERPAY_ENTITY_ID;

  // ── Guard: credentials must be set ──────────────────────────────────────
  if (!accessToken || !entityId) {
    const missingVars = [
      !accessToken && 'HYPERPAY_ACCESS_TOKEN',
      !entityId && 'HYPERPAY_ENTITY_ID',
    ]
      .filter(Boolean)
      .join(', ');

    console.error('[api/hyperpay] Missing env variables:', missingVars);

    return json(
      {
        error:
          `بوابة الدفع غير مُهيأة (${missingVars}). ` +
          'يرجى إضافة متغيرات البيئة في ملف .env',
      },
      {status: 500},
    );
  }

  // ── Parse request body ───────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return json({error: 'طلب غير صالح'}, {status: 400});
  }

  const {amount, currency = 'SAR', customer, items = [], shipping} = body;

  if (!amount || !customer?.email) {
    return json({error: 'بيانات غير مكتملة (amount / email)'}, {status: 400});
  }

  // ── Build HyperPay params ────────────────────────────────────────────────
  const params = new URLSearchParams({
    entityId,
    amount: String(amount),
    currency,
    paymentType: 'DB', // Debit (immediate charge)
    'customer.email': customer.email,
    'customer.givenName': customer.firstName ?? '',
    'customer.surname': customer.lastName ?? '',
    'customer.mobile': customer.phone ?? '',
    'billing.street1': customer.address ?? '',
    'billing.city': customer.city ?? '',
    'billing.country': customer.country ?? 'SA',
    'billing.postcode': customer.postalCode ?? '',
    // Merchant-facing description
    'descriptor': `4Sevens Order`,
  });

  if (customer.apartment) params.set('billing.street2', customer.apartment);

  // Add order line items as custom parameters (visible in dashboard)
  items.forEach((item, i) => {
    params.set(
      `cart.items[${i}].name`,
      (item.nameEn ?? item.name ?? 'Product').substring(0, 50),
    );
    params.set(`cart.items[${i}].quantity`, String(item.quantity ?? 1));
    params.set(`cart.items[${i}].price`, String(item.price ?? 0));
    params.set(`cart.items[${i}].currency`, currency);
  });

  if (shipping) {
    params.set('shipping.method', `${shipping.carrier} ${shipping.nameEn ?? ''}`);
    params.set('shipping.cost', String(shipping.price ?? 0));
    params.set('shipping.currency', currency);
  }

  // ── Call HyperPay ────────────────────────────────────────────────────────
  try {
    const res = await fetch(`${baseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();

    // HyperPay success code for session creation: 000.200.100
    const created = /^000\.200\./.test(data.result?.code ?? '');

    if (data.id && created) {
      return json({checkoutId: data.id, baseUrl});
    }

    console.error('[api/hyperpay] Session error:', data);
    return json(
      {
        error: `HyperPay: ${data.result?.description ?? 'فشل إنشاء جلسة الدفع'} (${
          data.result?.code ?? ''
        })`,
      },
      {status: 400},
    );
  } catch (err) {
    console.error('[api/hyperpay] Network error:', err.message);
    return json({error: `خطأ في الاتصال ببوابة الدفع: ${err.message}`}, {status: 500});
  }
}
