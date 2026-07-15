/**
 * Public Service - Handles API calls for public/landing page data
 * This includes fetching creators, categories, pricing, testimonials, etc.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export const publicService = {
  // Get featured creators for landing page
  getFeaturedCreators: async () => {
    // const response = await fetch(`${API_BASE}/api/public/creators/featured`);
    // return response.json();
    return [];
  },

  // Get categories for landing page
  getCategories: async () => {
    // const response = await fetch(`${API_BASE}/api/public/categories`);
    // return response.json();
    return [];
  },

  // Get reels for landing page
  getReels: async () => {
    // const response = await fetch(`${API_BASE}/api/public/reels`);
    // return response.json();
    return [];
  },

  // Get testimonials
  getTestimonials: async () => {
    // const response = await fetch(`${API_BASE}/api/public/testimonials`);
    // return response.json();
    return [];
  },

  // Get pricing plans
  getPricingPlans: async () => {
    // const response = await fetch(`${API_BASE}/api/public/pricing`);
    // return response.json();
    return [];
  },
};