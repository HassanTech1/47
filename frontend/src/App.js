import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@/App.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
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
import AuthModal from "./components/AuthModal";
import SearchModal from "./components/SearchModal";
import AccountPage from "./components/AccountPage";

const HomePage = ({ onOpenAuth, onOpenSearch, onOpenAccount }) => (
  <>
    <Header 
      onOpenAuth={onOpenAuth} 
      onOpenSearch={onOpenSearch}
      onOpenAccount={onOpenAccount}
    />
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [accountPageOpen, setAccountPageOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App" dir="rtl">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    onOpenAuth={() => setAuthModalOpen(true)}
                    onOpenSearch={() => setSearchModalOpen(true)}
                    onOpenAccount={() => setAccountPageOpen(true)}
                  />
                } 
              />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={
                <HomePage 
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onOpenSearch={() => setSearchModalOpen(true)}
                  onOpenAccount={() => setAccountPageOpen(true)}
                />
              } />
            </Routes>
            <ProductDetail />
            <CartSidebar />
            <AuthModal 
              isOpen={authModalOpen} 
              onClose={() => setAuthModalOpen(false)} 
            />
            <SearchModal 
              isOpen={searchModalOpen} 
              onClose={() => setSearchModalOpen(false)} 
            />
            <AccountPage 
              isOpen={accountPageOpen} 
              onClose={() => setAccountPageOpen(false)} 
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
