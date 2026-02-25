
/**
 * DHL Express API Integration (MyDHL API REST)
 *
 * Requirements:
 * - DHL_USERNAME (Site ID)
 * - DHL_PASSWORD
 * - DHL_ACCOUNT_NUMBER (Sender Account Number)
 *
 * Documentation: https://developer.dhl.com/api-reference/dhl-express-mydhl-api
 */

// Production URL (https://express.api.dhl.com/mydhlapi)
// Test URL (https://express.api.dhl.com/mydhlapi/test)
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://express.api.dhl.com/mydhlapi' 
  : 'https://express.api.dhl.com/mydhlapi/test';

/**
 * Get shipping rates from DHL Express API
 * @param {Object} params
 * @param {string} params.accountNumber Sender account number
 * @param {string} params.originCountry Origin country code (e.g. SA)
 * @param {string} params.originCity Origin city (e.g. Riyadh)
 * @param {string} params.destinationCountry Destination country code
 * @param {string} params.destinationCity Destination city
 * @param {number} params.weight Weight in kg
 * @param {number} params.length Length in cm
 * @param {number} params.width Width in cm
 * @param {number} params.height Height in cm
 * @param {string} params.plannedShippingDate Date (YYYY-MM-DD)
 * @returns {Promise<Array>} List of shipping options or null on error
 */
export async function getDHLRates({
  accountNumber,
  originCountry = 'SA',
  originCity = 'Riyadh',
  destinationCountry,
  destinationCity,
  weight = 0.5,
  length = 10,
  width = 10,
  height = 10,
  plannedShippingDate,
}) {
  const username = process.env.DHL_USERNAME;
  const password = process.env.DHL_PASSWORD;

  if (!username || !password) {
    // console.warn('DHL credentials missing (DHL_USERNAME, DHL_PASSWORD)');
    return null;
  }

  // Basic Auth Header
  const auth = typeof Buffer !== 'undefined' 
    ? Buffer.from(`${username}:${password}`).toString('base64')
    : btoa(`${username}:${password}`);

  const date = plannedShippingDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]; // Tomorrow

  const query = new URLSearchParams({
    accountNumber: accountNumber || process.env.DHL_ACCOUNT_NUMBER || '457579508',
    originCountryCode: originCountry,
    originCityName: originCity,
    destinationCountryCode: destinationCountry,
    destinationCityName: destinationCity || 'City',
    weight: weight.toString(),
    length: length.toString(),
    width: width.toString(),
    height: height.toString(),
    plannedShippingDate: date,
    isCustomsDeclarable: 'false',
    unitOfMeasurement: 'metric',
  });

  try {
    const response = await fetch(`${BASE_URL}/rates?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DHL API Error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    // Map DHL products to our format
    if (!data.products) return [];

    return data.products.map(p => ({
      id: `dhl-${p.productCode.toLowerCase()}`,
      carrier: 'DHL',
      nameEn: p.productName,
      nameAr: p.productName, // API returns English names
      price: p.totalPrice[0]?.price,
      currency: p.totalPrice[0]?.currencyType,
      daysAr: p.deliveryCapabilities?.estimatedDeliveryDateAndTime 
        ? new Date(p.deliveryCapabilities.estimatedDeliveryDateAndTime).toLocaleDateString('ar-SA')
        : '3-5 أيام',
      carrierLogo: '/logo/dhl.png'
    }));

  } catch (error) {
    console.error('DHL Fetch Error:', error);
    return null;
  }
}
