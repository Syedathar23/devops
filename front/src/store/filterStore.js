import { create } from "zustand";

const useFilterStore = create((set) => ({
  selectedCategories: [],
  priceRange: [0, 500],
  selectedColors: [],
  sortBy: "newest",
  viewMode: "grid",
  currentPage: 1,
  itemsPerPage: 8,
  selectedBadge: null,

  setSelectedBadge: (badge) => set({ selectedBadge: badge, currentPage: 1 }),

  toggleCategory: (category) =>
    set((state) => {
      const exists = state.selectedCategories.includes(category);
      return {
        selectedCategories: exists
          ? state.selectedCategories.filter((c) => c !== category)
          : [...state.selectedCategories, category],
        currentPage: 1,
      };
    }),

  setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),

  toggleColor: (color) =>
    set((state) => {
      const exists = state.selectedColors.includes(color);
      return {
        selectedColors: exists
          ? state.selectedColors.filter((c) => c !== color)
          : [...state.selectedColors, color],
        currentPage: 1,
      };
    }),

  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setCategories: (categories) => set({ selectedCategories: categories, currentPage: 1 }),

  clearFilters: () =>
    set({
      selectedCategories: [],
      priceRange: [0, 500],
      selectedColors: [],
      sortBy: "newest",
      currentPage: 1,
    }),
}));

export default useFilterStore;
