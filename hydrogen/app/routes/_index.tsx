import type { MetaFunction } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';
import Header from '~/components/Header';
import HeroSection from '~/components/HeroSection';
import PromoBanner from '~/components/PromoBanner';
import ProductGrid from '~/components/ProductGrid';
import Categories from '~/components/Categories';
import LifestyleSection from '~/components/LifestyleSection';
import Footer from '~/components/Footer';

export const meta: MetaFunction = () => {
  return [
    { title: "4Seven's Premium Fashion" },
    { name: 'description', content: "Premium fashion collection by 4Seven's" },
  ];
};

type OutletContext = {
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
};

export default function Index() {
  const { onOpenAuth, onOpenSearch, onOpenAccount } =
    useOutletContext<OutletContext>();

  return (
    <>
      <Header
        onOpenAuth={onOpenAuth}
        onOpenSearch={onOpenSearch}
        onOpenAccount={onOpenAccount}
      />
      <HeroSection />
      <PromoBanner />
      <ProductGrid />
      <Categories />
      <LifestyleSection />
      <Footer />
    </>
  );
}
