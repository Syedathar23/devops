import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product, selectedColor, selectedSize) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { items: newItems };
      }

      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            selectedColor,
            selectedSize,
            quantity: 1,
            isSelected: true,
          },
        ],
      };
    });
  },

  removeItem: (id, selectedColor, selectedSize) => {
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      ),
    }));
  },

  updateQuantity: (id, selectedColor, selectedSize, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id, selectedColor, selectedSize);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  toggleItemSelection: (id, selectedColor, selectedSize) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, isSelected: !item.isSelected }
          : item
      ),
    }));
  },

  toggleAllSelection: (isSelected) => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, isSelected })),
    }));
  },

  clearCart: () => set({ items: [] }),

  clearSelectedItems: () => set((state) => ({
    items: state.items.filter(item => !item.isSelected)
  })),

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  getSelectedCount: () => get().items.reduce((sum, item) => item.isSelected ? sum + item.quantity : sum, 0),

  getSubtotal: () =>
    get().items.reduce((sum, item) => item.isSelected ? sum + item.price * item.quantity : sum, 0),

  getTax: () => get().getSubtotal() * 0.08,

  getTotal: (shippingCost = 0) =>
    get().getSubtotal() > 0 ? get().getSubtotal() + get().getTax() + shippingCost : 0,
}));

export default useCartStore;
