export const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'] as const;

export const priceRanges = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { label: 'Above ₹20,000', min: 20000, max: Infinity },
] as const;

export const ratingFilters = [
  { label: 'Any Rating', value: 0 },
  { label: '4.5+', value: 4.5 },
  { label: '4.7+', value: 4.7 },
  { label: '4.9+', value: 4.9 },
] as const;

export const categoriesFAQ = [
  {
    question: 'How do I book a photographer in a category?',
    answer:
      'Browse a category, compare creators by price and rating, then hit Book Now to send a request. You can chat before confirming.',
  },
  {
    question: 'Are starting prices inclusive of edits?',
    answer:
      'Starting prices cover a base package. Final deliverables depend on the creator’s package — always check what’s included before booking.',
  },
  {
    question: 'Can I filter creators by city and availability?',
    answer:
      'Yes. Use the filters for city, price, rating, and availability to shortlist creators who match your shoot date and budget.',
  },
  {
    question: 'What do Popular and Trending badges mean?',
    answer:
      'Popular highlights categories with high booking volume. Trending marks categories with rising demand in the last 30 days.',
  },
] as const;

export function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}
