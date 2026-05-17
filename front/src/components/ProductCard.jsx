import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import useWishlistStore from "../store/wishlistStore";
import useToastStore from "../store/toastStore";

export default function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { toggle, isWishlisted } = useWishlistStore();
  const addToast = useToastStore((s) => s.addToast);
  const wishlisted = useWishlistStore((s) => s.items.includes(product.id));

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    addToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      wishlisted ? "info" : "success"
    );
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        to={`/product/${product.id}`}
        className="block card overflow-hidden"
        aria-label={`View ${product.name}, ${formatPrice(product.price)}`}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-surface-container overflow-hidden">
          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-surface-container animate-pulse" />
          )}

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition-all duration-200 z-10"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={`transition-colors duration-200 ${
                wishlisted
                  ? "fill-primary text-primary"
                  : "text-on-surface-variant"
              }`}
            />
          </button>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-white text-label-caps px-3 py-1.5 rounded-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-body-md font-semibold text-on-surface truncate">
            {product.name}
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-1 truncate">
            {product.description}
          </p>
          <p className="text-body-lg font-bold text-primary mt-3">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Indigo accent border */}
        <div className="h-0.5 bg-gradient-to-r from-primary to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Link>
    </motion.div>
  );
}
