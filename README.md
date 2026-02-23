# 4Seven's — Premium Fashion Store

A full-stack e-commerce application built with **React** (frontend) and **FastAPI** (backend), designed as a Shopify-compatible theme.

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository

> ⚠️ **Do NOT use `git init`** — this creates an empty local repository unconnected to GitHub.  
> You must **clone** the repository to get all the code and stay connected to GitHub.

```bash
git clone https://github.com/HassanTech1/47.git
cd 47
```

Then open the cloned folder in VS Code:

```
File → Open Folder → select the "47" folder
```

---

### 2. Frontend Setup

The frontend is a React app located in the `/frontend` directory.

**Requirements:** Node.js 18+ and npm

```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

To create a production build:

```bash
npm run build
```

---

### 3. Backend Setup

The backend is a FastAPI (Python) server located in the `/backend` directory.

**Requirements:** Python 3.10+

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=4sevens
JWT_SECRET_KEY=your-secret-key-here
STRIPE_API_KEY=sk_test_your_stripe_key
CORS_ORIGINS=http://localhost:3000
```

Start the server:

```bash
uvicorn server:app --reload --port 8000
```

The API will be available at **http://localhost:8000**

Set the backend URL in the frontend by creating `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🗂 Project Structure

```
47/
├── frontend/          # React app (Tailwind CSS, shadcn/ui)
│   ├── src/
│   │   ├── components/    # UI components (Header, ProductGrid, etc.)
│   │   ├── pages/         # Page components (Home, Checkout, etc.)
│   │   ├── context/       # React context (Cart, Auth, Language)
│   │   ├── data/          # Mock product data
│   │   └── assest/        # Local images (products, logos, previews)
│   └── package.json
├── backend/           # FastAPI server
│   ├── server.py          # Main API server
│   └── requirements.txt
├── assets/            # Shopify theme bundle output
├── sections/          # Shopify Liquid sections
├── templates/         # Shopify Liquid templates
└── README.md
```

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Tailwind CSS, shadcn/ui |
| Backend   | FastAPI, MongoDB (Motor)          |
| Auth      | JWT (python-jose)                 |
| Payments  | Stripe Checkout                   |
| Hosting   | Shopify (theme bundle)            |

---

## ❓ Troubleshooting

### VS Code shows "Not a git repository" error

This happens when you **downloaded the ZIP** or used `git init` instead of cloning.

**Fix:** Delete the folder and clone properly:

```bash
git clone https://github.com/HassanTech1/47.git
```

### VS Code shows "No such branch: main"

This happens when you ran `git init` locally — the new empty repo has no commits or branches.

**Fix:** Same as above — clone the repo instead of initializing a new one.

### `npm start` fails

Make sure you are inside the `frontend/` directory:

```bash
cd frontend
npm install
npm start
```
