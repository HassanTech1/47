import React from "react";
import "@/App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categories from "./components/Categories";
import PromoBanner from "./components/PromoBanner";
import ProductGrid from "./components/ProductGrid";
import LifestyleSection from "./components/LifestyleSection";
import FloatingChat from "./components/FloatingChat";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App" dir="rtl">
      <Header />
      <HeroSection />
      <Categories />
      <PromoBanner />
      <ProductGrid />
      <LifestyleSection />
      <FloatingChat />
      <Footer />
    </div>
  );
}

export default App;
