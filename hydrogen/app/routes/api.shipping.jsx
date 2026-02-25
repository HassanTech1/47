import {data} from 'react-router';
import {getDHLRates} from '~/lib/dhl.server';

const json = (payload, init) => data(payload, init);

// Fallback static rates (used if DHL API fails or credentials missing)
const STATIC_RATES = [
  {
    id: 'aramex-standard',
    carrier: 'Aramex',
    carrierLogo: '/logo/aramex.png',
    nameAr: 'عادي',
    nameEn: 'Standard',
    daysAr: '3-5 أيام عمل',
    price: 27,
  },
  {
    id: 'aramex-express',
    carrier: 'Aramex',
    carrierLogo: '/logo/aramex.png',
    nameAr: 'سريع',
    nameEn: 'Express',
    daysAr: '1-2 يوم عمل',
    price: 42,
  },
  {
    id: 'dhl-economy',
    carrier: 'DHL',
    carrierLogo: '/logo/dhl.png',
    nameAr: 'اقتصادي',
    nameEn: 'Economy',
    daysAr: '5-7 أيام عمل',
    price: 25,
  },
  {
    id: 'dhl-express',
    carrier: 'DHL',
    carrierLogo: '/logo/dhl.png',
    nameAr: 'سريع',
    nameEn: 'Express',
    daysAr: '1-3 أيام عمل',
    price: 45,
  },
];

export async function action({request}) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {country, city, weight = 0.5} = await request.json();

  if (!country) {
    return json({rates: STATIC_RATES}); // Default if no country selected
  }

  // 1. Try to fetch real DHL rates
  try {
    const dhlRates = await getDHLRates({
      destinationCountry: country,
      destinationCity: city,
      weight: parseFloat(weight),
      accountNumber: process.env.DHL_ACCOUNT_NUMBER || '457579508',
    });

    // 2. If DHL returns rates, merge or replace
    if (dhlRates && dhlRates.length > 0) {
      // Filter out static DHL if we have real DHL
      const otherRates = STATIC_RATES.filter(r => r.carrier !== 'DHL');
      return json({rates: [...otherRates, ...dhlRates]});
    }
  } catch (err) {
    console.error('Shipping rate fetch error:', err);
  }

  // 3. Fallback to static rates if API fails or credentials missing
  return json({rates: STATIC_RATES});
}
