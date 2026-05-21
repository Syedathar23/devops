import React, { useState } from "react";
import { Link } from "react-router-dom";
import useToastStore from "../store/toastStore";

const footerSections = [
  {
    title: "Shop",
    links: ["Supplements", "Gym Equipment", "Apparel", "Footwear", "Accessories", "Massagers", "Cycles"],
  },
  {
    title: "Customer Service",
    links: ["FAQs", "Shipping Info", "Returns & Exchanges", "Order Tracking", "Size Guide"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Affiliate Program", "Store Locator"],
  },
];

const socialLinks = [
  {
    name: "Instagram",
    icon: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    )
  },
  {
    name: "Twitter",
    icon: (props) => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    name: "Facebook",
    icon: (props) => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
      </svg>
    )
  },
  {
    name: "YouTube",
    icon: (props) => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }

];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const addToast = useToastStore((s) => s.addToast);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      addToast("Subscribed successfully! Welcome to the JERAI community.", "success");
      setEmail("");
    }
  };

  return (
    <footer className="bg-on-surface text-white mt-auto">
      <div className="max-w-container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-h1 font-extrabold tracking-tight text-white select-none">
              JERAI
            </Link>
            <p className="text-body-sm text-gray-400 mt-4 max-w-sm leading-relaxed">
              Premium gym essentials for every athlete. From supplements to equipment, we provide everything you need to push beyond limits.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mt-6">
              <p className="text-body-sm font-semibold text-white mb-2">Join our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-body-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="bg-primary hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-body-sm">
                  Subscribe
                </button>
              </div>
            </form>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.name} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center text-lg" aria-label={s.name} title={s.name}>
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-body-md font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link to="/shop" className="text-body-sm text-gray-400 hover:text-primary transition-colors duration-200">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-gray-500">
              &copy; {currentYear} JERAI Fitness. All rights reserved.
            </p>
            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              {["Visa", "Mastercard", "PayPal", "Apple Pay", "GPay"].map((p) => (
                <span key={p} className="bg-white/10 text-gray-400 text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wider">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
