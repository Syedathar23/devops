import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, LogOut, Package, MapPin } from "lucide-react";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { useAuth } from "../context/AuthContext";

const navStructure = [
  {
    label: "New Arrivals",
    path: "/shop",
  },
  {
    label: "Men",
    path: "/shop?gender=men",
  },
  {
    label: "Women",
    path: "/shop?gender=women",
  },
  {
    label: "Apparel",
    path: "/shop?category=Apparel",
  },
  {
    label: "Footwear",
    path: "/shop?category=Footwear",
  },
  {
    label: "Gym Equipment",
    path: "/shop?category=Equipment",
  },
  {
    label: "Accessories",
    path: "/shop?category=Accessories",
  },
  {
    label: "Cycles",
    path: "/shop?category=Cycles",
  },
  {
    label: "Shop by Activity",
    path: "/shop",
  }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Hidden on admin layout and auth layout
  if (location.pathname.startsWith('/admin') || location.pathname === "/auth") return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-outline-variant/30">
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <Link to="/" className="text-h2 font-extrabold tracking-tight text-on-surface select-none flex-shrink-0" aria-label="Home">
          CoreX Gear
        </Link>

        {/* Desktop Nav - with Hover Dropdowns */}
        <nav className="hidden xl:flex items-center justify-center flex-1 mx-4 h-full" aria-label="Main navigation">
          {navStructure.map((link) => (
            <div key={link.label} className="group h-full flex items-center px-3 relative">
              <Link
                to={link.path}
                className="text-body-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors duration-200 flex items-center gap-1"
              >
                {link.label}
              </Link>
              
              {/* Dropdown Menu (Hover Only) */}
              {link.dropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block bg-white shadow-lg border border-outline-variant/20 rounded-b-xl w-max min-w-[200px] pt-2 pb-6 px-6 z-50 transition-all duration-200">
                  <div className="flex gap-10">
                    {link.dropdown.map((section, idx) => (
                      <div key={idx} className="flex flex-col min-w-[150px]">
                        <h4 className="text-label-caps text-on-surface-variant uppercase mb-3 mt-4 border-b border-outline-variant/20 pb-2">{section.title}</h4>
                        {section.items && section.items.map((item, itemIdx) => (
                          <Link key={itemIdx} to={`/shop?category=${item}`} className="py-1.5 text-body-sm text-on-surface hover:text-primary hover:bg-primary/5 rounded px-2 -ml-2 transition-colors">
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="h-full flex items-center px-3">
             <Link to="/contact" className="text-body-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-1">Contact Us</Link>
          </div>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-surface-dim transition-colors text-on-surface">
            <Search size={22} />
          </button>
          <Link to="/" className="p-2 rounded-lg hover:bg-surface-dim transition-colors relative text-on-surface">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] min-h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
            )}
          </Link>
          
          {user ? (
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-surface-dim transition-colors relative text-on-surface flex items-center gap-2">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[12px] font-bold">
                    {user.firstname?.charAt(0) || <User size={16} />}
                  </div>
                )}
              </button>
              <div className="absolute right-0 top-full hidden group-hover:block bg-white shadow-lg border border-outline-variant/20 rounded-xl w-48 py-2 z-50">
                <div className="px-4 py-2 border-b border-outline-variant/20 mb-1">
                  <p className="text-body-sm font-bold truncate">{user.firstname} {user.lastname}</p>
                  <p className="text-[12px] text-on-surface-variant truncate">{user.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-dim">
                  <User size={16} /> My Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-dim">
                  <Package size={16} /> Orders
                </Link>
                <Link to="/addresses" className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-dim">
                  <MapPin size={16} /> Addresses
                </Link>
                <div className="border-t border-outline-variant/20 my-1"></div>
                <button onClick={logout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error-container/30">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="p-2 rounded-lg hover:bg-surface-dim transition-colors text-on-surface">
              <User size={22} />
            </Link>
          )}

          <Link to="/checkout" className="p-2 rounded-lg hover:bg-surface-dim transition-colors relative text-on-surface">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] min-h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 rounded-lg hover:bg-surface-dim transition-colors text-on-surface">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-outline-variant/30 bg-white shadow-sm absolute w-full">
            <div className="max-w-[1600px] mx-auto px-6 py-4">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <input type="text" placeholder="Search protein, equipment, apparel..." className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg pl-12 pr-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="xl:hidden overflow-hidden border-t border-outline-variant/30 bg-white max-h-[80vh] overflow-y-auto absolute w-full shadow-lg">
            <nav className="px-4 py-4 flex flex-col">
              {navStructure.map((link) => (
                <div key={link.label} className="border-b border-outline-variant/20 last:border-0">
                  <div className="py-3 px-2 flex justify-between items-center text-body-md font-semibold text-on-surface">
                    <Link to={link.path} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                    {link.dropdown && <ChevronDown size={18} className="text-outline" />}
                  </div>
                  {/* Simplified Mobile Dropdown - Always visible in mobile view for simplicity, or tap to expand. Implemented as static for now */}
                      {link.dropdown && (
                         <div className="pl-4 pb-3 flex flex-col gap-2">
                           {link.dropdown.map(sec => (
                             sec.items?.map(i => (
                               <Link key={i} to={`/shop?category=${i}`} onClick={() => setMobileOpen(false)} className="text-body-sm text-on-surface-variant py-1.5">{i}</Link>
                             ))
                           ))}
                         </div>
                      )}
                </div>
              ))}
              <div className="py-3 px-2 flex justify-between items-center text-body-md font-semibold text-on-surface border-t border-outline-variant/20 mt-2">
                 <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact Us</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
