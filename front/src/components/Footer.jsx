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
  { name: "Instagram", icon: "📷" },
  { name: "Twitter", icon: "🐦" },
  { name: "Facebook", icon: "📘" },
  { name: "YouTube", icon: "▶️" },
  { name: "TikTok", icon: "🎵" },
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
              {socialLinks.map((s) => (
                <button key={s.name} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center text-lg" aria-label={s.name} title={s.name}>
                  {s.icon}
                </button>
              ))}
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
