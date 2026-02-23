import {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router';
import {Search, User, ShoppingCart, Menu, X, Instagram} from 'lucide-react';

/**
 * Header component adapted for Shopify Hydrogen.
 * Cart count is passed as a prop from the loader data.
 */
export function Header({shop, cartCount = 0, onOpenSearch, onOpenCart}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const FREE_SHIPPING_THRESHOLD = 475;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showExpandedMenu = scrolled || menuOpen;

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[60] h-10 bg-white text-black flex items-center justify-center text-sm font-medium transition-transform duration-300 ${
          scrolled ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <span>
          Free delivery for orders above{' '}
          <span style={{color: 'green'}}>{FREE_SHIPPING_THRESHOLD}</span> SAR
        </span>
      </div>

      {/* Compact Header (over hero) */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          showExpandedMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl shadow-lg top-0'
            : 'bg-transparent top-10'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left icons */}
            <div className="flex items-center gap-6">
              <button
                className="header-icon relative"
                aria-label="Shopping Cart"
                onClick={onOpenCart}
                data-testid="header-cart-btn"
              >
                <ShoppingCart className="w-7 h-7" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                to="/account"
                className="header-icon"
                aria-label="My Account"
                data-testid="header-user-btn"
              >
                <User className="w-7 h-7" />
              </Link>
            </div>

            {/* Center logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" aria-label={shop?.name ?? '4Seven\'s'}>
                <span className="text-white text-2xl font-bold tracking-widest">
                  7777
                </span>
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-6">
              <button
                className="header-icon"
                aria-label="Search"
                onClick={onOpenSearch}
                data-testid="header-search-btn"
              >
                <Search className="w-7 h-7" />
              </button>
              <button
                className="header-icon lg:hidden"
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Expanded Header (after scroll) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white ${
          showExpandedMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="border-b-2 border-black">
          <div className="container mx-auto px-4 lg:px-8 py-4 border-b-2 border-black">
            <div className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-6">
                <button
                  className="icon-with-label relative"
                  onClick={onOpenCart}
                  data-testid="expanded-header-cart-btn"
                >
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link to="/account" className="icon-with-label">
                  <User className="w-6 h-6 mb-1" />
                </Link>
              </div>

              {/* Center logo */}
              <Link to="/" aria-label={shop?.name ?? '4Seven\'s'}>
                <span className="text-black text-2xl font-bold tracking-widest">
                  7777
                </span>
              </Link>

              {/* Right */}
              <div className="flex items-center gap-6">
                <button
                  className="icon-with-label"
                  onClick={onOpenSearch}
                  data-testid="expanded-search-btn"
                >
                  <Search className="w-6 h-6 mb-1" />
                </button>
                <button
                  className="icon-with-label lg:hidden"
                  aria-label="Menu"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6 mb-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] sm:w-[400px] bg-white z-[80] transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="px-6 py-8 space-y-6 flex-1 overflow-y-auto">
            <nav className="flex flex-col space-y-6 text-lg tracking-wide font-light">
              <a
                href="#hero"
                onClick={(e) => handleNavClick(e, 'hero')}
                className="block hover:text-gray-600 transition-colors"
              >
                Home
              </a>
              <a
                href="#product-grid"
                onClick={(e) => handleNavClick(e, 'product-grid')}
                className="block hover:text-gray-600 transition-colors"
              >
                All products
              </a>
              <Link
                to="/collections/all"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block hover:text-gray-600 transition-colors"
              >
                Catalog
              </Link>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="block hover:text-gray-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mt-4">
              <a
                href="https://instagram.com/4sevens.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
