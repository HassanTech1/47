// src/lib/shopify.js
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: process.env.REACT_APP_SHOPIFY_STORE_DOMAIN,
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN,
  apiVersion: '2023-10'
});

export default client;
