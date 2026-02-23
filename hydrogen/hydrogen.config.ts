import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  storefront: {
    defaultLanguage: 'AR',
    defaultCountry: 'SA',
    supportedLanguages: ['AR', 'EN'],
    supportedCountries: ['SA', 'AE', 'KW', 'BH', 'QA', 'OM'],
  },
});
