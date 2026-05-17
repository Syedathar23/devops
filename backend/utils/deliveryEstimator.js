/**
 * Estimates delivery time based on user location vs warehouse location.
 * 
 * @param {string} userState - State of the user (e.g., "Gujarat", "Maharashtra")
 * @param {string} userCity - City of the user (optional for same-city detection)
 * @param {string} warehouseState - Default warehouse state (from .env)
 * @returns {string} - Estimated delivery timeframe (e.g., "1-2 Days")
 */
export const estimateDeliveryTime = (userState, userCity = "", warehouseState = process.env.WAREHOUSE_STATE || "Gujarat") => {
  // Simple city matching logic if city is provided
  // In a real app, this might use pincode ranges
  const isSameCity = false; // Placeholder for advanced pincode logic

  if (isSameCity) {
    return "1-2 Days";
  }

  if (userState?.toLowerCase() === warehouseState?.toLowerCase()) {
    return "3-4 Days";
  }

  return "5-7 Days";
};
