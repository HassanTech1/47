# 4Seven's — Shopify Hydrogen Storefront

This is the Shopify Hydrogen (React Router v7) version of the **4Seven's** fashion brand storefront. It replaces the previous Create React App frontend with a production-ready, server-side rendered Shopify storefront.

## 🚀 Tech Stack

- **[Shopify Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)** 2026.1.0
- **[React Router v7](https://reactrouter.com/)** — file-based SSR routing
- **[Shopify Storefront API](https://shopify.dev/docs/api/storefront)** — real product & cart data
- **[Vite 6](https://vite.dev/)** — fast builds
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Shopify Oxygen](https://shopify.dev/docs/custom-storefronts/oxygen)** — deployment target

---

## ⚙️ Setup

### 1. Copy environment variables

```bash
cp .env.example .env
```

Fill in your store credentials in `.env`:

```env
SESSION_SECRET=<random-32-char-secret>
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=<storefront-api-public-token>
PRIVATE_STOREFRONT_API_TOKEN=<storefront-api-private-token>
PUBLIC_CHECKOUT_DOMAIN=your-store.myshopify.com
```

> **Where to get these credentials:**
> 1. Go to your **Shopify Admin** → Apps → Develop apps
> 2. Create or open an app, then click **Configure Storefront API scopes**
> 3. Enable: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`, `unauthenticated_read_customer_tags`
> 4. Copy the **public** and **private** API access tokens

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Build & Deploy

### Build for production

```bash
npm run build
```

### Deploy to Shopify Oxygen

```bash
npx shopify hydrogen deploy
```

Or connect your GitHub repository to **Shopify Oxygen** in the Shopify Partner Dashboard for automatic deployments.

---

## 🗂️ Project Structure

```
hydrogen/
├── app/
│   ├── components/         # UI components (Header, Footer, ProductGrid, etc.)
│   ├── lib/
│   │   ├── context.ts      # Hydrogen context (Storefront API, Session, Cart)
│   │   ├── session.ts      # Cookie session management
│   │   ├── fragments.ts    # GraphQL cart fragments
│   │   └── mock-data.js    # Fallback product data (when Shopify not configured)
│   ├── routes/
│   │   ├── _index.jsx      # Homepage
│   │   ├── products.$handle.jsx      # Product detail page
│   │   ├── collections.$handle.jsx   # Collection page
│   │   ├── cart.jsx        # Cart page + mutations
│   │   └── account.jsx     # Account page
│   ├── styles/
│   │   └── app.css         # Global styles + Tailwind
│   ├── root.jsx            # Root layout
│   ├── entry.client.jsx    # Client hydration
│   ├── entry.server.jsx    # SSR rendering
│   └── routes.ts           # Route configuration
├── server.ts               # Oxygen worker entry point
├── vite.config.js          # Vite + Hydrogen configuration
├── react-router.config.ts  # React Router configuration
├── tailwind.config.js      # Tailwind configuration
├── .env.example            # Environment variable template
└── package.json
```

---

## 🛍️ Features

- **Server-side rendering** via Shopify Oxygen (Cloudflare Workers)
- **Real Shopify cart** — add, update, remove items via Storefront API
- **Product pages** with variant selection (size, color)
- **Collection pages** — display Shopify collections
- **Mock data fallback** — works without Shopify connected (for development)
- **Arabic + English** support
- **Free shipping banner** at 475 SAR threshold
- **Responsive design** — mobile-first

---

## 🔗 Connecting to Your Shopify Store

After adding your credentials to `.env`:

1. Make sure your Shopify store has products uploaded at **Products** in the admin
2. Create a collection named `essentials` (or `all`) for the homepage to display
3. The app will automatically pull live products from your Storefront API
4. If no products are found, it falls back to the built-in mock product data

---

## 🔒 Security Notes

- **Never commit `.env`** — it is already in `.gitignore`
- Use **Shopify Oxygen environment variables** for production secrets
- The `PRIVATE_STOREFRONT_API_TOKEN` is only used server-side
