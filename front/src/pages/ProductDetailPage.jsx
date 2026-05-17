import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { products } from "../data/products";
import { reviews } from "../data/reviews";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useToastStore from "../store/toastStore";
import ProductCard from "../components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.items.includes(Number(id)));
  const addToast = useToastStore((s) => s.addToast);

  const [mainImage, setMainImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.length > 0 ? 1 : null
  );
  const [openAccordion, setOpenAccordion] = useState(null);

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === Number(id)),
    [id]
  );

  const relatedProducts = useMemo(
    () => products.filter((p) => p.id !== Number(id)).slice(0, 4),
    [id]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 text-on-surface">Product Not Found</h1>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

  const handleAddToCart = () => {
    const color = product.colors[selectedColor]?.name || "";
    const size =
      selectedSize !== null ? product.sizes[selectedSize] || "" : "";
    addItem(product, color, size);
    addToast(`${product.name} added to cart`, "success");
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    addToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      wishlisted ? "info" : "success"
    );
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-outline-variant"
        }
      />
    ));

  const accordionItems = [
    {
      title: "Composition & Care",
      content:
        "Made from 100% premium materials. Dry clean only. Store in a cool, dry place. Avoid direct sunlight for prolonged periods.",
    },
    {
      title: "Shipping & Returns",
      content:
        "Free standard shipping on orders over $200. Express delivery available for $25. 30-day return policy for unworn items with original tags.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-outline-variant/20">
        <div className="max-w-container mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-body-sm" aria-label="Breadcrumb">
            <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">
              Shop
            </Link>
            <ChevronRight size={14} className="text-outline" />
            <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">
              Collections
            </Link>
            <ChevronRight size={14} className="text-outline" />
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-container mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-surface-container rounded-xl overflow-hidden group cursor-zoom-in">
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImage}
                  src={product.images[mainImage]}
                  alt={`${product.name} view ${mainImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </AnimatePresence>

              {product.badge && (
                <span className="absolute top-4 left-4 bg-surface-container text-on-surface-variant text-label-caps px-3 py-1.5 rounded-md uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    mainImage === i
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-outline-variant"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {product.badge && (
              <span className="inline-flex w-fit text-label-caps bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-md mb-4 uppercase">
                {product.badge}
              </span>
            )}

            <h1 className="text-h1 text-on-surface">{product.name}</h1>

            <p className="text-display text-primary mt-3">
              {formatPrice(product.price)}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-body-sm font-semibold text-on-surface">
                {product.rating}
              </span>
              <button className="text-body-sm text-primary hover:underline">
                ({(product.reviewCount / 1000).toFixed(0)}k reviews)
              </button>
            </div>

            <p className="text-body-lg text-on-surface-variant mt-6">
              {product.description}. Crafted with meticulous attention to
              detail, this piece combines timeless design with modern
              functionality.
            </p>

            {/* Color Selection */}
            <div className="mt-8">
              <p className="text-label-caps text-on-surface-variant mb-3 uppercase">
                Color: {product.colors[selectedColor]?.name}
              </p>
              <div className="flex items-center gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === i
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-outline-variant/40 hover:border-outline"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-label-caps text-on-surface-variant uppercase">
                    Size
                  </p>
                  <button className="text-body-sm text-primary hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {product.sizes.map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(i)}
                      className={`min-w-[48px] h-12 px-4 rounded-lg text-body-sm font-semibold transition-all duration-200 ${
                        selectedSize === i
                          ? "bg-primary text-white"
                          : "bg-surface-container text-on-surface-variant hover:border-primary hover:text-primary border border-transparent"
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 py-4 text-body-md"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`btn-outline py-4 px-6 ${
                  wishlisted
                    ? "border-primary text-primary"
                    : ""
                }`}
              >
                <Heart
                  size={20}
                  className={wishlisted ? "fill-primary" : ""}
                />
                {wishlisted ? "Saved" : "Save to Wishlist"}
              </button>
            </div>

            {/* Accordion */}
            <div className="mt-8 border-t border-outline-variant/20">
              {accordionItems.map((item, i) => (
                <div key={i} className="border-b border-outline-variant/20">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === i ? null : i)
                    }
                    className="flex items-center justify-between w-full py-4 text-body-md font-semibold text-on-surface hover:text-primary transition-colors"
                    aria-expanded={openAccordion === i}
                  >
                    {item.title}
                    {openAccordion === i ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordion === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-body-sm text-on-surface-variant pb-4">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-white border-t border-outline-variant/20">
        <div className="max-w-container mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-h2 text-on-surface">Customer Reviews</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(product.rating)}
                </div>
                <span className="text-body-md font-semibold text-on-surface">
                  {product.rating} out of 5
                </span>
                <span className="text-body-sm text-on-surface-variant">
                  ({productReviews.length} reviews)
                </span>
              </div>
            </div>
            {/* Star Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-primary text-white">All</button>
              <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-surface-dim text-on-surface hover:bg-outline-variant/20">5★</button>
              <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-surface-dim text-on-surface hover:bg-outline-variant/20">4★</button>
              <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-surface-dim text-on-surface hover:bg-outline-variant/20">3★</button>
              <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-surface-dim text-on-surface hover:bg-outline-variant/20">2★</button>
              <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-surface-dim text-on-surface hover:bg-outline-variant/20">1★</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {productReviews.length > 0 ? (
                productReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background rounded-xl p-6 shadow-sm border border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-body-sm font-semibold text-on-surface">
                            {review.name}
                          </h4>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-body-sm text-outline">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface-variant leading-relaxed mt-4">
                      {review.text}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                       <button className="text-body-sm text-outline hover:text-primary transition-colors">Helpful?</button>
                       <span className="text-outline text-xs">({Math.floor(Math.random() * 10) + 1})</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-body-md text-on-surface-variant">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>

            {/* Write Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-surface-dim rounded-xl p-6 border border-outline-variant/20 sticky top-24">
                <h3 className="text-h3 font-bold text-on-surface mb-6">Write a Review</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addToast('Review submitted successfully!', 'success'); }}>
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Rating</label>
                    <div className="flex items-center gap-1 cursor-pointer">
                      {[1,2,3,4,5].map(star => <Star key={star} size={24} className="text-outline-variant hover:text-amber-400 hover:fill-amber-400 transition-colors" />)}
                    </div>
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Name</label>
                    <input type="text" className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Email</label>
                    <input type="email" className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Review</label>
                    <textarea rows="4" className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="What did you think of this product?" required></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="max-w-container mx-auto px-6 py-12 lg:py-16">
        <h2 className="text-h2 text-on-surface mb-8">You May Also Like</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {relatedProducts.map((p) => (
            <div key={p.id} className="min-w-[280px] flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
