import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@/App.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import ProductDetail from "./components/ProductDetail";
import CartSidebar from "./components/CartSidebar";
import AuthModal from "./components/AuthModal";
import SearchModal from "./components/SearchModal";
import AccountPage from "./components/AccountPage";

function App() {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);
  const [accountPageOpen, setAccountPageOpen] = React.useState(false);

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
              <Route path="/checkout" element={<CheckoutPage />} />
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
