import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones, Star, ShoppingBag, Eye, Heart } from "lucide-react";
import { shopCategories, activities } from "../data/products";
import { productApi } from "../services/api";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useToastStore from "../store/toastStore";

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

function FeaturedCard({ product, index }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.items.includes(product.id));
  const addToast = useToastStore((s) => s.addToast);

  const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="card overflow-hidden">
        <div className="relative aspect-[4/3] bg-surface-container overflow-hidden">
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => { addItem(product, product.colors[0]?.name || "", ""); addToast(`${product.name} added to cart`, "success"); }}
              className="bg-white text-on-surface p-3 rounded-full shadow-elevated hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
            </button>
            <Link to={`/product/${product.id}`} className="bg-white text-on-surface p-3 rounded-full shadow-elevated hover:bg-primary hover:text-white transition-colors" aria-label="Quick view">
              <Eye size={18} />
            </Link>
          </div>
          {/* Wishlist */}
          <button
            onClick={() => { toggle(product.id); addToast(wishlisted ? "Removed from wishlist" : "Added to wishlist", wishlisted ? "info" : "success"); }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition-all z-10"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} className={wishlisted ? "fill-primary text-primary" : "text-on-surface-variant"} />
          </button>
          {product.badge && <span className="absolute top-3 left-3 bg-primary text-white text-label-caps px-3 py-1.5 rounded-md">{product.badge}</span>}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} className={i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-outline-variant"} />
            ))}
            <span className="text-[11px] text-on-surface-variant ml-1">({(product.reviewCount / 1000).toFixed(1)}k)</span>
          </div>
          <h3 className="text-body-md font-semibold text-on-surface truncate">{product.name}</h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5 truncate">{product.description}</p>
          <p className="text-body-lg font-bold text-primary mt-2">{fmt(product.price)}</p>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-primary to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await productApi.getAll();
        // The API returns an array directly
        setProductsList(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const newArrivals = productsList.filter(p => p.badge === 'New Arrival').slice(0, 4);
  const trending = productsList.length > 0 ? productsList.slice(0, 8) : [];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-on-surface via-gray-900 to-primary/80">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-[100px]" />
        </div>
        <div className="max-w-container mx-auto px-6 py-20 lg:py-32 relative z-10">
          <div className="max-w-2xl">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-block text-label-caps text-primary bg-primary/10 px-4 py-2 rounded-full mb-6 uppercase">
                New Collection 2025
              </span>
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-[56px] lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-tight">
              Fuel Your <br />
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Strength</span>
            </motion.h1>
            <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-body-lg text-gray-300 mt-6 max-w-lg leading-relaxed">
              Premium gym essentials engineered for peak performance. From supplements to equipment — everything you need to push beyond limits.
            </motion.p>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4 mt-8">
              <Link to="/shop" className="btn-primary py-4 px-8 text-body-md">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/auth" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-body-md">
                Sign in
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white border-b border-outline-variant/20">
        <div className="max-w-container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
              { icon: ShieldCheck, title: "Authentic Products", desc: "100% genuine guaranteed" },
              { icon: RotateCcw, title: "30-Day Returns", desc: "Hassle-free returns" },
              { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-on-surface">{item.title}</p>
                  <p className="text-[12px] text-on-surface-variant">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="max-w-container mx-auto px-6 py-14 lg:py-20">
        <motion.div {...fadeUp} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-display text-on-surface">Shop by Category</h2>
          <p className="text-body-lg text-on-surface-variant mt-3">Find exactly what you need for your training</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shopCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to="/shop"
                className={`group relative block aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br ${cat.gradient}`}
              >
                <img src={"https://i.pinimg.com/1200x/e6/28/11/e628111b8a41d3ccfc223cf37de34190.jpg"} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-body-md lg:text-h3 font-bold text-white drop-shadow-lg">{cat.name}</h3>
                  <p className="text-body-sm text-white/80 mt-1">{cat.count} products</p>
                  <span className="mt-3 text-body-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="bg-surface-container/30">
          <div className="max-w-container mx-auto px-6 py-14 lg:py-20">
            <div className="text-center mb-10">
              <motion.h2 {...fadeUp} viewport={{ once: true }} className="text-display text-on-surface">New Arrivals</motion.h2>
              <motion.p {...fadeUp} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body-lg text-on-surface-variant mt-2">Just landed in our store</motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, i) => (
                <FeaturedCard key={product.id} product={{
                  ...product,
                  name: product.title,
                  price: product.sellprice,
                  image: product.image1,
                  rating: 5,
                  reviewCount: 120,
                  colors: []
                }} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING PRODUCTS */}
      <section className="bg-white">
        <div className="max-w-container mx-auto px-6 py-14 lg:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2 {...fadeUp} viewport={{ once: true }} className="text-display text-on-surface">Trending Now</motion.h2>
              <motion.p {...fadeUp} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body-lg text-on-surface-variant mt-2">Our most popular products this week</motion.p>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:underline text-body-md">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product, i) => (
              <FeaturedCard key={product.id} product={{
                ...product,
                name: product.title,
                price: product.sellprice,
                image: product.image1,
                rating: 4.5,
                reviewCount: 450,
                colors: []
              }} index={i} />
            ))}
          </div>

          <div className="md:hidden text-center mt-8">
            <Link to="/shop" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* SHOP BY ACTIVITY */}
      <section className="max-w-container mx-auto px-6 py-14 lg:py-20">
        <motion.div {...fadeUp} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-display text-on-surface">Shop by Activity</h2>
          <p className="text-body-lg text-on-surface-variant mt-3">Gear up for your favorite workout</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {activities.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to="/shop"
                className={`group block rounded-xl overflow-hidden bg-gradient-to-br ${act.gradient} p-6 text-center hover:shadow-hover transition-all duration-300 hover:-translate-y-1`}
              >
                <span className="text-4xl block mb-3">{act.icon}</span>
                <h3 className="text-body-md font-semibold text-white">{act.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-primary to-indigo-700">
        <div className="max-w-container mx-auto px-6 py-16 lg:py-20 text-center">
          <motion.h2 {...fadeUp} viewport={{ once: true }} className="text-h1 lg:text-display text-white">
            Ready to Transform Your Training?
          </motion.h2>
          <motion.p {...fadeUp} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body-lg text-white/80 mt-4 max-w-xl mx-auto">
            Join thousands of athletes who trust JERAI for their fitness journey. Sign up today and get 15% off your first order.
          </motion.p>
          <motion.div {...fadeUp} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link to="/auth" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors mt-8 text-body-md">
              Get Started <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
