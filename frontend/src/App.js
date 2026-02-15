import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@/App.css";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categories from "./components/Categories";
import PromoBanner from "./components/PromoBanner";
import ProductGrid from "./components/ProductGrid";
import LifestyleSection from "./components/LifestyleSection";
import FloatingChat from "./components/FloatingChat";
import Footer from "./components/Footer";
import ProductDetail from "./components/ProductDetail";
import CartSidebar from "./components/CartSidebar";
import CheckoutSuccess from "./pages/CheckoutSuccess";

const HomePage = () => (
  <>
    <Header />
    <HeroSection />
    <Categories />
    <PromoBanner />
    <ProductGrid />
    <LifestyleSection />
    <FloatingChat />
    <Footer />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App" dir="rtl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<HomePage />} />
          </Routes>
          <ProductDetail />
          <CartSidebar />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
