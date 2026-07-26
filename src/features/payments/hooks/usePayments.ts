import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { PAGE_SIZE } from '../constants';
import {
  createInvoice,
  fetchInvoiceById,
  fetchInvoices,
  fetchPaymentStatusSlices,
  fetchPaymentsOverview,
  fetchRevenueSeries,
  paymentsKeys,
  recordPayment,
} from '../services';
import { usePaymentsStore } from '../store';
import type { CreateInvoiceInput, PaymentMethod } from '../types';
import { filterInvoices } from '../utils';

export function usePaymentsOverview() {
  return useQuery({
    queryKey: paymentsKeys.overview(),
    queryFn: fetchPaymentsOverview,
  });
}

export function useRevenueSeries() {
  return useQuery({
    queryKey: paymentsKeys.revenue(),
    queryFn: fetchRevenueSeries,
  });
}

export function usePaymentStatusSlices() {
  return useQuery({
    queryKey: paymentsKeys.statusSlices(),
    queryFn: fetchPaymentStatusSlices,
  });
}

export function useInvoices() {
  const filters = usePaymentsStore((s) => s.filters);
  const page = usePaymentsStore((s) => s.page);
  const query = useQuery({
    queryKey: paymentsKeys.invoices(),
    queryFn: fetchInvoices,
  });

  const filtered = useMemo(
    () => (query.data ? filterInvoices(query.data, filters) : []),
    [query.data, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    ...query,
    filtered,
    pageItems,
    totalPages,
    totalFiltered: filtered.length,
  };
}

export function useInvoice(id: string | null) {
  return useQuery({
    queryKey: paymentsKeys.invoice(id || 'none'),
    queryFn: () => fetchInvoiceById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => createInvoice(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      amount,
      method,
    }: {
      invoiceId: string;
      amount: number;
      method?: PaymentMethod;
    }) => recordPayment(invoiceId, amount, method),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
