import { create } from "zustand";

const useWishlistStore = create((set, get) => ({
  items: [],

  toggle: (productId) => {
    set((state) => {
      if (state.items.includes(productId)) {
        return { items: state.items.filter((id) => id !== productId) };
      }
      return { items: [...state.items, productId] };
    });
  },

  isWishlisted: (productId) => get().items.includes(productId),
}));

export default useWishlistStore;
