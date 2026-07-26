import { create } from 'zustand';
import type { InvoiceFilters } from '../types';

type PaymentsUiState = {
  selectedInvoiceId: string | null;
  previewTab: 'details' | 'history';
  filters: InvoiceFilters;
  page: number;
  createOpen: boolean;
  setSelectedInvoiceId: (id: string | null) => void;
  setPreviewTab: (tab: 'details' | 'history') => void;
  setFilters: (patch: Partial<InvoiceFilters>) => void;
  setPage: (page: number) => void;
  setCreateOpen: (open: boolean) => void;
  resetFilters: () => void;
};

const defaultFilters: InvoiceFilters = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  dateRange: 'all',
};

export const usePaymentsStore = create<PaymentsUiState>((set) => ({
  selectedInvoiceId: null,
  previewTab: 'details',
  filters: defaultFilters,
  page: 1,
  createOpen: false,
  setSelectedInvoiceId: (id) => set({ selectedInvoiceId: id, previewTab: 'details' }),
  setPreviewTab: (tab) => set({ previewTab: tab }),
  setFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 })),
  setPage: (page) => set({ page }),
  setCreateOpen: (open) => set({ createOpen: open }),
  resetFilters: () => set({ filters: defaultFilters, page: 1 }),
}));
