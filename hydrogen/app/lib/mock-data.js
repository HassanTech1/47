/**
 * Mock product data as fallback when Shopify is not configured.
 * These mirror the products sold by the 4Seven's brand.
 */
export const MOCK_PRODUCTS = [
  {
    id: 'gid://shopify/Product/1',
    title: '٧٧٧٧ pants',
    handle: '7777-pants',
    description: 'Premium quality unisex pants from the 4Seven\'s essential collection.',
    priceRange: {
      minVariantPrice: {amount: '179.00', currencyCode: 'SAR'},
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=85',
      altText: '٧٧٧٧ pants',
      width: 800,
      height: 1000,
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1',
          title: 'S',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'S'}],
        },
        {
          id: 'gid://shopify/ProductVariant/2',
          title: 'M',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'M'}],
        },
        {
          id: 'gid://shopify/ProductVariant/3',
          title: 'L',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'L'}],
        },
        {
          id: 'gid://shopify/ProductVariant/4',
          title: 'XL',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'XL'}],
        },
      ],
    },
    tags: ['unisex', 'essentials'],
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Can be hoody',
    handle: 'can-be-hoody',
    description: 'Versatile hoodie from the 4Seven\'s essential collection.',
    priceRange: {
      minVariantPrice: {amount: '249.00', currencyCode: 'SAR'},
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=85',
      altText: 'Can be hoody',
      width: 800,
      height: 1000,
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/5',
          title: 'S',
          availableForSale: true,
          price: {amount: '249.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'S'}],
        },
        {
          id: 'gid://shopify/ProductVariant/6',
          title: 'M',
          availableForSale: true,
          price: {amount: '249.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'M'}],
        },
        {
          id: 'gid://shopify/ProductVariant/7',
          title: 'L',
          availableForSale: true,
          price: {amount: '249.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'L'}],
        },
        {
          id: 'gid://shopify/ProductVariant/8',
          title: 'XL',
          availableForSale: true,
          price: {amount: '249.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'XL'}],
        },
      ],
    },
    tags: ['unisex', 'essentials'],
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'T-shirt',
    handle: 't-shirt',
    description: 'Classic T-shirt from the 4Seven\'s essential collection.',
    priceRange: {
      minVariantPrice: {amount: '149.00', currencyCode: 'SAR'},
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1715533173683-737d4a2433dd?w=800&q=85',
      altText: 'T-shirt',
      width: 800,
      height: 1000,
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/9',
          title: 'S',
          availableForSale: true,
          price: {amount: '194.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'S'}],
        },
        {
          id: 'gid://shopify/ProductVariant/10',
          title: 'M',
          availableForSale: true,
          price: {amount: '194.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'M'}],
        },
        {
          id: 'gid://shopify/ProductVariant/11',
          title: 'L',
          availableForSale: true,
          price: {amount: '194.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'L'}],
        },
      ],
    },
    tags: ['unisex', 'essentials'],
  },
  {
    id: 'gid://shopify/Product/4',
    title: '٧٧٧٧ zip-up',
    handle: '7777-zip-up',
    description: 'Premium zip-up hoodie from the 4Seven\'s essential collection.',
    priceRange: {
      minVariantPrice: {amount: '269.00', currencyCode: 'SAR'},
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85',
      altText: '٧٧٧٧ zip-up',
      width: 800,
      height: 1000,
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/12',
          title: 'S',
          availableForSale: true,
          price: {amount: '269.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'S'}],
        },
        {
          id: 'gid://shopify/ProductVariant/13',
          title: 'M',
          availableForSale: true,
          price: {amount: '269.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'M'}],
        },
        {
          id: 'gid://shopify/ProductVariant/14',
          title: 'L',
          availableForSale: true,
          price: {amount: '269.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'L'}],
        },
      ],
    },
    tags: ['unisex', 'essentials'],
  },
  {
    id: 'gid://shopify/Product/5',
    title: 'My future is calling',
    handle: 'my-future-is-calling',
    description: 'Statement piece from the 4Seven\'s essential collection.',
    priceRange: {
      minVariantPrice: {amount: '269.00', currencyCode: 'SAR'},
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1686491730848-0c86413833e5?w=800&q=85',
      altText: 'My future is calling',
      width: 800,
      height: 1200,
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/15',
          title: 'S',
          availableForSale: true,
          price: {amount: '269.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'S'}],
        },
        {
          id: 'gid://shopify/ProductVariant/16',
          title: 'M',
          availableForSale: true,
          price: {amount: '269.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'M'}],
        },
        {
          id: 'gid://shopify/ProductVariant/17',
          title: 'L',
          availableForSale: true,
          price: {amount: '269.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'L'}],
        },
      ],
    },
    tags: ['featured', 'essentials'],
  },
  {
    id: 'gid://shopify/Product/6',
    title: "4Seven's pants",
    handle: '4sevens-pants',
    description: 'Signature pants from the 4Seven\'s collection.',
    priceRange: {
      minVariantPrice: {amount: '179.00', currencyCode: 'SAR'},
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=800&q=85',
      altText: "4Seven's pants",
      width: 800,
      height: 1000,
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/18',
          title: 'S',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'S'}],
        },
        {
          id: 'gid://shopify/ProductVariant/19',
          title: 'M',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'M'}],
        },
        {
          id: 'gid://shopify/ProductVariant/20',
          title: 'L',
          availableForSale: true,
          price: {amount: '179.00', currencyCode: 'SAR'},
          selectedOptions: [{name: 'Size', value: 'L'}],
        },
      ],
    },
    tags: ['special', 'essentials'],
  },
];
